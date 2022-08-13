import express from "express";
import { services } from "../../controllers/manager";

const router = express.Router();

router.get('/', services.get);

router.get('/:id', services.get);

module.exports = router;