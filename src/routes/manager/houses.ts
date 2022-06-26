import express from "express";
import { houses } from "../../controllers/manager";

import { validate } from "../../middlewares";
import { house } from "../../validations/manager";

const router = express.Router();

router.post('/', validate(house.add), houses.add);

router.get('/', houses.get);

router.get('/:id', houses.get);

router.put('/', validate(house.update), houses.update);

router.delete('/:id', houses.delete);

module.exports = router;