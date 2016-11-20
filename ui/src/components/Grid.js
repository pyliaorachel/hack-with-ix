// Dependencies

import React, { Component } from 'react'
import GridLayout from 'react-grid-layout'

// Components

import { Center, Col, Row } from 'components/Flex'
import ChartWrapper from 'components/ChartWrapper'

const defaultParams = { dc:'NA', id:'NA0003' }

export default class Grid extends Component {
  constructor (props) {
    super(props)

    const layout = [
      {i: 'a', x: 0, y: 0, w: 3, h: 1},
      {i: 'b', x: 3, y: 0, w: 3, h: 1},
      {i: 'c', x: 6, y: 0, w: 3, h: 1},
      {i: 'd', x: 9, y: 0, w: 3, h: 1},
      {i: 'e', x: 0, y: 1, w: 3, h: 1},
      {i: 'f', x: 3, y: 1, w: 6, h: 2},
      {i: 'g', x: 9, y: 1, w: 3, h: 1},
      {i: 'h', x: 0, y: 2, w: 3, h: 1},
      {i: 'i', x: 9, y: 2, w: 3, h: 1},
    ]

    this.state = {
      fullWidth: document.documentElement.clientWidth,
      chartProperties: props.chartProperties,
      layout,
      chartWidth: document.documentElement.clientWidth/4-16,
      interval: 700,
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps ...", nextProps)
    this.setState({chartProperties: nextProps.chartProperties})
  }

  getMainChart() {
    const { chartWidth, chartProperties } = this.state

    let params = null
    if (chartProperties) {
      params = {
        ...chartProperties,
        dc: chartProperties.area,
        id: chartProperties.server,
        dataType: chartProperties.dataType,
      }
    }

    return (
      <ChartWrapper
        width={chartWidth*2}
        height={527}
        chartType="line"
        dataType="performance"
        xField="timestamp"
        yField="requests"
        params={params || defaultParams}
        filter={{range:[0,40]}}
        interval={this.state.interval}
      />
    )
  }

  render () {
    const { fullWidth, chartWidth, layout, interval } = this.state
    return (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={320} width={fullWidth}>
        <div key={'a'}>
          <ChartWrapper
            width={chartWidth}
            chartType="area"
            dataType="impressions"
            xField="timestamp"
            yField="impressions"
            params={{dc:'EU'}}
            filter={{range:[0,40]}}
            interval={interval}
            group="platform"
          />
        </div>
        <div key={'b'}>
          <ChartWrapper
            width={chartWidth}
            chartType="bar"
            dataType="performance"
            xField="timestamp"
            yField="lag"
            params={{dc:'EU', id:'EU0004'}}
            filter={{range:[0,40]}}
            interval={interval}
          />
        </div>
        <div key={'c'}>
          <ChartWrapper
            width={chartWidth}
            chartType="line"
            dataType="performance"
            xField="timestamp"
            yField="requests"
            params={{dc:'AS', id:'AS0002'}}
            filter={{range:[0,40]}}
            interval={interval}
          />
        </div>
        <div key={'d'}>
          <ChartWrapper
            width={chartWidth}
            chartType="area"
            dataType="impressions"
            xField="timestamp"
            yField="impressions"
            params={{dc:'NA'}}
            filter={{range:[0,40]}}
            interval={interval}
            group="platform"
          />
        </div>
        <div key={'e'}>
          <ChartWrapper
            width={chartWidth}
            chartType="bar"
            dataType="performance"
            xField="timestamp"
            yField="lag"
            params={{dc:'AS', id:'AS0001'}}
            filter={{range:[0,40]}}
            interval={interval}
          />
        </div>
        <div key={'f'}>
          {
            this.getMainChart()
          }
        </div>
        <div key={'g'}>
          <ChartWrapper
            width={chartWidth}
            chartType="area"
            dataType="impressions"
            xField="timestamp"
            yField="impressions"
            params={{dc:'AS'}}
            filter={{range:[0,40]}}
            interval={interval}
            group="platform"
          />
        </div>
        <div key={'h'}>
          <ChartWrapper
            width={chartWidth}
            chartType="line"
            dataType="performance"
            xField="timestamp"
            yField="requests"
            params={{dc:'NA', id:'NA0001'}}
            filter={{range:[0,40]}}
            interval={interval}
          />
        </div>
        <div key={'i'}>
          <ChartWrapper
            width={chartWidth}
            chartType="area"
            dataType="impressions"
            xField="timestamp"
            yField="impressions"
            params={{dc:'EU'}}
            filter={{range:[0,40]}}
            interval={interval}
            group="platform"
          />
        </div>
      </GridLayout>
    )
  }
}
