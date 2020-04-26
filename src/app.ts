import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import { Tasks } from './routes/task';
var urlObj = {};

class App {
    public app: express.Application;
    public taskRoutes: Tasks = new Tasks();

    constructor() {
        this.app = express(); //run the express instance and store in app
        this.config();
        this.taskRoutes.routes(this.app);
        this.app.use("*", (req:Request, res:Response) => {
            res.status(404).json({ error: "Page not found" });
        });
    }
    
    Logger = (req: express.Request, res: express.Response, next: Function) => {
        
        console.log(`${JSON.stringify(req.body)} ${req.url} ${req.method}`);
        let currUrl = req.url;
        if (!urlObj[currUrl]) {
            urlObj[currUrl] = 1;
        }
        else {
            let value = urlObj[currUrl];
            urlObj[currUrl] = value + 1;
        }
        console.log("URL: " + JSON.stringify(urlObj));
        next();
    };




    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(
            bodyParser.urlencoded({
                extended: false
            })
        );

        this.app.use(this.Logger);
    }
}

export default new App().app;
