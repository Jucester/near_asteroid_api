const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { findAll, addList, csvToJson, updateNea, deleteNea, findOne } = require('../controllers/neas.controller');
const auth = require('../middlewares/auth');
const pagination = require('../middlewares/pagination');

router.get('/', auth, pagination, findAll);
router.get('/:id', auth, findOne)
router.post('/', auth, addList);
router.put('/:id', auth, updateNea);
router.delete('/:id', auth, deleteNea);

module.exports = router;