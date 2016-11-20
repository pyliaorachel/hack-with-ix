// Dependencies

import React, { Component } from 'react'

// Components

import { Center, Col, Row } from 'components/Flex'
import ChartWrapper from 'components/ChartWrapper'


export default class App extends Component {
  constructor () {
    super()
  }

  render () {
    return (
      <Center>
        <Col>
          <Row><ChartWrapper chartType="line" dataType="performance" xField="timestamp" yField="lag" params={{dc:'NA', id:'NA0002'}} filter={{range:[0,100]}} animation={true}/></Row>
          <Row><ChartWrapper chartType="bar" dataType="performance" xField="timestamp" yField="requests" params={{dc:'NA', id:'NA0002'}} filter={{range:[0,100]}} animation={true}/></Row>
        </Col>
      </Center>
    )
  }
}
