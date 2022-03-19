/**
 * Redirect to Game Level
 * @param {string} game_url The url of game mode chosen by the user
 * @param {number} level The game level chosen by the user
 */
function rgl(game_url, level) {
    location.href = game_url + '/' + level;
}