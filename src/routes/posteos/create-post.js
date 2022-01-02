const { Router } = require("express");
const { sendMail } = require("../../controllers/email.js");
const { User, LicensePlate, Post, Driver } = require("../../db.js");
const router = Router();

router.post("/", async (req, res) => {
  const {
    username,
    date,
    roadMap,
    origin,
    destination,
    departureTime,
    arrivalTime,
    licensePlate,
    driver,
    operator,
  } = req.body;
  if (
    !username ||
    !date ||
    !roadMap ||
    !origin ||
    !destination ||
    !departureTime ||
    !arrivalTime ||
    !licensePlate ||
    !driver ||
    !operator
  )
    return res.status(200).send({ msg: "faltan campos por rellenar" });
  try {
    const foundUser = await User.findOne({
      where: { user: username },
    });

    const foundDriver = await Driver.findOne({
      where: { name: driver },
    });
    const foundLicense = await LicensePlate.findOne({
      where: { name: licensePlate },
    });
    if (!foundUser)
      return res.status(404).send({ msg: `${username} not found` });
    if (!foundLicense)
      return res.status(404).send({ msg: `${licensePlate} not found` });
    if (!foundDriver)
      return res.status(404).send({ msg: `${driver} not found` });

    const postCreated = await Post.create({
      date: date,
      roadMap: roadMap,
      origin: origin,
      destination: destination,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      author: operator,
    });
    /*------------------------------------ Set ForeignKey ------------------------------------*/
    const foundUserByPk = await User.findByPk(foundUser.id);
    const foundDriverByPk = await Driver.findByPk(foundDriver.id);
    const foundLicenseByPk = await LicensePlate.findByPk(foundLicense.id);
    await postCreated.setUser(foundUserByPk);
    await postCreated.setDriver(foundDriverByPk);
    await postCreated.setLicensePlate(foundLicenseByPk);
    /*------------------------------------ Set ForeignKey ------------------------------------*/
    /*------------------------------------ Set Historial ------------------------------------*/
    await foundUser.update({
      totalReports: foundUser.totalReports + 1,
    });
    await foundDriver.update({
      totalReports: foundUser.totalReports + 1,
    });
    await foundLicense.update({
      totalReports: foundUser.totalReports + 1,
    });
    /*------------------------------------ Set Historial ------------------------------------*/
    res.status(201).json({
      msg: "Post Was successfully created",
    });
  } catch (err) {
    res.status(404).send({ err: err });
  }
});

module.exports = router;
