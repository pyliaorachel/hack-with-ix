// Dependencies

import React, { Component } from 'react'
import GridLayout from 'react-grid-layout'

// Components

import { Center, Col, Row } from 'components/Flex'
import ChartWrapper from 'components/ChartWrapper'


export default class Grid extends Component {
  constructor () {
    super()

    this.state = {
      fullWidth: document.documentElement.clientWidth,
    }
  }

  render () {
    const layout = [
      {i: 'a', x: 0, y: 0, w: 4, h: 4, static: true},
      {i: 'b', x: 4, y: 0, w: 4, h: 4, static: true},
      {i: 'c', x: 8, y: 0, w: 4, h: 4, static: true}
    ]
    const { fullWidth } = this.state
    const chartWidth = fullWidth/3-40
    return (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={250} width={fullWidth}>
        <div key={'a'}>
          <ChartWrapper
            width={chartWidth}
            chartType="area"
            dataType="impressions"
            xField="timestamp"
            yField="impressions"
            params={{dc:'NA'}}
            filter={{range:[0,50]}}
            interval={1000}
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
            params={{dc:'NA', id:'NA0001'}}
            filter={{range:[0,50]}}
            interval={1000}
          />
        </div>
        <div key={'c'}>
        <ChartWrapper
          width={chartWidth}
          chartType="line"
          dataType="performance"
          xField="timestamp"
          yField="requests"
          params={{dc:'NA', id:'NA0001'}}
          filter={{range:[0,50]}}
          interval={1000}
        />
        </div>
      </GridLayout>
    )
  }
}
