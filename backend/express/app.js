import express from 'express';
// const express = require('express')和这个代码一样
// 导入中间件包
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { uploadFileToIPFS } from './IPFSUploader.js';
import { uploadJsonDataToIPFS } from './IPFSUploader.js';
import { mint } from './NFT-miner.js';
// 跨域
import cors from 'cors';


// 通过调用express()函数，我们创建了一个Express应用程序的实例，并将其赋值给变量app。
const app = express();
// 设置模板引擎
app.set('view engine', 'ejs');

// 设置中间件
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(fileUpload({}));
// 设置跨域以便正常前后端发送数据
app.use(cors());

// 设置路由实现
// 具体来说，res.render("home")会将名为"home"的视图模板渲染为HTML，
// 并将其作为响应发送给客户端。这里使用的视图模板引擎是根据之前设置的默认引擎（如EJS）来解析和渲染模板。
app.get('/', (req, res) => {
  res.render("home");
})

// 处理上传的文件
app.post('/upload', (req, res) => {
  const title = req.body.title;
  const description = req.body.description;//这里的body.属性必须要与前端相对应
  // 写完前端后，就可以从前端获取用户的钱包地址，以便后面mint给这个地址
  const address =  req.body.address;

  // 获取文件信息，根据打印出的file信息编写
  const file = req.files.file;
  const filename = file.name;
  const filepath = "files/" + filename;

  console.log(title, description, address)

  // 先将用户上传到文件保存到本地
  file.mv(filepath, async (err) => {
    if (err) {
      console.log('error: failed to download the file.');
      res.status(500).send(err);
    }
    // 将本地的文件上传给IPFS，然后将返回的结果（包含一个CID）记录下来
    const fileResult = await uploadFileToIPFS(filepath);
    // 获取CID
    const fileCID = fileResult.cid.toString();
    const imageURL = 'http://127.0.0.1:8080/ipfs/' + fileCID + '/'+filename;
    // 封装一个metadata：
    const metadata = {
      title:title,
      description:description,
      imageURL:imageURL
    }
    // 将metadata上传到IPFS
    const metadataResult = await uploadJsonDataToIPFS(metadata);
    const metadataCID = metadataResult.cid.toString();
    console.log('Metadata added to IPFS:',metadataCID); 
    console.log('imgURL:'+imageURL);

    // 将用户发送的文件（图片）上链，也就是mint
    const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    await mint(userAddress,"http://127.0.0.1:8080/ipfs/"+metadataCID);

    console.log('imgURL:'+imageURL);

    // 给用户返回一个上传后的成功页面
    res.json(
      {
        message: "file upload success!",
        metadata:metadata
      }
    )
  })

});

app.listen(3000, () => {
  console.log('app is listening on port 3000!')
});