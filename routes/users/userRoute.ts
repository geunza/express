import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";
import { connection } from "@/server";
import { onRegex, removeTimeStamp } from "@/public/ts/common";
type User = {
  id: number;
  email: string;
  password: string;
  reg_date: string;
};
const userRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id :
 *           type: integer
 *           description : 아이디
 *         email:
 *           type: string
 *           description: 이메일
 *         password:
 *           type: string
 *           description: 비밀번호
 *         reg_date:
 *           type : string
 *           description: 생성시간
 *       example:
 *         email: gsiri@nate.com
 *         password: qwer1234!
 */
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: 계정 생성
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post("/", async (req: Request, res: Response) => {
  // 유저 생성
  const body = req.body;
  const email: string = body.email;
  const password: string = body.password;
  const isEmail = onRegex({ value: email, type: "email" });
  const isPassword = onRegex({ value: password, type: "password" });
  const saltRounds = 10;

  if (isEmail && isPassword) {
    // Check if email already exists in the database
    const checkEmailQuery = "SELECT email FROM user WHERE email = ?;";
    connection.query(checkEmailQuery, [email], async (error, results) => {
      if (error) {
        console.error("Error querying the database:", error);
        return res.status(500).send({ message: "데이터베이스 오류" });
      }

      if (results.length > 0) {
        // Email already exists
        return res.status(400).send({ message: "이미 존재하는 이메일입니다." });
      }

      // Email doesn't exist, proceed with the creation
      const bcryptPassword = await bcrypt.hash(password, saltRounds);
      const insertQuery = "INSERT INTO user (email, password) VALUES (?, ?);";
      connection.query(
        insertQuery,
        [email, bcryptPassword],
        (error, insertResults) => {
          if (error) {
            console.error("Error inserting into database:", error);
            return res.status(500).send({ message: "데이터베이스 오류" });
          }
          console.log(insertResults);
          res.send({
            mem_no: insertResults.insertId,
          });
        }
      );
    });
  } else {
    res
      .status(400)
      .send({ message: "이메일 또는 비밀번호가 규격에 맞지 않습니다." });
  }
});

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: 특정 유저 조회
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 유저 아이디
 *     responses:
 *       200:
 *         description: The user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get("/:userId", (req: Request, res: Response) => {
  // 특정 사용자 조회
  const userId = req.params.userId;
  const qs = "SELECT id, email, reg_date from user WHERE id = ?";
  connection.query(qs, [userId], (error, rows) => {
    if (error) throw error;
    if (rows.length === 0) {
      // 사용자가 없는 경우
      return res
        .status(404)
        .send({ message: "존재하지 않는 회원번호 입니다." });
    }
    const row = rows[0];
    const result = {
      ...row,
      reg_date: removeTimeStamp({ time: row.reg_date }),
    };
    res.send(result);
  });
});

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: 모든 유저 조회
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get("/", (req: Request, res: Response) => {
  // 모든 사용자 조회
  const qs = "SELECT * from user";
  connection.query(qs, (error, rows) => {
    if (error) throw error;
    res.send(
      rows.map((user: User) => {
        return {
          ...user,
          reg_date: removeTimeStamp({ time: user.reg_date }),
        };
      })
    );
  });
});
export default userRouter;
