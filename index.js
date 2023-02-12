const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js');
const { chatAIHandler } = require('./features/chat_GPT');
const { convertFotoToSticker } = require('./features/sticker');
const { imageGeneratorAIHandler } = require('./features/textToImage');
const { textToSpeechHandler } = require('./features/textToSpeech');
const { getJakartaTime } = require('./utilities')
//const dotenv = require('dotenv');
const express = require('express')

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const app = express()

mongoose.set('strictQuery', true);
// dotenv.config();

const menu = `ini yang bisa saya lakukan 👇

kirim foto = mengubah foto jadi sticker

#ask_question = menjawab semua pertanyaan 
 ex : #ask buatkan format chat dosen
 
#speech_text = convert text ke suara
 ex : #speech hai, udah makan belom

masi bingung cara makenya?
coba liat disini https://bit.ly/cara-pakai-whatsappbot
`

console.log('server started ...')
console.log(getJakartaTime().toString())

mongoose.connect(process.env['MONGGO_URL']).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000
    }),
    // Hapus komentar dibawah jika ngejalanin di server // 
    puppeteer: {
      args: ['--no-sandbox']
    }
  });

  client.on('message', async msg => {
    const text = msg.body.toLowerCase() || '';

    if (text === 'p') {
      console.log(`${ msg.from } cek status`)
      msg.reply('online 👌');

    } else if (text.includes("#ask")){
      console.log(`${ msg.from } GPT Handler`)
      await chatAIHandler(text, client, msg)

    } else if (msg.hasMedia){
      console.log(`${ msg.from } image to sticker`)
      convertFotoToSticker(client, msg, MessageMedia)
      
    } else if (text.includes("#imagine")){
      console.log('Generate Image')
      await imageGeneratorAIHandler(text, client, msg, MessageMedia)   
    
    } else if (text.includes("#speech")){
      console.log(`${ msg.from } text to speech`) 
      await textToSpeechHandler(text, client, msg, MessageMedia)   
      
    }else {
      client.sendMessage(msg.from, menu)
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
    console.log('status 200')     
    res.send('Online👌');
  })

  app.listen(3000, () => console.log('app listening on port 3000'))
  client.initialize();
});
