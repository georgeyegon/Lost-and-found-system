const jsonServer = require('json-server');
const express = require('express');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use('/resources', express.static(path.join(__dirname, '../resources')));

server.use(middlewares);
server.use('/', router);

server.listen(process.env.PORT || 5000, () => {
  console.log('JSON Server is running');
});
