import approveAndList from "@/utils/ApproveAndList";
import List from "@/utils/List";
import { Form, useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function SellNft() {
  const dispatch = useNotification();
  async function approvingAndlistngItem(data) {
    console.log("Approving Nft...");

    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    console.log(data);
    //Debemos convertir el precio de forma que EVM lo pueda entender, y pasarlo a string
    //porque si no es un big Object que no qeuremsos
    const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether");

    const nftMarketplace = "0x690CE9f45E9301B9D1A63b580241Ffb71b337682";
    try {
      await approveAndList(nftAddress, nftMarketplace, tokenId);
      dispatch({
        type: "success",
        message: "Listing Approved successfully",
        title: "Listing Approved - Wait for Listing to happens",
        position: "topR",
      });
      console.log("approved");
    } catch (error) {
      // Handle error here
      console.log(error);
    }
    try {
      await List(nftMarketplace, nftAddress, tokenId, price);
      dispatch({
        type: "success",
        message: "Listing Listed successfully",
        title: "Listing Listed - please refresh",
        position: "topR",
      });
      console.log("Listed");
      await new Promise((resolve) => setTimeout(resolve, 6000));
      if (process.env.NODE_ENV === "production") {
        window.location.href =
          "https://nftmarketplace-centralized-database.netlify.app/";
      } else {
        window.location.href = "http://localhost:3000/";
      }
    } catch (error) {
      // Handle error here
      console.log(error);
    }
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <div className="w-full p-40">
        <Form
          onSubmit={approvingAndlistngItem}
          //Data object es especial de esta libreria y de este Form, y contiene una lista de
          //de los fields que va tenr nuestro form
          data={[
            {
              name: "Nft Address",
              type: "text",
              inputWidth: "100%",
              value: "",
              key: "nftAddress",
            },
            {
              name: "Token Id",
              type: "number",
              inputWidth: "100%",
              value: "",
              key: "tokenId",
            },
            {
              name: "Price (in Eth)",
              type: "number",
              inputWidth: "100%",
              value: "",
              key: "price",
            },
          ]}
          title="Sell your NFT!"
          id="MainForm"
        />
      </div>
    </div>
  );
}
