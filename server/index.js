const express = require('express')
const cors = require('cors')

serverData ={}

const Draw = require('./router/Draw');
const Words = require('./router/Words');
const Users = require('./router/users');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/Draw', Draw)
app.use('/Words', Words)
app.use('/users', Users)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Running on port: ', PORT)); 

app.get('/', (req, res) => {
    res.send('Server is up and running.')
})

