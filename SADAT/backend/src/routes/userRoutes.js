const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas para gestión de usuarios por admin
router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);
router.put('/:id', authenticate, authorizeAdmin, userController.updateUser);
router.delete('/:id', authenticate, authorizeAdmin, userController.deleteUser);

module.exports = router;
