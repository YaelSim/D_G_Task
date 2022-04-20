const router = require('express').Router();
const WordsController = require('../Controllers/wordsControl')

router.get('/getRandomsWords', WordsController.getRandomWords)

router.post('/receivingChosenWord', WordsController.receivingChosenWord)

router.post('/receivingSubmitWord', WordsController.receivingSubmitWord)

router.get('/getChosenWord', WordsController.getChosenWord)


module.exports = router;
