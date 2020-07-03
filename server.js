const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const crypt = require('./helper/crypt');
const db = require('./model/dbQuery');
const { query } = require('express');


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

app.post('/signin', (req, res, next) => {

    const { signInEmail, signInPassword } = req.body;

    if (signInEmail && signInPassword) {
        const userLookedUpd = users.filter(user => user.email === signInEmail);

        crypt.compare(signInPassword, userLookedUpd[0].password)
            .then(result => {
                if (result) {
                    res.status(200)
                        .json({
                            result: 'success',
                            userLogged: {
                                id: userLookedUpd[0].id,
                                name: userLookedUpd[0].name,
                                email: userLookedUpd[0].email,
                                entries: userLookedUpd[0].entries
                            }
                        }
                        );
                } else res.status(500).json({
                    result: 'failed',
                    description: 'Credential did not match'
                })
            })
            .catch(err => res.status(500).json('Some error occured:' + err))
    } else {
        res.status(500).json('Email and password is required')
    }
});

app.post('/register', (req, res, next) => {

    // https://www.elephantsql.com/plans.html

    const { name, email, password } = req.body;

    console.log(req.body);

    crypt.hashing(password)
        .then(hashedPwd => {
            let newUser = {
                name: name, email: email, password: hashedPwd
            }
            db.insertUser(newUser)
                .then(queryResult => {
                    if (queryResult.status === 'success') {
                        res.status(200).json({
                            result: 'success',
                            user: queryResult.output
                        });
                    }
                    if (queryResult.status === 'failed') {
                        throw Error(queryResult.output);
                    }
                }
                )
                .catch(err => {
                    // error sent to the client
                    res.status(400).json('some error occured: ' + err)
                })
        })
        .catch(err => res.status(500).json('some error occured:' + err))


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