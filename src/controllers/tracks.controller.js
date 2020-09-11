const multer = require('multer');
const { getConnection } = require('../database');
const { GridFSBucket, ObjectID } = require('mongodb');
const { Readable } = require('stream');

const getTrack = (req, res) => {
    let idCancion;
    try{
        idCancion = new ObjectID(req.params.trackId);
    }catch(error){
        return res.status(400).json({message:'Id no válido'});
    }

    res.set('content-type','audio/mp3');
    res.set('accept-ranges','bytes');

    const db = getConnection();
    const bucket = new GridFSBucket(db,{
        bucketName: 'Canciones'
    });

    let downloadStream = bucket.openDownloadStream(idCancion);
    downloadStream.on('data',chunk=>{
        res.write(chunk);
    });

    downloadStream.on('error',()=>{
        res.sendStatus(404);
    });

    downloadStream.on('end',()=>{
        res.end();
    });
};

const uploadTrack = (req, res) => {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage,
        limits: {
            fields: 3,
            files: 1,
            parts: 4
        }
    });
    upload.single('track')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err.message });
        } else if (!req.body.nombre) {
            return res.status(400).json({ message: 'La cancion no tiene el nombre' });
        } else if (!req.body.genero) {
            return res.status(400).json({ message: 'La cancion no tiene género' });
        } else if (!req.body.artista) {
            return res.status(400).json({ message: 'La cancion no tiene artista' });
        }

        let nombreTrack = req.body.nombre;

        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);

        const db = getConnection();
        const bucket = new GridFSBucket(db, {
            bucketName: 'Canciones'
        });

        let uploadStream = bucket.openUploadStream(nombreTrack);
        const id = uploadStream.id;
        readableTrackStream.pipe(uploadStream);

        uploadStream.on('error', () => {
            return res.status(500).json({ message: 'Error subiendo el archivo' });
        });

        uploadStream.on('finish', () => {
            return res.status(201).json({ message: 'Archivo subido correctamente,almacendado con el id:' + id });
        });
    });

};

module.exports = {
    getTrack,
    uploadTrack
}