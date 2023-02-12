const axios = require('axios')
const fs = require('fs');
const { splitCommand } = require('../utilities')

const textToSpeech = async (text, pathVoice) => {
  const result = {
    'status' : false,
    'message': '',
  }
  
  return await axios.get(`https://tts-api.qadrillahstorag.repl.co/speak?text=${text}`, {
    responseType : 'stream'
  }).then( async (response) => {
    await new Promise( (resolve, reject) => {
      response.data.pipe(fs.createWriteStream(`${pathVoice}.mp3`))
      response.data.on('end', resolve)
      response.data.on('error', reject)
    })
    result.status = true
    return result
    
  }).catch( (error) => {
    result.message = error
    return result
  })

}

const textToSpeechHandler = async (text, client, msg, MessageMedia) => {
  const pathVoice = msg.from
  const response = await textToSpeech(splitCommand(text), pathVoice)

  if (!response.status){
    return client.sendMessage(msg.from, response.message)
  }

  try {
    const media = await MessageMedia.fromFilePath(`${pathVoice}.mp3`)
    await client.sendMessage(msg.from, media)
    return fs.unlinkSync(`${pathVoice}.mp3`); 
    
  } catch (error) {
    client.sendMessage(msg.from, "gagal mengubah teks jadi sticker 😢")
    client.sendMessage(msg.from, "silahkan coba lagi ✨")
  }

   
}

module.exports = {
  textToSpeechHandler
}
