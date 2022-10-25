import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const handler = nextConnect().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { wallet } = req.query;
      const { mint, amount } = req.body;

      if (wallet == null || wallet == undefined) {
        return res.status(400).send("No wallet address found");
      }

      if (
        mint == undefined ||
        amount == undefined ||
        mint == null ||
        amount == null
      ) {
        return res.status(400).send("Mint Or Amount Undefined");
      }

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

      filteredAccounts.forEach((token: any) => {
        if (
          token.account.data.parsed.info.mint === mint &&
          token.account.data.parsed.info.tokenAmount.uiAmount >=
            parseInt(amount)
        ) {
          return res.status(200).send({
            allowed: true,
          });
        }
      });

      return res.status(200).send({
        allowed: false,
      });
    } catch (error) {
      console.log("Error During Check", error);
      res.status(400).send(error);
    }
  }
);

export default handler;
