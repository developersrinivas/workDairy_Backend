const Joi = require('joi');

const labourAssignmentSchema = Joi.object({
  labourId: Joi.string().required().messages({
    'string.empty': 'Labour ID is required',
    'any.required': 'Labour ID is required',
  }),
  amountPaid: Joi.number().min(0).required().messages({
    'number.base': 'Amount paid must be a number',
    'number.min': 'Amount paid cannot be negative',
    'any.required': 'Amount paid is required',
  }),
  roleNotes: Joi.string().allow('').optional(),
});

const loadSchema = Joi.object({
  loadNo: Joi.number().integer().min(1).required().messages({
    'number.base': 'Load number must be a number',
    'number.integer': 'Load number must be an integer',
    'number.min': 'Load number must be at least 1',
    'any.required': 'Load number is required',
  }),
  mode: Joi.string().valid('per_load', 'per_member', 'per_unit', 'mixed', 'gaddulu', 'trip_share').required().messages({
    'string.base': 'Mode must be a string',
    'any.only': 'Mode must be one of: per_load, per_member, per_unit, mixed, gaddulu, trip_share',
    'any.required': 'Mode is required',
  }),
  quantity: Joi.number().min(0).default(0).messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity cannot be negative',
  }),
  unit: Joi.string().allow('').optional(),
  membersCount: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Members count must be a number',
    'number.integer': 'Members count must be an integer',
    'number.min': 'Members count cannot be negative',
  }),
  rateOverride: Joi.number().min(0).optional().messages({
    'number.base': 'Rate override must be a number',
    'number.min': 'Rate override cannot be negative',
  }),
  // gaddulu mode fields
  totalGaddulu: Joi.number().min(0).when('mode', {
    is: 'gaddulu',
    then: Joi.required().messages({
      'any.required': 'Total gaddulu is required for gaddulu mode',
    }),
    otherwise: Joi.optional(),
  }),
  ratePerGaddu: Joi.number().min(0).when('mode', {
    is: 'gaddulu',
    then: Joi.required().messages({
      'any.required': 'Rate per gaddu is required for gaddulu mode',
    }),
    otherwise: Joi.optional(),
  }),
  // trip_share mode fields
  tripsCount: Joi.number().min(0).when('mode', {
    is: 'trip_share',
    then: Joi.required().messages({
      'any.required': 'Trips count is required for trip_share mode',
    }),
    otherwise: Joi.optional(),
  }),
  ratePerTrip: Joi.number().min(0).when('mode', {
    is: 'trip_share',
    then: Joi.required().messages({
      'any.required': 'Rate per trip is required for trip_share mode',
    }),
    otherwise: Joi.optional(),
  }),
  labourCount: Joi.number().min(0).when('mode', {
    is: 'trip_share',
    then: Joi.required().messages({
      'any.required': 'Labour count is required for trip_share mode',
    }),
    otherwise: Joi.optional(),
  }),
  amount: Joi.number().min(0).default(0).messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount cannot be negative',
  }),
  notes: Joi.string().allow('').optional(),
  labourAssignments: Joi.array().items(labourAssignmentSchema).default([]),
}).when('mode', {
  is: 'gaddulu',
  then: Joi.object({
    membersCount: Joi.number().integer().min(1).required().messages({
      'any.required': 'Members count is required for gaddulu mode',
    }),
  }),
  otherwise: Joi.optional(),
}).when('mode', {
  is: 'trip_share',
  then: Joi.object({
    labourCount: Joi.number().integer().min(1).required().messages({
      'any.required': 'Labour count is required for trip_share mode',
    }),
  }),
  otherwise: Joi.optional(),
});

const createTripSchema = Joi.object({
  date: Joi.date().required().messages({
    'date.base': 'Date must be a valid date',
    'any.required': 'Date is required',
  }),
  vehicleId: Joi.string().required().messages({
    'string.empty': 'Vehicle ID is required',
    'any.required': 'Vehicle ID is required',
  }),
  vehicleCount: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Vehicle count must be a number',
    'number.integer': 'Vehicle count must be an integer',
    'number.min': 'Vehicle count must be at least 1',
  }),
  routeFrom: Joi.string().required().messages({
    'string.empty': 'Route from is required',
    'any.required': 'Route from is required',
  }),
  routeTo: Joi.string().required().messages({
    'string.empty': 'Route to is required',
    'any.required': 'Route to is required',
  }),
  remarks: Joi.string().allow('').optional(),
  loads: Joi.array().items(loadSchema).default([]).custom((value, helpers) => {
    const loadNumbers = value.map(load => load.loadNo);
    const uniqueLoadNumbers = [...new Set(loadNumbers)];
    
    if (loadNumbers.length !== uniqueLoadNumbers.length) {
      return helpers.error('custom.loadNumbersNotUnique');
    }
    
    return value;
  }, 'Load number validation').messages({
    'custom.loadNumbersNotUnique': 'Load numbers must be unique within the same trip',
  }),
  settingsUsed: Joi.object({
    mode: Joi.string().valid('per_load', 'per_member', 'per_unit', 'mixed').optional(),
    ratesSnapshot: Joi.object({
      per_load_rate: Joi.number().min(0).optional(),
      per_member_rate: Joi.number().min(0).optional(),
      per_unit_rate: Joi.number().min(0).optional(),
    }).optional(),
  }).optional(),
});

const updateTripSchema = Joi.object({
  date: Joi.date().optional(),
  vehicleId: Joi.string().optional(),
  vehicleCount: Joi.number().integer().min(1).optional(),
  routeFrom: Joi.string().optional(),
  routeTo: Joi.string().optional(),
  remarks: Joi.string().allow('').optional(),
  loads: Joi.array().items(loadSchema).optional().custom((value, helpers) => {
    if (!value) return value;
    
    const loadNumbers = value.map(load => load.loadNo);
    const uniqueLoadNumbers = [...new Set(loadNumbers)];
    
    if (loadNumbers.length !== uniqueLoadNumbers.length) {
      return helpers.error('custom.loadNumbersNotUnique');
    }
    
    return value;
  }, 'Load number validation').messages({
    'custom.loadNumbersNotUnique': 'Load numbers must be unique within the same trip',
  }),
  settingsUsed: Joi.object({
    mode: Joi.string().valid('per_load', 'per_member', 'per_unit', 'mixed').optional(),
    ratesSnapshot: Joi.object({
      per_load_rate: Joi.number().min(0).optional(),
      per_member_rate: Joi.number().min(0).optional(),
      per_unit_rate: Joi.number().min(0).optional(),
    }).optional(),
  }).optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const validateCreateTrip = (req, res, next) => {
  const { error } = createTripSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message),
    });
  }
  next();
};

const validateUpdateTrip = (req, res, next) => {
  const { error } = updateTripSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message),
    });
  }
  next();
};

module.exports = {
  createTripSchema,
  updateTripSchema,
  validateCreateTrip,
  validateUpdateTrip,
};
