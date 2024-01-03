import { create } from 'kubo-rpc-client'
import fs from 'fs';

// connect to ipfs daemon API serverconst 
const ipfs = create('http://localhost:5001') ;

// 将本地文件（图片）上传到IPFS
export async function uploadFileToIPFS(filePath){
    try {
        const file = fs.readFileSync(filePath);
        const result = await ipfs.add({ path: filePath, content: file });
        return result;
    } catch (error) {
        console.error('Failed to add file to IPFS:', error);
    }
}

// 将文件相关的元数据以JSON形式上传到IPFS
export async function uploadJsonDataToIPFS(json){
    try {
        const result = await ipfs.add(JSON.stringify(json));
        return result;
    } catch (error) {
        console.error('Failed to add JSON to IPFS:', error);
    }
}
