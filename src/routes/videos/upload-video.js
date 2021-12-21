const { Router } = require("express");
const {
  download,
  merge,
  upload,
  deleteVideo,
} = require("../../controllers/video");
const { sendMail } = require("../../controllers/email.js");
const router = Router();
// este modulo inicializa firebase
const admin = require("./admin-firebase.js");

router.post("/", async (req, res) => {
  const { video, name } = req.body;

  //Se descargan los videos desde el servidor de Jimi
  let flag = await download(video);
  if (flag === 501)
    return res.status(501).send({ err: "No se obtuvieron url" });
  else if (flag === 502)
    return res.status(501).send({ err: "Error en la descarga" });

  //Una vez descargado se hace merge de los videos
  flag = await merge(name, video.length);

  //si hay error se eliminan los videos descargados
  if (flag === 503) {
    await deleteVideo();
    return res.status(501).send({ err: "Fallo en la union de videos" });
  }

  //Se suben los videos a Firebase(Google cloud) y se trae la url del video
  let url = await upload(name, admin);

  if (url === 504) {
    await deleteVideo();
    return res.status(501).send({ err: "Fallo en subida a fireba" });
  }

  // se borran los videos para no ocupar espacio en el servidor
  flag = await deleteVideo();

  if (flag === 505)
    return res
      .status(501)
      .send({ err: "Archivo subido Fallo en borrado de archivos" });

  res.send({ msg: "Se completo con exito", url });
});

module.exports = router;
