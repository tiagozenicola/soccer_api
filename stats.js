const fetch = require('node-fetch');
const getStats = require('./util/espn_stats_parser')

const urls = [
    "http://www.espn.com/soccer/stats/_/league/ENG.1",
    "http://www.espn.com/soccer/stats/_/league/ita.1",
    "http://www.espn.com/soccer/stats/_/league/esp.1",
    "http://www.espn.com/soccer/stats/_/league/ger.1",
    "http://www.espn.com/soccer/stats/_/league/fra.1",
]

const loadStatsData = (first) => {
    console.log('loadStats called')

    const fetches = urls.map(url => fetch(url).then(resp => resp.text()))

    return Promise.all(fetches).then(texts => {
        return {
            "england": getStats(texts[0], first),
            "italy": getStats(texts[1], first),
            "spain": getStats(texts[2], first),
            "germany": getStats(texts[3], first),
            "france": getStats(texts[4], first)
        }
    })    
  }
  

module.exports = loadStatsData;
