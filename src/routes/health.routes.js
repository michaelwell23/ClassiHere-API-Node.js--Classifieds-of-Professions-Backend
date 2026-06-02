const { Router } = require('express');

const router = Router();

router.get('/', (request, response) => {
  return response.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date(),
  });
});

module.exports = router;
