const router = require("express").Router({ mergeParams: true });
const { param } = require("express-validator");
const tokenHandler = require("../handlers/tokenHandler");
const sectionController = require("../controllers/section");
const validation = require("../handlers/validation");

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Board section management endpoints
 */

/**
 * @swagger
 * /boards/{boardId}/sections:
 *   post:
 *     summary: Create a new section in a board
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID to create section in
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Section successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Section'
 *                 - type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                       example: []
 *             example:
 *               _id: "507f1f77bcf86cd799439033"
 *               board: "507f1f77bcf86cd799439011"
 *               title: ""
 *               tasks: []
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Invalid board ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post(
  "/",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  sectionController.create,
);

/**
 * @swagger
 * /boards/{boardId}/sections/{sectionId}:
 *   put:
 *     summary: Update a section
 *     tags: [Sections]
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
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID to update
 *         example: "507f1f77bcf86cd799439033"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Section title
 *           example:
 *             title: "To Do"
 *     responses:
 *       200:
 *         description: Section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Section'
 *                 - type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                       example: []
 *             example:
 *               _id: "507f1f77bcf86cd799439033"
 *               board: "507f1f77bcf86cd799439011"
 *               title: "To Do"
 *               tasks: []
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T11:30:00.000Z"
 *       400:
 *         description: Invalid board or section ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a section and all its tasks
 *     tags: [Sections]
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
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID to delete
 *         example: "507f1f77bcf86cd799439033"
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "deleted"
 *       400:
 *         description: Invalid board or section ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:sectionId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  param("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid section id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  sectionController.update,
);

router.delete(
  "/:sectionId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  param("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid section id");
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  sectionController.delete,
);

module.exports = router;
