const { ValidationError } = require('./errors');

function validateSchema(schema, data) {
  const result = schema.validate(data);

  if (result.error) {
    throw new ValidationError(error);
  }
}

module.exports = validateSchema;
