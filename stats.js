const fetch = require('node-fetch');
const getStats = require('./util/espn_stats_parser')

const URL = "http://www.espn.com/soccer/stats/_/league/ENG.1"

const loadStatsData = () => {
    console.log('loadStats called')
    return fetch(URL)
      .then(response => {
        if (!response.ok){
          const error_message = 'Error calling site'
          console.error(error_message);
          throw new Error(error_message)
        }
  
        return response.text();
      })
      .then(data => {
        const tables = getStats(data)
        return tables
      })
      .catch(console.error);
  }
  

module.exports = loadStatsData;
