const crypt = require('../helper/crypt');
const db = require('../models/dbQuery');


const findUserByEmail = async (email) => {

    const queryResult = await db.getUserByEmail(email);

    const { status, payload, module } = queryResult;

    if (status === 'fulfilled' && payload.length > 0) {
        return {
            result: true,
            payload: payload[0]
        };
    }

    if (status === 'fulfilled' && payload.length === 0) {
        return {
            result: false,
            payload: 'User not found'
        };
    }

    if (status === 'rejected') {
        return {
            result: false,
            payload: 'General failure. Try again later...'
        };
    }

}

const comparePwdWithHash = async (email, password) => {

    const queryResultgetUserPwdHash = await db.getUserPwdHash(email);

    const { status, payload, module } = queryResultgetUserPwdHash;

    if (status === 'fulfilled' && payload.length > 0) {
        const isPwdMatch = await crypt.compare(password, payload[0].hash);
        if (!isPwdMatch) {
            return {
                result: false,
                payload: 'Wrong password'
            };
        }

        return {
            result: true,
            payload: { canBeLogged: true }
        };
    }

    if (status === 'fulfilled' && payload.length === 0) {
        return {
            result: false,
            payload: 'User not found'
        };
    }


    if (status === 'rejected') {
        return {
            result: false,
            payload: 'General failure. Try again later...'
        };
    }


}



module.exports.userAuth = async (email, password) => {

    const userExists = await findUserByEmail(email);

    if (userExists.result) {
        const isPwdMatchedwithHash = await comparePwdWithHash(userExists.payload.email, password);
        if (isPwdMatchedwithHash.result) {
            return {
                result: 'success',
                payload: userExists.payload
            }

        } else {
            return {
                result: 'failed',
                payload: isPwdMatchedwithHash.payload
            }
        }
    } else {
        return {
            result: 'failed',
            payload: userExists.payload
        }
    }



}