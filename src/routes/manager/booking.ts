import express from "express";
import { bookings } from "../../controllers/manager";

const router = express.Router();

router.get('/', bookings.get);

router.get('/:id', bookings.get);

module.exports = router;