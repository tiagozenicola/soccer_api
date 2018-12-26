const express = require('express');
const app = express();
const getTables = require('./util')
const fetch = require('node-fetch');


app.get('/', function (req, res) {
  fetch('https://www.theguardian.com/football/tables')
    .then(response => {
        if (!response.ok){
            const error_message = 'Error calling site'
            console.error(error_message);
            throw new Error(error_message)
        }

        return response.text();
    })
    .then(data => {
        const tables = getTables(data)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(tables);
    })
    .catch(console.error);
  
});

app.listen(3001, function () {
  console.log('Example app listening on port 3000!');
});