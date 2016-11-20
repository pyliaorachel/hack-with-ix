// Dependencies

import React, { Component } from 'react'
import * as Chart from 'react-d3-basic'
import D3 from 'd3'
import * as Color from 'style/colors'

const defaultData = []

const styles = {
  wrapperStyle: {
    backgroundColor: Color.bg,
    padding: 8
  },
  titleStyle: {
    display: `flex`,
    justifyContent: `center`,
    fontFamily: 'Oswald',
    color: Color.title,
    fontSize: 26
  },
  subtitleStyle: {
    display: `flex`,
    justifyContent: `center`,
    fontFamily: 'Oswald',
    color: Color.title,
    fontSize: 14
  }
}

export default class ChartWrapper extends Component {
  constructor (props) {
    super(props)

    let title = ''
    Object.keys(this.props.params).forEach((key) => {
      title += `${this.props.params[key]} `
    })

    this.state = {
      title: props.title || title,
      width: props.width || 200,
      height: props.height || 200,
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

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps ... in ChartWrapper", nextProps)
    const oldParams = this.state.params
    const newParams = nextProps.params

    if ((newParams.dataType && this.state.dataType != newParams.dataType)
      || (newParams.xField && this.state.xField != newParams.xField)
      || (newParams.yField && this.state.yField != newParams.yField)
      || (newParams.chartType && this.state.chartType != newParams.chartType)
      ) {
      // refresh plot
      console.log("refresh plot ...")
      this.setState({params: newParams, dataType: newParams.dataType, xField: newParams.xField, yField: newParams.yField, chartType: newParams.chartType})
      if (this.state.intervalId) {
        clearInterval(this.state.intervalId);
      }
      this.fetchData(newParams)
      return
    }
    Object.keys(oldParams).forEach((key) => {
      if (oldParams[key] != newParams[key]){
        // refresh plot
        console.log("refresh plot ...")
        this.setState({params: newParams})
        if (this.state.intervalId) {
          clearInterval(this.state.intervalId);
        }
        this.fetchData(newParams)
        return
      }
    })
  }

  componentWillUnmount() {
    console.log("componentWillUnmount ...")

    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
  }

  refreshData() {
    let title = ''
    Object.keys(this.state.params).forEach((key) => {
      title += `${this.state.params[key]} `
    })
    this.setState({title})
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
        this.refreshData()
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
    Object.keys(allKeys).forEach((key,i) => {
      const color = D3.rgb(Color.line).darker(i*0.5)
      console.log('color', color)
      chartTemplate.push({
        name: key,
        field: key,
        color,
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
      // let parseDate = D3.time.format("%b%d %H:%M").parse
      // let formatDate = D3.time.format("%b%d %H:%M")

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
    //console.log("getChartComponent ...", this.state.chartSeries)
    const { chartType, chartData, chartSeries, width, height, title, xField, yField, group, xFunc } = this.state;
    const xScale = (xField == 'timestamp') ? 'time' : 'linear'

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
          xLabel={xField}
          yLabel={yField}
          showXGrid={false}
          showYGrid={false}
          yTickFormat={D3.format(".2s")}
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
          xScale={xScale}
          xLabel={xField}
          yLabel={yField}
          showXGrid={false}
          showYGrid={false}
          yTickFormat={D3.format(".2s")}
        />)
    } else if (chartType == 'area') {
      return (
        <Chart.AreaChart
          legend={(group != null)}
          data={chartData}
          chartSeries={chartSeries}
          width={width}
          height={height}
          margins={{ top: 40, right: 50, bottom: 40, left: 50 }}
          x={xFunc}
          xScale={xScale}
          xLabel={xField}
          yLabel={yField}
          showXGrid={false}
          showYGrid={false}
          yTickFormat={D3.format(".2s")}
        />)
    } else {
      return (<div></div>)
    }
  }

  render () {

    return (
      <div style={styles.wrapperStyle}>
        <h1 style={styles.titleStyle}>{this.state.title}</h1>
        <span style={styles.subtitleStyle}>{`${this.state.xField} X ${this.state.yField}`}</span>
        {this.getChartComponent()}
      </div>
    )
  }
}
