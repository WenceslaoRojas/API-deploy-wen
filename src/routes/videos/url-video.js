const { Router } = require("express");
const { getUrl } = require("../../controllers/video-fire.js");
const router = Router();
// este modulo inicializa firebase
const admin = require("./admin-firebase.js");
const { createdHistorial } = require("../../controllers/historial-created");

router.get("/", async (req, res) => {
  const { name, username, roadMap } = req.query;
  try {
    //se trae el nombre por query y se trae la url del video
    await createdHistorial(username, roadMap);
    let url = await getUrl(name, admin);

    if (url === 505) return res.status(506).send("Video not found in Firebase");

    res.status(200).send({ url });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
