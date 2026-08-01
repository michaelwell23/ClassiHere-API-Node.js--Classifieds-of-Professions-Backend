const { Router } = require('express');

const SessionController = require('./controllers/SessionController');

const { loginDTO, logoutDTO, refreshTokenDTO } = require('./dtos/session.dto');

const authMiddleware = require('../../shared/middlewares/auth.middleware');
const validate = require('../../shared/middlewares/validation.middleware');

const authRoutes = Router();

authRoutes.post('/login', validate(loginDTO), SessionController.login);
authRoutes.post('/logout', validate(logoutDTO), SessionController.logout);
authRoutes.post('/logout-all', authMiddleware, SessionController.logoutAll);
authRoutes.get('/me', authMiddleware, SessionController.me);
authRoutes.post('/refresh-token', validate(refreshTokenDTO), SessionController.refresh);

module.exports = authRoutes;
