const knex = require('../config/db_connection');

const notifyErrors = (error) => {
    return queryResult = {
        status: 'failed',
        output: '',
        error: error.message
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
        notifyErrors(error);
    }


}

module.exports.getUserByEmail = async (email = '') => {

    let queryResult = { status: '', output: '', error: '' }

    try {
        const userLookedUp = await knex.select('*').from('users').where('email', email);

        if (userLookedUp.length === 0) {
            queryResult = {
                status: 'success',
                output: userLookedUp[0],
                error: ''
            }
        }

        return queryResult;

    } catch (error) {
        notifyErrors(error);
    }
}


module.exports.getUserHash = async (email = '') => {

    let queryResult = { status: '', output: '', error: '' }

    try {
        const hash = await knex.select('hash').from('login').where('email', email);

        if (userLookedUp.length === 0) {
            queryResult = {
                status: 'success',
                output: hash,
                error: ''
            }
        }

        return queryResult;

    } catch (error) {
        notifyErrors(error);
    }
}



