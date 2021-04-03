const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');

jest.setTimeout(30000);

const validUser = {
    username: 'user1',
    email: 'user1@test.com',
    password: 'Password*123',
};

const addUser = async(user = {...validUser}) => {
    const hashed = await bcrypt.hash(user.password, 10);
    user.password = hashed;

    let newUser = new User(user);
    await newUser.save();

    return newUser;
}

const postAuth = async(credentials) => {
    let agent = request(app).post('/api/1.0/users/login');
    return await agent.send(credentials);
}

beforeAll( async() => {
    return await mongoose.connect(process.env.MONGO_TEST, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false 
    })
});

beforeEach( async() => {
    return await User.deleteMany();
});

afterAll( async() => {
    return await mongoose.disconnect();
});


describe('Authentication', () => {
    it('returns 200 ok when credentials are correct', async() => {
        await addUser();
        const response = await postAuth({ email: 'user1@test.com', password: 'Password*123'});
        expect(response.status).toBe(200);
    });

    it('returns 401 and "User doest not exists" message when user doest not exists', async() => {
        const response = await postAuth({ email: 'user@test.com', password: 'Password*123' });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('User does not exists');
    });

    it('returns 401 and "Incorrect password" when password is wrong', async() => {
        await addUser();
        const response = await postAuth({ email: 'user1@test.com', password: 'Wrong*123' });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Incorrect password');
    });

    it('returns errors array when data is not provided in login', async() => {
        await addUser();
        const response = await postAuth({ email: null, password: null});
        expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('returns "Email is required" error when no email is provided in login', async() => {
        await addUser();
        const response = await postAuth({ email: null, password: 'Password*123'});
        expect(response.body.errors[0].msg).toBe('Email is required');
    });

    it('returns "Password is required" error when no password is provided in login', async() => {
        await addUser();
        const response = await postAuth({ email: 'user1@test.com', password: null});
        expect(response.body.errors[0].msg).toBe('Password is required');
    });

})

