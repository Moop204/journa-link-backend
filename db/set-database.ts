import { Sequelize, Op, DataTypes, Model } from "sequelize";
import { obtainDataStructure } from "./process-scraped";

const dotenv = require("dotenv");

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const Reporter = sequelize.define(
  "Reporter",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    work: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

const Publisher = sequelize.define(
  "Publisher",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

const WorkFor = sequelize.define(
  "WorkFor",
  {
    reporter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Reporter",
        key: "id",
      },
    },
    publisher: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Publisher",
        key: "id",
      },
    },
  },
  { freezeTableName: true }
);

// const Article = sequelize.define(
//   "Article",
//   {
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     link: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     publisher: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "Publisher",
//         key: "id",
//       },
//     },
//   },
//   { freezeTableName: true }
// );

// const ReportedOn = sequelize.define(
//   "ReportedOn",
//   {
//     reporter: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "Reporter",
//         key: "id",
//       },
//     },
//     article: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "Article",
//         key: "id",
//       },
//     },
//   },
//   { freezeTableName: true }
// );

// // const test = async () => {
// //   try {
// //     await sequelize.authenticate();
// //     console.log("Connection has been established successfully.");
// //   } catch (error) {
// //     console.error("Unable to connect to the database:", error);
// //   }
// // };

// // test();

const query = async () => {
  // See what a record of a Reporter is
  // console.log(
  //   await (await sequelize.models.Reporter.findOne()).getDataValue("work")
  // );
};

// query();

const simpleInsert = async () => {
  const data = obtainDataStructure();

  // Hard reset of everything mentioned
  // await sequelize.sync({ force: true });

  const publishers = [{ name: "nytimes", link: "nytimes.com" }];
  const publisherRecords = await sequelize.models.Publisher.findAll({
    attributes: ["name", "link", "id"],
  });
  const publisherCache: { [index: string]: number } = {};
  const existingPublishers = publisherRecords.map((record) => {
    publisherCache[record.getDataValue("link")] = record.getDataValue("id");
    return record.getDataValue("name");
  });

  publishers.forEach(async (pub) => {
    if (!existingPublishers.find((ePub) => ePub === pub.name)) {
      const addedPublisher = await sequelize.models.Publisher.create(pub);
      publisherCache[addedPublisher.getDataValue("name")] =
        addedPublisher.getDataValue("id");
    }
  });
  console.log(publisherCache);

  Object.entries(data).forEach(async ([author, profile]) => {
    const articlesWritten = Object.values(profile).reduce(
      (articles: JSON[], curArticles: JSON[]) => {
        articles.concat(curArticles);
      }
    );

    const checkAuthor = await sequelize.models.Reporter.findOne({
      where: {
        name: author,
      },
    });
    let reporter: Model<any, any>;
    if (checkAuthor === null) {
      reporter = await sequelize.models.Reporter.create({
        name: author,
        work: articlesWritten,
      });
    } else {
      reporter = checkAuthor;
    }

    Object.entries(profile).forEach(async ([publisher, articles]) => {
      if (!publisherCache[publisher]) {
        const publisherRecord = await sequelize.models.Publisher.findOne({
          where: {
            link: publisher,
          },
        });
        publisherCache[publisher] = publisherRecord.getDataValue("id");
      }

      await sequelize.models.WorkFor.create({
        reporter: reporter.getDataValue("id"),
        publisher: publisherCache[publisher],
      });
    });
  });
};

simpleInsert();
