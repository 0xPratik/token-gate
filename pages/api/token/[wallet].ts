import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import jwt from "jsonwebtoken";

export const tokenVerify = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    console.log(err);

    if (err) return res.status(403);

    next();
  });
};

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { wallet } = req.query;

    if (wallet == null || wallet == undefined) {
      return res.status(400).send("No wallet address found");
    }

    const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
    const amount = "10";

    console.log("Wallet address ", wallet);
    console.log("Mint", mint);
    console.log("Amount", amount);
    const userWalletAddress = new PublicKey(wallet);

    const endpoint = "https://api.devnet.solana.com";
    const connection = new Connection(endpoint);

    const accounts = await connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {
        filters: [
          {
            dataSize: 165, // number of bytes
          },
          {
            memcmp: {
              offset: 32, // number of bytes
              bytes: userWalletAddress.toBase58(), // base58 encoded string
            },
          },
        ],
      }
    );

    const filteredAccounts = accounts.filter((account) => {
      const data: any = account.account.data;
      if (data.parsed.info.tokenAmount.decimals !== 0) {
        return data.parsed.info;
      }
    });
    const SECRET = process.env.JWT_SECRET || "EqPvA2c1g6";
    const authToken = jwt.sign({ allowed: true }, SECRET, {
      expiresIn: "1800s",
    });
    filteredAccounts.forEach((token: any) => {
      if (
        token.account.data.parsed.info.mint === mint &&
        token.account.data.parsed.info.tokenAmount.uiAmount >= parseInt(amount)
      ) {
        console.log(token.account.data.parsed.info.mint);
        return res.status(200).send({
          token: authToken,
        });
      }
    });

    return res.status(200).send({
      token: undefined,
    });
  } catch (error) {
    console.log("Error During Check", error);
    res.status(400).send(error);
  }
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
