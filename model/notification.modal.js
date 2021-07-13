let db = require("../util/db")

let schema = `
    title VARCHAR(255),
    description TEXT,
    filename VARCHAR(56),
    postTime VARCHAR(55)
`

exports.save_notif_to_db = (data) => {
    return db.execute("CREATE TABLE IF NOT EXISTS notifications ( " + schema + " ) ").then((res) => {
        if (res) {
            db.execute("INSERT INTO notifications ( "
                + Object.keys(data)
                + " ) VALUES ( "
                + Object.values(data).map((e) => `'${e}'`).join()
                + " )"
            )
        }
    })
}

exports.retrive_notif = () => {
    return db.execute("SELECT * FROM notifications")
} 

