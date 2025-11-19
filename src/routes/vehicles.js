const express = require('express');
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicles.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(auth);

router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
