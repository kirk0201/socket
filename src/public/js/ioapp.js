const socket = io();
const welcome = document.querySelector("#welcome");
const nickForm = document.querySelector("#nickForm");
const msgForm = document.querySelector("#msgForm");
const roomForm = document.querySelector("#roomForm");
const room = document.querySelector("#room");
room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = document.querySelector("#msgForm input");
  const value = input.value;
  console.log(value, roomName);
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = document.querySelector("#nickForm input");
  const value = input.value;
  socket.emit("nickname", value);
}

roomForm.addEventListener("submit", handleRoomSubmit);

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  msgForm.addEventListener("submit", handleMessageSubmit);
  nickForm.addEventListener("submit", handleNicknameSubmit);
}
function handleRoomSubmit(e) {
  e.preventDefault();
  const input = document.querySelector("#roomForm input");
  roomName = input.value;
  console.log(roomName);
  socket.emit("enter_room", roomName, showRoom);
  input.value = "";
}

socket.on("welcome", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left!`);
});

socket.on("new_message", addMessage);
