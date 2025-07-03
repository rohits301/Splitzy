'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Settlement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Settlement.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  }
  Settlement.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups', // name of the table in the database
        key: 'id' // primary key in the Groups table
      }
    },
    settleTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settleFrom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settleDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    settleAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Settlement',
    tableName: 'settlements', // optional: specify the table name if different from model name
    freezeTableName: true, // optional: prevents Sequelize from pluralizing the table name
    timestamps: true, // ensures createdAt and updatedAt are added
    underscored: true, // optional: creates snake_case columns like created_at
  });
  return Settlement;
};