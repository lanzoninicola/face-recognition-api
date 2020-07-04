const bcrypt = require('bcrypt');
const db = require('./model/dbQuery');


module.exports.userAuth = async (email, password) => {

    let queryResult = { status: '', output: '' }

    console.log(email, password);

    try {





        const userHashPassword = await knex.select('*').from('login').where('hash', password);

        // if (userLookedUp.length === 0 && (userHashPassword.length === 0 || userHashPassword.length > 0)) {
        //     throw new Error('User not found')
        // }

        // if (userLookedUp.length > 0 && userHashPassword.length === 0) {
        //     throw new Error('Password doesn\'t match')
        // }

        console.log(userLookedUp[0]);
        console.log(userHashPassword)

        queryResult = {
            status: 'success',
            output: userLookedUp[0]
        }

        console.log(queryResult);

        // return Promise.all([userLookedUp, userHashPassword])
        //     .then(newUser => {
        //         queryResult = {
        //             status: 'success',
        //             output: userLookedUp[0]
        //         }
        //         return queryResult;
        //     })
    } catch (error) {
        console.log(error);
    }

}