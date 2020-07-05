const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const crypt = require('./helper/crypt');
const { userAuth } = require('./controller/userAuth');
const db = require('./model/dbQuery');



// added security configuration
// require('./config/security')(app)

// PORT LISTENING
app.set('port', process.env.PORT || 4000)

// MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// ROUTES AND CALLBACKS

app.get('/', (req, res) => {
    res.send(users)
});

app.post('/signin', async (req, res, next) => {

    const { signInEmail, signInPassword } = req.body;

    const userAuthAttempts = await userAuth(signInEmail, signInPassword);

    if (userAuthAttempts.result === 'success') {
        res.status(200).json({
            result: 'success',
            userLoggedIn: userAuthAttempts.payload
        });
    }

    if (userAuthAttempts.result === 'failed') {
        res.status(400).json({
            result: 'failed',
            message: userAuthAttempts.payload
        });
    }

})

app.post('/register', async (req, res, next) => {

    // https://www.elephantsql.com/plans.html

    const { name, email, password } = req.body;

    try {
        const hashedPwd = await crypt.hashing(password)

        let user = {
            name: name, email: email, password: hashedPwd
        }

        const queryResult = await db.insertNewUser(user)

        if (queryResult.status === 'success') {
            res.status(200).json({
                result: 'success',
                user: queryResult.output
            });
        }
        if (queryResult.status === 'failed') {
            throw Error(queryResult.output);
        }

    } catch (error) {
        res.status(400).json('some error occured:' + error)
    }
});

app.get('/profile/:id', (req, res, next) => {

    const { id } = req.params;
    const userFound = users.filter(user => user.id === id);

    if (userFound.length > 0) {
        res.status(200).json('user found');
    } else {
        res.status(404).json('user not found');
    }

});

app.post('/image', (req, res, next) => {

    let { idUser } = req.body;

    console.log(idUser);

    let userFound = users.filter(user => user.id === idUser);

    if (userFound.length > 0) {
        userFound[0].entries++
        res.status(200).json({ "entries": userFound[0].entries });
    } else {
        res.status(404).json('user not found');
    }

});

app.listen(app.get('port'))