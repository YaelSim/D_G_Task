const randomWords = require('random-words');
const { get } = require('../router/users');

const getScoreByLength = (word) => {
    switch(word.length){
        case 3:
            return 1
        case 4:
            return 1
        case 5:
            return 3
        case 6:
            return 5
        case 7:
            return 5
    }
}
const getWordsAtMaxAndMinLength = (options) => {
    var rightSize = false;
    var wordUsed;
    while (!rightSize) {
        wordUsed = randomWords();
        if (wordUsed.length <= options.maxLength && wordUsed.length >= options.minLength) {
            rightSize = true;
        }
    }
    return wordUsed;
}

module.exports.getRandomWords = async (req, res) => {
    try {
        const words = [
            getWordsAtMaxAndMinLength({ minLength: 3, maxLength: 4 }),
            getWordsAtMaxAndMinLength({ minLength: 5, maxLength: 5 }),
            getWordsAtMaxAndMinLength({ minLength: 6, maxLength: 7 })
        ]
        return res.status(200).json(words)

    } catch (error) {
        console.log(error)
        return res.status(400).send("Error sending random words.")
    }
}

module.exports.receivingChosenWord = async (req, res) => {
    try {
        serverData[req.headers["room"]].chosenWord = req.body.word
        return res.status(200).send("Word received successfully")
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error receiving chosen word.")
    }
}

module.exports.receivingSubmitWord = async (req, res) => {
    try {
        serverData[req.headers['room']].roundOver = true

        const {chosenWord} = serverData[req.headers['room']]
        if (chosenWord === req.body.word.toLowerCase()) {
            serverData[req.headers['room']].SessionScore += getScoreByLength(chosenWord)
            res.status(200).json({ isMatch: true})
            } 

        else {
            res.status(200).json({ isMatch: false })
        }

        serverData[req.headers['room']].drawing = {data:[], ready:false}

    } catch (error) {
        console.log(error)
        return
    }
}

module.exports.getChosenWord = async (req, res) => {
    try {
        const chosenWord = serverData[req.headers['room']].chosenWord
        return res.status(200).json({ word: chosenWord })

    } catch (error) {
        return res.status(400).send("Error in chosen word.")

    }
}

