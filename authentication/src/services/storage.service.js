const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: "private_c9U6+Oh4631JrqVbNRZZ9VxBNLA=",
});

async function uploadFile(buffer) {
  const result = await imagekit.files.upload({
    file: await toFile(buffer, "image.jpg"),
    fileName: "image.jpg",
  });
  return result;
}

module.exports = uploadFile;
