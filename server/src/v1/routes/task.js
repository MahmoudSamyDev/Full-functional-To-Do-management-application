const router = require("express").Router({ mergeParams: true });
const { param, body } = require("express-validator");
const tokenHandler = require("../handlers/tokenHandler");
const validation = require("../handlers/validation");
const taskController = require("../controllers/task");

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints within boards and sections
 */

/**
 * @swagger
 * /boards/{boardId}/tasks:
 *   post:
 *     summary: Create a new task in a section
 *     tags: [Tasks]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sectionId
 *             properties:
 *               sectionId:
 *                 type: string
 *                 description: Section ID where the task will be created
 *           example:
 *             sectionId: "507f1f77bcf86cd799439033"
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Task'
 *                 - type: object
 *                   properties:
 *                     section:
 *                       $ref: '#/components/schemas/Section'
 *             example:
 *               _id: "507f1f77bcf86cd799439044"
 *               section:
 *                 _id: "507f1f77bcf86cd799439033"
 *                 board: "507f1f77bcf86cd799439011"
 *                 title: "To Do"
 *               title: ""
 *               content: ""
 *               position: 0
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Invalid board or section ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post(
  "/",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  body("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid section id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  taskController.create,
);

/**
 * @swagger
 * /boards/{boardId}/tasks/update-position:
 *   put:
 *     summary: Update task positions (drag and drop between sections)
 *     tags: [Tasks]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePositionRequest'
 *           example:
 *             resourceList:
 *               - _id: "507f1f77bcf86cd799439044"
 *                 section: "507f1f77bcf86cd799439033"
 *                 title: "Task 2"
 *                 content: "Updated task"
 *                 position: 0
 *             destinationList:
 *               - _id: "507f1f77bcf86cd799439055"
 *                 section: "507f1f77bcf86cd799439034"
 *                 title: "Task 1"
 *                 content: "Moved task"
 *                 position: 0
 *               - _id: "507f1f77bcf86cd799439066"
 *                 section: "507f1f77bcf86cd799439034"
 *                 title: "Task 3"
 *                 content: "Another task"
 *                 position: 1
 *             resourceColumnId: "507f1f77bcf86cd799439033"
 *             destinationColumnId: "507f1f77bcf86cd799439034"
 *     responses:
 *       200:
 *         description: Task positions updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "updated"
 *       400:
 *         description: Invalid board ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.put(
  "/update-position",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  taskController.updatePosition,
);

/**
 * @swagger
 * /boards/{boardId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to delete
 *         example: "507f1f77bcf86cd799439044"
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "deleted"
 *       400:
 *         description: Invalid board or task ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to update
 *         example: "507f1f77bcf86cd799439044"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *               content:
 *                 type: string
 *                 description: Task content/description
 *           example:
 *             title: "Updated task title"
 *             content: "Updated task description with more details"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               _id: "507f1f77bcf86cd799439044"
 *               section: "507f1f77bcf86cd799439033"
 *               title: "Updated task title"
 *               content: "Updated task description with more details"
 *               position: 0
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T12:30:00.000Z"
 *       400:
 *         description: Invalid board or task ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.delete(
  "/:taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid task id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  taskController.delete,
);

router.put(
  "/:taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid task id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  taskController.update,
);

module.exports = router;
