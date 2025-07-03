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
   await queryInterface.bulkInsert('users', [
      {
        first_name: 'Alice',
        last_name: 'Doe',
        email_id: 'alice@example.com',
        password: 'hashedpass1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Bob',
        last_name: 'Smith',
        email_id: 'bob@example.com',
        password: 'hashedpass2',
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
    await queryInterface.bulkDelete('users', null, {});
  }
};
