const mongoose = require('mongoose');

const { DB } = process.env;

(async () => {
  try {
    await mongoose.connect(
      DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    );
  } catch (error) {
    console.error(error);
  }
})();

const dbConnection = mongoose.connection;

dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
dbConnection.once('open', () => console.log('MongoDB database connection established successfully'));

module.exports = dbConnection;