let nm = require("nodemailer")



function sendMail(to, subject = "", mailData) {
    let transport = nm.createTransport({
        service: "gmail",
        auth: {
            user: "jsaurabh1122@gmail.com",
            pass: "inkfuamzlxdsjwyk"
        },
    })

    let mailOption = {
        from: "jsaurabh1122@gmail.com",
        to: to,
        subject: subject,
        html: mailData
    }

    return transport.sendMail(mailOption)
}


function verification_Mail_Template(to, pin, name = "User") {
    let subject = "Pin Verification"
    let mailData = `
    Hello ${name}, <br><br>

    You registered an account on ECC training and Placement portal, 
    before being able to use your account you need to verify that 
    this is your email address is yours.

    <br>
    Your Six digit pin is: 
    <span style="font-size: 30px; vertical-align: center"><b>${pin}</b></span>
    
    <br><br>Kind Regards, ECC`;
    return sendMail(to, subject, mailData)
}

module.exports = {
    sendPinToMail: verification_Mail_Template
}