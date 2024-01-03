import React,{useState,useRef} from "react";
import{useNavigate} from "react-router-dom";
import axios from "axios";
import "./App.css";

function UploadImage({ address }){
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
   
    const handleCancel = () =>{
        setTitle('');
        setDescription('');
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async (event) =>{
        event.preventDefault();

        if(fileInputRef.current.files.length === 0){
            alert("Please select a file");
            return;
        }
      

    const formData = new FormData();
    formData.append("file",fileInputRef.current.files[0]);
    formData.append("title",title);
    formData.append("description",description);
    formData.append("address",address);

    try{
        const response = await axios.post('http://127.0.0.1:3000/upload'
        ,formData,{
            Headers:{
                'Content-Type':'multipart/form-data'
            }
        });

    console.log('File uploade successfully',response.data);
    // navigate("/success")是一个导航操作，通常在前端应用程序中使用。
    // 它的意思是将用户导航到指定的URL路径，这里是"/success"。
    navigate('/success');
    }catch(error){
        console.error("File uploade error:",error);
    }
};

    return(
        <div className="upload-container">
            <h1>Upload images to IPFS and Mint NFT</h1>
            <form className="upload-form" onSubmit={handleUpload}>
                <label htmlFor="title">Title *</label>
                <input 
                type="text" 
                id="title" 
                placeholder="Enter image title"
                value={title}
                onChange={(e)=> setTitle(e.target.value)}
                required
                />

                <label htmlFor="description">Description</label>
                <textarea 
                id="description" 
                placeholder="Enter image description"
                value={description}
                onChange={(e)=> setDescription(e.target.value)}
                />

                <label htmlFor="file">Image File *</label>
                <input
                type="file"
                id="file"
                ref={fileInputRef}
                required
                />

                <div className="buttons">
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="upload-button" onClick={handleUpload}>
                        Upload
                    </button>
                </div>
            </form>
        
        </div>
    );
}

export default UploadImage;