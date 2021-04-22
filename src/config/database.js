const mongoose = require('mongoose');

const connectDB = async() => {

    const url = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST : process.env.MONGO_URI

    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB Connected in', process.env.NODE_ENV, mongoose.connection.name);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

const clearDB = async () => {

    const { collections } = mongoose.connection;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    };
}

const closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}

const disconnectDB = async () => { await mongoose.disconnect(); }

module.exports = {
    connectDB,
    clearDB,
    closeDB,
    disconnectDB
}