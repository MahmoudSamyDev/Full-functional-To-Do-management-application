const router = require("express").Router();
const userController = require("../controllers/user");
const { body } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const User = require("../models/user");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *           example:
 *             username: "johndoe123"
 *             password: "password123"
 *             confirmPassword: "password123"
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               data:
 *                 user:
 *                   _id: "507f1f77bcf86cd799439011"
 *                   username: "johndoe123"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                   updatedAt: "2024-01-15T10:30:00.000Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               errors:
 *                 - param: "username"
 *                   msg: "username must be at least 8 characters"
 *                 - param: "username"
 *                   msg: "username already used"
 *       500:
 *         description: Internal server error
 */

router.post(
  "/signup",
  body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
  body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("confirmPassword must be at least 8 characters"),
  body("username").custom(async (value) => {
    const user = await User.findOne({ username: value });
    if (user) return Promise.reject("username already used");
  }),
  validation.validate,
  userController.register,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *           example:
 *             username: "johndoe123"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               data:
 *                 user:
 *                   _id: "507f1f77bcf86cd799439011"
 *                   username: "johndoe123"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                   updatedAt: "2024-01-15T10:30:00.000Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               errors:
 *                 - param: "username"
 *                   msg: "username must be at least 8 characters"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               errors:
 *                 - param: "username"
 *                   msg: "Invalid username or password"
 *       500:
 *         description: Internal server error
 */

router.post(
  "/login",
  body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
  body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
  validation.validate,
  userController.login,
);

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     summary: Verify JWT token validity
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               user:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 username: "johndoe123"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Unathorized"
 */

router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
