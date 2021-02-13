var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', process.env.PORT || 9000);
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
}).listen(app.get('port'), function(req, res) {
  console.log("listening on localhost port "+ app.get('port'));
});

// WILL ADD SERVER SIDE DATA RETRIEVAL INSTEAD IN NEAR FUTURE


// app.get('/postWords', function(req, res) {
//
//   var sen = req.query.sentence;
//   var words = sen.split(' ');
//
//   console.log(words);
//
//   for (var i = 0; i < words.length; i++) {
//     var url = 'https://api.datamuse.com/words?rel_nry='+words[i];
//
//     request(url, function(err, resp, body) {
//       if (err) {
//         console.error("Error Making request: " + err);
//       }
//
//        body = JSON.parse(body);
//        for (var i = 0; i < body.length; i++) {
//          console.log(body[i].word);
//        }
//      });
//   }
//
//    res.end();
// });
