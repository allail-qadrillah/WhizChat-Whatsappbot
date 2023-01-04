//https://github.dev/try-catch-dev/BotWhatsapp
const axios = require('axios')
const { OPENAI_API_KEY } = require('../config')

const chatGPTRequest = async (text) => {
  // tampung data
  const result = {
    'success': false,
    'message': '',
    'data': null
  }
  // request ke API
  return await axios({
    method: 'post',
    url: 'https://api.openai.com/v1/completions',
    data: {
      "model": "text-davinci-003",
      "prompt": text,
      "max_tokens": 1000,
      "temperature": 0
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    }
  })// terima response dan kembalikan kedalam result
    .then((response) => {
      if (response.status == 200) {
        result.success = true;
        result.data = response.data?.choices?.[0]?.text || "tak tau"

      } else {
        result.success = false
      }

      return result
    })// tangkap error dan kembalikan kedalam result
      .catch((error) => {
        result.message = "Error : " + error.message
        return result
      })

}

const chatAIHandler = async (text, client, msg) => {
  const response = await chatGPTRequest(text)

  if (!response.success) {
    return client.sendMessage(msg.from, response.message);
  }

  return client.sendMessage(msg.from, response.data);
}

module.exports = {
  chatAIHandler
}
