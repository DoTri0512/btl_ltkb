/**
 * Required External Modules
*/
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { itemsRouter } from "./items/items.router";
import path from "path"
import bodyParser from "body-parser";
import session from "express-session"
dotenv.config();



/**
 * App Variables
 */

if (!process.env.PORT) {
    process.exit(1);
 }
 
 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();
/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use("/", itemsRouter);

app.set("view engine","ejs");
app.set("views","./src/views");
app.use('/',express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))
app.set('trust proxy', 1);

app.use(session({  
  secret: 'your_session_secret',
	resave: false,
	saveUninitialized: true
}));

/**
 * Server Activation
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });