import express from "express";

import { categories } from "../../controllers/manager";
import { validate } from "../../middlewares";
import { category } from "../../validations/manager";

const router = express.Router();

router.post('/', validate(category.add), categories.add);

router.get('/', categories.get);

router.get('/:id', categories.get);

router.put('/', validate(category.update), categories.update);

router.delete('/:id', categories.update);

module.exports = router;