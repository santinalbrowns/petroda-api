import express from "express";
import { providers } from "../../controllers/manager";

import { validate } from "../../middlewares";
import { provider } from "../../validations/manager";

const router = express.Router();

router.post('/', validate(provider.add), providers.add);

router.get('/', providers.get);

router.get('/:id', providers.get);

router.put('/', validate(provider.update), providers.update);

router.delete('/:id', providers.delete);

module.exports = router;