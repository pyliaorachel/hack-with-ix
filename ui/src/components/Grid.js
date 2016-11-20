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
    const { fullWidth } = this.state
    const chartWidth = fullWidth/4-16
    return (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={300} width={fullWidth}>
        <div key={'a'}>
          <ChartWrapper
            width={chartWidth}
            chartType="area"
            dataType="impressions"
            xField="timestamp"
            yField="impressions"
            params={{dc:'EU'}}
            filter={{range:[0,40]}}
            interval={700}
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
            interval={700}
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
            interval={700}
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
            interval={700}
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
            interval={700}
          />
        </div>
        <div key={'f'}>
          <ChartWrapper
            width={chartWidth*2}
            height={510}
            chartType="line"
            dataType="performance"
            xField="timestamp"
            yField="requests"
            params={{dc:'NA', id:'NA0003'}}
            filter={{range:[0,40]}}
            interval={700}
          />
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
            interval={700}
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
            interval={700}
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
            interval={700}
            group="platform"
          />
        </div>
      </GridLayout>
    )
  }
}
