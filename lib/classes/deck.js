module.exports = class Deck {

    constructor(limit = 1) {
        this.suits = [
            'Diamonds',
            'Hearts',
            'Spades',
            'Clubs'
        ];
        this.values = [
            'A',
            2,
            3,
            4, 
            5, 
            6,
            7,
            8,
            9,
            10,
            'J',
            'Q',
            'A'
        ];
        this.cards = [];

        let i =0;

        while(i < limit) {
            this.assembleDeck();
            i = i + 1;
        }
        
        this.cards = this.shuffle(this.cards);
    }

    take() {
        const card = this.cards.shift();

        return card;
    }

    insertIntoDeck(suit, value) {
        this.cards.push({
            suit,
            value
        });
    }

    assembleDeck() {
        // iterate suits
        this.suits.forEach(
            suit => {
                // iterate through values
                this.values.forEach(
                    val => {
                        // add to deck
                        this.insertIntoDeck(suit, val);
                    }
                );
            }
        );
    }

    shuffle(arr){
        return [...arr].map( (_, i, arrCopy) => {
            var rand = i + ( Math.floor( Math.random() * (arrCopy.length - i) ) );
            [arrCopy[rand], arrCopy[i]] = [arrCopy[i], arrCopy[rand]]
            return arrCopy[i]
        });
    }
}