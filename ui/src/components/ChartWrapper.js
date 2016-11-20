// Dependencies

import React, { Component } from 'react'
import * as Chart from 'react-chartjs'

const defaultData = {
    labels: [""],
    datasets: [
        {
            label: "",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
        }
    ]
}

const defaultOptions = {
  elements: {
    points: {
      borderWidth: 1,
      borderColor: 'rgb(0, 0, 0)'
    }
  }
}

export default class ChartWrapper extends Component {
  constructor (props) {
    super(props)

    this.state = {
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
      chartOptions: this.props.chartOptions || defaultOptions,
    }
  }

  fetchPerformance(dc, id){
    console.log("Fetching performance ...")

    fetch(`http://localhost:8000/performance?dc=${dc}&id=${id}`)
      .then(res => res.json())
      .then(json => {
        this.setState({ data: json.data})
        this.parseData(this.state.xField, this.state.yField, this.state.filter)
      })
      .catch(err => { console.log('ERROR', err); });
  }

  fetchImpressions(dc){
    console.log("Fetching impressions ...")

    fetch(`http://localhost:8000/impressions?dc=${dc}`)
      .then(res => res.json())
      .then(json => {
        this.setState({ data: json.data})
        this.parseData(this.state.xField, this.state.yField, this.state.filter)
      })
      .catch(err => { console.log('ERROR', err); });
  }

  updateData(yField, ranges){
    let data = this.state[yField]
    if (this.state[yField]) {
      if (ranges) {
        let filteredData = this.state[yField].filter((item) => {
          let isValid = true
          Object.keys(ranges).forEach((rangeType) => {
            if (item[rangeType] < ranges[rangeType][0] || item[rangeType] > ranges[rangeType][1]){
              isValid = false
              return
            }
          })
          return isValid
        })
        data = filteredData
      }
    }
    return data
  }

  parseData(xField, yField, filter){
    console.log("Parsing data...", xField, yField)

    const allData = this.state.data

    let chartTemplate = {
      labels: [""],
      datasets: [
        {
          label: `${xField}_${yField}`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false,
        }
      ]
    }

    let labels = []
    for (let i = filter.range[0]; i < filter.range[1]; i++) {
      if (i % 10 == 0) {
        let date = new Date(allData[i][xField])
        labels.push(date.toDateString())
      } else {
        labels.push('')
      }
    }

    let data = []
    for (let i = filter.range[0]; i < filter.range[1]; i++) {
      data.push(allData[i][yField])
    }

    chartTemplate.datasets[0].data = data
    chartTemplate.labels = labels

    let stateObj = {}
    stateObj[`${xField}_${yField}`] = chartTemplate
    this.setState(stateObj)
  }

  componentWillMount() {
    console.log("componentWillMount ...")
    const { dataType, params, fieldType } = this.state;

    if (dataType == 'performance') {
      this.fetchPerformance(params.dc, params.id)
    } else if (dataType == 'impressions') {
      this.fetchImpressions(params.dc)
    }
  }

  getChartComponent() {
    console.log("getChartComponent ...")
    const { chartType, chartOptions, fieldType } = this.state;

    if (chartType == 'bar') {
      return (<Chart.Bar data={this.state[fieldType] || defaultData} options={chartOptions} width="600" height="250"/>)
    } else if (chartType == 'line') {
      return (<Chart.Line data={this.state[fieldType] || defaultData} options={chartOptions} width="600" height="250"/>)
    } else {
      return (<div></div>)
    }
  }

  render () {
    return (
      <div>
        {this.getChartComponent()}
      </div>
    )
  }
}
