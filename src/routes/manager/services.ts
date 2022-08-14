import express from "express";
import { services } from "../../controllers/manager";

import { validate } from "../../middlewares";
import { service } from "../../validations/manager";

const router = express.Router();

router.post('/', validate(service.add), services.add);

router.get('/', services.get);

router.get('/:id', services.get);

router.get('/:id/providers', services.providers);

router.put('/:id', validate(service.update), services.update);

router.delete('/:id', services.delete);

module.exports = router;