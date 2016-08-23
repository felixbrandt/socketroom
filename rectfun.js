var http = require("http");
var fs = require("fs");

var Player = require("./player");
var game = { "players": {} };

const speed = 2;

var index = fs.readFileSync("public/rect.html");

var app = http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(index);
});

var io = require("socket.io").listen(app);


setInterval(main, 1000/60);

function main() {
    for (var player in game.players) {
        var p = game.players[player];

        if (p.keys.up) {
            p.y -= speed;
        }
        if (p.keys.down) {
            p.y += speed;
        }
        if (p.keys.left) {
            p.x -= speed;
        }
        if (p.keys.right) {
            p.x += speed;
        }
    }

    io.emit("update", game.players);
}

io.on("connection", function(socket) {
    console.log(socket.id+" connected");

    game.players[socket.id] =
        new Player(
            50+Math.floor(Math.random()*700), // x
            50+Math.floor(Math.random()*500), // y
            20,                               // size
            Math.floor(Math.random()*255),    // r
            Math.floor(Math.random()*255),    // g
            Math.floor(Math.random()*255)     // b
        );
    game.players[socket.id].id = socket.id;

    socket.on("documentLoaded", function() {
        io.emit("update", game.players);
    });

    socket.on("presskey", function(direction) {
        game.players[socket.id].keys[direction] = true;
    });

    socket.on("releasekey", function(direction) {
        game.players[socket.id].keys[direction] = false;
    });

    socket.on('disconnect', function(){
        console.log(socket.id+" disconnected");
        // delete player key
        delete game.players[socket.id];
        io.emit("update", game.players);
    });
});

app.listen(8080);
console.log('\x1b[32mServer is now listening at port 8080\x1b[0m'); // Change color to green and then back to normal
