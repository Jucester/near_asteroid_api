const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const controller = {};
require('dotenv').config();

const { getAccessToken, fetchGitHubUser } = require('../utils/oauthFunctions');

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

controller.register = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        
        const { username, email, password } = req.body;

        let user = new User(req.body);
        const salt = await bcrypt.genSaltSync(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        return res.status(200).json({
            message: 'User registered successfully',
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
};

controller.login = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

  
    const { email, password } = req.body;

    try {
       let user = await User.findOne({ email });
       if(!user) {
           return res.status(401).json({
               message: 'User does not exists'
           });
       }

       const match = await bcrypt.compare(password, user.password);

       if(!match) {
           return res.status(401).json({
               message: 'Incorrect password'
           });
       }

       // Create the payload and sign the JWT
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        }

        const token = jwt.sign(payload, process.env.SECRET, {
           expiresIn: 3600
        });

        return res.status(200).json({
            message: 'Login succesfully',
            token,
            user
        })

     } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }

};

controller.oauthLogin = (req, res) => {
    
    const redirect_uri = "http://localhost:4000/api/1.0/users/login/github/callback";
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`
    );
  
 }

controller.oauthLoginCallback = async (req, res) => {
    
        const code = req.query.code;
        const access_token = await getAccessToken({ code, client_id, client_secret });
        const user = await fetchGitHubUser(access_token);
        if (user) {
            console.log(access_token)
            console.log(user);
            req.session.access_token = access_token;
            req.session.githubId = user.id;
            // Create the payload and sign the JWT
            const payload = {
                user: {
                    email: user.email,
                    username: user.username
                }
            }
            /*
            const token = jwt.sign(payload, process.env.SECRET, {
               expiresIn: 3600
            });*/
            return res.status(200).json({
                message: 'Login succesfully',
                token: access_token,
                user
            })
        } else {
          res.send("Login did not succeed!");
        }
};

controller.getUsers = async (req, res, next) => {

    const users = await User.find();
    res.status(200).json({
        message: 'Success',
        users
    })
};


module.exports = controller;