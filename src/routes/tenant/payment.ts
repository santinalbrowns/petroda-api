import express from "express";
import pay, { verify } from "../../controllers/tenant/payment";

const router = express.Router();

router.post('/', pay);

router.post('/verify', express.raw({type: 'application/json'}), verify);

module.exports = router;