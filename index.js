import 'dotenv/config';
import http from 'node:http';

import express from 'express';
import { Server } from 'socket.io';

import { kafkaClient } from './kafka-client.js';

async function main() {
    const PORT = process.env.PORT || 8000;
    const app = express();
    const server = http.createServer(app);
    const io = new Server();

    io.attach(server);


    const kafkaProducer = kafkaClient.producer();
    await kafkaProducer.connect();

    const kafkaConsumer = kafkaClient.consumer({
        groupId: `socket-server-${PORT}`,
    });
    await kafkaConsumer.connect();

    await kafkaConsumer.subscribe({
        topics: ['location-updates'],
        fromBeginning: false,
    });

    await kafkaConsumer.run({
        eachMessage: async ({ message, heartbeat }) => {
            let data;
            try {
                data = JSON.parse(message.value);
            } catch {
                console.error("KafkaConsumer: skipped invalid message");
                return;
            }
            console.log("KafkaConsumer Data Received:", data);
            io.emit("server:location:update", data);
            await heartbeat();
        },
    });

    io.on("connection", (socket) => {
        console.log(`[Socket:${socket.id}]: Connected Success...`);

        socket.on("client:location:update", async (locationData) => {
            const { latitude, longitude } = locationData ?? {};

            if (
                !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
                !Number.isFinite(longitude) || longitude < -180 || longitude > 180
            ) {
                return;
            }

            console.log(
                `[Socket:${socket.id}]:client:location:update:`,
                locationData
            );

            try {
                await kafkaProducer.send({
                    topic: 'location-updates',
                    messages: [
                        {
                            key: socket.id,
                            value: JSON.stringify({ id: socket.id, latitude, longitude }),
                        },
                    ],
                });
            } catch (err) {
                console.error(`[Socket:${socket.id}]: could not send to Kafka:`, err.message);
            }
        });

        socket.on("disconnect", () => {
            io.emit("server:location:remove", socket.id);
        });
    });

    app.use(express.json());
    app.use(express.static("public"));

    app.get("/health", (_req, res) => {
        res.json({ status: "Welcome to Tracely", healthy: true, message: "Server is running perfectly" });
    });

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
}

main().catch((err) => {
    console.error("Tracely failed to start:", err.message);
    process.exit(1);
});
