const HTMLParser = require('node-html-parser');

const countries = ['england', 'spain', 'italy', 'germany','france']

const removeWomenTable = (_, index) => {
  return index !== 1
}

const getTables = data => {
  const html = getAsHtml(data)
  const tables = html.querySelectorAll('table')
  const majorTables = Array.from(tables).slice(0, countries.length + 1).filter(removeWomenTable)

  const mapTables = {}

  majorTables.forEach((table, index) => {
    mapTables[countries[index]] = getTeamsFromTable(table);
  })

  return mapTables;
}

const getTeamsFromTable = table => {

  const teams = []

  table.querySelectorAll('tr').forEach((row, index) => {

    if (index === 0 || index === 5){
      return
    }

    const columns = row.querySelectorAll('td')

    teams.push({
      "position": parseInt(columns[0].innerText),
      "name": columns[1].innerText,
      "games_played": parseInt(columns[2].innerText),
      "win": parseInt(columns[3].innerText),
      "drawn": parseInt(columns[4].innerText),
      "lost": parseInt(columns[5].innerText),
      "goals_for": parseInt(columns[6].innerText),
      "goals_against": parseInt(columns[7].innerText),
      "goal_difference": parseInt(columns[8].innerText),
      "points": parseInt(columns[9].innerText),
      "history": [],
      "percent": columns[9].innerText / (columns[2].innerText * 3),
    })

  })
  return teams
}

const getAsHtml = text => {
  return HTMLParser.parse(text)
}

module.exports = getTables;
