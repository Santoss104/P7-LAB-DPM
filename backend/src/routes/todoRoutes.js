const express = require('express');
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @typedef {object} TodoRequest
 * @property {string} title.required - Title
 * @property {string} description - Description
 */

/**
 * POST /api/todos
 * @summary Create a new todo
 * @tags Todos
 * @param {TodoRequest} request.body.required - Todo info
 * @return {object} 201 - Todo created successfully
 * @return {object} 500 - Server error
 */
router.post('/', authMiddleware, TodoController.createTodo);

/**
 * GET /api/todos
 * @summary Get all todos
 * @tags Todos
 * @return {object} 200 - List of todos
 * @return {object} 500 - Server error
 */
router.get('/', authMiddleware, TodoController.getTodos);

/**
 * GET /api/todos/{id}
 * @summary Get a todo by ID
 * @tags Todos
 * @param {string} id.path.required - Todo ID
 * @return {object} 200 - Todo data
 * @return {object} 404 - Todo not found
 * @return {object} 500 - Server error
 */
router.get('/:id', authMiddleware, TodoController.getTodoById);

/**
 * PUT /api/todos/{id}
 * @summary Update a todo by ID
 * @tags Todos
 * @param {string} id.path.required - Todo ID
 * @param {TodoRequest} request.body.required - Todo info
 * @return {object} 200 - Todo updated successfully
 * @return {object} 404 - Todo not found
 * @return {object} 500 - Server error
 */
router.put('/:id', authMiddleware, TodoController.updateTodoById);

/**
 * DELETE /api/todos/{id}
 * @summary Delete a todo by ID
 * @tags Todos
 * @param {string} id.path.required - Todo ID
 * @return {object} 200 - Todo deleted successfully
 * @return {object} 404 - Todo not found
 * @return {object} 500 - Server error
 */
router.delete('/:id', authMiddleware, TodoController.deleteTodoById);

module.exports = router;