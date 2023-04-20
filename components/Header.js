//Aqui vamos a hacer un boton que se conecte con metamask, pero no manualmente, sino usando un thirdpartypacket que ya tiene todo automatzado
//llamado web3uikit

import { Fragment } from "react";
import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <Fragment>
        <nav className="flex justify-evenly p-10 border-b-2 border-cyan-100">
          <div className="">
            {" "}
            <ul className="flex flex-row space-x-10">
              <li>
                <Link href="/" className="py-4 px-4 font-bold text-3xl">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#sellNft" className="py-4 px-4 font-bold text-3xl">
                  Sell-Nfts
                </Link>
              </li>
              <li>
                <Link
                  href="/#withdrawProceeds"
                  className="py-4 px-4 font-bold text-3xl"
                >
                  Withdraw Funds
                </Link>
              </li>
            </ul>
          </div>
          <div className="pl-60">
            {" "}
            <ConnectButton moralisAuth={false}></ConnectButton>
          </div>
        </nav>
      </Fragment>
    </>
  );
}

//SOlo esto, hace todo lo que hemos hecho en ManualHeader
