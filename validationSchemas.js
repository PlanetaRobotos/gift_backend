// validationSchemas.js
const Joi = require('joi');

const solveRiddleSchema = Joi.object({
  puzzle_id: Joi.string().required(),
  answer: Joi.string().required()
});

const markFoundSchema = Joi.object({
  puzzle_id: Joi.string().required()
});

module.exports = {
  solveRiddleSchema,
  markFoundSchema
};
