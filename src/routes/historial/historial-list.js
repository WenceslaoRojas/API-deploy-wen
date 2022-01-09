const { Router } = require("express");
const router = Router();
const { Post, User, Historial } = require("../../db");

router.get("/", async function (req, res) {
  const { username } = req.query;
  try {
    const foundUser = await User.findOne({
      where: { user: username },
    });
    if (foundUser.admin === "usuario")
      return res
        .status(404)
        .send({ message: "The history is only for administrators" });
    const historial = await Historial.findAll({
      include: [{ model: User, attributes: { exclude: ["password"] } }, Post],
    });
    res.send({ message: historial });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err, message: "Error list history" });
  }
});

module.exports = router;
