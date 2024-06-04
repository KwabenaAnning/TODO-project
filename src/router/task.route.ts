import { Router } from 'express';
import {
    createTaskController,
    fetchTasksController,
    updateTaskController,
    deleteTaskController,
    toggleTaskController,
} from '../controllers/task.controller';
import authenticateToken from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/tasks', authenticateToken, createTaskController);
router.get('/tasks', authenticateToken, fetchTasksController);
router.put('/tasks/:id', authenticateToken, updateTaskController);
router.delete('/tasks/:id', authenticateToken, deleteTaskController);
router.patch('/tasks/:id/toggle', authenticateToken, toggleTaskController);

export default router;