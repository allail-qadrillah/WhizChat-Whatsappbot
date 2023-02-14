const axios = require('axios')
const fs = require('fs');
const { splitCommand, splitCommandWithParam } = require('../utilities')

// TEXT TO SPEECH GOOGLE VOICE 
const textToSpeech = async (text, pathVoice) => {
  const result = {
    'status': false,
    'message': '',
  }

  return await axios.get(`https://tts-api.qadrillahstorag.repl.co/speak?text=${text}`, {
    responseType: 'stream'
  }).then(async (response) => {
    await new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(`${pathVoice}.mp3`))
      response.data.on('end', resolve)
      response.data.on('error', reject)
    })
    result.status = true
    return result

  }).catch((error) => {
    result.message = error
    return result
  })

}

const textToSpeechHandler = async (text, client, msg, MessageMedia) => {
  const pathVoice = msg.from
  const response = await textToSpeech(splitCommand(text), pathVoice)

  if (!response.status) {
    return client.sendMessage(msg.from, response.message)
  }

  setTimeout(() => {

    try {
      const media = MessageMedia.fromFilePath(`${pathVoice}.mp3`)
      console.log(media)
      client.sendMessage(msg.from, media)

    } catch (error) {
      client.sendMessage(msg.from, "gagal mengubah teks jadi sticker 😢")
      client.sendMessage(msg.from, "silahkan coba lagi ✨")
    }
  }, 3000)


  // return fs.unlinkSync(`${pathVoice}.mp3`); 
}

// TEXT TO SPEECH DEEP VOICE
const fakeVoiceTextToSpeech = async (text, person, pathVoice) => {
  const result = {
    'status': false,
    'message': '',
  }

  return await axios.get(`https://tts-fake-voice-api.qadrillahstorag.repl.co/speak?text=${text}&person=${person}`, {
    responseType: 'stream'
  }).then(async (response) => {
    await new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(`${pathVoice}.mp3`))
      response.data.on('end', resolve)
      response.data.on('error', reject)
    })
    result.status = true
    return result

  }).catch((error) => {
    result.message = error
    return result
  })
}

const fakeVoiceTextToSpeechHandler = async (text, client, msg, MessageMedia) => {
  // const pathVoice = `./downloaded-media/${msg.from}`
  const pathVoice = msg.from
  const command = splitCommandWithParam(text)
  const response = await fakeVoiceTextToSpeech(command.prompt, command.param, pathVoice)

  if (!response.status) {
    return client.sendMessage(msg.from, response.message)
  }

  setTimeout(() => {
    try {
      const media = MessageMedia.fromFilePath(`${pathVoice}.mp3`)
      client.sendMessage(msg.from, media, { sendMediaAsDocument: false })

    } catch (error) {
      client.sendMessage(msg.from, "gagal mengubah teks jadi suara 😢")
      client.sendMessage(msg.from, "silahkan coba lagi ✨")
      console.log(error)
    }
  }, 5000)

  // return fs.unlinkSync(`${pathVoice}.mp3`); 
}

module.exports = {
  textToSpeechHandler,
  fakeVoiceTextToSpeechHandler
}
