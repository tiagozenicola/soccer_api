const { buildSchema } = require('graphql');

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
    assists(first: Int): [PlayerStats!]
    goals(first: Int): [PlayerStats!]
    goalsAndAssists(first: Int): [PlayerStats!]
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

module.exports = schema;
