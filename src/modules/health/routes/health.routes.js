const { Router } = require('express');

const HealthController = require('../controllers/HealthController');

const router = Router();

router.get('/', HealthController.check);

module.exports = router;
