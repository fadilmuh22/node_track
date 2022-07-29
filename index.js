const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: '*' } });
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

const PORT = process.env.PORT || 3700;

io.on("connection", (socket) => {
  socket.on('track-order', (data) => {
    socket.join(data.orderid);
  });

  socket.on("position-change", (data) => {
    socket.broadcast.to(data.orderid).emit("position-change", data);
  });

  socket.on('confirm-order', (data) => {
    io.to(data.orderid).emit('confirm-order', data);
  });

});

app.get('/ping', (req, res) => {
  res.json({'data': 'pong'});
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
