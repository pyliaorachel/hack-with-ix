// Dependencies

import React, { Component } from 'react'
import * as Chart from 'react-chartjs'

const exampleData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
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
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }
    ]
};
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
