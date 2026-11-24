import 'dotenv/config';
import mongoose from 'mongoose';
import { kafkaClient } from './kafka-client.js';
import { Location } from './models/Location.js';

async function init() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Missing MONGO_URI in environment configuration');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const kafkaConsumer = kafkaClient.consumer({
      groupId: 'database-processor',
    });

    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({
      topics: ['location-updates'],
      fromBeginning: true,
    });

    await kafkaConsumer.run({
      eachMessage: async ({ message, heartbeat }) => {
        try {
          const data = JSON.parse(message.value.toString());

          await Location.create({
            userId: data.id,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: new Date(),
          });
        } catch (dbError) {
          if (dbError instanceof SyntaxError || dbError.name === 'ValidationError') {
            console.error('Skipped bad location record:', dbError.message);
          } else {
            throw dbError;
          }
        }

        await heartbeat();
      },
    });

    const shutdown = async () => {
      try {
        await kafkaConsumer.disconnect();
        await mongoose.disconnect();
        process.exit(0);
      } catch {
        process.exit(1);
      }
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Database processor initialization failed:', err.message);
    process.exit(1);
  }
}

init();
