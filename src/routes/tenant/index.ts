import express from "express";
import { overview } from "../../controllers/manager";
import { ROLE } from "../../enum";
import { guard } from "../../middlewares";

const router = express.Router();


router.use(guard(ROLE.TENANT));

// Service providers end-point
router.use('/providers', require('./providers'));

// Services end-point
router.use('/services', require('./services'));

//router.use('/houses', require('./houses'));

module.exports = router;