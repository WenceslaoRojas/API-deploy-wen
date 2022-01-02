const { Router } = require("express");
const router = Router();
const { User } = require("../../db.js");

router.put("/", async function (req, res) {
  const { username } = req.body;
  try {
    await User.update(
      { active: false },
      {
        where: {
          user: username,
        },
      }
    );
    res.status(200).send({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
