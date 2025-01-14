const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pika = require('amqplib');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const port = 8000;
const rabbitmqHost = "rabbitmq";



async function connectToRabbitMQ() {
    try {
      const connection = await pika.connect(`amqp://${rabbitmqHost}`);
      const channel = await connection.createChannel();
       await channel.assertQueue('dashboard_queue');
      return channel;

    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        throw error;
    }
}

async function consumeMessages(io) {
    let rabbitmqChannel = null;
    try {
        rabbitmqChannel = await connectToRabbitMQ();
      if(rabbitmqChannel != null){
          rabbitmqChannel.consume('dashboard_queue', (msg) => {
            if (msg) {
                io.emit('message', msg.content.toString());
            }

        }, {
            noAck: true
        });
         console.log('Dashboard Service waiting for RabbitMQ Messages...');
      } else {
         console.log("Dashboard Service dont receive messages cause connection problems...")
      }


    } catch (error) {
       console.log(error);
    }

}




app.get('/', (req, res) => {
    res.send("Dashboard");
})



io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
    });
});

server.listen(port, () => {
  console.log('Dashboard service listening on port:' + port);
});

consumeMessages(io);