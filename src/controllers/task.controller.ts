import { Request, Response, NextFunction } from 'express';
import { createTask, fetchTasks, updateTask, deleteTask, toggleTask } from '../services/task.service';

export const createTaskController = async (req: Request, res: Response, next: NextFunction) => {
    const taskData = req.body;
    const userId = (req as any).user.id;
    console.log("REQQQ", (req as any).user.id);
    console.log('User ID:', userId); // Debug log
    console.log('Task Data:', taskData); 

    if (!userId) {
        res.status(400).json({ 
            code: 400, 
            data: null, 
            message: 'Missing User ID' 
        });
        return;
    }

    try {
         const createTasks = await createTask(taskData, userId); 
        res.status(201).json({ 
            code: 201, 
            data: createTasks, 
            message: 'Task created successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500, 
            data: null, 
            message: 'Error creating task: ' + (error as Error).message 
        });
    }
};


export const fetchTasksController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const task = req.query.task ? req.query.task as string : undefined;
    const priority = req.query.priority ? parseInt(req.query.priority as string, 10) : undefined;
    const completed = req.query.completed ? req.query.completed === 'true' : undefined;
  
    try {
      const tasks = await fetchTasks(userId, task, priority, completed);
      res.status(200).json({
        code: 200,
        data: tasks,
        message: "Tasks fetched successfully"
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        data: null,
        message: 'Error fetching tasks: ' + (error as Error).message
      });
      next(error);
    }
  };

export const updateTaskController = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const taskData = req.body;
    const userId = (req as any).user.id;
    try {
        const updatedTask = await updateTask(taskId, taskData, userId);
        res.status(200).json({
            code: 200,
            data: updatedTask,
            message: 'Task updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            data: null,
            message: 'Error updating task: ' + (error as Error).message
        });
        next(error);
    }
};

export const deleteTaskController = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const userId = (req as any).user.id;
    try {
        const deletedTask = await deleteTask(taskId, userId);
        res.status(200).json({
            code: 200,
            data: deletedTask,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            data: null,
            message: 'Error deleting task: ' + (error as Error).message
        });
        next(error);
    }
};

export const toggleTaskController = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const completed = req.body.completed;
    const userId = (req as any).user.id;
    try {
        const toggledTask = await toggleTask(taskId, completed, userId);
        res.status(200).json({
            code: 200,
            data: toggledTask,
            message: 'Task toggled successfully'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            data: null,
            message: 'Error toggling task: ' + (error as Error).message
        });
        next(error);
    }
};