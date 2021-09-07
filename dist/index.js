const { Client } = require("pg");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
// Uses Heroku defined port number or else 3000
const port = process.env.PORT || 3000;
const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    },
});
client.connect();
app.get("/api", (req, res) => {
    let query = "a";
    let resObjectt = {};
    client.query("SELECT * FROM information_schema.schemata;", (err, query) => {
        if (err)
            throw err;
        res.status(200).send(query.rows);
        console.log(query.rows);
        // for (let row of query.rows) {
        //   console.log(JSON.stringify(row));
        //   // @ts-ignore
        //   resObjectt["api"] = JSON.stringify(row);
        // }
    });
});
app.get("/testy", (req, res) => {
    client.query("SELECT * FROM Journalist;", (err, query) => {
        if (err)
            throw err;
        res.status(200).send(query.rows);
        console.log(query.rows);
        // for (let row of query.rows) {
        //   console.log(JSON.stringify(row));
        //   // @ts-ignore
        //   resObjectt["api"] = JSON.stringify(row);
        // }
    });
});
app.get("/", (req, res) => {
    res.status(200).json({ base: "other" });
});
app.listen(port, () => console.log("server started"));
//# sourceMappingURL=index.js.map