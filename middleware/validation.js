const Joi = require('joi');

// Validate user registration
exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().allow(''),
    address: Joi.string().allow('')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

// Validate user login
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

// Validate order creation
exports.validateOrder = (req, res, next) => {
  const itemSchema = Joi.object({
    productName: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(0).required()
  });

  const schema = Joi.object({
    items: Joi.array().items(itemSchema).min(1).required(),
    totalPrice: Joi.number().min(0).required(),
    deliveryAddress: Joi.string().required(),
    notes: Joi.string().allow('')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

// Validate product creation
exports.validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid('hot-drinks', 'cold-drinks', 'pastries', 'snacks', 'other').required(),
    image: Joi.string().allow(''),
    available: Joi.boolean()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};