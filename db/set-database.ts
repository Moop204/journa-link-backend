const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// const sequelize = new Sequelize(database, user, password, {
//   host: host,
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       key: cKey,
//       cert: cCert,
//       ca: cCA
//     }
//   }
// });

const test = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

test();
