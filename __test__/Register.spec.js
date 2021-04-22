const request = require('supertest');
//const mongoose = require('mongoose');
const { connectDB, clearDB, closeDB } = require('../src/config/database');
const app = require('../src/app');
const User = require('../src/models/User');
require('dotenv').config();

jest.setTimeout(30000);

const validUser = {
    username: 'user1',
    email: 'user1@test.com',
    password: 'Password*123',
};

const postUser = async(user = validUser) => {
    let agent = request(app).post('/api/1.0/users/register');
    return await agent.send(user);
};

beforeAll( async() => {
    connectDB();
});
 
beforeEach( async() => {
    clearDB();
});
 
afterAll( async() => {
    closeDB();
});

describe('User Registration', () => {
    it('Returns 200 when singup request is valid', async () => {
        const response = await postUser();
        expect(response.status).toBe(200);
     });
    
    it('Returns success mesage when singup request is valid', async () => {
        const response = await postUser();
        expect(response.body.message).toBe('User registered successfully');
    });

    it('Saves the user to the database correctly',  async () => {
        await postUser();
        const user = await User.find();
        expect(user[0].username).toBe('user1');
        expect(user[0].email).toBe('user1@test.com');
    });

    it('Password is hashed correctly in database', async () => {
        await postUser();
        const user = await User.find();
        expect(user[0].password).not.toBe('Password*123');
    })
     
});