// Dependencies

import React, { Component } from 'react'
import * as Chart from 'react-d3-basic'
import D3 from 'd3'
import * as Color from 'style/colors'

let count = 0

const defaultData = []

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
      title: props.title || `${props.xField} X ${props.yField}`,
      width: props.width || 600,
      height: props.height || 250,
      data: null,
      dataType: props.dataType || null,
      xField: props.xField || null,
      yField: props.yField || null,
      params: props.params || null,
      chartType: props.chartType || null,
      filter: props.filter || null,
      intervalId: null,
      interval: props.interval || 0,
      group: props.group || null,
      groups: null,
      chartData: [],
      chartSeries: [{data:[]}],
      xFunc: ()=>{},
    }
    console.log(Color)
  }

  componentWillMount() {
    console.log("componentWillMount ...")
    const { params } = this.state;

    this.fetchData(params)
  }

  componentWillUnmount() {
    console.log("componentWillUnmount ...")

    if (this.state.intervalId) {
      clearintervalId(this.state.intervalId);
    }
  }

  fetchData(params){
    console.log("Fetching data ...")
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
      this.parseData()

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
    const { filter } = this.state
    let range = this.state.filter.range

    range[0] += 5
    range[1] += 5

    filter.range = range

    let chartData = []
    for (let i = range[0]; i < range[1]; i++) {
      let v = groupData[i]
      chartData.push(v)
    }

    let stateObj = {}
    stateObj.chartData = chartData
    stateObj.filter = filter
    this.setState(stateObj)
  }

  parseData(){
    console.log("Parsing data...")
    const allData = this.state.data
    const { xField, yField, group } = this.state

    // form group
    let allGroups = {}
    let allKeys = {}
    if (group != null) {
      let tempGroups = {}
      allData.forEach((item) => {
        allKeys[item[group]] = true
        tempGroups[item[xField]] = (tempGroups[item[xField]] == null) ? {} : tempGroups[item[xField]]
        let obj = {}
        obj[item[group]] = item[yField] + (tempGroups[item[xField]] && tempGroups[item[xField]][item[group]] ? tempGroups[item[xField]][item[group]] : 0)
        obj[xField] = item[xField]
        tempGroups[item[xField]] = Object.assign(tempGroups[item[xField]], obj)
      })
      allGroups = Object.values(tempGroups)
    } else {
      allGroups = allData
      allKeys[yField] = true
    }

    // basic chart series template
    let chartTemplate = []
    Object.keys(allKeys).forEach((key) => {
      chartTemplate.push({
        name: key,
        field: key,
      })
    })

    // x function
    const x = (v) => {
      const xField = this.state.xField
      // if (xField == 'timestamp') {
      //   let date = new Date(v[xField])
      //   return `${date.toDateString().slice(4,7)} ${date.getDate()} ${date.getHours()}`
      // } else {
      //   return v[xField]
      // }
      return v[xField]
    }

    let stateObj = {}
    stateObj.chartSeries = chartTemplate
    stateObj.groups = allGroups
    stateObj.xFunc = x
    this.setState(stateObj)

    this.updateData()
  }

  getChartComponent() {
    console.log("getChartComponent ...", this.state.chartSeries)
    const { chartType, chartData, chartSeries, width, height, title, xField, yField, group, xFunc } = this.state;

    if (chartType == 'bar') {
      return (
      <Chart.BarChart
        legend={(group != null)}
        data={chartData}
        chartSeries={chartSeries}
        width={width}
        height={height}
        x={xFunc}
        xScale='ordinal'
      />)
    } else if (chartType == 'line') {
      return (
        <Chart.LineChart
          legend={(group != null)}
          data={chartData}
          chartSeries={chartSeries}
          width={width}
          height={height}
          x={xFunc}
          xScale='time'
        />)
    } else if (chartType == 'area') {
      return (
        <Chart.AreaChart
          legend={(group != null)}
          data={chartData}
          chartSeries={chartSeries}
          width={width}
          height={height}
          x={xFunc}
          xScale='time'
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
