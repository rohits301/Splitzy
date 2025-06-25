'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association: Expense.belongsTo(models.Group)
      Expense.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  }
  Expense.init({
    groupId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { 
        model: 'Groups', // name of the table in the database
        key: 'id' // primary key in the Groups table 
      } 
    },
    expenseName: { 
      type: DataTypes.STRING, 
      allowNull: false
    },
    expenseDescription: { 
      type: DataTypes.TEXT 
    },
    expenseAmount: { 
      type: DataTypes.FLOAT, 
      allowNull: false
    },
    expenseCategory: { 
      type: DataTypes.STRING, 
      defaultValue: 'Others'
    },
    expenseCurrency: { 
      type: DataTypes.STRING,
      defaultValue: 'INR'
    },
    expenseDate: { 
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    expenseOwner: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    expenseMembers: { 
      type: DataTypes.JSONB,
      allowNull: false,
    },
    expensePerMember: { 
      type: DataTypes.FLOAT,
      allowNull: false
    },
    expenseType: { 
      type: DataTypes.STRING,
      defaultValue: 'CASH', 
    }
  }, {
    sequelize,
    modelName: 'Expense',
    timestamps: true, // ensures createdAt and updatedAt are added
    underscored: true, // optional: creates snake_case columns like created_at
  });
  return Expense;
};