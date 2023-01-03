const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth } = require('whatsapp-web.js');

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);

// Load the session data
mongoose.connect("mongodb+srv://allail:qadrillahsabikha@cluster0.yap4x3d.mongodb.net/?retryWrites=true&w=majority").then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000
    })
  });

  client.on('message', async msg => {
  const text = msg.body.toLowerCase() || '';

  //check status
  if (text === 'hai') {
    msg.reply('tuan');
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

// puppeteer: {
//   headless: false,
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
// }