var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', (err, result) => {
  if (err) console.log(err)
  console.log('Listening at localhost:3000')
})

// var myImage = document.querySelector('.my-image');
// fetch('flowers.jpg').then(function(response) {
// 	response.blob().then(function(myBlob) {
//         var objectURL = URL.createObjectURL(myBlob);
//         myImage.src = objectURL;
//       });
//       console.log(response.bodyUsed);
//  });

// "timestamp":1478302800000,
//       "platform":"app",
//       "format":"banner",
//       "impressions":10724,
//       "spend":61691.60489606392

//Generating Dummy JSON data for impressions
//76592.70706271428
while (true) {
    var impressions, spend = 0;
    var impressions = Math.random();
    var spend = Math.random() * (100000.00000000000 - 10000.00000000000) + 10000.00000000000;

    var platformArr = ['App', 'Web'];
    var platform = platformArr[Math.floor(Math.random() * platformArr.length)];

    var formatArr = ['banner', 'video'];
    var format = formatArr[Math.floor(Math.random() * formatArr.length)];

    createJSON(impressions, spend, platform, format);
}

function createJSON(impressions, spend, platform, format) {
    jsonObj = [];
    //$("input[class=email]").each(function() {

        // var id = $(this).attr("title");
        // var email = $(this).val();

        data = {}
        data ["timestamp"] = $.now();
        data ["platform"] = platform;
        data ["format"] = format;
        data ["impressions"] = impressions;
        data ["spend"] = spend;

        jsonObj.push(item);
    //});

    //console.log(jsonObj);
}