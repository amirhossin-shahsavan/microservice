const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid'); 

async function sendMessage() {
    try {
        const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'; 
        const connection = await amqp.connect(rabbitMqUrl);
        const channel = await connection.createChannel();

        const queue = 'messages_queue';
        await channel.assertQueue(queue, { durable: true });

        setInterval(() => {
            const message = {
                id: uuidv4(), 
                value: Math.random() < 0.5 
            };

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            console.log('Message sent:', message);
        }, 2000); 
    } catch (error) {
        console.error('Error:', error);
    }
}

sendMessage();
