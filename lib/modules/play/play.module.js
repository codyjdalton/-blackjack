/**
 * hello.module
 */
const { prompt } = require('inquirer');
const chalk = require('chalk');

const Blackjack = require('../../classes/blackjack');

class PlayModule {

    constructor() {
        this.log = console.log;
        this.prompt = prompt;
        
        this.game = new Blackjack();
    }

    play() {
        const prompts = [
            {
                type: 'rawlist',
                name: 'response',
                message: 'What would you like to do?',
                choices: [
                    'Deal',
                    'Quit'
                ],
            },
        ];
        
        this.prompt(prompts)
            .then((answers) => {
                if(answers.response === 'Deal') {
                    this.deal();
                }
            });
    }
    
    outputHand(hand) {

        let suitUnicodes = {
            'Diamonds': '♦',
            'Hearts': '♥',
            'Clubs': '♣',
            'Spades': '♠'
        }
        let output = '';
        let outputCards = hand.map(
            c => c.suit === 'Diamonds' || c.suit === 'Hearts' ?
            chalk.bgWhite( ' ' + chalk.red(c.value + suitUnicodes[c.suit]) + ' ') :
            chalk.inverse(' ' + c.value + suitUnicodes[c.suit] + ' ')
        );

        output = output + outputCards.join(' ');

        if(hand.length === 1) {
            output += ' ';
            output += chalk.bgWhite(' ' + chalk.blue('██') + ' ')
        }

        console.log(output);
    }

    outputGameState() {

        let odds = this.game.calculateOdds();

        console.log('---------- PLAYER HAND ----------')
        this.outputHand(this.game.playerHand)
        console.log('---------- DEALER HAND ----------')
        this.outputHand(this.game.dealerHand)
        console.log('---------------------------------')
    }

    outputOdds() {

        let odds = this.game.calculateOdds();
        let delta = odds.hit - odds.stand;
        let hitStatement = 'Hit: ' + odds.hit + '% ';
        let standStatement = 'Stand: ' + odds.stand + '% '
        let output = delta > 5 ? chalk.green(hitStatement) :
            delta < -5 ? chalk.red(hitStatement) : 
            chalk.blue(hitStatement);

        output += ' ';
        output += delta < -5 ? chalk.green(standStatement) :
            delta > 5 ? chalk.red(standStatement) : 
            chalk.blue(standStatement);

        console.log(output);
        console.log('---------------------------------')
    }

    playerOptions() {

        // if player hand > 21... just keep going
        if(this.game.getHandValue(this.game.playerHand) > 20) {
            this.playerStand();
            return;
        }
        
        this.outputOdds();

        const prompts = [
            {
                type: 'rawlist',
                name: 'response',
                message: 'What would you like to do?',
                choices: [
                    'Hit',
                    'Stand'
                ],
            },
        ];

        this.prompt(prompts)
            .then((answers) => {
                if(answers.response === 'Hit'){
                    this.playerHit();
                }

                if(answers.response === 'Stand') {
                    this.playerStand();
                }
            });
    }

    playerStand() {

        this.game.dealerTurn();
        this.outputGameState();

        let winner = this.game.determineWinner();

        if(winner === 'player') {
            this.game.playerMoney = this.game.playerMoney + 50;
            console.log('Player wins!');
        }

        if(winner === 'push') {
            this.game.playerMoney = this.game.playerMoney + 25;
            console.log('Push');
        }

        if(winner === 'dealer') {
            console.log('Dealer wins!');
        }

        console.log('---------------------------------');
        console.log('Player Money: $' + this.game.playerMoney);
        console.log('---------------------------------')

        this.play();
    }

    playerHit() {
        this.game.playerHit();
        this.outputGameState();
        this.playerOptions();
    }

    deal() {
        this.game.playerMoney = this.game.playerMoney - 25;
        this.game.deal();
        this.outputGameState();
        this.playerOptions();
    }
}

module.exports = {
    PlayModule
};