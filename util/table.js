const HTMLParser = require('node-html-parser');

const countries = ['england', 'germany', 'italy', 'spain', 'france']

const getTables = data => {
  const html = HTMLParser.parse(data)
  const tables = html.querySelectorAll('table')
  const majorTables = Array.from(tables).slice(0, countries.length)

  championships = []

  majorTables.forEach((table, index) => {
    championships.push({
      "country": countries[index],
      "teams": getTeamsFromTable(table)
    })
  })

  return championships;
}

const getTeamsFromTable = table => {
  const teams = []

  table.querySelectorAll('tr').forEach((row, index) => {

    if (index === 0 || index === 5){
      return
    }

    const columns = row.querySelectorAll('td')

    teams.push({
      "position": parseInt(columns[0].text),
      "name": columns[1].text.trim(),
      "games_played": parseInt(columns[2].text),
      "win": parseInt(columns[3].text),
      "drawn": parseInt(columns[4].text),
      "lost": parseInt(columns[5].text),
      "goals_for": parseInt(columns[6].text),
      "goals_against": parseInt(columns[7].text),
      "goal_difference": parseInt(columns[8].text),
      "points": parseInt(columns[9].text),
      "history": [],
      "percent": columns[9].text / (columns[2].text * 3),
    })

  })
  return teams
}


module.exports = getTables;
