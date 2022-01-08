const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("post", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roadMap: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departureTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    arrivalTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordArrivalTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordDepartureTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
