const express = require('express');
const router = express.Router();

//Requirements
const userRouter = require('./users.routes');

//Binding
userRouter(router);

module.exports = router;