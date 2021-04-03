require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

connectDB();

app.listen(app.get('PORT'), () => {
    console.log('Server running on port ', app.get('PORT'));
})