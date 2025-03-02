import { wrapper } from "../redux/store";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BaseUrl } from "../constants/constant";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from "next/head";
import { initializeOneSignal } from "../utilities/oneSignalClient";
import { OneSignalProvider, useOneSignal } from "../utilities/OneSignalContext";
import runOneSignal from "../utilities/oneSignal";
function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  // const { setUserId } = useOneSignal();
  useEffect(() => {
    // Simulate an asynchronous delay (replace with actual authentication data fetching)
    const delay = setTimeout(() => {
      setLoading(false);
    }, 200); 

    return () => clearTimeout(delay); // Clear the timeout if the component unmounts
  }, []);

//   useEffect(() => {
//     initializeOneSignal().then((userId) => {
//       if (userId) {
//           setUserId(userId); // Save the User ID in the global context
//       }
//   });
// }, []);

useEffect(() => {

  runOneSignal();
},[])

  if (loading) {
    return <></>;
  }
  

  return (
    <>
      <div className="mainBox">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <GoogleOAuthProvider clientId={BaseUrl?.GOOGLE_CLIENT_ID}>
        <main>
        <OneSignalProvider>
          <Component {...pageProps} />
        </OneSignalProvider>
        </main>
        </GoogleOAuthProvider>
      </div>
      <ToastContainer
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
}

export default wrapper.withRedux(App);
