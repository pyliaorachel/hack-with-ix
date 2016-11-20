// Dependencies

import React, { Component } from 'react'
import * as Chart from 'react-chartjs'

const defaultData = {
    labels: [""],
    datasets: [
        {
            label: "",
            data: [],
        }
    ]
}

const defaultOptions = {
  animation: false,
  scaleShowGridLines: false,
  pointDot: true,
  pointDotRadius: 1,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: false,
}

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
      title: props.title || 'MyChart',
      width: props.width || 600,
      height: props.height || 250,
      data: [],
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
      options: props.options || defaultOptions,
      intervalId: null,
      interval: props.interval || 0,
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
    const allData = this.state.data
    const { xField, yField, filter } = this.state
    let range = this.state.filter.range

    range[0] += 1
    range[1] += 1

    filter.range = range

    let labels = []
    for (let i = range[0]; i < range[1]; i++) {
      if (i % 10 == 0) {
        let date = new Date(allData[i][xField])
        const month = date.toDateString().slice(4,7)
        const day = date.getDate()
        const hour = date.getHours()
        labels.push(`${month} ${day}, ${hour}`)
      } else {
        labels.push('')
      }
    }

    let data = []
    for (let i = range[0]; i < range[1]; i++) {
      data.push(allData[i][yField])
    }

    let chartObj = this.state[`${xField}_${yField}`]
    chartObj.datasets[0].data = data
    chartObj.labels = labels
    let stateObj = {}
    stateObj[`${xField}_${yField}`] = chartObj
    stateObj.filter = filter
    this.setState(stateObj)
  }

  parseData(){
    console.log("Parsing data...")
    const allData = this.state.data
    const { xField, yField } = this.state

    let chartTemplate = {
      labels: [""],
      datasets: [
        {
          data: [],
          label: `${xField}_${yField}`,
        }
      ]
    }

    let stateObj = {}
    stateObj[`${xField}_${yField}`] = chartTemplate
    this.setState(stateObj)

    this.updateData()
  }

  getChartComponent() {
    console.log("getChartComponent ...")
    const { chartType, options, fieldType, width, height } = this.state;

    if (chartType == 'bar') {
      return (<Chart.Bar data={this.state[fieldType] || defaultData} options={options} width={width} height={height}/>)
    } else if (chartType == 'line') {
      return (<Chart.Line data={this.state[fieldType] || defaultData} options={options} width={width} height={height}/>)
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
