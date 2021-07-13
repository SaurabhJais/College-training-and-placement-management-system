let db = require("../util/db")




exports.createUser = function (data) {

    let schema;

    if (data.role == "student") {
        schema = `
    userId varchar(25) NOT NULL PRIMARY KEY,
    firstName varchar(256),
    lastName varchar(256),
    email varchar(256) UNIQUE,
    mobile varchar(256),
    personalAddress varchar(256),
    city varchar(256),
    state varchar(256),
    pinCode varchar(256),
    password varchar(256),
    mailConfirmationPin int(6),
    isEmailVerified varchar(256),
    role varchar(256)`
    } else {
        schema = `
    userId varchar(25) NOT NULL PRIMARY KEY,
    firstName varchar(256),
    lastName varchar(256),
    email varchar(256) UNIQUE,
    mobile varchar(256),
    website varchar(256),
    companyName varchar(256),
    companyAddress varchar(256),
    city varchar(256),
    state varchar(256),
    password varchar(256),
    confirmPassword varchar(256) ,
    role varchar(256),
    isEmailVerified varchar(256),
    mailConfirmationPin varchar(256)`
    }

    return db.execute("CREATE TABLE IF NOT EXISTS " + data.role + "( " + schema + ")").then((result) =>
        db.execute("INSERT INTO "
            + data.role
            + " ( "
            + Object.keys(data).join()
            + " ) VALUES ( "
            + Object.values(data).map((e) => ` '${e}' `).join()
            + " )"
        )
    )
}



exports.retrive_mail_verification_pin = (userId, role) =>
    db.execute("SELECT mailConfirmationPin FROM "
        + role
        + " WHERE userId= " + userId)
        .then((res) => res[0][0]["mailConfirmationPin"])


exports.unset_pin_and_isEmailVerified = (userId, role) => 
    db.execute("UPDATE " + role + " SET mailConfirmationPin = 0, isEmailVerified = 'true' " )


exports.retrive_details_using_email = (email, role) =>
    db.execute("SELECT userId, firstName, lastName, email, isEmailVerified, role, password FROM " + role + " WHERE email = " + `'${email}'`)



exports.update_mail_confirmation_pin = (userId, role, newPin) => 
    db.execute("UPDATE " + role + " SET mailConfirmationPin = " + newPin)


exports.check_if_user_present = (email, role) => 
    db.execute("SELECT email, userId from " + role + " WHERE email = " + `'${email}'`)

    
exports.update_user_password = (email, userId, role, password) => 
    db.execute("UPDATE " + role + " SET password = " + `'${password}'` + " WHERE email = " + `'${email}'` + " AND userId = " + userId)