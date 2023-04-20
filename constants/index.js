//Este fichero lo creamos solo para importar el abi.json y contractAddresses.json aqui, y luego exportarlo de una .

const abi = require("./abi.json");
const contractAddress = require("./contractAddresses.json");
const basicNftabi = require("./basicNftabi.json");

module.exports = { abi, contractAddress, basicNftabi };
