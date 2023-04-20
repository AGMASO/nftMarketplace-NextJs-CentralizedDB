import Head from "next/head";
//Como podemos enseñar los NFTs listados en nuestro index.js
//Vamos a recopilar los Enventos triggered en una dataBase y de alli, llamaremos a esa data a nuestro Indx.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MongoClient } from "mongodb";
import { abi, contractAddress } from "../constants/index";

export default function Home(props) {
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
        <div className="">
          <h1 className="py-10 px-4 font-extralight text-5xl text-white">
            Welcome to the real decentralized Nfts Market
          </h1>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  //Intento de oir eventos de nuestro contrato y subirlo a la mongoDb
  //Connecting to Ethereum Goerli Network

  const provider = new ethers.WebSocketProvider(
    "wss://eth-goerli.g.alchemy.com/v2/6WDKZRPFR3JfUlvLpczZ491-CvXm-jhc"
  );

  const contractAddress = "0x9F8847cA2f42600b869E39A4Dc0Eb618Ed115A4b";
  const contractAbi = abi;
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  // Listen to the event emitted by the Solidity contract

  contract.on("ItemListing", async (seller, nftAddress, tokenId, price) => {
    const nft = {
      seller: seller.toLowerCase(),
      nftAddress: nftAddress.toLowerCase(),
      tokenId: tokenId.toString(),
      price: ethers.utils.formatUnits(price, 6),
    };

    console.log(JSON.stringify(nft, null, 4));

    //Connect to MongoDb

    const client = await MongoClient.connect(process.env.MONGODB_KEY);

    //Iniciamos la database conectada al cliente.
    const dataBase = client.db();

    console.log("You are coneccted to the dataBase");

    // Store the transaction in MongoDB

    const collection = dataBase.collection("nfts");
    collection.insertOne(nft, function (error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log("NftList stored in MongoDB", nft);
      }
    });
  });

  //END

  return {
    props: {},
  };
}
