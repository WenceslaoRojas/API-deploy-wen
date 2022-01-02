const { Router } = require("express");
const router = Router();
const { Post } = require("../../db.js");

router.get("/", async (req, res) => {
  try {
    let listPost = await Post.findAll();
let maxUser = await User.max('id', {where : {'totalReport': 342 }})


    const report = {
      totalReports: listPost.length,
    };
    return res.json(Licenses);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
