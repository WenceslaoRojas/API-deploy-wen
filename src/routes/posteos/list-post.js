const { Router } = require("express");
const router = Router();
const { Post, User, Driver, LicensePlate } = require("../../db.js");

router.get("/", async function (req, res) {
  const { user, admin } = req.query;
  try {
    if (admin === true) {
      let posts = await Post.findAll({ include: [User, Driver, LicensePlate] });
      return res.json(posts);
    }
    let postsUser = await Post.findAll({
      where: { user: user },
      include: [User, Driver, LicensePlate],
    });
    return res.json(postsUser);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
