const axios = require('axios')
const { downloadImage } = require('../utilities')
const fs = require("fs");

const bardRequest = async (text) => {
  // tampung data
  const result = {
    'success': false,
    'message': '',
    'data': null
  }
  // request ke API
  return await axios.get("https://bardapii.qadrillahstorag.repl.co/answer", { params: { text } })
                .then(response => {
                  result.data = response.data;
                  result.success = true;
                  return result
                })
                .catch(error => {
                  result.message = error;
                  result.success = false;
                  return result
                })
}

const groupChatAIHandler = async (text, client, msg, MessageMedia) => {
  var text = text.split(' ')
  text.shift()
  prompt = text.join(' ')
    
  const response = await await bardRequest(prompt)
  if (!response.success) {
    return client.sendMessage(msg.from, response.message);
  }

  client.sendMessage(msg.from, response.data.content);
  
  try {
    // download images
  if (response.data.images) {
    
    for (let index = 0; index < response.data.images.length; index++) {
      if (index == 3) { break }
      
      const image = await Promise.race([
        downloadImage(response.data.images[index]),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Timeout: Download image took too long"));
          }, 3000); // Timeout set to 5 seconds (5000 milliseconds)
        }),
      ]).catch((error) => {
        console.error(error.message);
        return client.sendMessage(msg.from, "Download image took too long");
      });

      if (image) {
        const imageData = fs.readFileSync(image.fileName).toString('base64');
        var media = await new MessageMedia("image/jpg", imageData, image.fileName)
        console.log("sending image")
        await client.sendMessage(msg.from, media) 
        // hapus gambar biar hemat memory server
        fs.unlinkSync(image.fileName); 
      }
    }
  }
} catch (error) {
  client.sendMessage(msg.from, "cant send image 😔");
}
  return;
}
const personalChatAIHandler = async (text, client, msg, MessageMedia) => {
  var text = text.split(' ')
  text.shift()
  prompt = text.join(' ')
    
  const response = await await bardRequest(prompt)
  if (!response.success) {
    return client.sendMessage(msg.from, response.message);
  }

  client.sendMessage(msg.from, response.data.content);
  
  try {
    // download images
  if (response.data.images) {
    
    for (let index = 0; index < response.data.images.length; index++) {
      if (index == 3) { break }
      
      const image = await Promise.race([
        downloadImage(response.data.images[index]),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Timeout: Download image took too long"));
          }, 3000); // Timeout set to 5 seconds (5000 milliseconds)
        }),
      ]).catch((error) => {
        console.error(error.message);
        return client.sendMessage(msg.from, "Download image took too long");
      });

      if (image) {
        const imageData = fs.readFileSync(image.fileName).toString('base64');
        var media = await new MessageMedia("image/jpg", imageData, image.fileName)
        console.log("sending image")
        await client.sendMessage(msg.from, media) 
        // hapus gambar biar hemat memory server
        fs.unlinkSync(image.fileName); 
      }
    }
  }
} catch (error) {
  client.sendMessage(msg.from, "cant send image 😔");
}
  return;
}

module.exports = {
  groupChatAIHandler,
  personalChatAIHandler
}
