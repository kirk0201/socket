const ul = document.querySelector("ul");

const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
  console.log("서버로부터 메시지를 받았습니다 : ", message);
  const li = document.createElement("li");
  li.style.listStyle = "none";
  li.innerText = message.data;
  ul.appendChild(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected to Server");
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#message input");
  console.log(input.value);
  socket.send(makeMessage("new_msg", input.value));
  input.value = "";
});

nickForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
});
