let express = require("express");
let app = express();
require("dotenv").config()
let path = require("path")
var http = require('http').Server(app);
var io = require('socket.io')(http);
let router = require("./route")
let bodyParser = require("body-parser")
const db = require("./util/db")
 




app.set("view engine", "ejs")

db.execute("SELECT * FROM products").then((res) => {console.log(res[0])});

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(express.static(path.join(__dirname + "/views/")))


app.use("/", router);

app.get("/404-error", (req, res) => {
    res.render("error.ejs")
})

app.get("*", (req, res) => {
    res.redirect("/404-error")
})



http.listen(process.env.PORT, () => {
    console.log("Running like a charm")
})