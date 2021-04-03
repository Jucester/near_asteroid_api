const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Nea = require('../src/models/Nea');
const bcrypt = require('bcrypt');
require('dotenv').config();

jest.setTimeout(30000);


const validUser = {
    username: 'user1',
    email: 'user1@test.com',
    password: 'Password*123',
};

const validNea = {
    "full_name": "1566 Icarus (1949 MA)",
    "a": "1.078076432",
    "e": "0.827072914",
    "i": "22.81881892",
    "om": "87.98911327",
    "w": "31.40697081",
    "ma": "8.160598893"
}

/*
const postAuth = async(credentials) => {
    let agent = request(app).post('/api/1.0/users/login');
    return await agent.send(credentials);
}*/

const postNea = async(body) => {
    let agent = request(app);

    await agent.post('/api/1.0/users/register').send({ ...validUser});
    const userResponse =  await agent.post('/api/1.0/users/login').send({ email: validUser.email, password: validUser.password });
    const token = userResponse.body.token;

    agent = request(app).post('/api/1.0/neas/addList');
    if (token) {
        agent.set('x-auth-token', token);
    }

    return agent.send({ user_id: userResponse.body.user.id, ...body});
}

const getNeas = async () => {

    let agent = request(app);

    //await agent.post('/api/1.0/users/register').send({ ...user});
    const userResponse =  await agent.post('/api/1.0/users/login').send({ email: validUser.email, password: validUser.password });
    const token = userResponse.body.token;

    agent = request(app).get('/api/1.0/neas/');

    if (token) {
        agent.set('x-auth-token', token);
    }

    return agent.send();
}

beforeAll( async() => {
    return await mongoose.connect(process.env.MONGO_TEST, { 
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false 
    })
});

beforeEach( async() => {
    await User.deleteMany({});
    return;
});

afterAll( async() => {
    return await mongoose.disconnect();
});


describe('Listing Near Earth Asteroirds', () => {
    it('returns array of neas', async() => {
        await postNea({...validNea});
        const response = await getNeas();
        console.log(response.body)
        expect(Array.isArray(response.body.neas));
        expect(response.body.neas.length).toBeGreaterThan(0);
    })
})