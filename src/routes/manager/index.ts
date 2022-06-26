import express from "express";
import { overview } from "../../controllers/manager";
import { ROLE } from "../../enum";
import { guard } from "../../middlewares";

const router = express.Router();


router.use(guard(ROLE.MANAGER));

// Overview endpoint
router.get('/', overview);

// Categories end-point
router.use('/categories', require('./categories'));

// Service providers end-point
router.use('/providers', require('./providers'));

// Services end-point
router.use('/services', require('./services'));

// Tenants end-point
router.use('/tenants', require('./tenants'));

// Users end-point
router.use('/users', require('./users'));

router.use('/houses', require('./houses'));

module.exports = router;