var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), 
    fs = require('fs'),
    todolist = [];  // liste des taches partagée par tous les utilisateurs

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'un utilisateur se connecte, on lui envoie la todolist
    socket.on('new_user', function() {
        console.log("new user !");
        socket.emit('new_list', todolist);
    });

    // Dès qu'on reçoit un ajout de tache, on l'ajoute à la todolist et on renvoie la nouvelle liste aux autres utilisateurs
    socket.on('add_task', function (task) {
        task = ent.encode(task);
        todolist.push(task)
        socket.broadcast.emit('new_list', todolist);
    }); 

    // Dès qu'on reçoit une suppression de tache, on l'enlève à la todolist et on renvoie la nouvelle liste aux autres utilisateurs
    socket.on('delete_task', function (taskid) {
        todolist.splice(taskid, 1)
        socket.broadcast.emit('new_list', todolist);
    }); 
});

server.listen(8080);