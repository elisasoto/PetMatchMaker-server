const fs = require('fs');
const cloudinary = require('cloudinary').v2;

async function uploadToCloudinaryUser(filePath) {
  let file;

  try {
    file = await cloudinary.uploader.upload(filePath, {
      folder: 'petMatchMaker-user'
    });
  } catch (err) {
    console.log('Error uploading to Cloudinary', err.message);
  }
  fs.unlinkSync(filePath);

  return file;
}

async function uploadToCloudinaryPet(filePath) {
  let file;

  try {
    file = await cloudinary.uploader.upload(filePath, {
      folder: 'petMatchMaker-pet'
    });
  } catch (err) {
    console.log('Error uploading to Cloudinary', err.message);
  }
  fs.unlinkSync(filePath);

  return file;
}

module.exports = {
  uploadToCloudinaryUser,
  uploadToCloudinaryPet
};
