const { z } = require('zod');

const uuidSchema = z.string().uuid();

module.exports = uuidSchema;
