const HTMLParser = require('node-html-parser');

const removeRankingColumn = (_, index) => {
  return index !== 0
}

const getStats = data => {
  const html = HTMLParser.parse(data)
  const goalsAndAssists = html.querySelectorAll('tbody.Table2__tbody tr')
  const goals = goalsAndAssists.slice(0,50)
  const assists = goalsAndAssists.slice(50,100)

  return {
    goals: goals.map(row => getPlayer(row, "goals")),
    assists: assists.map(row => getPlayer(row, "assists"))
  }
}

const getPlayer = (row, field) => {
  const columns = row.querySelectorAll('td').filter(removeRankingColumn)

  return {
    "name": columns[0].text,
    "team": columns[1].text.trim(),
    "games_played": parseInt(columns[2].text),
    [field]: parseInt(columns[3].text),
  }
}


module.exports = getStats;
