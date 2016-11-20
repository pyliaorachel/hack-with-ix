// Dependencies

import React, { Component } from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { Navbar, NavDropdown, Nav, MenuItem, Tab, NavItem } from 'react-bootstrap'

// Components

import { Center, Col, Row } from 'components/Flex'

class NavBar extends Component {
  constructor() {
    super()

    this.state = {
      areas: [],
      area: '',
      serverObjs: [],
      servers: [],
      server: null,
      dataTypes: ['performance', 'impressions'],
      dataType: 'performance',
      xFields: ['timestamp'],
      xField: 'timestamp',
      yFields: ['impressions', 'spend', 'requests', 'lag', 'warn'],
      yField: 'lag',
      chartTypes: ['line', 'area', 'bar'],
      chartType: 'line',
    }
  }

  componentWillMount() {
    console.log("componentWillMount ...")
    this.fetchServers()
  }

  fetchServers() {
    const url = 'http://localhost:8000/servers'
    fetch(url)
    .then(res => res.json())
    .then(json => {
      const serverObjs = json.data

      let servers = []
      let areas = []
      serverObjs.forEach((server) => {
        servers.push(server.id)
        areas[server.dc] = true
      })

      this.setState({ areas: Object.keys(areas), area: serverObjs[0].dc, serverObjs, servers, server: servers[0]})
      this.props.plot({server: servers[0], area: serverObjs[0].dc, dataType: this.state.dataType, xField: this.state.xField, yField: this.state.yField, chartType: this.state.chartType})
    })
    .catch(err => { console.log('ERROR', err); });
  }

  getDropdown(eventKey, title, id) {
    const list = this.state[`${eventKey}s`]

    let menuItems = []
    list.forEach((item,i) => {
      menuItems.push(<MenuItem eventKey={`${eventKey}.${i}`}>{item}</MenuItem>)
    })
    return (
      <NavDropdown
        eventKey={eventKey}
        title={title}
        id={id}
        onSelect={(eventKey) => {
          console.log(eventKey)
          const key = eventKey.slice(0,eventKey.indexOf('.'))
          const index = eventKey.slice(eventKey.indexOf('.')+1)

          let stateObj = this.state[`${key}s`]
          stateObj[key] = this.state[`${key}s`][index]
          this.setState(stateObj)
        }}
      >
        {menuItems}
      </NavDropdown>
    )
  }

  render() {
    const { server, area, dataType, xField, yField, chartType } = this.state
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">UBoard</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          {this.getDropdown('area', `Area ${area}`, "area-dropdown")}
          {this.getDropdown('server', `Server ${server}`, "server-dropdown")}
          {this.getDropdown('dataType', `Data Type ${dataType}`, "data-type-dropdown")}
          {this.getDropdown('xField', `x-Axis ${xField}`, "x-field-dropdown")}
          {this.getDropdown('yField', `y-Axis ${yField}`, "y-field-dropdown")}
          {this.getDropdown('chartType', `Chart Type ${chartType}`, "chart-type-dropdown")}
          <NavItem
            onClick={() => {
              this.props.plot({server, area, dataType, xField, yField, chartType})
            }}
          >
            <p style={{margin: 0, color: '#FFC107', fontSize: '24'}}>Plot!</p>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default class ControlPanel extends Component {
  constructor () {
    super()
  }

  componentWillMount() {
    console.log("componentWillMount ...")
  }

  render () {
    return (
      <NavBar plot={this.props.plot}/>
    )
  }
}
