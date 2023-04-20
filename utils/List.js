import { ethers } from "ethers";
import { abi, basicNftabi, contractAddress } from "../constants/index";

export default async function List(nftMarketplace, nftAddress, tokenId, price) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Request access to the MetaMask account
  await window.ethereum.enable();
  // Get the signer's address
  const signerAddress = (await provider.listAccounts())[0];
  console.log(signerAddress);

  // Create an instance of the signer using the provider and signer's address
  const signer = provider.getSigner(signerAddress);
  console.log(signer);

  console.log("estoy trabajando en Listar");

  // Estimate the gas required for the transaction
  /*const basicNft = "0xAA9833b34E38cb997898F420a3838B32C6E544D2";
  const nftMarketplace = "0x690CE9f45E9301B9D1A63b580241Ffb71b337682";*/
  const contract = new ethers.Contract(nftMarketplace, abi, signer);
  console.log("estoy trabajando en listar 2");

  const tx = await contract.listItems(nftAddress, tokenId, price);
  console.log("estoy trabajando en listar 3");
  const receipt = await tx.wait();
  console.log("Nft listed saftely");
}
