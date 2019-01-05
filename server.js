const getTables = require('./util')
const fetch = require('node-fetch');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const SERVER_PORT = process.env.PORT || 4000;

const schema = buildSchema(`
  type Query {
    tables: Tables!
  }
  type Tables {
    england: [Team!]
    spain: [Team!]
    italy: [Team!]
    germany: [Team!]
    france: [Team!]
  }
  type Team {
    position: Int!
    name: String!
    games_played: Int!
    win: Int!
    drawn: Int!
    lost: Int!
    goals_for: Int!
    goals_against: Int!
    goal_difference: Int!
    points: Int!
    history: [Int!]
    percent: Float!
  }
`);

const root = {
  tables: () => {
    return loadSiteData();
  },
};

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
  
app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`));
