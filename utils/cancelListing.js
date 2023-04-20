import { ethers } from "ethers";
import { abi } from "../constants/index";

export default async function cancelListing(nftAddress, tokenId) {
  /*const provider = new ethers.providers.WebSocketProvider(
    "wss://eth-sepolia.g.alchemy.com/v2/pDnsHSqJomhXLGvW0BD406tousjSDigY"
  );*/
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Request access to the MetaMask account
  await window.ethereum.enable();
  // Get the signer's address
  const signerAddress = (await provider.listAccounts())[0];
  console.log(signerAddress);

  // Create an instance of the signer using the provider and signer's address
  const signer = provider.getSigner(signerAddress);
  console.log(signer);

  console.log("estoy trabajando en cancelar listing");
  const contractAddress = "0x690CE9f45E9301B9D1A63b580241Ffb71b337682";
  // Estimate the gas required for the transaction

  const contract = new ethers.Contract(contractAddress, abi, signer);
  console.log("estoy trabajando en cancelar listing 2");

  const tx = await contract.cancelListing(nftAddress, tokenId);
  console.log("estoy trabajando en cancelar listing 3");

  const receipt = await tx.wait();
  console.log("Nft cancelled by you", receipt);
}
