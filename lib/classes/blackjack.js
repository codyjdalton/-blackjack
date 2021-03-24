
const Deck = require('./deck');


module.exports = class Blackjack {

    constructor() {
        this.playerMoney = 300;
    }

    calculateOdds() {
        const scenariosToRun = 5000;
        const odds = {
            hit: 0,
            stand: 0
        };
        const scenariosCount = {
            hit: 0,
            stand: 0
        };

        Object.keys(scenariosCount).forEach(
            scenario => {
                while(scenariosCount[scenario] < scenariosToRun) {

                    const originalPlayerHand = JSON.parse(JSON.stringify(this.playerHand));
                    const originalDealerHand = JSON.parse(JSON.stringify(this.dealerHand));
                    
                    this.deck = new Deck(6);

                    if(scenario === 'hit') {

                        this.playerHit();

                        while(this.getHandValue(this.playerHand) < 12) {
                            this.playerHit();
                        }
                    
                        this.dealerTurn();
                    } else {
                        this.dealerTurn();
                    }

                    if(this.determineWinner() == 'player') {
                        odds[scenario] = odds[scenario] + 1;
                    }

                    // increment scenario
                    scenariosCount[scenario] = scenariosCount[scenario] + 1;

                    // reset hands back to normal
                    this.playerHand = originalPlayerHand;
                    this.dealerHand = originalDealerHand;
                }

                odds[scenario] = Number(((odds[scenario] / scenariosToRun) * 100).toFixed(0));
            }
        );

        return odds;
    }

    playerCanHit() {
        return this.getHandValue(this.playerHand)
    }

    determineWinner() {
        let playerScore = this.getHandValue(this.playerHand);
        let dealerScore = this.getHandValue(this.dealerHand);

        // player bust is a dealer win
        if(playerScore > 21 || (dealerScore < 22 && dealerScore > playerScore)) {
            return 'dealer';
        }

        // bust
        if(dealerScore < 22 && dealerScore == playerScore) {
            return 'push';
        }

        return 'player';
    }

    playerHit() {
        this.playerHand.push(
            this.deck.take()
        );
    }

    dealerTurn() {
        while(this.dealerMustHit(this.dealerHand)) {
            this.dealerHand.push(
                this.deck.take()
            );
        }
    }

    deal() {
        this.deck = new Deck(6);
        this.dealerHand = [];
        this.playerHand = [];

        // give the dealer 1 and the player 2...
        this.playerHand = [
            this.deck.take(),
            this.deck.take()
        ];

        this.dealerHand = [
            this.deck.take()
        ];
    }

    dealerMustHit(hand) {

        const handValue = this.getHandValue(hand);

        // check soft 17
        if(this.isSoft17(hand)) {
            return true;
        }

        return Boolean(
            handValue < 17
        );
    }

    isSoft17(hand) {
        let nonAceCards = hand.filter(
            c => c.value !== 'A'
        );
        let aceCards = hand.filter(
            c => c.value == 'A'
        );

        let total = this.getRawValue(nonAceCards);

        return Boolean(
            this.getHandValue(hand) === 17 &&
            (total + aceCards.length) != 17
        );
    }

    isBlackjack(hand) {
        return Boolean(
            hand.length === 2 &&
            this.getHandValue(hand) == 21
        );
    }

    getCardValue(card) {

        const val = card.value;
        const tenValues = [
            'J', 'Q', 'K'
        ];

        // handle ace..
        if(val === 'A') {
            console.log('ACE VALUE REQUESTED!!!')
        }

        // handle tens
        if(tenValues.includes(val)) {
            return 10
        }

        return Number(val);
    }

    getRawValue(hand) {
        return hand.reduce(
            (result, c) => {
                return result + this.getCardValue(c)
            },
            0
        );
    }

    getHandValue(hand) {
        let nonAceCards = hand.filter(
            c => c.value !== 'A'
        );
        let aceCards = hand.filter(
            c => c.value == 'A'
        );
        let aceScenarios = [];

        let total = this.getRawValue(nonAceCards);

        // calculate every ace scenario...
        // all 1s...
        aceScenarios.push(aceCards.length);
        
        // each ace 11 scenario..
        let activeAce = 1;

        while((activeAce - 1) < aceCards.length) {

            let leftOverLength = aceCards.length - activeAce;

            // calculate scenario...
            // all aces before and including active ace are worth 11..
            aceScenarios.push(
                (activeAce * 11) +
                leftOverLength
            );

            activeAce = activeAce + 1;
        }

        // compute the correct scenario
        // sort them highest first...
        aceScenarios = aceScenarios.sort(function(a, b) {
            return b - a;
        });

        // then filter to just the ones less than 22
        aceScenarios = aceScenarios.filter(
            s => (s + total) < 22 ||
                s == aceCards.length // handle case when it goes over but there are aces...
        );

        if(aceScenarios.length) {
            total = total + aceScenarios[0];
        }

        return total;
    }
}
