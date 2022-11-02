

const Protected = () => {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>You have access to this page</p>
      </div>
    );
  };
  
  export default Protected;


  export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`https://.../data`)
    const data = await res.json()
  
    // Pass data to the page via props
    return { props: { data } }
  }