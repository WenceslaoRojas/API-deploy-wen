const { Router } = require("express");
const router = Router();
const { User } = require("../../db.js");

router.put("/", async function (req, res) {
  const { username } = req.body;
  try {
    let foundUSer = await User.findOne({
      where: {
        user: username,
      },
    });

    if (!foundUSer || !foundUSer.dataValues.active)
      return res
        .status(200)
        .json({ msg: "The driver does not exist in the database" });

    await foundUSer.update({ active: false });
    res.status(200).send({ msg: `User: ${username} deleted successfully` });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
