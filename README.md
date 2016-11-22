Goto [demo](https://github.com/pyliaorachel/hack-with-ix/tree/demo) branch for working version. Master has some issue...

# Features

- __React.js__
- __Data visualization__ with charts

# UI

1. Visualizing data using [react-d3-basic](https://github.com/react-d3/react-d3-basic)
 - Also tried [react-chartjs](https://github.com/reactjs/react-chartjs), which I had problem doing the css with. And I hate the documentation.
 - And [react-d3](https://github.com/esbullington/react-d3) from this guy. Is it my problem that the styling is so hard to succeed???
 - OMG I tried with 3-4 different libraries this night.
2. Animating data i.e. data goes with time
 - Did it myself by setting intervals to parse the data and rerender the component
3. Grid layout using [react-grid-layout](https://github.com/STRML/react-grid-layout#features)
4. Styling with [react-bootstrap](https://react-bootstrap.github.io/components.html)

# Usage

- Server:

`cd api`  
`npm install`  
`node server.js`

Then open your browser and go to `localhost:8000`

- Client:

`cd ui`  
`npm install`  
`node server.js`

Then open your browser and go to `localhost:3000`

# Demo

![demo](https://github.com/pyliaorachel/hack-with-ix/blob/demo/demo.gif)
