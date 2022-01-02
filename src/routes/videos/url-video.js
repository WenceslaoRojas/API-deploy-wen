const { Router } = require("express");
const { getUrl } = require("../../controllers/video-fire.js");
const router = Router();
// este modulo inicializa firebase
const admin = require("./admin-firebase.js");

router.get("/", async (req, res) => {
  const { name } = req.query;
  //se trae el nombre por query y se trae la url del video
  let url = await getUrl(name, admin);

  if (url === 505) return res.status(506).send("Video not found in Firebas");

  res.status(200).send({ url });
});

module.exports = router;
