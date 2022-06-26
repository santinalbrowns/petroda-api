import express from "express";
import { users } from "../../controllers/manager";

import { validate } from "../../middlewares";
import { user } from "../../validations/manager";

const router = express.Router();

router.post('/', validate(user.add), users.add);

router.get('/', users.get);

router.get('/:id', users.get);

router.put('/', validate(user.update), users.update);

router.delete('/:id', users.delete);

module.exports = router;