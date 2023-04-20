import getProceeds from "@/utils/getProceeds";
import withdrawProceeds from "@/utils/withdrawProceeds";
import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Button, useNotification } from "web3uikit";

export default function WithdrawProceeds() {
  const { isWeb3Enabled, account } = useMoralis();
  const dispatch = useNotification();
  const [proceeds, setProceeds] = useState("0");
  const [loading, setLoading] = useState(true);

  async function settingProceeds() {
    const amountProceeds = await getProceeds(account);

    console.log("amountProceeds");

    if (amountProceeds && amountProceeds > 0) {
      console.log("executed getProceeds 2");
      setProceeds(amountProceeds.toString());
      setLoading(false);
    } else {
      console.log(amountProceeds);
    }
  }

  const handleWithdraw = async function () {
    try {
      await withdrawProceeds();
      dispatch({
        type: "success",
        message: "Withdrawing goin on",
        title: "Withdrawing",
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
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      settingProceeds();
    }
  }, [isWeb3Enabled, proceeds]);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <div className="py-10 px-4 font-extralight text-5xl text-white text-center">
        You have {proceeds} ETH to withdraw
      </div>
      {proceeds !== "0" ? (
        <Button
          onClick={() => {
            handleWithdraw();
          }}
          text="Withdraw Funds"
          theme="primary"
        >
          Withdraw
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
