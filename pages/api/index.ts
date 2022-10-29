import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import jwt from "jsonwebtoken";

const router = createRouter<NextApiRequest, NextApiResponse>();

export const tokenVerify = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) => {
  console.log("Headers", req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    console.log(err);

    if (err) return res.status(403);

    next();
  });
};

router
  .use((req: NextApiRequest, res: NextApiResponse, next: any) => {
    const authHeader = req.headers["authorization"];
    console.log("AUTH HEADER", authHeader);

    if (authHeader == null) return res.status(401);
    jwt.verify(
      authHeader,
      process.env.JWT_SECRET as string,
      (err: any, user: any) => {
        console.log(err);
        if (err) return res.status(403);

        next();
      }
    );

    next();
  })
  .get((req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json({
      allowed: true,
    });
  });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
