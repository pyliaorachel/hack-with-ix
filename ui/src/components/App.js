// Dependencies

import React, { Component } from 'react'

// Components

import { Center, Col, Row } from 'components/Flex'
import Grid from 'components/Grid'
import ControlPanel from 'components/ControlPanel'

export default class App extends Component {
  constructor () {
    super()

    this.state = {
      fullWidth: document.documentElement.clientWidth,
      chartProperties: null,
    }
  }

  plot(params) {
    console.log('plot', params)
    this.setState({chartProperties: params})
  }

  render () {
    return (
      <div style={{width: this.state.fullWidth}}>
        <ControlPanel plot={(params) => this.plot(params)}/>
        <Grid />
      </div>
    )
  }
}
