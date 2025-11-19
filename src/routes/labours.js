const express = require('express');
const {
  createLabour,
  getLabours,
  getLabour,
  updateLabour,
  deleteLabour,
} = require('../controllers/labours.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(auth);

router.post('/', createLabour);
router.get('/', getLabours);
router.get('/:id', getLabour);
router.put('/:id', updateLabour);
router.delete('/:id', deleteLabour);

module.exports = router;
