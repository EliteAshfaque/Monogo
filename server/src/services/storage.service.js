const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(buffer, fileName = "file") {
  const result = await imagekit.files.upload({
    file: await toFile(buffer, fileName),
    fileName,
  });
  return result;
}

module.exports = uploadFile;
