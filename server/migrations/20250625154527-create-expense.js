'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER
      },
      expenseName: {
        type: Sequelize.STRING
      },
      expenseDescription: {
        type: Sequelize.TEXT
      },
      expenseAmount: {
        type: Sequelize.FLOAT
      },
      expenseCategory: {
        type: Sequelize.STRING
      },
      expenseCurrency: {
        type: Sequelize.STRING
      },
      expenseDate: {
        type: Sequelize.DATE
      },
      expenseOwner: {
        type: Sequelize.STRING
      },
      expenseMembers: {
        type: Sequelize.JSONB
      },
      expensePerMember: {
        type: Sequelize.FLOAT
      },
      expenseType: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  }
};