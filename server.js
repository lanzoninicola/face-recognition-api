const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let users = require('./users.js');


// added security configuration
// require('./config/security')(app)

// PORT LISTENING
app.set('port', process.env.PORT || 4000)

// MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ROUTES AND CALLBACKS

app.get('/', (req, res) => {
    res.send(users)
});

app.post('/signin', (req, res, next) => {

    if (req.body.email === users[0].email &&
        req.body.password === users[0].password) {
        res.status(200).json("login successful")
    } else {
        res.status(400).json("login failed")
    }
});

app.post('/register', (req, res, next) => {

    const { name, email, password } = req.body;

    if (name && email && password) {
        users.push({
            id: '188',
            name: name,
            email: email,
            password: password
        })

        res.status(200).json('registration succesful');
    } else {
        res.status(500).json('some error occured');
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

    let { id } = req.body;

    let userFound = users.filter(user => user.id === id);
    if (userFound.length > 0) {
        userFound[0].entries++
        res.status(200).json({ "entries": userFound[0].entries });
    } else {
        res.status(404).json('user not found');
    }

});

app.listen(app.get('port'))
