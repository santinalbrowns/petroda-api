import express from "express";
import { bookings } from "../../controllers/tenant";
import { validate } from "../../middlewares";
import book from "../../validations/tenant/book";

const router = express.Router();

router.get('/', bookings.get);

router.get('/:id', bookings.get);

router.delete('/:id', bookings.delete);

router.post('/', validate(book.request), bookings.request);

module.exports = router;