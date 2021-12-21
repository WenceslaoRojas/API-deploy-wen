const axios = require("axios");
const Fs = require("fs");
const path = require("path");
let videoStitch = require("video-stitch").concat;
const { v4: uuidv4 } = require("uuid");

module.exports = {
  download: async function (url) {
    //Se verifica que las url enviadas al enpoint sean mayor a 0
    if (url.length) {
      let arrPromise = [];
      // se hace un arreglo de promesas para traer todos los buffer del server de JIMI
      arrPromise = url.map((el) =>
        axios({
          method: "GET",
          url: el,
          responseType: "stream",
        })
      );

      let results = await Promise.all(arrPromise);

      // se hace un rescorrido para crear los archivos
      //cada archivo dispara un evento lo cual se crea una promesa para no perder los eventos
      results = results.map((el, idx) => {
        //esta linea crea los archivos pero no se ejecuta hasta el promise All
        const file = el.data.pipe(
          Fs.createWriteStream(`./temp/output${idx}.mp4`)
        );

        return new Promise((resolve, reject) => {
          file.on("error", reject);
          file.on("finish", resolve);
        });
      });

      try {
        // ejecuta todos los eventos
        results = await Promise.all(results);
        return 200;
      } catch (err) {
        console.log(err);
        return 502;
      }
    } else {
      return 501;
    }
  },
  merge: async function (name, length) {
    //el merge ocupa un exe para unir los videos, en heroku se ocupa un paquete
    try {
      let videos = [];
      // let folder = "C:\\Users\\Trabajo\\Documents\\Practicas y Proyectos\\API_MGF_logistica\\temp\\"
      // let output = path.join(__dirname,"..","..","temp",`${name}.mp4`)

      // se crea un arreglo con las carecteristicas que requiere la libreria
      for (let i = 0; i < length; i++) {
        //esta linea crea una ruta absoluta que necesita la libreria para localizar el archivo
        //de lo contrario lo busca en una carpeta especial en el disco C
        let folder = path.join(__dirname, "..", "..", "temp", `output${i}.mp4`);

        videos.push({
          fileName: folder,
        });
      }

      //se llama a la libreria para hacer la funcion de unir videos
      // internamente ejecua el exe ffmpeg.exe
      let file = await videoStitch({
        ffmpeg_path: "",
        silent: false, // optional. if set to false, gives detailed output on console
        overwrite: true, // optional. by default, if file already exists, ffmpeg will ask for overwriting in console and that pause the process. if set to true, it will force overwriting. if set to false it will prevent overwriting.
      })
        .clips(videos)
        .output(`./temp/${name}.mp4`)
        .concat(); //output acepta una ruta relativa

      return 200;
    } catch (err) {
      console.log(err);
      return 503;
    }
  },
  upload: async function (name, admin) {
    // se accede al bucket(directorio google storage)
    const storageRef = admin.storage().bucket(`gs://mgflogisitica.appspot.com`);

    try {
      //se hace la subida de archivos de un directorio local a uno global
      await storageRef.upload(`./temp/${name}.mp4`, {
        public: true,
        destination: `videos/${name}.mp4`,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });

      //se accede a google storage para obtener la url
      let file = storageRef.file(`videos/${name}.mp4`);
      let url = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      return url;
    } catch (err) {
      console.log(err);
      return 504;
    }
  },
  deleteVideo: async function () {
    const directory = "temp";

    try {
      //se recorre la carpeta temp para borrar todo su contenido
      Fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          Fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      });
    } catch (err) {
      console.log(err);
      return 505;
    }
  },
  getUrl: async function (name, admin) {
    // se accede al bucket
    const storageRef = admin.storage().bucket(`gs://mgflogisitica.appspot.com`);

    try {
      //se accede a google storage atravez del nombre del video para obtener la url
      let file = storageRef.file(`videos/${name}.mp4`);
      let url = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      return url;
    } catch (err) {
      console.log(err);
      return 506;
    }
  },
};
