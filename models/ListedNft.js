import { Schema, model, models } from "mongoose";

const listedNftSchema = new Schema(
  {
    seller: String,
    nftAddress: String,
    tokenId: String,
    price: String,
    data: Object,
  },
  { timestamps: true }
);

//! Normalmente en Express creariamos el modelo solo con model. Pero en nextjs va corriendo este codigo tdo el rato
//! por eso si no usamos MODELS de mongoose, no podremos parar este error.
//! La lógica es decir, que primero checkee si hay un modelo llamado nft, y luego si no lo hay , que cree uno llamado Nft
let ListedNft;

try {
  ListedNft = model("ListedNft");
} catch (error) {
  // If it doesn't exist, create it
  ListedNft = model("ListedNft", listedNftSchema);
}

export default ListedNft;
