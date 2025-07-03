'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('expenses', [
      {
        group_id: 1, // assumes Group with ID 1 exists
        expense_name: 'Hotel',
        expense_description: '2 nights stay',
        expense_amount: 3000,
        expense_category: 'Lodging',
        expense_currency: 'INR',
        expense_date: new Date(),
        expense_owner: 'alice@example.com',
        expense_members: JSON.stringify(['alice@example.com', 'bob@example.com']),
        expense_per_member: 1500,
        expense_type: 'CASH',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('expenses', null, {});
  }
};
