const router = require('express').Router();
const UsersController = require('../Controllers/userControl')

router.get('/getRoomID', UsersController.getRoomID)

router.get('/releaseRoom', UsersController.releaseRoom)

router.post('/joinRoom', UsersController.joinRoom)

router.post('/username', UsersController.username)

router.get('/checkAmountOfPlayers', UsersController.checkAmountOfPlayers)

router.get('/checkIfRoundOver', UsersController.checkIfRoundOver)

router.get('/getSessionScore' , UsersController.getSessionScore)




module.exports = router;