const sequelize = require('../config/connection');
const seedPost = require('./seedPost');
const seedUser = require('./seedUser');
const seedComment = require("./seedComment")
const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedPost();
  //await seedLike();
  await seedUser();
  await seedComment();
  process.exit(0);
};

seedAll();
