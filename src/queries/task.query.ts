const creatTasks = `
INSERT INTO tasks (task, priority, user_id, completed) VALUES ($1, $2, $3, false) RETURNING id, task, priority, completed, user_id, created_at, updated_at`;

const FetchTasks = `
SELECT * FROM tasks WHERE user_id = $1
AND ($2::TEXT IS NULL OR task ILIKE '%' || $2 || '%')
AND ($3::INT IS NULL OR priority = $3)
AND ($4::BOOLEAN IS NULL OR completed = $4)
ORDER BY created_at DESC;
`;

const updateTasks = `
UPDATE tasks SET task = $1, priority = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *`;

const deleteTasks = `
DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`;

const toggleTasks = `
UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *
`;

const tasksQueries = {
    creatTasks,
    FetchTasks,
    updateTasks,
    deleteTasks,
    toggleTasks
}

export default tasksQueries;