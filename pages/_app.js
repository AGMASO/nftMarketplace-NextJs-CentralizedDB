import "@/styles/globals.css";
import { Fragment } from "react";
import { NotificationProvider } from "web3uikit";

//!Como estamos usando Moralis, por ejmplo con la web3uikit. Para incializarlo debemos hacer los siguiente.
import { MoralisProvider } from "react-moralis";

import Header from "@/components/Header";

export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Header />
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}
