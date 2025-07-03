'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupDescription: {
      type: DataTypes.TEXT,
    },
    groupCurrency: { 
      type: DataTypes.STRING,
      defaultValue: 'INR'
    },
    groupOwner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupMembers: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    groupCategory: {
      type: DataTypes.STRING,
      defaultValue: 'Others'
    },
    groupTotal: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    split: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'groups', // optional: specify the table name if different from model name
    freezeTableName: true, // optional: prevents Sequelize from pluralizing the table name
    timestamps: true, // ensures createdAt and updatedAt are added
    underscored: true, // optional: creates snake_case columns like created_at
  });
  return Group;
};