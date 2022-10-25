import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect().post(
  async (req: NextApiRequest, res: NextApiResponse) => {}
);

export default handler;
