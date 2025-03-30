import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable JSON & URL Encoded Body Parsing
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Enable CORS if needed
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
