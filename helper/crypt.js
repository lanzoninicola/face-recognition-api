const bcrypt = require('bcrypt');
const saltRounds = 10;

/* 
 hashing(text)
        .then(hashedText => {
            -- do something with hashed Text
        })
        .catch(
            -- handling error
        )

*/

module.exports.hashing = (text) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(text, saltRounds, (err, hash) => {
            if (err) reject(err)
            resolve(hash)
        });
    });
}

module.exports.compare = (text, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(text, hash, (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    });
}
