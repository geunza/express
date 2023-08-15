import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";
import { connection } from "@/server";
import { onRegex, removeTimeStamp } from "@/public/ts/common";

const loginRouter = Router();
/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: 로그인
 *     tags: [Login]
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
loginRouter.post("/", async (req: Request, res: Response) => {
  // 유저 생성
  const body = req.body;
  const email: string = body.email;
  const password: string = body.password;
  const saltRounds = 10;
  const emailQuery = "SELECT * FROM user WHERE email = ?;";
  connection.query(emailQuery, [email], async (error, results) => {
    if (error) {
      console.log("데이터베이스 오류", error);
      return res.status(500).send({ message: "데이터베이스 오류" });
    }
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.send({ mem_no: user.id });
      } else {
        res.status(401).send({ message: "잘못된 비밀번호 입니다." });
      }
    } else {
      res.status(401).send({ message: "계정을 찾을 수 없습니다." });
    }
  });
});

export default loginRouter;
