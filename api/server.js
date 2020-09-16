const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

const users = [];
const api_helper = require('./API_helper');
const mysql = require('mysql');
const cors = require('cors')
const routes = require('./routes');


var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'my_events'
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
  });

app.use(cors(corsOptions))
    .use(routes(connection))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended : true}));
    
app.get('/api', (req, res) => {
    api_helper.make_API_call('http://eventful.com/events?q=music')
    .then(response => {
        console.log(req.params)
    })
    .catch(error => {
        res.send(error)
    })
})
app.get('/apo', (req, res) => {
    api_helper.make_API_call('https://eventful.com/json/marseille/events?q=title:cats tag:musical')
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        res.send(error)
    })
})


app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});