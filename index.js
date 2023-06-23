const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth, MessageMedia, Buttons } = require('whatsapp-web.js');
// const { chatAIHandler } = require('./features/chat_GPT');
const { chatAIHandler } = require('./features/bard_api');
const { convertFotoToSticker } = require('./features/sticker');
const { imageGeneratorAIHandler } = require('./features/textToImage');
const { textToSpeechHandler, fakeVoiceTextToSpeechHandler } = require('./features/textToSpeech');
const { getJakartaTime } = require('./utilities')
const express = require('express')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//const dotenv = require('dotenv');
// dotenv.config();

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const app = express()

mongoose.set('strictQuery', true);

const menu = `ini yang bisa saya lakukan 👇

kirim foto = ngubah foto jadi sticker
kirim video maks 5 detik = jadiin sticker GIF

#ask_question = menjawab semua pertanyaan  
 ex : #ask buatkan format chat dengan dosen
 
#speech_text = convert text ke suara
 ex : #speech hai, udah makan belom

masih bingung cara makenya?
coba liat disini https://bit.ly/cara-pakai-whatsappbot
`

console.log('server started ...')
console.log(getJakartaTime().toString())

mongoose.connect(process.env['MONGGO_URL']).then(async() => {
  const { stdout: chromiumPath } = await exec("which chromium");

  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000
    }),
    // Hapus komentar dibawah jika ngejalanin di server // 
    puppeteer: {
      headless: true,
      // args: ['--no-sandbox', "--disable-setuid-sandbox"],
      args: ['--no-sandbox'],
      executablePath: chromiumPath.trim()
    }
  });
  
  client.on('message', async msg => {
    const text = msg.body.toLowerCase() || '';
    const chat = await msg.getChat()

    if (text === 'p') {
      chat.sendStateTyping()
      console.log(`${ msg._data.notifyName } | ${ msg.deviceType } cek status`)
      msg.reply('online 👌');

    } else if (text.includes("#ask")){
      chat.sendStateTyping()
      console.log(`${ msg._data.notifyName } | ${ msg.deviceType } AI Request`)
      await chatAIHandler(text, client, msg, MessageMedia)

    } else if (msg.hasMedia){
      try {
        console.log(`${ msg._data.notifyName } | ${ msg.deviceType } image to sticker`)
        convertFotoToSticker(client, msg, MessageMedia)
      } catch (error) {
        client.reply(msg.from, "gabisa dijadiin sticker 😔")
      }
      
    } else if (text.includes("#imagine")){
      console.log('Generate Image')
      await imageGeneratorAIHandler(text, client, msg, MessageMedia)   
    
    } else if (text.includes("#speech")){
      chat.sendStateRecording()
      console.log(`${ msg._data.notifyName } | ${ msg.deviceType } text to speech`) 
      await textToSpeechHandler(text, client, msg, MessageMedia)   
      
    } else if (text.includes("#fakespeech")){
      console.log(`${ msg._data.notifyName } fake text to speech`) 
      await fakeVoiceTextToSpeechHandler(text, client, msg, MessageMedia)   
      
    }else {
      chat.sendStateTyping()
      client.sendMessage(msg.from, menu)
      let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');
      client.sendMessage(msg.from, button);
    }

  });

  
  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('remote_session_saved', () => {
    console.log('Session saved remotely')
  })

  client.on('ready', () => {
    console.log('Client is ready!');
    const number = "+6282277396265";

    const text = "Server Started!";
    const chatId = number.substring(1) + "@c.us";
    client.sendMessage(chatId, text);

  });

  app.get('/', (req, res) => {
    res.send('Online👌');
  })

  app.listen(3000, () => console.log('app listening on port 3000'))
  client.initialize();
});
