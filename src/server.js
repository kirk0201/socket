import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
console.log("hello");
app.get("/", (req, res) => res.render("iohome"));

// app.listen(3000);
const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
  socket["nickname"] = "Anon";

  socket.onAny((e) => {
    console.log(`Socket Event: ${e}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    console.log(msg, room, done);
    socket.to(room).emit("new_message", `${socket.nickname}:${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// const wss = new WebSocket.Server({ server });
// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   console.log("Connected to Browser");
//   socket.on("message", (message) => {
//      const json = JSON.parse(message)
//     console.log("Brwoser로 메시지를 보냈습니다. :", json);
//     sockets.forEach((aSocket) => aSocket.send(json));
//   });
// });

server.listen(3000);
