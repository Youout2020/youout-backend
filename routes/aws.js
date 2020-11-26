const express = require('express');
const router = express.Router();
const awsController = require('./controllers/aws.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/rekognition', verifyToken, awsController.rekognition);

module.exports = router;
