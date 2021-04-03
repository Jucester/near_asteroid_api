const { Schema, model } = require('mongoose');

const NeaSchema = Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    a: {
        type: String,
        required: true,
        trim: true
    },
    e: {
        type: String,
        required: true,
        trim: true
    }, 
    i: {
        type: String,
        required: true,
        trim: true
    },
    om: {
        type: String,
        required: true,
        trim: true
    },
    w: {
        type: String,
        required: true,
        trim: true
    },
    ma: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('neas', NeaSchema);