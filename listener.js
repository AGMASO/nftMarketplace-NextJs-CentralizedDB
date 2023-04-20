import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MongoClient } from "mongodb";
import { abi } from "./constants/index";

//----------------------------
import connectMongo from "./utils/connectMongo";
import ActiveNft from "./models/ActiveNft";
import ListedNft from "./models/ListedNft";

export default async function listener() {
  //Intento de oir eventos de nuestro contrato y subirlo a la mongoDb
  //Connecting to Ethereum Sepolia Network
  const provider = new ethers.providers.WebSocketProvider(
    process.env.SEPOLIA_RPC_WEBSOCKET
  );

  const contractAddress = "0x690CE9f45E9301B9D1A63b580241Ffb71b337682";
  const contractAbi = abi;
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  // Listen to the event ItemListing emitted by the Solidity contract
  //UpdateListing
  contract.once(
    "UpdateListing",
    async (seller, nftAddress, tokenId, newPrice, event) => {
      const UpdateNft = {
        seller: seller,
        nftAddress: nftAddress,
        tokenId: tokenId.toString(),
        newPrice: ethers.utils.formatEther(newPrice),
        data: event,
      };

      //Connect to MongoDb

      const client = await MongoClient.connect(process.env.MONGODB_KEY);

      //Iniciamos la database conectada al cliente.
      const dataBase = client.db();

      console.log("You are conected to the dataBase");

      // Store the transaction in MongoDB

      const collection = await dataBase.collection("listednfts");
      try {
        const filter = { tokenId: UpdateNft.tokenId };
        const update = { $set: { price: UpdateNft.newPrice } };
        const options = { returnOriginal: false };

        const result = await collection.findOneAndUpdate(
          filter,
          update,
          options
        );
        console.log(result.value);
      } catch (error) {
        console.log(error);
      }
      const collection2 = dataBase.collection("activenfts");
      try {
        const filter = { tokenId: UpdateNft.tokenId };
        const update = { $set: { price: UpdateNft.newPrice } };
        const options = { returnOriginal: false };

        const result = await collection2.findOneAndUpdate(
          filter,
          update,
          options
        );
        console.log(result.value);
      } catch (error) {
        console.log(error);
      }
    }
  );
  //End
  //LISTINITEMS
  contract.once(
    "ItemListing",
    async (seller, nftAddress, tokenId, price, event) => {
      const ActiveNft = {
        seller: seller,
        nftAddress: nftAddress,
        tokenId: tokenId.toString(),
        price: ethers.utils.formatEther(price),
        data: event,
      };

      //console.log(JSON.stringify(ActiveNft));

      //Connect to MongoDb

      const client = await MongoClient.connect(process.env.MONGODB_KEY);

      //Iniciamos la database conectada al cliente.
      const dataBase = client.db();

      console.log("You are conected to the dataBase");

      // Store the transaction in MongoDB

      const collection = await dataBase.collection("listednfts");

      if (
        (await collection
          .countDocuments({
            tokenId: ActiveNft.tokenId,
            added_at: { $exists: true },
          })
          .then((result) => {
            return result;
          })) === 0
      ) {
        try {
          await collection.insertOne(ActiveNft, function (error, result) {
            //Closing DB
            client.close();
            return result;
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Document already exits in the Database");
      }

      /*try {
        await collection.insertOne(ActiveNft, function (error, result) {
          return result;
        });
      } catch (error) {
        console.log(error);
      }*/

      const collection2 = dataBase.collection("activenfts");
      if (
        (await collection2
          .countDocuments({
            tokenId: ActiveNft.tokenId,
            added_at: { $exists: true },
          })
          .then((result) => {
            return result;
          })) === 0
      ) {
        try {
          await collection2.insertOne(ActiveNft, function (error, result) {
            return result;
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Document already exits in the Database");
      }
    }
  );
  //END

  // LIsten to ItenBought Event

  contract.once("ItemBought", async (buyer, nftAddress, tokenId, price) => {
    const nft = {
      buyer: buyer,
      nftAddress: nftAddress,
      tokenId: tokenId.toString(),
      price: ethers.utils.formatEther(price),
    };

    console.log(JSON.stringify(nft));

    //Connect to MongoDb

    const client = await MongoClient.connect(process.env.MONGODB_KEY);

    //Iniciamos la database conectada al cliente.
    const dataBase = client.db();

    console.log("You are coneccted to the dataBase");

    // Store the transaction in MongoDB
    const collection = dataBase.collection("boughtNfts");
    if (
      (await collection
        .countDocuments({
          tokenId: nft.tokenId,
          added_at: { $exists: true },
        })
        .then((result) => {
          return result;
        })) === 0
    ) {
      try {
        await collection.insertOne(nft, function (error, result) {
          //Closing DB
          client.close();
          return result;
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Document already exits in the Database");
    }
    //END
    /*await collection.insertOne(nft, function (error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log(`NftList stored in MongoDB: ${nft}`);
        //Closing DB
        client.close();
      }
    });*/

    const collection2 = dataBase.collection("activenfts");
    await collection2.findOneAndDelete(
      { tokenId: nft.tokenId },
      function (error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log(`Nft deslistado from Database: ${nft}`);
          //Closing DB
          client.close();
        }
      }
    );
    return nft;
  });

  //END

  //Listen to ItemCanceled

  contract.once("ItemCanceled", async (seller, nftAddress, tokenId) => {
    const nft = {
      seller: seller,
      nftAddress: nftAddress,
      tokenId: tokenId.toString(),
    };

    console.log(JSON.stringify(nft));

    //Connect to MongoDb

    const client = await MongoClient.connect(process.env.MONGODB_KEY);

    //Iniciamos la database conectada al cliente.
    const dataBase = client.db();

    console.log("You are coneccted to the dataBase");

    // Store the transaction in MongoDB

    const collection = dataBase.collection("cancelledNfts");
    collection.insertOne(nft, function (error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log(`CancelledNft stored in MongoDB: ${nft}`);
        //Closing DB
        client.close();
      }
    });

    const collection2 = dataBase.collection("activenfts");

    collection2.findOneAndDelete(
      { tokenId: nft.tokenId },
      function (error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log(`Nft deslistado from Database: ${nft}`);
          //Closing DB
          client.close();
        }
      }
    );
    return nft;
  });
  //END
}

/*listener()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });*/
