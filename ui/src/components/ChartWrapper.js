// Dependencies

import React, { Component } from 'react'
import * as Chart from 'react-d3'
import D3 from 'd3'

let count = 0

const styles = {
  wrapperStyle: {
    backgroundColor: '#FFC107',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  titleStyle: {
    display: `flex`,
    justifyContent: `center`,
    fontFamily: 'Cabin',
    color: 'white',
  }
}

export default class ChartWrapper extends Component {
  constructor (props) {
    super(props)

    this.state = {
      title: props.title || `${props.xField}X${props.yField}`,
      width: props.width || 600,
      height: props.height || 250,
      data: null,
      timestamp_lag: null,
      timestamp_requests: null,
      timestamp_mean: null,
      dataType: props.dataType || null,
      xField: props.xField || null,
      yField: props.yField || null,
      fieldType: `${props.xField}_${props.yField}`,
      params: props.params || null,
      chartType: props.chartType || null,
      filter: props.filter || null,
      intervalId: null,
      interval: props.interval || 0,
      group: props.group || null,
      groups: null,
    }
  }

  componentWillMount() {
    console.log("componentWillMount ...")
    const { dataType, params, fieldType } = this.state;

    this.fetchData(params)
  }

  componentWillUnmount() {
    console.log("componentWillUnmount ...")

    if (this.state.intervalId) {
      clearintervalId(this.state.intervalId);
    }
  }

  fetchData(params){
    console.log("Fetching data ...", this.state.dataType)
    const dataType = this.state.dataType

    // parse url
    let url = `http://localhost:8000/${dataType}?`
    Object.keys(params).forEach((key) => {
      url += `${key}=${params[key]}&`
    })

    console.log(url)

    // fetch
    fetch(url)
    .then(res => res.json())
    .then(json => {
      this.setState({ data: json.data})
      this.parseData(this.state.xField, this.state.yField, this.state.filter)

      if (this.state.interval != 0) {
        const intervalId = setInterval(() => {
          console.log('setinterval ...')
          this.updateData()
        }, this.state.interval)
        this.setState({intervalId})
      }
    })
    .catch(err => { console.log('ERROR', err); });
  }

  updateData(){
    console.log("Update data ...")
    const groupData = this.state.groups
    const { xField, yField, filter } = this.state
    let range = this.state.filter.range

    range[0] += 5
    range[1] += 5

    filter.range = range

    let chartArr = this.state[`${xField}_${yField}`]
    Object.keys(groupData).forEach((key,i) => {
      const group = groupData[key]

      let values = []
      for (let i = range[0]; i < range[1]; i++) {
        let v = {
          x: group[i][xField],
          y: group[i][yField],
        }
        values.push(v)
      }
      chartArr[i].values = values
    })

    let stateObj = {}
    stateObj[`${xField}_${yField}`] = chartArr
    stateObj.filter = filter
    this.setState(stateObj)
  }

  parseData(){
    console.log("Parsing data...")
    const allData = this.state.data
    const { xField, yField, group } = this.state

    // form group
    let allGroups = {}
    if (group != null) {
      allData.forEach((item) => {
        allGroups[item[group]] = (allGroups[item[group]] == null) ? [] : allGroups[item[group]]
        allGroups[item[group]].push(item)
      })
    } else {
      allGroups[yField] = allData
    }

    // basic chart template
    let chartTemplate = []
    Object.keys(allGroups).forEach((key) => {
      chartTemplate.push({
        name: key,
        values:[{x:0,y:0}]
      })
    })

    let stateObj = {}
    stateObj[`${xField}_${yField}`] = chartTemplate
    stateObj.groups = allGroups
    this.setState(stateObj)

    this.updateData()
  }

  getChartComponent() {
    console.log("getChartComponent ...")
    const { chartType, fieldType, width, height, title, xField, yField, group } = this.state;

    if (chartType == 'bar') {
      return (
      <Chart.BarChart
        data={this.state[fieldType] || [{values:[{x:0,y:0}]}]}
        width={width}
        height={height}
        yAxisLabel={yField}
        xAxisLabel={xField}
        xAxisFormatter={(d) => {
          if (count % 10 == 0) {
            count++
            if (this.state.xField == 'timestamp') {
              let date = new Date(d)
              return `${date.toDateString().slice(4,7)} ${date.getDate()} ${date.getHours()}`
            } else {
              return d
            }
          } else {
            count++
            return ''
          }
        }}
      />)
    } else if (chartType == 'line') {
      return (
        <Chart.LineChart
          legend={(group != null)}
          data={this.state[fieldType] || [{values:[{x:0,y:0}]}]}
          viewBoxObject={{
            x: 0,
            y: 0,
            width,
            height,
          }}
          width={width}
          height={height}
          yAxisLabel={yField}
          xAxisLabel={xField}
          xAxisFormatter={(d) => {
            if (count % 5 == 0) {
              count++
              if (this.state.xField == 'timestamp') {
                let date = new Date(d)
                return `${date.toDateString().slice(4,7)}\n${date.getDate()} ${date.getHours()}`
              } else {
                return d
              }
            } else {
              count++
              return ''
            }
          }}
        />)
    } else if (chartType == 'area') {
      let color = null
      if (this.state.groups) {
        color = d3.scale.ordinal()
                              .domain(Object.keys(this.state.groups))
                              .range(["#FF0000", "#009933" , "#0000FF"])
      }
      return (
        <Chart.AreaChart
          color={color}
          legend={(group != null)}
          data={this.state[fieldType] || [{values:[{x:0,y:0}]}]}
          viewBoxObject={{
            x: 0,
            y: 0,
            width,
            height,
          }}
          width={width}
          height={height}
          yAxisLabel={yField}
          xAxisLabel={xField}
          xAxisFormatter={(d) => {
            if (count % 5 == 0) {
              count++
              if (this.state.xField == 'timestamp') {
                let date = new Date(d)
                return `${date.toDateString().slice(4,7)}\n${date.getDate()} ${date.getHours()}`
              } else {
                return d
              }
            } else {
              count++
              return ''
            }
          }}
        />)
    } else {
      return (<div></div>)
    }
  }

  render () {
    return (
      <div style={styles.wrapperStyle}>
        <h1 style={styles.titleStyle}>{this.state.title}</h1>
        {this.getChartComponent()}
      </div>
    )
  }
}
