import { MongoHelper } from './data/mongo.helper';
import app from './app';
const PORT = 3000;

app.listen(PORT, async () => {
    console.log('listening on port ' + PORT);
    try {
        await MongoHelper.connect(`mongodb://localhost:27017/`);
        console.info(`Connected to Mongo!`);
    } catch (err) {
        console.error(`Unable to connect to Mongo!`, err);
    }
});

