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
   await queryInterface.bulkInsert('groups', [
      {
        group_name: 'Trip to Manali',
        group_description: 'A fun trip with friends',
        group_currency: 'INR',
        group_owner: 'alice@example.com',
        group_members: JSON.stringify(['alice@example.com', 'bob@example.com']),
        group_category: 'Travel',
        group_total: 0,
        split: JSON.stringify({}),
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
    await queryInterface.bulkDelete('groups', null, {});
  }
};
