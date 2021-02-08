# Dice Project

Design the game described below. Implement a method playGame() which simulates a game then displays the winning player and their score.

Game rules:

In this game players roll dice and try to collect the lowest score. A 4 counts as zero, all other numbers count as face value. A player’s score is the total spots showing on the dice when she finishes her turn (excluding fours because they’re zero). The object of the game is to get the lowest score possible. The game is played as follows between 4 players:

* Play starts with one person randomly being chosen to start rolling and proceeds in succession until all players have rolled.
* The player rolls all five dice, then must keep at least one dice but may keep more at her discretion (She can stop on her first roll if she so wishes).
* Those dice which are not kept are rolled again and each round she must keep at least one more until all the dice are out.
* Once each player has rolled the player who scored the lowest wins.
* Repeat for three more rounds in succession so that the next person starts rolling first (at the end each player will have started).

After all four rounds have been completed the player with the lowest combined score wins.

## Requirements
* Browser: Firefox 85.0+, Google Chrome 88.0+ or equivalent with JavaScript enabled

## How to play
1. Download `index.html`, `dice.css` and `dice.js`.
2. From your browser, open file `index.html` and begin playing by clicking the *Roll!* button.
3. To "keep" a dice from each roll, simply click on the dice (or die) desired.
4. To play another game, refresh your browser.

To change the amount of players, rounds or dice values, simply modify the values within the configuration section of `dice.js` then refresh your browser to see the changes take effect.

## TODO
* How do we handle tied rounds? Tied games?
  * Do lowest-tied players go into a tie-breaker round?
  * Are all lowest ties declared as the winner?
* Introduce poker-themed roll values (e.g.):
  * Yahtzee! (all five die are the same)
  * Large Straight (all five die are in sequence)
  * Small Straight (four of the five die are in sequence)
