const HTMLParser = require('node-html-parser')

const removeRankingColumn = (_, index) => {
  return index !== 0
}

const joinGoalsAndAssists = (goals, assists, first) => {
  const goalsRanking = goals.map(row => getPlayer(row, 'goals'))
  const assistsRanking = assists.map(row => getPlayer(row, 'assists'))

  goalsAndAssists = []

  goalsRanking.map(player =>
    goalsAndAssists[player.name]
      ? (goalsAndAssists[player.name] += player.goals)
      : (goalsAndAssists[player.name] = player.goals)
  )

  assistsRanking.map(player =>
    goalsAndAssists[player.name]
      ? (goalsAndAssists[player.name] += player.assists)
      : (goalsAndAssists[player.name] = player.assists)
  )

  const goalsAndAssistsAsObject = Object.keys(goalsAndAssists)
    .map(playerName => {
      return {
        name: playerName,
        goalsAndAssists: goalsAndAssists[playerName],
        team: getTeamByName(playerName, goalsRanking, assistsRanking)
      }
    })
    .sort((a, b) => {
      if (a.goalsAndAssists < b.goalsAndAssists) {
        return 1
      }

      if (a.goalsAndAssists > b.goalsAndAssists) {
        return -1
      }

      return 0
    })

  return {
    goals: goalsRanking.slice(0, first),
    assists: assistsRanking.slice(0, first),
    goalsAndAssists: goalsAndAssistsAsObject.slice(0, first)
  }
}

const getTeamByName = (playerName, goalsRanking, assistsRanking) => {
  const player = goalsRanking.filter(player => player.name === playerName)
  if (player.length > 0) {
    return player[0].team
  }

  return assistsRanking.filter(player => player.name === playerName)[0].team
}

const getStats = (data, first) => {
  const html = HTMLParser.parse(data)
  const goalsAndAssists = html.querySelectorAll('tbody.Table__TBODY tr')
  const goals = goalsAndAssists.slice(0, 50)
  const assists = goalsAndAssists.slice(50, 100)

  return joinGoalsAndAssists(goals, assists, first)
}

const getPlayer = (row, field) => {
  const columns = row.querySelectorAll('td').filter(removeRankingColumn)

  return {
    name: columns[0].text,
    team: columns[1].text.trim(),
    games_played: parseInt(columns[2].text),
    [field]: parseInt(columns[3].text)
  }
}

module.exports = getStats
