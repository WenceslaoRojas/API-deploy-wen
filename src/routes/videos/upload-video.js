const { Router } = require("express");
const {
  download,
  merge,
  upload,
  deleteVideo,
} = require("../../controllers/video-fire");
const { sendMail } = require("../../controllers/email.js");
const router = Router();
// este modulo inicializa firebase
const admin = require("./admin-firebase.js");

router.post("/", async (req, res) => {
  const { video, name } = req.body;

  try {
    //Se descargan los videos desde el servidor de Jimi
    
    let flag = await download(video);
    if (flag === 501)
      return res.status(501).send({ err: "No urls were obtained" });
    else if (flag === 502)
      return res.status(502).send({ err: "Download failed" });

    //Una vez descargado se hace merge de los videos
    flag = await merge(name, video.length);

    //si hay error se eliminan los videos descargados
    if (flag === 503) {
      await deleteVideo();
      return res.status(503).send({ err: "Video merge failure" });
    }

    //Se suben los videos a Firebase(Google cloud) y se trae la url del video
    let url = await upload(name, admin);

    if (url === 504) {
      await deleteVideo();
      return res.status(504).send({ err: "Firebase upload failed" });
    }

    // se borran los videos para no ocupar espacio en el servidor
    flag = await deleteVideo();

    if (flag === 505)
      return res
        .status(505)
        .send({ err: "File uploaded. File deletion failed" });

    res.send({ msg: "video upload successfully", url });
  } catch (err) {
    console.log(err);
    return res.status(509).send({"msg":"error",err});
  }
});

module.exports = router;
