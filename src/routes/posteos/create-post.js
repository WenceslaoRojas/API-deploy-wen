const { Router } = require("express");
const { sendMail } = require("../../controllers/email.js");
const { User, LicensePlate, Post, Driver } = require("../../db.js");
const router = Router();
const moment = require("moment");
const { getCoords } = require("../../controllers/coord-truck");

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
    return res.status(200).send({ msg: "Missing fields to fill" });
  try {
    const foundPost = await Post.findOne({ where: { roadMap: roadMap } });
    if (foundPost)
      return res.send({
        msg: `The roadmap number ${roadMap} already exists and must be unique.`,
      });
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
      coordDepartureTime: await getCoords(
        departureTime,
        moment(departureTime).add(1, "m").format("YYYY-MM-DD HH:mm:SS")
      ),
      coordArrivalTime: await getCoords(
        arrivalTime,
        moment(arrivalTime).add(1, "m").format("YYYY-MM-DD HH:mm:SS")
      ),
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
      totalReports: foundDriver.totalReports + 1,
    });
    await foundLicense.update({
      totalReports: foundLicense.totalReports + 1,
    });
    /*------------------------------------ Set Historial ------------------------------------*/
    /*------------------------------------ Send Email ------------------------------------*/

    try {
      // envío mail confirmación
      let respMail = await sendMail(
        foundUser.email,
        `Nuevo reporte creado - MGF Logística`,
        `¡Hola ${foundUser.user}! Lo invitamos a revisar en la web https://mgflogistica.netlify.app/ porque se creo un nuevo reporte sobre la hoja de ruta ${roadMap}.`
      );
      return res.status(201).send({
        msg: "Post Was successfully created",
        email: respMail,
        post: postCreated,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send({ err: "Post Created, Failed to send email", post: postCreated });
    }

    /*------------------------------------ Send Email ------------------------------------*/
  } catch (err) {
    console.log(err);
    res.status(404).send({ err: err });
  }
});

module.exports = router;
