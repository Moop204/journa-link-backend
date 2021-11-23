import { Sequelize, Op, DataTypes, Model } from "sequelize";

console.log(process.env.CONNECTION_STRING);
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

export { sequelize as db };
