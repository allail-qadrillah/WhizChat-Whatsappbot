
const getJakartaTime = () =>{
  let today = new Date();
  let offset = 420;
  let jakartaTime = new Date(today.getTime() + offset * 60 * 1000);
  return jakartaTime
}

const splitCommand = (text) => {
  var text = text.split(' ')
  text.shift()
  return text.join(' ')
}


module.exports = {
  getJakartaTime,
  splitCommand
}