const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// added security configuration
require('./config/security')(app)

// PERSONAL DATA
const users = require('./users.json');

// PORT LISTENING
app.set('port', process.env.PORT || 4000)


// MIDDLEWARE FUNCTIONS
const Logger = (req, res, next) => {
    //console.log(req);
    next();
    return
}

const isAdmin = (req, res, next) => {
    req.admin = true; // adding custom value to pass to the routes callbacks
    console.log(users);
    next();
}

// MIDDLEWARES
app.use(Logger);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// ROUTES AND CALLBACKS

app.get('/', (req, res) => {
    res.send('hellooooooooodddoo!!') // sending unformatted text
});

app.get('/admin', isAdmin, (req, res, next) => {
    if (req.admin) {
        res.json(users) // sending JSON file
    } else {
        res.send('You are not authorized to view this content')
    }
});


app.listen(app.get('port'))
