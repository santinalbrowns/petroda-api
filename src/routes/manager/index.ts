import express from "express";
import { overview } from "../../controllers/manager";
import { ROLE } from "../../enum";
import { guard } from "../../middlewares";

const router = express.Router();


router.use(guard(ROLE.MANAGER));

// Overview endpoint
router.get('/', overview);

// Service providers end-point
router.use('/providers', require('./providers'));

// Services end-point
router.use('/services', require('./services'));

// Tenants end-point
router.use('/tenants', require('./tenants'));

// Users end-point
router.use('/users', require('./users'));

// Houses end-point
router.use('/houses', require('./houses'));

// Bookins end-point
router.use('/bookings', require('./booking'));

module.exports = router;