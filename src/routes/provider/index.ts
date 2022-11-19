import express from "express";
import { ROLE } from "../../enum";
import { guard } from "../../middlewares";

const router = express.Router();

router.use(guard(ROLE.PROVIDER));

// Service providers end-point
router.use('/requests', require('./requests'));


module.exports = router;