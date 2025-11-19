// src/routes/persons.routes.js
import express from 'express';
import { list, create, update, remove, ledger } from '../controllers/persons.controller.js';
const router = express.Router();

router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/:id/ledger', ledger);

export default router;
