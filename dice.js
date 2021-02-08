/*** Configuration ***/
const dice_count    = 5;
const players       = 4;
const rounds        = players;
const show_debug    = false;
const dice          = {
    1: 1,
    2: 2,
    3: 3,
    4: 0,
    5: 5,
    6: 6
};
/*** ***/

const fa_dice       = {
    1: 'fa-dice-one',
    2: 'fa-dice-two',
    3: 'fa-dice-three',
    4: 'fa-dice-four',
    5: 'fa-dice-five',
    6: 'fa-dice-six'
}

var game_obj                = {};

game_obj['players']         = {};
game_obj['tallies']         = {};
game_obj['round_initiator'] = {};
game_obj['current_player']  = null;
game_obj['current_round']   = null;


function setDiceProperties(round, player)
{
    var current_dice = document.querySelector('#roll_dice');

    current_dice.setAttribute('data-round', round);
    current_dice.setAttribute('data-player', player);

    current_dice.setAttribute('disabled', 'disabled');

    if (hasDiceRemaining(round, player)) {
        current_dice.removeAttribute('disabled');
    }

    return true;
}


function hasDiceRemaining(round, player)
{
    var dice_remaining = getDiceRemaining(round, player);

    return (dice_remaining > 0);
}


function getDiceRemaining(round, player)
{
    var dice_remaining = dice_count;

    for (i in game_obj['players'][player][round]) {
        if (game_obj['players'][player][round][i] !== null) {
            dice_remaining -= 1;
        }
    }

    return dice_remaining;
}


function shouldStartNextRound()
{
    var players_with_dice_remaining = players;

    for (i in game_obj['players']) {
        if (!hasDiceRemaining(game_obj['current_round'], i)) {
            players_with_dice_remaining -= 1;
        }
    }

    return (players_with_dice_remaining <= 0);
}


function rollDice()
{
    var dice_numbers = Object.keys(dice);

    return Math.ceil(Math.random() * dice_numbers.length);
}


function switchPlayer(round, player)
{
    var next_player = (player > players) ? 1 : player;

    for (i in game_obj['players'][next_player][round]) {
        if (game_obj['players'][next_player][round][i] !== null) {

            return switchPlayer(round, +next_player + +1);
        }
    }

    setDiceProperties(round, next_player);

    highlightCurrentTurn(round, next_player);

    game_obj['current_player'] = next_player;
    document.getElementById('current_player').innerHTML = 'Player ' + next_player;

    updateGameObjDisplay();

    return next_player;
}


function highlightCurrentTurn(round, player)
{
    var player_containers   = document.getElementsByClassName('player_container');
    var round_containers    = document.getElementsByClassName('round_container');

    for (i = 0; i < player_containers.length; i++) {
        player_containers[i].classList.remove('highlighted');
    }

    for (i = 0; i < round_containers.length; i++) {
        round_containers[i].classList.remove('highlighted');
    }

    if (round && player) {
        document.getElementById('player_' + player).classList.add('highlighted');
        document.getElementById('player_' + player + '_round_' + round + '_container').classList
            .add('highlighted');
    }

    return true;
}


function beginRound(round_number)
{
    var starter_player  = Math.ceil(Math.random() * players);

    for (i in game_obj['round_initiator']) {
        if (game_obj['round_initiator'][i] === starter_player) {
            return beginRound(round_number);
        }
    }

    setDiceProperties(round_number, starter_player);

    highlightCurrentTurn(round_number, starter_player);

    game_obj['current_round']  = round_number;
    game_obj['current_player'] = starter_player;

    document.getElementById('current_player').innerHTML = 'Player ' + starter_player;
    document.getElementById('roll_comment').innerHTML   = 'Player ' + starter_player + (
        (round_number >= rounds)
            ? ', who has been selected, is the last remaining player to begin a round.'
            : ' was randomly selected to begin this round.'
    );

    updateGameObjDisplay();

    return game_obj['round_initiator'][round_number]    = starter_player;
}


function rollDie()
{
    var current_dice_count  = getDiceRemaining(game_obj['current_round'], game_obj['current_player']);

    document.getElementById('roll_comment').innerHTML = null;

    /* clear board before (re?)roll */
    var rolled_die = document.getElementsByClassName('dice_to_select');

    while(rolled_die.length > 0){
        rolled_die[0].remove();
    }

    /* (re?)rolls remaining */
    for (i = 1; i <= current_dice_count; i++) {
        var dice_result = rollDice();

        document.getElementById('dice_board')
            .innerHTML += '<td class="dice_to_select" id="dice_' + i + '"></td>';

        var current_dice = document.querySelector('#dice_' + i);

        current_dice.setAttribute('data-result', dice_result);

        document.getElementById('dice_' + i)
            .innerHTML = '<i class="fas ' + fa_dice[dice_result] + '"></i> ' + dice[dice_result];
    }

    /* newly rolled die */
    rolled_die = document.getElementsByClassName('dice_to_select');

    for (i = 0; i < current_dice_count; i++) {
        rolled_die[i].onclick = function () {
            var clicked_dice = this.dataset.result;

            if (keepDice(clicked_dice, game_obj['current_player'], game_obj['current_round'])) {
                this.remove();
            }
        };
    }

    return document.getElementById('roll_dice').setAttribute('disabled', 'disabled');
}


