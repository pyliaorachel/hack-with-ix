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
          <Row><ChartWrapper chartType="line" dataType="impressions" xField="timestamp" yField="impressions" params={{dc:'NA'}} filter={{range:[0,100]}} interval={1000}/></Row>
        </Col>
      </Center>
    )
  }
}
