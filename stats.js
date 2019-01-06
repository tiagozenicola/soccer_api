const fetch = require('node-fetch');
const getStats = require('./util/espn_stats_parser')

const urls = [
    "http://www.espn.com/soccer/stats/_/league/ENG.1",
    "http://www.espn.com/soccer/stats/_/league/ita.1",
    "http://www.espn.com/soccer/stats/_/league/esp.1",
    "http://www.espn.com/soccer/stats/_/league/ger.1",
    "http://www.espn.com/soccer/stats/_/league/fra.1",
]

const loadStatsData = () => {
    console.log('loadStats called')

    const fetches = urls.map(url => fetch(url).then(resp => resp.text()))
    console.log(47,  typeof(urls), typeof(fetches), urls, fetches)

    return Promise.all(fetches).then(texts => {
        console.log(48, typeof(texts), texts.length)
        return {
            "england": getStats(texts[0]),
            "italy": getStats(texts[1]),
            "spain": getStats(texts[2]),
            "germany": getStats(texts[3]),
            "france": getStats(texts[4])
        }
    })    
  }
  

module.exports = loadStatsData;
