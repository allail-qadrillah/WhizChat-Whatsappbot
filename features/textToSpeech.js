const axios = require('axios')
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

const textToSpeech = async (text) => {
  const result = {
    'status' : false,
    'message': '',
    'path': '',
  }

  return await axios.get('https://tts-api.qadrillahstorag.repl.co/speak?text=halo', {
    responseType : 'stream'
  }).then( (response) => {
    response.data.pipe(fs.createWriteStream('temp.mp3'))
  }).catch( (error) => {
    console.log(error)
  })

}

const main = async () => {
  const text = 'Halo Dunia'
  const result = await textToSpeech(text)
}
// main()
const textToSpeechHandler = async (msg, MessageMedia) => {
  const media = MessageMedia.fromFilePath("temp.mp3")
  await client.sendMessage(msg.from, media)
}