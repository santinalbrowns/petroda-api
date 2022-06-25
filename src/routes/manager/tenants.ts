import express from "express";
import { tenants } from "../../controllers/manager";

const router = express.Router();

router.get('/', tenants.get);

router.get('/:id', tenants.get);

module.exports = router;