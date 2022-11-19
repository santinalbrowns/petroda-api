import express from "express";
import requests from "../../controllers/provider/requests";
import { validate } from "../../middlewares";
import request from "../../validations/provider/request";

const router = express.Router();

router.get('/', requests.get);
router.get('/:id', requests.get);

router.put('/:id', validate(request.update), requests.update);

module.exports = router;