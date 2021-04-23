const axios = require("axios");

if (!process.env.PORT) {
  require("../Secrets");
}

function getUID() {
  let UID = "";
  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * 10);
    UID += rand;
  }
  return UID;
}

async function getPhoto(name) {
  const API = `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_API_KEY}&page=1&query=${name}`;
  const res = await axios.get(API);
  const photos = res.data.results;
  const defaultPhoto =
    "https://image.shutterstock.com/image-photo/black-steel-large-anchor-chain-260nw-1081708619.jpg";

  if (photos.length === 0) return defaultPhoto;

  const photosLength = photos.length;
  const randIdx = Math.floor(Math.random() * photosLength);

  return res.data.results[randIdx].urls.small;
}

module.exports = {
  getUID,
  getPhoto,
};
