const { Router } = require("express");
const router = Router();
const { Post, LicensePlate, Driver, User } = require("../../db.js");

router.get("/", async (req, res) => {
  const { admin } = req.query;
  try {
    if (admin !== "true" || !admin)
      return res.send({ err: "Only available to listeners or administrators" });
    const listPost = await Post.findAll();
    const maxUser = await User.max("totalReports", { where: { active: true } });
    const maxDriver = await Driver.max("totalReports", {
      where: { active: true },
    });
    const maxLicense = await LicensePlate.max("totalReports", {
      where: { active: true },
    });
    const userOfMax = await User.findOne({ where: { totalReports: maxUser } });
    const driverOfMax = await Driver.findOne({
      where: { totalReports: maxDriver },
    });
    const licenseOfMax = await LicensePlate.findOne({
      where: { totalReports: maxLicense },
    });

    const report = {
      totalReports: listPost.length,
      driver: driverOfMax.name,
      user: userOfMax.user,
      license: licenseOfMax.name,
    };
    return res.send(report);
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err });
  }
});

module.exports = router;
