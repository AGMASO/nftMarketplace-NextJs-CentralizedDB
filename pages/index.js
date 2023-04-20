import Head from "next/head";

import NftBox from "@/components/NftBox";
import WithdrawProceeds from "@/components/WithdrawProceeds";
import SellNft from "@/components/SellNft";
//Como podemos enseñar los NFTs listados en nuestro index.js
//Vamos a recopilar los Enventos triggered en una dataBase y de alli, llamaremos a esa data a nuestro Indx.js

import { ethers } from "ethers";

import { abi, contractAddress } from "../constants/index";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Form, useNotification, Withdraw } from "web3uikit";

//----------------------------
import connectMongo from "../utils/connectMongo";
import ActiveNft from "../models/ActiveNft";
import ListedNft from "../models/ListedNft";
import listener from "@/listener";

import { useEffect } from "react";

export default function Home({ nfts }) {
  //Inicializamos useNitification de la libreria web3uikit
  const dispatch = useNotification();
  const { isWeb3Enabled } = useMoralis();

  return (
    <>
      <Head>
        <title>Nft Marketplace</title>
        <meta
          name="description"
          content="List your Nfts, sell it or buy more"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="" />
      </Head>

      <main className="flex justify-center">
        <div>
          <div className="">
            <h1 className="py-10 px-4 font-extralight text-5xl text-white text-center">
              Welcome to the real decentralized Nfts Market
            </h1>
            <h2 className="py-10 px-4 font-bold text-2xl text-white text-center">
              Recently Listed NFTS
            </h2>

            <div className="flex flex-wrap">
              {isWeb3Enabled ? (
                nfts.map((nft) => {
                  const { price, nftAddress, tokenId, seller } = nft;

                  return (
                    <NftBox
                      price={price}
                      nftAddress={nftAddress}
                      tokenId={tokenId}
                      seller={seller}
                      key={`${nftAddress}${tokenId}`}
                    />
                  );
                })
              ) : (
                <div className="py-10 px-4 font-extralight text-5xl text-white text-center">
                  Web3 Currently not enabled
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <div>
        <div id="sellNft">
          <SellNft />
        </div>
      </div>
      <div>
        <div id="withdrawProceeds">
          <WithdrawProceeds />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  //Connect to MongoDb
  try {
    console.log("Listening");
    await listener();
  } catch (error) {
    console.log(error);
  }

  //Fetching DATA
  try {
    console.log("CONNECTING TO MONGO");

    await connectMongo();

    console.log("CONNECTED TO MONGO");

    console.log("FETCHING DATA");

    const activeNfts = await ActiveNft.find();

    /*const tokenURI = await Promise.all(
      activeNfts.map(async (nft) => {
        const { tokenId } = nft;
        const imageURI = await getTokenURI(tokenId);
        console.log(`El imageURI es ${imageURI}`);

        return imageURI;
      })
    );
    console.log(`esto es tokenURI ${tokenURI}`);*/

    console.log("FETCHED DATA");

    return {
      props: {
        nfts: JSON.parse(JSON.stringify(activeNfts)),
        /*tokenURI: JSON.parse(JSON.stringify(tokenURI)),*/
      },
      revalidate: 10,
    };
  } catch (error) {
    console.log(error);

    return {
      notFound: true,
    };
  }
}
