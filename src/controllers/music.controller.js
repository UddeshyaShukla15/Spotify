const musicModel = require("../models/music.model.js");
const {uploadFile} = require("../services/storage.service.js");
const jwt = require("jsonwebtoken");

async function createMusic(req, res){

    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist"){
            return res.status(403).json({
                message: "You dont have access to create a music"
            })
        }
    
    

    const {title} = req.body;
    const file = req.file;

    const reult = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
        uri: reult.url,
        title,
        artist: decoded.id
    })

    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    })
}
    catch(err){

        console.log(err);
        
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

module.exports = {createMusic};