const HTMLParser = require('node-html-parser');

const removeRankingColumn = (_, index) => {
  return index !== 0
}

const joinGoalsAndAssists = (goals, assists) => {
  const goalsRanking = goals.map(row => getPlayer(row, "goals"))
  const assistsRanking = assists.map(row => getPlayer(row, "assists"))

  goalsAndAssists = []

  goalsRanking.map(player => 
    goalsAndAssists[player.name] ? 
    goalsAndAssists[player.name] += player.goals : 
    goalsAndAssists[player.name] = player.goals
  )

  assistsRanking.map(player => 
    goalsAndAssists[player.name] ? 
    goalsAndAssists[player.name] += player.assists : 
    goalsAndAssists[player.name] = player.assists
  )

  const goalsAndAssistsAsObject = Object.keys(goalsAndAssists).map(key => {
    return {
      name: key,
      goalsAndAssists: goalsAndAssists[key]
    }
  }).sort((a,b)=>{
    if (a.goalsAndAssists < b.goalsAndAssists){
      return 1;
    }

    if (a.goalsAndAssists > b.goalsAndAssists){
      return -1;
    }

    return 0;
  })

  return {
    goals: goalsRanking,
    assists: assistsRanking,
    goalsAndAssists: goalsAndAssistsAsObject
  }
}

const getStats = data => {
  const html = HTMLParser.parse(data)
  const goalsAndAssists = html.querySelectorAll('tbody.Table2__tbody tr')
  const goals = goalsAndAssists.slice(0,50)
  const assists = goalsAndAssists.slice(50,100)

  return joinGoalsAndAssists(goals, assists)
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
