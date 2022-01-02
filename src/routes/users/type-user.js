const { Router } = require("express");
const router = Router();
const { User } = require("../../db.js");

router.get("/", async function (req, res) {
  try {
    let instanceUser = await User.findOne({
      where: {
        user: req.body.user,
      },
    });

    if (instanceUser !== null)
      res
        .status(200)
        .send({ name: instanceUser.name, type: instanceUser.admin });
    else res.status(500).send({ msg: "user not found" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
