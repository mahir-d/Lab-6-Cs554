import { Request, Response } from 'express';


import commentData = require('../data/comments');
import data = require('../data/task');


export class Tasks {
    public routes(app: any): void {
        
        /**
         * To Create a new task with given details in the body
         */
        app.route("/tasks").post(async (req: Request, res: Response) => {

            const newTask = req.body;
            try {
                if (!newTask.title) {
                    throw 'You must provide a task title in order to create a new task'
                }
                if (!newTask.description) {
                    throw 'You must provide a task description in order to create a new task'
                }
                if (!newTask.hoursEstimated) {
                    throw 'You must provide hoursEstimated in order to create a new task'
                }
                const { title, description, hoursEstimated } = newTask;
                const taskToRtrn = await data.create(title, description, hoursEstimated);
                let objToRtrn = await commentData.showComments(taskToRtrn);
                res.status(200).json(objToRtrn);

            }
            catch (e) {
                console.log(e)
                res.status(400).json({ Error: e });
            }



        })

        /**
 * To get task by the given id
 */
        app.route("/tasks/:id").get(async (req: Request, res: Response) => {


            try {
                const taskId = req.params.id;
                if (!taskId) {
                    throw `task id should be provided`;
                }
                const taskObjToRtrn = await data.getTaskById(taskId);
                let objToRtrn = await commentData.showComments(taskObjToRtrn);
                res.status(200).json(objToRtrn);
            }
            catch (e) {
                console.log(e)
                res.status(400).json({ Error: e });
            }


        })

        /**
        * To get all task in the database
        */
        
        app.route("/tasks").get(async (req: Request, res: Response) => {
            let skippy:string = req.query.skip as string;
            let takey:string = req.query.take as string
            if (skippy && takey) {
                try {
                    var s = parseInt(skippy);
                    if (isNaN(s)) {
                        throw 'Skip number should be an Integer'
                    }
                    if (typeof s != 'number' && !Number.isInteger(s)) {
                        throw 'query skip  should be of type number';
                    }
                    if (s < 0) {
                        throw 'query skip  should be a positive number';
                    }
                    var t = parseInt(takey);
                    if (isNaN(t)) {
                        throw 'take number should be an Integer'
                    }
                    if (typeof t != 'number' && !Number.isInteger(t)) {
                        throw 'query take should be of type number';
                    }
                    if (t < 0) {
                        throw 'query take should be a positive number';
                    }
                    if (t > 100) {
                        t = 100;
                    }

                    const allTaskData = await data.getAll(s, t);

                    let taskArrayToRtrn = []


                    for (let i = 0; i < allTaskData.length; i++) {
                        let objToRtrn = await commentData.showComments(allTaskData[i]);
                        taskArrayToRtrn.push(objToRtrn);
                    }
                    res.status(200).json(taskArrayToRtrn);

                } catch (e) {
                    res.status(400).json({ Error: e })
                }

            }
            else if (!skippy && takey) {
                try {
                    var t = parseInt(takey);
                    if (isNaN(t)) {
                        throw 'take number should be an Integer'
                    }
                    if (typeof t != 'number' && !Number.isInteger(t)) {
                        throw 'query take should be of type number';
                    }
                    if (t < 0) {
                        throw 'query take should be a positive number';
                    }
                    if (t > 100) {
                        t = 100;
                    }

                    const allTaskData = await data.getAll(s, t);

                    let taskArrayToRtrn = []

                    for (let i = 0; i < allTaskData.length; i++) {
                        let objToRtrn = await commentData.showComments(allTaskData[i]);
                        taskArrayToRtrn.push(objToRtrn);
                    }
                    res.status(200).json(taskArrayToRtrn);


                } catch (e) {
                    res.status(400).json({ Error: e })
                }

            }

            else if (skippy && !takey) {
                try {
                    var s = parseInt(skippy);
                    if (isNaN(s)) {
                        throw 'skip number should be an Integer'
                    }
                    if (typeof s != 'number' && !Number.isInteger(s)) {
                        throw 'query skip  should be of type number';
                    }
                    if (s < 0) {
                        throw 'query skip  should be a positive number';
                    }

                    const allTaskData = await data.getAll(s, t);

                    let taskArrayToRtrn = []

                    for (let i = 0; i < allTaskData.length; i++) {
                        let objToRtrn = await commentData.showComments(allTaskData[i]);
                        taskArrayToRtrn.push(objToRtrn);
                    }
                    res.status(200).json(taskArrayToRtrn);


                } catch (e) {
                    res.status(400).json({ Error: e })
                }

            }
            else {

                const allTaskData = await data.getWoST();
                let taskArrayToRtrn = []

                for (let i = 0; i < allTaskData.length; i++) {
                    let objToRtrn = await commentData.showComments(allTaskData[i]);
                    taskArrayToRtrn.push(objToRtrn);
                }
                res.status(200).json(taskArrayToRtrn);

            }
        });

        /*
        To update a task by the given id
        */
        app.route("/tasks/:id").put(async (req: Request, res: Response) => {




            try {
                if (!req.params.id) {
                    res.status(400).json({ Error: "you need to submit a id in parameters" });
                }
                let newTask = req.body;
                if (!newTask.title) {
                    throw "You must provide a task title in order to update a task";
                }
                if (!newTask.description) {
                    throw "You must provide a task description in order to update a task";
                }
                if (!newTask.hoursEstimated) {
                    throw "You must provide hoursEstimated in order to update a task";
                }
                if (newTask.completed === undefined) {
                    throw "You must provide completed status in order to update a task";
                }
                if (newTask.comments) {
                    throw "Error: Comments cannot be updated from this route"
                }

                let { title, description, hoursEstimated, completed } = newTask;
                const updatedTask = await data.updateTask(req.params.id, title, description, hoursEstimated, completed);

                let objToRtrn = await commentData.showComments(updatedTask);

                res.status(200).json(objToRtrn);
            } catch (e) {
                console.log(e);
                res.status(400).json({ error: e });
            }
        });

        /**
        * To add a new comment on task by id
        */

        app.route("/tasks/:id/comments").post(async (req: Request, res: Response) => {


            try {
                if (!req.params.id) {
                    throw "id is required to add comment"
                }
                if (!req.body.name) {
                    throw "name is required"
                }
                if (!req.body.comment) {
                    throw "comment is required"
                }
                let { name, comment } = req.body;
                const currtask = await data.getTaskById(req.params.id);
                if (!currtask) {
                    throw `Error: task with id ${req.params.id} does not exisits`;
                }
                const taskToRtrn = await data.addComment(req.params.id, name, comment);
                let objToRtrn = await commentData.showComments(taskToRtrn)
                res.status(200).json(objToRtrn);
            }
            catch (e) {
                console.log(e)
                res.status(400).json({ Error: e });
            }
        })


        /*
        To delete a comment with comment id in task id
        */
        app.route("/tasks/:taskId/:commentId").delete(async (req: Request, res: Response) => {

            try {
                if (!req.params.taskId) {
                    throw 'taskId is requireds to delete a comment'
                }
                if (!req.params.commentId) {
                    throw 'commentId is required to delete a comment'
                }
                let taskToRtrn = await data.deleteComment(req.params.taskId, req.params.commentId);
                let objToRtrn = await commentData.showComments(taskToRtrn)
                res.status(200).json(objToRtrn);
            }
            catch (e) {
                console.log(e)
                res.status(400).json({ Error: e });
            }

        })


        app.route("/tasks/:id").patch(async (req:Request, res:Response) => {
            try {
                if (!req.params.id) {
                    throw `Please provide a task id to update`;
                }
                let newDetails = req.body;

                if (!newDetails) {
                    throw `Please provide at least one detail in the body to update the task`;
                }

                let taskToRtrn = await data.patchTask(req.params.id, newDetails);
                let objToRtrn = await commentData.showComments(taskToRtrn)
                res.status(200).json(objToRtrn);

            } catch (e) {
                console.log(e);
                res.status(400).json({ Error: e });
            }
        });

    }
}
