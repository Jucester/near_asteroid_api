const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const controller = {};
require('dotenv').config();

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
            message: 'User registered succesfully',
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
           return res.status(400).json({
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

controller.getUsers = async (req, res, next) => {

    const users = await User.find();
    res.status(200).json({
        message: 'Success',
        users
    })
};

controller.postUser = (req, res, next) => {
    res.status(200).json({
        message: 'working'
    })
};

module.exports = controller;