import express from "express";
import pay from "../../controllers/tenant/payment";

const router = express.Router();

router.post('/', pay);

module.exports = router;