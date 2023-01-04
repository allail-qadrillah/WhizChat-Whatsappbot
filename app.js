const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js');

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const { chatAIHandler } = require('./features/chat_GPT');
const { convertFotoToSticker } = require('./features/sticker');
// mongoose.set('strictQuery', true);

// Load the session data
mongoose.connect("mongodb+srv://allail:qadrillahsabikha@cluster0.yap4x3d.mongodb.net/?retryWrites=true&w=majority").then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000
    }),
    // Hapus komentar ini jika ngejalanin di server //
    // puppeteer: {
    //   headless: false,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox']
    // }
  });

  client.on('message', async msg => {
    const text = msg.body.toLowerCase() || '';

    //check status
    if (text === 'status') {
      msg.reply('OKE!');

    } else if (text){
      // handle chat ai
      console.log("ai handler requests")
      await chatAIHandler(text, client, msg)

    } else if (msg.hasMedia){
      // handle foto lalu ubah jadi sticker
      console.log("convert foto to sticker handler")
      convertFotoToSticker(client, msg, MessageMedia)
    }

  });

  // Handle login process
  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('remote_session_saved', () => {
    console.log('Session saved remotely')
  })

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.initialize();
});