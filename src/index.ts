const express = require("express");
const app = express();

// Uses Heroku defined port number or else 3000
const port = process.env.PORT || 3000;

app.get("/api", (req: any, res: any) => {
  res.status(200).json({ api: "version 1" });
});

app.get("/", (req: any, res: any) => {
  res.status(200).json({ base: "other" });
});

app.listen(port, () => console.log("server started"));
