const { sequelize } = require('../models');

(async () => {
  await sequelize.sync({ force: true });
  console.log('Database synced from models.');
})();
