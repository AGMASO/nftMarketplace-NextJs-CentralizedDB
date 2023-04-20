import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";

import { abi, basicNftabi, contractAddresses } from "../constants/index";
import Image from "next/image";

import { Button, Card, useNotification } from "web3uikit";

//Importamos el componente modal UpdateListingModal
import UpdateListingModal from "./UpdateListingModal";
//Importamos la function de buyItem
import buyItem from "@/utils/BuyItem";
import cancelListing from "@/utils/cancelListing";

//Creamos una FUnction para recortar la Seller address ya que se ve muy larga, y asi
//tmabien damos un poco de privacidad.

const recortarString = (fullString, StringLenght) => {
  if (fullString.lenght <= StringLenght) return fullString;

  const separator = "...";
  const separatorLenght = separator.length;
  const chartsToShow = StringLenght - separatorLenght;
  const frontcharacters = Math.ceil(chartsToShow / 2);
  const backCharacters = Math.floor(chartsToShow / 0.33);
  return (
    fullString.substring(0, frontcharacters) +
    separator +
    fullString.substring(backCharacters)
  );
};

export default function NftBox({ price, nftAddress, tokenId, seller }) {
  //Sacamos de UseMoralis isWeb3Enablend y account para sacar datos del account
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [nameURI, setNameURI] = useState("");
  const [descriptURI, setDescriptURI] = useState("");
  const [ShowModal, setShowModal] = useState(false); //Al inicio el popup no saldrá
  //para manejar que cada vez que le demos a cerrar se cambie a false de vuelta
  const hideModal = () => setShowModal(false);
  const dispatch = useNotification();

  async function getTokenURI() {
    const network = "goerli";
    const provider = new ethers.providers.WebSocketProvider(
      "wss://eth-sepolia.g.alchemy.com/v2/pDnsHSqJomhXLGvW0BD406tousjSDigY"
    );

    const contractAddress = "0xAA9833b34E38cb997898F420a3838B32C6E544D2";
    const contractAbi = basicNftabi;
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider
    );
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(tokenURI);

    if (tokenURI) {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      console.log(tokenURIResponse);
      const imageURI = tokenURIResponse.image;
      const nameURI = tokenURIResponse.name;
      const descriptURI = tokenURIResponse.description;
      console.log(imageURI);
      setImageURI(imageURI);
      setNameURI(nameURI);
      setDescriptURI(descriptURI);
    }

    //Function para obtener tokenURI
    //usando el tag de la imagen de tokenURI
  }
  useEffect(() => {
    getTokenURI();
  }, [isWeb3Enabled]);

  //creamos una constante para declarar y diferenciar cuando el NFT pertenece al User o a
  //otra account, para ello igualamos el seller al account
  //Seller lo conseguimos del props, y account es la cuenta que está conectada a la wallet
  //y nos la da usemoralis
  console.log(seller);
  console.log(account);
  const isOwnedByUser =
    seller.toLowerCase() === account.toLowerCase() || seller === undefined;
  console.log(`este es ${isOwnedByUser}`);

  //Formateamos de esta forma seller. Asi que no vamos a dar seller raw en el return, vamos
  //a dar este constant en cambio.

  const SellerMejorado = isOwnedByUser
    ? "you"
    : recortarString(seller || "", 15);

  //CLICK TO DELETE NFT
  const handleCancellingListing = async function () {
    if (isOwnedByUser) {
      setShowModal(false);
      try {
        await cancelListing(nftAddress, tokenId);
        dispatch({
          type: "success",
          message: "You are canceling your Listing in this platform",
          title: "Cancelling",
          position: "topR",
        });
        await new Promise((resolve) => setTimeout(resolve, 6000));
        if (process.env.NODE_ENV === "production") {
          window.location.href = "https://sellandbuyyournextnft.netlify.app/";
        } else {
          window.location.href = "http://localhost:3000/";
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const CancelListing = isOwnedByUser ? (
    <div>
      <Button
        onClick={() => {
          handleCancellingListing();
        }}
        text="Cancel Listing"
        theme="primary"
      ></Button>
    </div>
  ) : (
    ""
  );
  //END

  //HANDLECARDCLICK FUNCTION
  const handleCardClick = async function () {
    if (isOwnedByUser) {
      setShowModal(true);
    } else {
      console.log("Starting");
      await buyItem(nftAddress, tokenId, price);
      dispatch({
        type: "success",
        message: "You bought the NFT successfully",
        title: "Nft bought - please refresh",
        position: "topR",
      });
      await new Promise((resolve) => setTimeout(resolve, 6000));
      if (process.env.NODE_ENV === "production") {
        window.location.href = "https://sellandbuyyournextnft.netlify.app/";
      } else {
        window.location.href = "http://localhost:3000/";
      }
      console.log("Ending");
    }
  };
  //END

  return (
    <div>
      <div>
        {imageURI ? (
          <div className="flex">
            <div className="m-10">
              <UpdateListingModal
                esVisible={ShowModal}
                nftAddress={nftAddress}
                tokenId={tokenId}
                onClose={hideModal}
              />
              <Card
                title={nameURI}
                description={descriptURI}
                onClick={handleCardClick}
              >
                <div className="text-end text-xl font-bold">
                  TokenID: #{tokenId}
                </div>
                <div className="italic text-sm mb-4 text-end">
                  Owned by {SellerMejorado}
                </div>

                <Image
                  className="m-auto border-2"
                  loader={() => imageURI}
                  src={imageURI}
                  height="200"
                  width="200"
                />
                <div className="text-lg font-bold text-center">{price} ETH</div>
              </Card>
              <div className="m-1 flex justify-center">{CancelListing}</div>
            </div>
          </div>
        ) : (
          <div> Is Loading...</div>
        )}
      </div>
    </div>
  );
}
