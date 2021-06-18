let express = require("express");
let app = express();
require("dotenv").config();
let path = require("path");
let http = require('http').Server(app);
let router = require("./routes/route");
const db = require("./util/db");
const cookieParser = require("cookie-parser");
const setGlobals = require("./util/setGlobals");



app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname + "/views/")));
app.use(cookieParser());


app.use(setGlobals)



app.use("/", router);

app.get("/404-error", (req, res) => {
    res.render("error.ejs");
})


app.get("*", (req, res) => {
    res.redirect("/404-error");
})


http.listen(process.env.PORT, () => {
    console.log("Running like a charm");
})