import chai from 'chai';
import sinon from 'sinon';
import pool from '../core/config/database';
import tasksQueries from '../queries/task.query';
import { createTask, fetchTasks, updateTask, deleteTask, toggleTask } from '../services/task.service';

const expect = chai.expect;

describe("Task Management Service", () => {
    let poolQueryStub: sinon.SinonStub;

    beforeEach(() => {
        poolQueryStub = sinon.stub(pool, "query");
    });

    afterEach(() => {
        poolQueryStub.restore();
    });

    describe("createTask", () => {
        it("should create a task successfully", async () => {
            const taskData = { task: "New Task", priority: 1 };
            const userId = 1;
            const createdTask = {
                id: 1,
                task: "New Task",
                priority: 1,
                completed: false,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date()
            };

            poolQueryStub.withArgs(tasksQueries.creatTasks, [taskData.task, taskData.priority, userId]).resolves({ rows: [createdTask] });

            const result = await createTask(taskData, userId);

            expect(result).to.deep.equal(createdTask);
            expect(poolQueryStub).to.have.been.calledWith(tasksQueries.creatTasks, [taskData.task, taskData.priority, userId]);
        });

        it("should throw an error when task creation fails", async () => {
            const taskData = { task: "New Task", priority: 1 };
            const userId = 1;

            poolQueryStub.withArgs(tasksQueries.creatTasks, [taskData.task, taskData.priority, userId]).rejects(new Error("Failed to create task"));

            try {
                await createTask(taskData, userId);
            } catch (error: any) {
                expect(error.message).to.equal("Error creating task: Failed to create task");
            }
        });
    });

    describe("fetchTasks", () => {
        it("should fetch tasks successfully", async () => {
            const userId = 1;
            const fetchedTasks = [
                {
                    id: 1,
                    task: "Task 1",
                    priority: 1,
                    completed: false,
                    user_id: userId,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: 2,
                    task: "Task 2",
                    priority: 2,
                    completed: true,
                    user_id: userId,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];

            poolQueryStub.withArgs(tasksQueries.FetchTasks, [userId, null, null, null]).resolves({ rows: fetchedTasks });

            const result = await fetchTasks(userId);

            expect(result).to.deep.equal(fetchedTasks);
            expect(poolQueryStub).to.have.been.calledWith(tasksQueries.FetchTasks, [userId, null, null, null]);
        });

        it("should throw an error when fetching tasks fails", async () => {
            const userId = 1;
            const errorMessage = "Cannot read properties of undefined (reading 'rows')";

            poolQueryStub.withArgs(tasksQueries.FetchTasks, [userId, null, null, null]).rejects(new Error(errorMessage));

            try {
                await fetchTasks(userId);
            } catch (error: any) {
                expect(error.message).to.equal(`Error fetching tasks: ${errorMessage}`);
            }
        });
    });

    describe("updateTask", () => {
        it("should update a task successfully", async () => {
            const taskId = "1";
            const taskData = { task: "Updated Task", priority: 2 };
            const userId = 1;
            const updatedTask = {
                id: 1,
                task: "Updated Task",
                priority: 2,
                completed: false,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date()
            };

            poolQueryStub.withArgs(sinon.match.string, sinon.match.array).resolves({ rows: [updatedTask] });

            const result = await updateTask(taskId, taskData, userId);

            expect(result).to.deep.equal(updatedTask);
            expect(poolQueryStub).to.have.been.calledWith(sinon.match.string, sinon.match.array);
        });

        it("should throw an error when task update fails", async () => {
            const taskId = "1";
            const taskData = { task: "Updated Task", priority: 2 };
            const userId = 1;

            poolQueryStub.withArgs(sinon.match.string, sinon.match.array).rejects(new Error("Failed to update task"));

            try {
                await updateTask(taskId, taskData, userId);
            } catch (error: any) {
                expect(error.message).to.equal("Error updating task: Failed to update task");
            }
        });
    });

    describe("deleteTask", () => {
        it("should delete a task successfully", async () => {
            const taskId = "1";
            const userId = 1;
            const deletedTask = {
                id: 1,
                task: "Task to be deleted",
                priority: 1,
                completed: false,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date()
            };

            poolQueryStub.withArgs(tasksQueries.deleteTasks, [taskId, userId]).resolves({ rows: [deletedTask] });

            const result = await deleteTask(taskId, userId);

            expect(result).to.deep.equal(deletedTask);
            expect(poolQueryStub).to.have.been.calledWith(tasksQueries.deleteTasks, [taskId, userId]);
        });

        it("should throw an error when task deletion fails", async () => {
            const taskId = "1";
            const userId = 1;

            poolQueryStub.withArgs(tasksQueries.deleteTasks, [taskId, userId]).rejects(new Error("Failed to delete task"));

            try {
                await deleteTask(taskId, userId);
            } catch (error: any) {
                expect(error.message).to.equal("Error deleting task: Failed to delete task");
            }
        });
    });

    describe("toggleTask", () => {
        it("should toggle a task successfully", async () => {
            const taskId = "1";
            const completed = true;
            const userId = 1;
            const toggledTask = {
                id: 1,
                task: "Task to be toggled",
                priority: 1,
                completed: true,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date()
            };

            poolQueryStub.withArgs(tasksQueries.toggleTasks, [completed, taskId, userId]).resolves({ rows: [toggledTask] });

            const result = await toggleTask(taskId, completed, userId);

            expect(result).to.deep.equal(toggledTask);
            expect(poolQueryStub).to.have.been.calledWith(tasksQueries.toggleTasks, [completed, taskId, userId]);
        });

        it("should throw an error when task toggle fails", async () => {
            const taskId = "1";
            const completed = true;
            const userId = 1;

            poolQueryStub.withArgs(tasksQueries.toggleTasks, [completed, taskId, userId]).rejects(new Error("Failed to toggle task"));

            try {
                await toggleTask(taskId, completed, userId);
            } catch (error: any) {
                expect(error.message).to.equal("Error toggling task: Failed to toggle task");
            }
        });
    });
});