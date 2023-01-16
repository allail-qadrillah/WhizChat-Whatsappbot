const axios = require('axios')
const fs = require('fs');

const textToImageRequests = async (text) => {
  // tampung data
  const result = {
    'status': false,
    'message': '',
    'url': null
  }
  // requests body
  const data = {
    "key": process.env('TEXT_TO_IMAGE'),
    "prompt": text,
    "negative_prompt": "",
    "width": "1024",
    "height": "768",
    "samples": "1",
    "num_inference_steps": "20",
    "seed": null,
    "guidance_scale": 7.5,
    "webhook": null,
    "track_id": null
  }
  // request ke API
  return await axios.post('https://stablediffusionapi.com/api/v3/text2img', data)
    .then(response => {
      if (response.data.status == 'success') {
        result.status = true
        result.url = response.data.output[0]
      } else {
        result.status = false
      }
      return result
    })
    .catch(error => {
      result.message = error.message
    });
}

const downloadImage = async (url) => {
  const result = {
    'status': false,
    'message': '',
    'fileName': null
  }

  try {
    // dapatkan gambar
    const image = await axios.get(url, {
      'responseType': 'arraybuffer'
    });
    // jika foldernya ga ada maka buatkan
    const mediaPath = './downloaded-media'
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath)

    }
    // simpan gambar
    const fileName = new Date().getTime();
    const fullFileName = mediaPath + '/' + fileName + '.jpg'
    fs.writeFileSync(fullFileName, Buffer.from(image.data));

    result.fileName = fullFileName
    result.status = true
    return result


  } catch (error) {
    result.message = 'error : ' + error
    return result
  }
}

const imageGeneratorAIHandler = async (text, client, msg, MessageMedia) => {
  // Terima inputan Prompt dan hapus .imagine
  var text = text.split(' ')
  text.shift()
  prompt = text.join(' ')
  // reply suru tunggu bentar
  msg.reply(`generate image *${prompt}*...`);

  // generate gambar
  response = await textToImageRequests(prompt)
  // jika ada error maka kirimkan pesan error
  if (!response.status) {
    return client.sendMessage(msg.from, `can't imagine ${prompt}:(\nwith Error : ${response.message}`);
  }
  
  // Download gambar dan dapatkan nama file
  result = await downloadImage(response.url)
  if (!result.status) {
    return client.sendMessage(msg.from, `can't get image ${prompt}:(\nwith Error : ${result.message}`);
  }
  const imageData = fs.readFileSync(result.fileName).toString('base64');
  var media = await new MessageMedia("image/jpg", imageData, result.fileName)
  await client.sendMessage(msg.from, media, { caption: prompt })
  // hapus gambar biar hemat memory server
  fs.unlinkSync(result.fileName);
}

module.exports = {
  imageGeneratorAIHandler
}