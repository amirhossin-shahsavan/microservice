const amqp = require('amqplib');
const mongoose = require('mongoose');
const RedisDB = require('../redisconfig');
const MessageModel = require("./model/data.model");


async function connectMongoDB() {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://mongodb:27017/monitoring_db'; 
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

async function receiveMessage() {
    const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'; 
    try {
        const connection = await amqp.connect(rabbitMqUrl);
        const channel = await connection.createChannel();
        const queue = 'messages_queue';
        await channel.assertQueue(queue, {
            durable: true
        });

        console.log('Waiting for messages...');
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                console.log('Received message:', message);

                if (message.value === true) {
                    await RedisDB.set(message.id, JSON.stringify(message.value));
                    console.log(`Saved to Redis: ${message.id}`);
                }

                const newMessage = new MessageModel({
                    id: message.id,
                    value: message.value
                });
                try {
                    await newMessage.save();
                    console.log(`Saved to MongoDB: ${message.id}`);
                } catch (err) {
                    console.error('Error saving to MongoDB:', err);
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error receiving message:', error);
    }
}

(async () => {
    await connectMongoDB();
    await receiveMessage();
})();