# soccer_api

Request example:

http://localhost:4000/graphql?query=%7B%0A%20%20tables%7B%0A%20%20%20%20england%20%7B%0A%20%20%20%20%20%20...teamFields%0A%20%20%20%20%7D%2C%0A%20%20%20%20france%20%7B%0A%20%20%20%20%20%20...teamFields%0A%20%20%20%20%7D%2C%0A%20%20%20%20germany%20%7B%0A%20%20%20%20%20%20...teamFields%0A%20%20%20%20%7D%2C%0A%20%20%20%20italy%20%7B%0A%20%20%20%20%20%20...teamFields%0A%20%20%20%20%7D%2C%0A%20%20%20%20spain%20%7B%0A%20%20%20%20%20%20...teamFields%0A%20%20%20%20%7D%0A%09%7D%0A%7D%0Afragment%20teamFields%20on%20Team%20%7B%0A%20%20position%2C%0A%20%20name%2C%0A%20%20games_played%2C%0A%20%20win%2C%0A%20%20drawn%2C%0A%20%20lost%2C%0A%20%20goals_for%2C%0A%20%20goals_against%2C%0A%20%20goal_difference%2C%0A%20%20points%2C%0A%20%20history%2C%0A%20%20percent%2C%0A%7D