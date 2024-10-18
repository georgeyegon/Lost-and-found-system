const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const multer = require('multer');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../resources/images'))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

// Handle file uploads
server.post('/lostItems', upload.single('image'), (req, res, next) => {
    req.body.image = req.file.filename;
    next();
});

server.post('/foundItems', upload.single('image'), (req, res, next) => {
    req.body.image = req.file.filename;
    next();
});

// Serve static files
server.use('/resources', express.static(path.join(__dirname, '../resources')));

server.use(middlewares);
server.use('/', router);

server.listen(process.env.PORT || 5000, () => {
    console.log('JSON Server is running');
});
