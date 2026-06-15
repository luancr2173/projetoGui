const express = require('express');
const router = express.Router();
const atendimentosController = require('../controllers/atendimentosController');

router.get('/', atendimentosController.getAtendimentos);

module.exports = router;