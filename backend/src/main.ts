import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {

  const allowedOrigins = [
      "https://d1pc059cxwtfw0.cloudfront.net/", // e.g., 'https://d1pc059cxwtfw0.cloudfront.net/'
      "http://localhost:3000",    // e.g., 'https://d123.cloudfront.net'
      /\.cloudfront\.net$/,          // Wildcard for all CloudFront subdomains
    ].filter(Boolean); // Remove undefined values

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, '0.0.0.0');
  console.log(`Server running on http://0.0.0.0:${process.env.PORT || 3000}`);
}
bootstrap();
