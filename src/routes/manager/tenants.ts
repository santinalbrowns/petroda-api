import express from "express";
import { tenants } from "../../controllers/manager";
import { validate } from "../../middlewares";
import { tenant } from "../../validations/manager";

const router = express.Router();

router.get('/', tenants.get);

router.get('/:id', tenants.get);

router.post('/', validate(tenant.add), tenants.add);

router.put('/:id', validate(tenant.update), tenants.update);

router.delete('/:id', tenants.delete);

module.exports = router;