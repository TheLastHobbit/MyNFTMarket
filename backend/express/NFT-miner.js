import { ethers,JsonRpcProvider } from "ethers";
import fs from 'fs';

export async function mint(to,Tokenuri){
    const provider = new JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const abi = JSON.parse(fs.readFileSync("./abis/MyNFT.json"));
    const contract = new ethers.Contract(contractAddress,abi,signer);
    const result = await contract.safeMint(to,Tokenuri);
    console.log(result.hash);
}
