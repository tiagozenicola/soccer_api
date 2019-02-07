const cors = require('cors')
const getTables = require('./util/table.js')
const loadStatsData = require('./stats')
const fetch = require('node-fetch');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');

const SERVER_PORT = process.env.PORT || 4000;

let lastCallTime = undefined;
let lastCallValue = undefined;

const root = {
  championships: ({first}) => {
    const firstParameter = first || 5;

    if (!lastCallTime || new Date() - lastCallTime > 60000){
      lastCallTime = new Date();
      lastCallValue = loadInfo(firstParameter);
    }

    return lastCallValue;
  }
};

const loadInfo = (first) => {
  return loadSiteData().then(championships => {
    
    return loadStatsData(first).then(stats => {
      championships.forEach(c => c.stats = stats[c.country] )
      return championships;
    })


  })
  
}

const loadSiteData = () => {
  console.log('loadSiteData called')
  return fetch('https://www.theguardian.com/football/tables')
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
      return tables
    })
    .catch(console.error);
}

const app = express();

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


app.get('/tables', (_req, res) => {
  loadSiteData().then(tables => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(tables);
  })
});

app.get('/tables/stats', (_req, res) => {
  loadStatsData().then(tables => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(tables);
  })
});
  
app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`));
