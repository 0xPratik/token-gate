import { GetServerSideProps } from "next";
import axios from 'axios';


const Protected = () => {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>You have access to this page</p>
      </div>
    );
  };
  
  export default Protected;


  export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  
    const res = await axios.get(
        `/api/token/${wallet.publicKey?.toString()}`
      );
  
    if (!) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  

  
    if (!hasNFT) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  
    return {
      props: {},
    };
  };