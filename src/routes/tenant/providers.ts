import express from "express";
import { providers } from "../../controllers/manager";
import { addReview } from "../../controllers/tenant/reviews";
import { validate } from "../../middlewares";
import rate from "../../validations/tenant/review";

const router = express.Router();

router.get('/', providers.get);

router.get('/:id', providers.get);

router.post('/:id/review', validate(rate), addReview);

module.exports = router;