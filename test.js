const bcrypt = require('bcrypt');

let hashedPassword = ''
async function hashPassword(plainPwd) {

    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(plainPwd, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return hashedPassword
}


hashPassword('banana')
    .then(result => hashedPassword = result)


console.log(hashedPassword)

