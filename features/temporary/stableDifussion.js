const fs = require('fs');
const axios = require('axios')

// terima url gambar yang sudah diinput prompt dan nama file
const downloadImage = async (url) => {

  const result = {
    'status' : false,
    'message' : '',
    'fileName' : null
  }

  try {
    // dapatkan gambar
    const image = await axios.get(url, {
      'responseType' : 'arraybuffer'
    });
    // jika foldernya ga ada maka buatkan
    const mediaPath = './downloaded-media'
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath)

    }
    // simpan gambar
    const fileName = new Date().getTime();
    const fullFileName = mediaPath + '/' + fileName + '.jpg'
    fs.writeFileSync(fullFileName, Buffer.from(image.data));

    result.fileName = fullFileName
    result.status = true
    return result


  } catch (error) {
    result.message = 'error : ' + error
    return result
  }
}

const imageGeneratorAIHandler = async (text, client, msg, MessageMedia) => {
  // Terima inputan Prompt dan hapus .imagine
  var text = text.split(' ')
  text.shift()
  prompt = text.join(' ')
  
  // suru tunggu bentar
  client.sendMessage(msg.from, `generate gambar *${prompt}*...`);
  
  // Kirimkan gambar ke user
  try{  // Download gambar dan dapatkan nama file
    result = await downloadImage(`https://dalle-mini.amasad.repl.co/gen/${prompt}`)
    // jika ada error maka kirimkan pesan error
    if (!result.status){
      return client.sendMessage(msg.from, result.message);
    }
    // ubah gambar kedalam bentuk base64 lalu kirimkan pake caption prompt
    const imageData = fs.readFileSync(result.fileName).toString('base64');
    var media = await new MessageMedia("image/jpg", imageData, result.fileName)
    await client.sendMessage(msg.from, media, {caption: prompt}) 
    // hapus gambar biar hemat memory server
    fs.unlinkSync(result.fileName); 
    
  } catch(err) {
    msg.reply(`cant imagine image ${prompt} :(`);
    console.log("Problemmmms : ", err);
  }
  // hapus gambar

}

module.exports = {
  imageGeneratorAIHandler
}

