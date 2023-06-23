const fs = require('fs');
const axios = require('axios')

const getJakartaTime = () =>{
  let today = new Date();
  let offset = 420;
  let jakartaTime = new Date(today.getTime() + offset * 60 * 1000);
  return jakartaTime
}

const splitCommand = (text) => {
  var text = text.split(' ')
  text.shift()
  return text.join(' ')
}

const splitCommandWithParam = (text) => {
  var text = text.split(' ')
  
  return {param: text[1], 
          prompt: text.slice(2).join(' ')
  }
}

const downloadImage = async (url) => {
  const result = {
    status: false,
    message: "",
    fileName: null,
  };

  try {
    // dapatkan gambar
    const image = await axios.get(url, {
      responseType: "arraybuffer",
    });
    // jika foldernya ga ada maka buatkan
    const mediaPath = "./downloaded-media";
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath);
    }
    // simpan gambar
    const fileName =
      new Date().getTime() + Math.random().toString(36).substring(7);
    const fullFileName = mediaPath + "/" + fileName + ".jpg";
    fs.writeFileSync(fullFileName, Buffer.from(image.data));

    result.fileName = fullFileName;
    result.status = true;
    return result;
  } catch (error) {
    result.message = "error : " + error;
    return result;
  }
};

module.exports = {
  getJakartaTime,
  splitCommand,
  splitCommandWithParam,
  downloadImage,
}