const knex = require('../config/db_connection');
const { insert } = require('../config/db_connection');



module.exports.insertUser = async (user = {}) => {

    const { name, email, password } = user;

    let queryResult = { status: '', output: '' }

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
                    output: newUser[0][0]
                }
                return queryResult;
            })

    } catch (error) {

        // handling errors at system level 

        // send error response to the client
        return queryResult = {
            status: 'failed',
            output: error.message
        };
    }


}

const getUsers = async () => {
    try {
        const usersList = await knex.select('name').from('users');
        return usersList;
    } catch (error) {
        console.log('error: ', error);
    }

}



// let user = {
//     name: 'Mae2r2a',
//     email: 'malac22earnemara@gmail.com',
//     password: 'fdskajfòasjòfjkadsòlfjkòaldskjfòkjasflkjadsòlkjfòalksdjfòlkjasdfjakl'
// }

// insertUser(user).then(result => console.log(result[0]));
