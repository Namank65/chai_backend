import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
   
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
      if(!localFilePath) return "File did't uploded";
  
      const responce = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      })
    
      console.log("File is Uploded Successfully on Cloudinary", responce.url);
      // fs.unlinkSync(localFilePath)
      return responce;

    } catch (error) {
      
      fs.unlinkSync(localFilePath) // removes the locally saved temporary file as the uplode opration got failed
      
    }
}

export {uploadCloudinary}