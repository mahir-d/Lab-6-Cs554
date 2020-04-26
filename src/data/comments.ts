import { MongoHelper } from './mongo.helper';
var ObjectID = require("mongodb").ObjectID;
const getCommentsCollections = () => {
    return MongoHelper.client.db("Dhall-Mahir-CS554-Lab6").collection("comments");
}

interface taskInterface {
    "_id": string,
    "title": string,
    "description": string,
    "hoursEstimated": number,
    "completed": boolean,
    "comments": string
}


/**
* To display comments of the given task in a proper format
* @param {the task object to return } taskToRtrn 
*/
async function showComments(taskToRtrn: taskInterface) {

    let lsComments = taskToRtrn.comments;
    let commentArray = [];


    if (lsComments.length > 0) {
        const commentsCollection = await getCommentsCollections()

        for (let i = 0; i < lsComments.length; i++) {
            let currComment = await commentsCollection.findOne({ _id: lsComments[i] })
            if (currComment == null) {
                throw `Error: Comment at id ${lsComments[i]} not found`
            }
            let newObj = {
                "id": currComment._id,
                "name": currComment.name,
                "comment": currComment.comment
            }
            commentArray.push(newObj);
        }

    }

    let objToRtrn = {
        'id': taskToRtrn._id,
        'title': taskToRtrn.title,
        'description': taskToRtrn.description,
        'hoursEstimated': taskToRtrn.hoursEstimated,
        'completed': taskToRtrn.completed,
        'comments': commentArray


    }

    return objToRtrn;
}



function checkString(s: string) {
    if (typeof s != 'string') {
        return false;
    }
    if (s.length == 0) {
        return false;
    }
    return true;
}


async function dltComment(commentId: string) {
    if (!ObjectID.isValid(commentId)) {
        try {
            commentId = ObjectID.createFromHexString(commentId);
        } catch (e) {
            throw `Error : ${commentId} is not a vaild ObjectId`
        }
    }
    commentId = ObjectID(commentId);
    const commentCollection = await getCommentsCollections();
    const dltStatus = await commentCollection.deleteOne({ _id: commentId });
    if (dltStatus.deletedCount > 0) {
        return true;
    }
    return false;
}

async function getCommentsById(id: string) {
    try {
        id = ObjectID.createFromHexString(id);
    } catch (e) {
        throw `Error : ${id} is not a vaild ObjectId`
    }
    id = ObjectID(id);

    const commentsCollection = await getCommentsCollections();
    let commentToRtrn = await commentsCollection.findOne({ _id: id });
    if (!commentToRtrn) {
        throw 'Error: no comment found based on id';
    }
    return commentToRtrn;
}
interface comment {
    name: string,
    comment: string
}

async function createComment(name: string, comment: string) {
    if (!checkString(name)) {
        throw 'Error: name should of type string and non empty';
    }
    if (!checkString(comment)) {
        throw 'Error: comment should be of type string and non empty';
    }



    let newObj = {
        name,
        comment
    }

    const commentsCollection = await getCommentsCollections();

    const newComment = await commentsCollection.insertOne(newObj);
    if (newComment.insertedCount == 0) {
        throw 'Error: comment not inserted'
    }
    return newComment.insertedId;
}

export = { createComment, getCommentsById, getCommentsCollections, dltComment, showComments }