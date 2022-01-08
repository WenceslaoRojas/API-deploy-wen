const { Router } = require("express");
const router = Router();
const { getUrl } = require("../../controllers/video-fire.js");
// este modulo inicializa firebase
const admin = require("./admin-firebase.js");
const { createdHistorial } = require("../../controllers/historial-created");
const { Post, User, Historial } = require("../../db");

router.get("/", async function (req, res) {
  const { name, username, roadMap } = req.query;
  if (!username && !roadMap)
    return res.status(404).send({
      message: `You must send by query "username" and "roadmap".`,
    });
  try {
    const foundUser = await User.findOne({
      where: { user: username },
    });
    if (foundUser.admin !== "usuario")
      return res
        .status(404)
        .send({ message: "The history is only for administrators" });
    const foundPost = await Post.findOne({
      where: { roadMap: roadMap },
    });
    if (!foundUser)
      return res.status(404).send({ message: `${roadMap} not found` });
    if (!foundPost)
      return res.status(404).send({ message: `${roadMap} not found` });
    const toDay = new Date().toISOString().slice(0, 19).replace("T", " ");
    // const foundUserByPk = await User.findByPk(foundUser.id);
    // const foundPostByPk = await Post.findByPk(foundPost.id);
    const historialCreated = await Historial.create({
      date: toDay,
    });

    await historialCreated.setUser(foundUser.id);
    await historialCreated.setPost(foundPost.id);
    let url = await getUrl(name, admin);
    if (url === 505) return res.status(506).send("Video not found in Firebase");
    res.send({ url });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .send({ error: err, message: "Error creating history" });
  }
});

module.exports = router;
