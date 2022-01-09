const { Router } = require("express");
const { Op } = require("sequelize");
const router = Router();
const { Post, User, Driver, LicensePlate } = require("../../db.js");

router.get("/", async function (req, res) {
  const { username, admin } = req.query;
  try {
    if (admin === "true") {
      let allPostList = await Post.findAll({
        include: [
          { model: User, attributes: { exclude: ["password"] } },
          Driver,
          LicensePlate,
        ],
      });
      return res.send(allPostList);
    }
    const foundUser = await User.findOne({ where: { user: username } });
    let postList = await Post.findAll({
      include: [
        { model: User, attributes: { exclude: ["password"] } },
        Driver,
        LicensePlate,
      ],
      where: { userId: foundUser.id },
    });

    res.send(postList);
  } catch (err) {
    console.log(err);
    res.status(509).send({ error: err });
  }
});

module.exports = router;
