const express = require('express');
const bodyParser = require('body-parser');
const pika = require('amqplib');

const app = express();
const port = 8069;
const rabbitmqHost = 'rabbitmq';

app.use(bodyParser.json());


async function connectToRabbitMQ() {
    try {
        const connection = await pika.connect(`amqp://${rabbitmqHost}`);
        const channel = await connection.createChannel();
        await channel.assertQueue('iot_queue');
        return channel;

    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        throw error;
    }
}


app.post('/iot', async (req, res) => {
   let rabbitmqChannel = null;
   try {
        rabbitmqChannel = await connectToRabbitMQ();
    if (rabbitmqChannel != null) {
         const message = JSON.stringify(req.body);
          rabbitmqChannel.sendToQueue('iot_queue', Buffer.from(message));
          res.status(200).send("Data sent to RabbitMQ");
         console.log('Data sent to RabbitMQ from Iot Endpoint:',message);
      } else {
        console.log("Fail to conect with RabbitMQ from Iot Endpoint...")
      }
    } catch(error) {
        console.log(error)
        res.status(500).send('Failed to send data.');
    }

});

app.listen(port, () => {
    console.log('IoT service listening on port:'+ port);
});