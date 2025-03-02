import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {

  return (
    <Html lang="en">
      <Head>
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        /> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* <script async
          defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIzZ9W2f7cMZSTogL6Dr06IwD5ZR64oi0&libraries=places"
        ></script> */}
              <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <body className="hold-transition sidebar-mini layout-fixed">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
