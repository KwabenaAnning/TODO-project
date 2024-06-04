import pool from '../core/config/database';
import tasksQueries from '../queries/task.query';

const { creatTasks, FetchTasks, updateTasks, deleteTasks, toggleTasks } = tasksQueries;

export const createTask = async (taskData: any, userId: number): Promise<void> => {
    const { task, priority} = taskData;
    console.log('Creating task for User ID:', userId); 
    try {
        const result = await pool.query(creatTasks, [task, priority, userId]);
        return result.rows[0]
    } catch (error) {
        throw new Error('Error creating task: ' + (error as Error).message);
    }
};

export const fetchTasks = async (userId: number, task?: string, priority?: number, completed?: boolean) => {
    try {
      const queryParams = [
        userId,
        task ?? null,
        priority ?? null,
        completed ?? null
      ];
      console.log('Query params:', queryParams);
      const result = await pool.query(FetchTasks, queryParams);
      console.log('Result:', result);
      const rows = result.rows || [];
      return rows;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching tasks: ${error.message}`);
      } else {
        throw new Error(`Error fetching tasks: ${error}`);
      }
    }
  };

export const updateTask = async (taskId: string, taskData: any, userId: number): Promise<any> => {
    const updates = [];
    const values = [];
    let index = 1;

    if (taskData.task !== undefined) {
        updates.push(`task = $${index}`);
        values.push(taskData.task);
        index++;
    }

    if (taskData.priority !== undefined) {
        updates.push(`priority = $${index}`);
        values.push(taskData.priority);
        index++;
    }

    if (updates.length === 0) {
        throw new Error('No valid fields to update');
    }

    const updateTasks = `
        UPDATE tasks SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${index} AND user_id = $${index + 1}
        RETURNING *`;

    values.push(taskId, userId);

    try {
        const result = await pool.query(updateTasks, values);
        if (result.rows.length === 0) {
            throw new Error('Task not found or not authorized to update this task');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Error updating task: ' + (error as Error).message);
    }
};

export const deleteTask = async (taskId: string, userId: number): Promise<any> => {
    try {
        const result = await pool.query(deleteTasks, [taskId, userId]);
        if (result.rows.length === 0) {
            throw new Error('Task not found or not authorized to delete this task');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Error deleting task: ' + (error as Error).message);
    }
};

export const toggleTask = async (taskId: string, completed: boolean, userId: number): Promise<any> => {
    try {
        const result = await pool.query(toggleTasks, [completed, taskId, userId]);
        if (result.rows.length === 0) {
            throw new Error('Task not found or not authorized to toggle this task');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Error toggling task: ' + (error as Error).message);
    }
};