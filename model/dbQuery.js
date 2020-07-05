const knex = require('../config/db_connection');
const { query } = require('express');

const notifyErrors = (error, origin) => {
    return queryResult = {
        status: 'rejected',
        payload: error.message,
        module: origin
    };
}

module.exports.insertNewUser = async (user = {}) => {

    const { name, email, password } = user;

    let queryResult = { status: '', output: '', error: '' }

    try {
        const newUserRecord = await knex('users').returning('*').insert({
            name: name,
            email: email,
            entries: 0,
            joined: new Date()
        })

        const newUserRecordWithPwd = await knex('login').insert({
            hash: password,
            email: email
        })

        return Promise.all([newUserRecord, newUserRecordWithPwd])
            .then(newUser => {
                queryResult = {
                    status: 'success',
                    output: newUser[0][0],
                    error: ''
                }
                return queryResult;
            })

    } catch (error) {


        // handling errors at system level 

        // send error response to the client
        return notifyErrors(error, 'insertNewUser');
    }


}

module.exports.getUserByEmail = async (email = '') => {

    // let queryResult = { status: '', output: '', error: '' }
    let queryResult = { status: '', payload: '' };

    try {
        const userLookedUp = await knex.select('*').from('users').where('email', email);

        return queryResult = {
            status: 'fulfilled',
            payload: userLookedUp
        }

    } catch (error) {
        return notifyErrors(error, 'getUserByEmail');
    }
}


module.exports.getUserPwdHash = async (email = '') => {

    let queryResult = { status: '', payload: '' };

    try {
        const hash = await knex.select('hash').from('login').where('email', email);

        return queryResult = {
            status: 'fulfilled',
            payload: hash
        }

    } catch (error) {
        return notifyErrors(error, 'getUserByEmail');
    }
}



