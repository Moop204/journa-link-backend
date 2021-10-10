const { Client } = require("pg");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

import { Model, Op } from "sequelize";
import { db } from "./databaseClient";

// Uses Heroku defined port number or else 3000
const port = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

app.get("/api", (req: any, res: any) => {
  client.query(
    "SELECT * FROM information_schema.schemata;",
    (err: any, query: any) => {
      if (err) throw err;
      res.status(200).send(query.rows);
      console.log(query.rows);
      // for (let row of query.rows) {
      //   console.log(JSON.stringify(row));
      //   // @ts-ignore
      //   resObjectt["api"] = JSON.stringify(row);
      // }
    }
  );
});

app.get("/testy", (req: any, res: any) => {
  client.query("SELECT * FROM Journalist;", (err: any, query: any) => {
    if (err) throw err;
    res.status(200).send(query.rows);
    console.log(query.rows);
    // for (let row of query.rows) {
    //   console.log(JSON.stringify(row));
    //   // @ts-ignore
    //   resObjectt["api"] = JSON.stringify(row);
    // }
  });
});

app.get("/all-publisher", async (req: any, res: any) => {
  const allPublishers = await db.models.Publisher.findAll();
  const response: { [id: string]: { name: string; link: string } } = {};
  allPublishers.forEach((publisher) => {
    const id = publisher.getDataValue("id");
    response[id] = {
      name: publisher.getDataValue("name"),
      link: publisher.getDataValue("link"),
    };
  });
  res.status(200).json(response);
});

app.get("/all-journalist", async (req: any, res: any) => {
  const allJournalists = await db.models.Reporter.findAll();
  const response: { [id: string]: { name: string; work: any } } = {};
  allJournalists.forEach((journalist) => {
    const id = journalist.getDataValue("id");
    response[id] = {
      name: journalist.getDataValue("name"),
      work: journalist.getDataValue("work"),
    };
  });
  res.status(200).json(response);
});

app.get("/publisher", async (req: any, res: any) => {
  const id = req.query["id"];
  const name = req.query["name"];

  let searchResult: Model<any, any>[];

  if (id) {
    searchResult = [
      await db.models.Publisher.findOne({
        where: {
          id: id,
        },
      }),
    ];
  } else if (name) {
    let trimmedName = name.replace("_", " ");
    trimmedName = trimmedName.replace(/[^a-zA-Z. ]*/g, "");

    searchResult = await db.models.Publisher.findAll({
      where: {
        name: {
          [Op.substring]: trimmedName,
        },
      },
    });
  }

  const response: { [id: string]: { name: string; link: string } } = {};
  searchResult.forEach((publisher) => {
    const id = publisher.getDataValue("id");
    response[id] = {
      name: publisher.getDataValue("name"),
      link: publisher.getDataValue("link"),
    };
  });

  res.status(200).json(response);
});

app.get("/journalist", async (req: any, res: any) => {
  const id = req.query["id"];
  const name: string = req.query["name"];

  let searchResult: Model<any, any>[];

  if (id) {
    searchResult = [
      await db.models.Reporter.findOne({
        where: {
          id: id,
        },
      }),
    ];
  } else if (name) {
    let trimmedName = name.replace("_", " ");
    trimmedName = trimmedName.replace(/[^a-zA-Z. ]*/g, "");
    searchResult = await db.models.Reporter.findAll({
      where: {
        name: {
          [Op.iLike]: trimmedName + "%",
        },
      },
    });
  }
  const response: { [id: string]: { name: string; work: any } } = {};
  searchResult.forEach((journalist) => {
    const id = journalist.getDataValue("id");
    response[id] = {
      name: journalist.getDataValue("name"),
      work: journalist.getDataValue("work"),
    };
  });
  res.status(200).json(response);
});

app.get("/", (req: any, res: any) => {
  res.status(200).json({ base: "other" });
});

app.listen(port, () => console.log("server started"));
