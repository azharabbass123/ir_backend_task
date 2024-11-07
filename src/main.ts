import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const db = mongoose.connection;
  db.on('connected', () => {
    console.log('Connected to the database successfully');
  });
  db.on('error', (error) => {
    console.error('Error connecting to the database:', error);
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
