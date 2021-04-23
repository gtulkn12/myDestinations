/**
 * ****************IMPORTS *********************************
 */
const express = require("express");
const cors = require("cors");
const { getUID, getPhoto } = require("./Services/lookup");

/**
 * *****************SET-UP SERVER ***************************
 */
const server = express();
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json()); //create a body property for the req.body
/**
 * *****************SET-UP PORT *******************************
 */
const PORT = process.env.PORT || 3000; //make our server listen on a port
server.listen(PORT, () => console.log("Server on"));

/**
 * *****************SET-UP DATABASE ***************************
 */
const { db } = require("./Database");

/**
 * *****************ROUTES ******************************
 */
/**
 * ***************** READ / GET ROUTES ********************************
 * READ / GET => db : READ
 */
server.get("/", (req, res) => {
  res.send(db);
});

/**
 * *****************CREATE / POST ROUTES ********************************
 * CREATE / POST => db : CREATE
 * expects{name, location, description?}
 * before we create a destination in our db, we will get a photo of that destination from
 *  unsplash
 */
server.post("/", async (req, res) => {
  let found = false;
  const { name, location, description } = req.body;

  if (!name || !location) return res.status(400).json({ error: "message" });
  const uid = getUID(); // generate a UID
  const photo = await getPhoto(name); //get picture from unsplash

  db.push({
    uid,
    name,
    photo,
    location,
    description: description || "",
  });

  res.send({ uid });
  console.log(db);

  //   console.log("post /");
  //   console.log(req.body);
});

/**
 * ***************** UPDATE / PUT ROUTES ********************************
 * UPDATE : PUT /?uid
 * expects{name. location, description?}
 */
server.put("/", async (req, res) => {
  const { uid } = req.query;

  if (!uid || uid.length !== 6)
    return res.status(400).json({ error: "uid is required" });
  found = true;

  const { name, location, description } = req.body;

  if (!name && !location & !description) {
    return res
      .status(400)
      .json({ error: "we need at least one property to update" });
  }

  for (let i = 0; i < db.length; i++) {
    const dest = db[i];

    if (dest.uid === uid) {
      dest.description = description ? description : dest.description;
      dest.location = location ? location : dest.location;

      if (name) {
        const photo = await getPhoto(name);
        dest.name = name;
        dest.photo = photo;
      }
      break;
    }
  }
  console.log(db);
  res.send({ sucess: "true" });
});

/**
 * ***************** DELETE ROUTES ********************************
 * //DELETE :DELETE /?uid
 */
server.delete("/", (req, res) => {
  let found = false;
  const { uid } = req.query;

  for (let i = 0; i < db.length; i++) {
    const dest = db[i];

    if (dest.uid === uid) {
      db.splice(i, 1);
      break;
    }
    if (found) return res.send({ status: "found and Deleted" });
    return res.send({ status: "not found" });
  }
  res.send(db);
});
