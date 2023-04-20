//Importamos Modal que es un popUp ya formateado de web3uikit
import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import updateListingUtils from "@/utils/updateListingUtils";
import { ethers } from "ethers";

export default function UpdateListingModal({
  price,
  nftAddress,
  tokenId,
  seller,
  esVisible,
  onClose,
}) {
  //Creamos un useState para linkear lo que escribamos en modal aqui
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("");

  //Inicializamos useNitification de la libreria web3uikit
  const dispatch = useNotification();
  return (
    //Key for Modal es definir su propiedad isVisible, para que sepa si es visible o hide
    //esVisible lo vamos a pasar a este componente en el PROPS y lo tenemos que crear en NFTBOX component
    //Tenemos que importar INPUT de Web3uikit, nos facilita introducir los parametros a cambiar

    <Modal
      isVisible={esVisible}
      //con onOk acontinuacion creamos la function para realizar la llamada al BC
      onOk={() => {
        updateListingUtils(
          nftAddress,
          tokenId,
          ethers.utils.parseEther(priceToUpdateListingWith)
        );
        onClose && onClose();
        setPriceToUpdateListingWith("0");
        dispatch({
          type: "success",
          message: "Listing updated successfully",
          title: "Listing Updated - please refresh",
          position: "topR",
        });
      }}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      //Llamamos la function onClose definida en NFTBOX component cuando
      //cerramos el popUp, de la misma forma con onCloseButtonPressed
    >
      <Input
        label="Update Listing Price of your NFT"
        name="New Listing Price"
        type="number"
        //Con la propiedad onChange impiclita en esta libreria, vamos a linkear el dato
        //que escribirimos para update el NFt

        onChange={(event) => {
          setPriceToUpdateListingWith(event.target.value);
        }}
      />
    </Modal>
  );
}
