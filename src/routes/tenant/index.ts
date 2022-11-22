import express from "express";
import { overview } from "../../controllers/manager";
import { ROLE } from "../../enum";
import { guard } from "../../middlewares";

const router = express.Router();

// Service providers end-point
router.use('/providers', guard(ROLE.TENANT), require('./providers'));

// Services end-point
router.use('/services', guard(ROLE.TENANT), require('./services'));

// Bookings end-point
router.use('/bookings', guard(ROLE.TENANT), require('./booking'));

//router.use('/houses', require('./houses'));

//Making payments
router.use('/pay', require('./payment'));

module.exports = router;