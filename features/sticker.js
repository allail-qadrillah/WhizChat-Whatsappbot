const mime = require('mime-types')
const fs = require('fs');

const convertFotoToSticker = (client, msg, MessageMedia) => {
  msg.downloadMedia().then(media => {
    if (media) {

      const mediaPath = './downloaded-media'
      if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath)

      }
      // buat nama dan tipe file
      const exstension = mime.extension(media.mimetype);
      const fileName = new Date().getTime();
      const fullFileName = mediaPath + '/' + fileName + '.' + exstension;

      try {
        // download gambar jadi sticker
        fs.writeFileSync(fullFileName, media.data, { encoding: 'base64' });
        MessageMedia.fromFilePath(filePath = fullFileName);
        // kirim sticker
        client.sendMessage(msg['_data']['from'], new MessageMedia(media.mimetype, media.data, fileName),
          { sendMediaAsSticker: true, stickerAuthor: "Created by Bot", stickerName: "Stickers" });
        // hapus gambar biar hemat memory server
        fs.unlinkSync(fullFileName); 

      } catch (err) {
        msg.reply('tidak dapat mengubahnya jadi sticker :"');
        console.log("Failed Downloaded File", err);
      }
    }
  })
}

module.exports = {
  convertFotoToSticker
}