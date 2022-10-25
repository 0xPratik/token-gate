import type { NextPage } from "next";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { useToast } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Box,
  HStack,
  VStack,
  Flex,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import BN from "bn.js";

const Home: NextPage = () => {
  const wallet = useWallet();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const message = new TextEncoder();

  const uint = message.encode("You are verifying your address");

  useEffect(() => {
    console.log("RUN");
  }, [verified]);

  return (
    <Box w="100vw" h="100vh" bg="blackAlpha.800" p={4}>
      <HStack h="50px" align="center" justify={"end"}>
        <WalletMultiButton />
      </HStack>
      <HStack h="50px" align="center" justify="center">
        <Button
          onClick={async () => {
            if (uint === undefined || wallet.signMessage === undefined) {
              return;
            }
            const res = await wallet.signMessage(uint);
            console.log("RES<", res);

            setVerified(true);
          }}
        >
          Sign to Confirm
        </Button>
      </HStack>
      <Flex mt={10} w="full" maxH={"30vh"} align={"center"} justify="center">
        {isAllowed ? (
          <Box
            border={"1px"}
            p={4}
            bg="green.500"
            borderColor="white"
            borderRadius={"base"}
          >
            <VStack w="full" h="20vh">
              <Heading color="whiteAlpha.900">
                You can view this cause you have the token to view this
              </Heading>
              <Text color="whiteAlpha.900">
                So Congrats on having the required Token
              </Text>
            </VStack>
          </Box>
        ) : (
          <Box
            border={"1px"}
            p={4}
            bg="red.500"
            borderColor="white"
            borderRadius={"base"}
          >
            <VStack w="full" h="20vh">
              <Heading color="whiteAlpha.900">
                You can&apos;t view this cause you don&apos;t have the token to
                view this
              </Heading>
              <Text color="whiteAlpha.900">
                So please get {process.env.NEXT_PUBLIC_TOKEN_AMOUNT} amount of
                the token of mint :- {process.env.NEXT_PUBLIC_MINT_ADDRESS}
              </Text>
            </VStack>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Home;
