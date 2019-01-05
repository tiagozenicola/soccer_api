const getTables = require('./util')
const fetch = require('node-fetch');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const data = require('./data')

console.log(111, data.tables)

const SERVER_PORT = process.env.PORT || 4000;

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
};

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: false,
}));

app.get('/tables', function (req, res) {
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
  
app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}!`));
