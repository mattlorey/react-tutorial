var express = require('express')
var app = express()

app.use('/static', express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index', {});
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})