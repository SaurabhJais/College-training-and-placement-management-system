let db = require("../util/db");

function createUser(data) {
    let query = `
            CREATE TABLE IF NOT EXISTS students(
                studentID INT NOT NULL UNIQUE AUTO_INCREMENT,
                uID VARCHAR(256),
                firstName VARCHAR(256) NOT NULL,
                lastName VARCHAR(256) NOT NULL,
                email VARCHAR(256) NOT NULL,
                mobile varchar(256) NOT NULL,
                personalAddress VARCHAR(256) NOT NULL,
                companyName VARCHAR(256) NOT NULL,
                companyAddress VARCHAR(256) NOT NULL,
                city VARCHAR(256) NOT NULL,
                state VARCHAR(256) NOT NULL,
                pinCode varchar(256),
                password VARCHAR(256) NOT NULL,
                isAuthorized VARCHAR(256) NOT NULL,
                verificationPin VARCHAR(256) NOT NULL,
                role VARCHAR(256) NOT NULL
            );
            `

    let res = db.execute(query)
        .then((r) => {
            db.execute("INSERT INTO students ( "
                + Object.keys(data).join()
                + ") Values("
                + Object.values(data).map((i) => `'${i}'`)
                + ")"
            ).then((res) => {
                return res;
            })
        })
        .catch((err) => { throw err })

    return res;
}



function retrive_user_by_uID(uID) {
    console.log(uID)
    return db
        .query("SELECT verificationPin, role FROM students WHERE uID=" + `'${uID}'`)
        .then((res) => res)
}

function make_user_authorized(uID) {
    return db
        .query("UPDATE students SET isAuthorized = 'true', verificationPin= '' WHERE uID=" + `'${uID}'`)
        .then((res) => res)
}




module.exports = {
    createUser: createUser,

    retrive_user_by_uID: retrive_user_by_uID,

    make_user_authorized: make_user_authorized
}
