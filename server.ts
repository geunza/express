import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import mysql from "mysql";
import "dotenv/config";
import dbconfig from "@/config/database";
import userRouter from "@/routes/users/userRoute";
import loginRouter from "@/routes/login/loginRoute";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "@/config/swagger";
import cors from "cors";
const specs = swaggerJSDoc(swaggerOptions);

export const connection = mysql.createConnection(dbconfig);
// connection.connect();
// connection.query("SELECT * from user", (error, rows, fields) => {
//   if (error) throw error;
//   console.log("user info is: ", rows);
// });
// connection.end();
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
// app.get("/user", (req: Request, res: Response) => {
//   res.send(process.env.DB_HOST);
// });
const apiRouter = express.Router();
apiRouter.use("/users", userRouter);
apiRouter.use("/login", loginRouter);
app.use("/api/v1", apiRouter);

app.listen(8080);
