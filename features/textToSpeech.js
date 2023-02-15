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
  // const pathVoice = msg.from
  const pathVoice = `./downloaded-media/${msg.from}`
  
  const response = await textToSpeech(splitCommand(text), pathVoice)

  if (!response.status) {
    return client.sendMessage(msg.from, response.message)
  }

  setTimeout(() => {

    try {
      const media = MessageMedia.fromFilePath(`${pathVoice}.mp3`)
      client.sendMessage(msg.from, media, { sendAudioAsVoice: true })
      return fs.unlinkSync(`${pathVoice}.mp3`); 
      
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
  // const pathVoice = msg.from
  // const command = splitCommandWithParam(text)
  // const response = await fakeVoiceTextToSpeech(command.prompt, command.param, pathVoice)

  // if (!response.status) {
  //   return client.sendMessage(msg.from, response.message)
  // }

  // const media = await MessageMedia.fromFilePath("6282277396265@c.us.mp3")
  // console.log(media)

  const mediaFile = fs.readFileSync('./6282277396265@c.us.mp3');
  const mediaFileBase64 = mediaFile.toString('base64');
  media = new MessageMedia(
    'audio/mp3',
    mediaFileBase64,
    '6282277396265@c.us.mp3'
);
  await client.sendMessage(msg.from, media, { sendAudioAsVoice: false } )
  // setTimeout(() => {
  //   try {
  //     // const media = MessageMedia.fromFilePath(`${pathVoice}.mp3`)
  //     console.log("mengirimkan audio")
  //     console.log("audio terkirim")

  //   } catch (error) {
  //     client.sendMessage(msg.from, "gagal mengubah teks jadi suara 😢")
  //     client.sendMessage(msg.from, "silahkan coba lagi ✨")
  //     console.log(error)
  //   }
  // }, 5000)
  // console.log("selesai")
  // return fs.unlinkSync(`${pathVoice}.mp3`); 
}


// const fakeVoiceTextToSpeechHandler = async (text, client, msg, MessageMedia) => {
//   // const pathVoice = `./downloaded-media/${msg.from}`
//   const pathVoice = msg.from
//   const command = splitCommandWithParam(text)
//   const response = await fakeVoiceTextToSpeech(command.prompt, command.param, pathVoice)

//   if (!response.status) {
//     return client.sendMessage(msg.from, response.message)
//   }

//   setTimeout(() => {
//     try {
//       const media = MessageMedia.fromFilePath(`${pathVoice}.mp3`)
//       console.log(media)
//       client.sendMessage(msg.from, media, { sendAudioAsVoice: true } )

//     } catch (error) {
//       client.sendMessage(msg.from, "gagal mengubah teks jadi suara 😢")
//       client.sendMessage(msg.from, "silahkan coba lagi ✨")
//       console.log(error)
//       throw error  // tambahkan baris ini untuk melemparkan error ke luar fungsi
//     } finally {
//       // fs.unlinkSync(`${pathVoice}.mp3`)
      
//     }
//   }, 5000)
// }



module.exports = {
  textToSpeechHandler,
  fakeVoiceTextToSpeechHandler
}
