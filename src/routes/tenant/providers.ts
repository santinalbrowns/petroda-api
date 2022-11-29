import express from "express";
import { providers } from "../../controllers/manager";
import { addReview } from "../../controllers/tenant/reviews";
import { ROLE } from "../../enum";
import { guard, validate } from "../../middlewares";
import rate from "../../validations/tenant/review";

const router = express.Router();

router.get('/', providers.get);

router.get('/:id', providers.get);

router.post('/:id/review', guard(ROLE.TENANT), validate(rate), addReview);

module.exports = router;