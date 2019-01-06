const fetch = require('node-fetch');
const getStats = require('./util/espn_stats_parser')

const urls = [
    "http://www.espn.com/soccer/stats/_/league/ENG.1",
    "http://www.espn.com/soccer/stats/_/league/ita.1",
]

const loadStatsData = () => {
    console.log('loadStats called')

    const fetches = urls.map(url => fetch(url).then(resp => resp.text()))
    console.log(47,  typeof(urls), typeof(fetches), urls, fetches)

    return Promise.all(fetches).then(texts => {
        console.log(48, typeof(texts), texts.length)
        return getStats(texts[0])
    })    
  }
  

module.exports = loadStatsData;
