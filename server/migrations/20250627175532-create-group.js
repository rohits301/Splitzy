'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupName: {
        type: Sequelize.STRING
      },
      groupDescription: {
        type: Sequelize.TEXT
      },
      groupCurrency: {
        type: Sequelize.STRING
      },
      groupOwner: {
        type: Sequelize.STRING
      },
      groupMembers: {
        type: Sequelize.JSONB
      },
      groupCategory: {
        type: Sequelize.STRING
      },
      groupTotal: {
        type: Sequelize.FLOAT
      },
      split: {
        type: Sequelize.JSONB
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
    await queryInterface.dropTable('groups');
  }
};