function keepDice(dice_result, player, round)
{
    for (i = 1; i <= dice_count; i++) {
        if (document.getElementById('dice_player_' + player + '_round_' + round + '_roll_' + i)
            .innerHTML.length === 0) {
            document.getElementById('dice_player_' + player + '_round_' + round + '_roll_' + i)
                .innerHTML =
                '<h2><i class="fas ' + fa_dice[dice_result] + '"></i><h3>' + dice[dice_result] + '</h3>';

            game_obj['players'][player][round][i] = dice[dice_result];

            game_obj['tallies'][player]['sum']          += dice[dice_result];
            game_obj['tallies'][player][round]['sum']   += dice[dice_result];

            break;
        }
    }

    setDiceProperties(round, player);

    document.getElementById('roll_dice').onclick = function() {
        rollDie();
    }

    tallyScore(game_obj['current_round'], game_obj['current_player']);

    if (!hasDiceRemaining(game_obj['current_round'], game_obj['current_player'])) {
        if (game_obj['current_round'] >= rounds && shouldStartNextRound()) {
            declareWinner();
        } else if (shouldStartNextRound()) {
            declareRoundWinner(game_obj['current_round']);
            beginRound(game_obj['current_round']+1);
        } else {
            switchPlayer(round, game_obj['current_player']);
        }
    }

    updateGameObjDisplay();

    return true;
}


function tallyScore(round, player)
{
    document.getElementById('player_score_' + player).innerHTML = game_obj['tallies'][player]['sum'];
    document.getElementById('player_score_' + player + '_round_' + round)
        .innerHTML = game_obj['tallies'][player][round]['sum'];

    return true;
}


function declareRoundWinner(round)
{
    var players     = Object.keys(game_obj['tallies']);
    var smallest    = game_obj['tallies'][players[0]][round]['sum'];
    var winner      = players[0][round];
    var winners     = {};

    for (i in game_obj['tallies']) {
        var value = game_obj['tallies'][i][round]['sum'];

        if (value <= smallest) {
            winner         = i;
            smallest       = value;
            var lowest_tie = false;

            for (j in winners) {
                if (typeof winners[j] !== 'undefined' && winners[j] === value) {
                    lowest_tie = true;
                }
            }

            winners[i]  = value;
        }
    }

    if (lowest_tie !== true) {
        document.getElementById('player_score_' + winner + '_round_' + round)
            .innerHTML += '&#160;<i class="fas fa-award"></i>';
        document.getElementById('player_score_' + winner + '_round_' + round).classList.add('winner');
    }
}


function declareWinner()
{
    var players     = Object.keys(game_obj['tallies']);
    var smallest    = game_obj['tallies'][players[0]]['sum'];
    var winner      = players[0];
    var winners     = {};

    for (i in game_obj['tallies']) {
        var value = game_obj['tallies'][i]['sum'];

        if (value <= smallest) {
            winner         = i;
            smallest       = value;
            var lowest_tie = false;

            for (j in winners) {
                if (typeof winners[j] !== 'undefined' && winners[j] === value) {
                    lowest_tie = true;
                }
            }

            winners[i]  = value;
        }
    }

    // remove any highlighting
    highlightCurrentTurn();

    if (lowest_tie === true) {
        document.getElementById('current_player').innerHTML = 'No clear winner...';
    } else {
        document.getElementById('player_' + winner + '_emblem')
            .innerHTML = '<i class="fas fa-award"></i>&#160;'
            + document.getElementById('player_' + winner + '_emblem').innerHTML;
        document.getElementById('player_' + winner).classList.add('winner');
        document.getElementById('current_player')
            .innerHTML = '<i class="fas fa-award"></i> Player ' + winner + ' wins!';
    }
}


function updateGameObjDisplay()
{
    return (show_debug === true) ? document.getElementById('game_object')
        .innerHTML = JSON.stringify(game_obj, null, 4) : false;
}


function playGame()
{
    for (i = 1; i <= players; i++) {
        document.getElementById('game_board')
            .innerHTML +=
            '<div class="player_container" id="player_' + i + '"><h2 class="player_emblem" id="player_' + i + '_emblem">' +
            '<i class="fas fa-user"></i>&#160;Player&#160;' + i + '</h2>' +
            '<p class="score" id="player_score_' + i + '"></p></div>';

        game_obj['players'][i]          = {};
        game_obj['tallies'][i]          = {};
        game_obj['tallies'][i]['sum']   = 0;

        for (j = 1; j <= rounds; j++) {
            document.getElementById('player_' + i)
                .innerHTML +=
                '<table class="round_container" id="player_' + i + '_round_' + j + '_container">' +
                '<tr id="player_' + i + '_round_' + j + '"><td><h3>Round&#160;' + j + '</h3>' +
                '<p class="score" id="player_score_' + i + '_round_' + j + '"></p></td></tr></table>';

            game_obj['players'][i][j]           = {};
            game_obj['tallies'][i][j]           = {};
            game_obj['tallies'][i][j]['sum']    = 0;

            for (k = 1; k <= dice_count; k++) {
                document.getElementById('player_' + i + '_round_' + j)
                    .innerHTML += '<td id="dice_player_' + i + '_round_' + j + '_roll_' + k + '"></td>';

                game_obj['players'][i][j][k] = null;
            }
        }
    }

    document.getElementById('roll_dice').onclick = function() {
        rollDie();
    }

    updateGameObjDisplay();

    return beginRound(1);
}

playGame();