const { Router } = require("express");
const router = Router();
const { User } = require("../../db.js");

router.put("/", async function (req, res) {
  try {
    await User.update(
      { active: false },
      {
        where: {
          user: req.body.username,
        },
      }
    );
    res.status(200).send({ msg: "Usuario eliminado con éxito" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
