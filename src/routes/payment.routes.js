import express from "express";
import * as ctrl from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", ctrl.create);
router.get("/:id", ctrl.listByPerson);

export default router;
