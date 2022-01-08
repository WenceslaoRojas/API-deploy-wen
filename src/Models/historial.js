const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("historial", {
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
  });
};
