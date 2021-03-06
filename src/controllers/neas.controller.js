const Nea = require('../models/Nea');
const controller = {};
const { validationResult } = require('express-validator');
;

controller.findAll = async (req, res) => {
    const { page, size } = req.pagination
    try {
        
        const neas = await Nea.find().skip(page * size).limit(size);

        return res.status(200).json({
            page,
            size,
            totalPages: Math.ceil(120 / size),
            neas
        })

    } catch (error) {
       console.log(error);
       res.status(500).json({
           message: 'Something went wrong'
       })
    }
}

controller.findOne = async (req, res) => {

    const { id } = req.params;

    try {
        
        const nea = await Nea.findById(id);

        if(!nea) {
            return res.status(401).json({
                message: 'Asteroid not found'
            })
        }

        return res.status(200).json({
            message: 'Asteroid found',
            nea
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

controller.addList = (req, res) => {
    
    try {

        const nea = new Nea(req.body);
        nea.save();

        return res.status(200).json({
            message: 'Near Earth Asteroid Added',
            nea
        })

    } catch (error) {
       console.log(error);
       res.status(500).json({
           message: 'Something went wrong'
       })
    }
} 

controller.updateNea = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    try {
        const { id } = req.params;
        let nea = await Nea.findById(id);

        if(!nea) {
            return res.status(404).json({
                message: 'Asteroid not found'
            })
        };

        nea = await Nea.findByIdAndUpdate({ _id : id }, { $set: req.body }, { new: true });

        res.status(200).json({
            message: 'Updated successfully',
            nea
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

controller.deleteNea = async (req, res) => {

    try {
        
        const { id } = req.params;
        let nea = await Nea.findById(id);

        if(!nea) {
            return res.status(404).json({
                message: 'Asteroid not found'
            });
        }

        nea = await Nea.findByIdAndRemove({ _id: id });

        res.status(200).json({
            message: 'Deleted successfully',
            nea
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}


module.exports = controller;