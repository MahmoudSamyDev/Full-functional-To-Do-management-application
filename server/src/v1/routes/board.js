const router = require("express").Router();
const { param } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const boardController = require("../controllers/board");

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Board management endpoints
 */

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Board successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               user: "507f1f77bcf86cd799439099"
 *               icon: "📃"
 *               title: "Untitled"
 *               description: "Add description here\n🟢 You can add multiline description\n🟢 Let's start..."
 *               position: 0
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/", tokenHandler.verifyToken, boardController.create);

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Get all boards for the authenticated user
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's boards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Board'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 user: "507f1f77bcf86cd799439099"
 *                 icon: "📋"
 *                 title: "Project Alpha"
 *                 description: "Main project board"
 *                 position: 1
 *                 favourite: true
 *                 favouritePosition: 0
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T11:30:00.000Z"
 *               - _id: "507f1f77bcf86cd799439022"
 *                 user: "507f1f77bcf86cd799439099"
 *                 icon: "📃"
 *                 title: "Personal Tasks"
 *                 description: "My daily tasks"
 *                 position: 0
 *                 favourite: false
 *                 createdAt: "2024-01-14T09:15:00.000Z"
 *                 updatedAt: "2024-01-14T09:15:00.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update board positions (reorder boards)
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Board ID
 *           example:
 *             boards:
 *               - id: "507f1f77bcf86cd799439011"
 *               - id: "507f1f77bcf86cd799439022"
 *     responses:
 *       200:
 *         description: Board positions updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "updated"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/", tokenHandler.verifyToken, boardController.getAll);

router.put("/", tokenHandler.verifyToken, boardController.updatePosition);

/**
 * @swagger
 * /boards/{boardId}:
 *   get:
 *     summary: Get a specific board with sections and tasks
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Board details with sections and tasks
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Board'
 *                 - type: object
 *                   properties:
 *                     sections:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Section'
 *                           - type: object
 *                             properties:
 *                               tasks:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Task'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               user: "507f1f77bcf86cd799439099"
 *               icon: "📋"
 *               title: "Project Alpha"
 *               description: "Main project board"
 *               position: 1
 *               sections:
 *                 - _id: "507f1f77bcf86cd799439033"
 *                   board: "507f1f77bcf86cd799439011"
 *                   title: "To Do"
 *                   tasks:
 *                     - _id: "507f1f77bcf86cd799439044"
 *                       section: "507f1f77bcf86cd799439033"
 *                       title: "Task 1"
 *                       content: "Description of task 1"
 *                       position: 0
 *                 - _id: "507f1f77bcf86cd799439034"
 *                   board: "507f1f77bcf86cd799439011"
 *                   title: "In Progress"
 *                   tasks: []
 *       400:
 *         description: Invalid board ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update board details
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Board title
 *               description:
 *                 type: string
 *                 description: Board description
 *               icon:
 *                 type: string
 *                 description: Board icon emoji
 *               favourite:
 *                 type: boolean
 *                 description: Whether board is favourite
 *           example:
 *             title: "Updated Project Alpha"
 *             description: "Updated description for the main project"
 *             icon: "🚀"
 *             favourite: true
 *     responses:
 *       200:
 *         description: Board updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       400:
 *         description: Invalid board ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a board and all its sections/tasks
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Board deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "deleted"
 *       400:
 *         description: Invalid board ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.getOne,
);

router.put(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.update,
);

router.delete(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.delete,
);

module.exports = router;
