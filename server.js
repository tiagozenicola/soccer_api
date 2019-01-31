const cors = require('cors')
const getTables = require('./util/table.js')
const loadStatsData = require('./stats')
const fetch = require('node-fetch');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const SERVER_PORT = process.env.PORT || 4000;

const schema = buildSchema(`
  type Query {
    championships: [Championship!]
  }
  type Championship {
    country: String!
    teams: [Team!]
    stats: SoccerStats!
  }
  type SoccerStats {
    assists: [PlayerStats!]
    goals: [PlayerStats!]
    goalsAndAssists: [PlayerStats!]
  }
  type PlayerStats {
    name: String!
    team: String
    games_played: Int
    assists: Int
    goals: Int
    goalsAndAssists: Int
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

let lastCallTime = undefined;
let lastCallValue = undefined;

const root = {
  championships: () => {
    
    if (!lastCallTime || new Date() - lastCallTime > 60000){
      lastCallTime = new Date();
      lastCallValue = loadInfo();
    }

    return lastCallValue;
  }
};

const loadInfo = () => {
  return loadSiteData().then(championships => {
    
    return loadStatsData().then(stats => {
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
