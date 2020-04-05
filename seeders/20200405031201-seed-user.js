'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('users', [{
      name: 'JohnCena',
      email: 'JohnCena@example.com',
      password: '$2a$10$qZDCEIlsY6P5rH9LhjlRyegjFisBhHUoW6ZrKHLa31Rmj7yvUzm1m',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', [{
      email: 'JohnCena@example.com'
    }]);
  }
};
