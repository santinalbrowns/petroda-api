import express from "express";
import { providers } from "../../controllers/manager";

const router = express.Router();

router.get('/', providers.get);

router.get('/:id', providers.get);

module.exports = router;