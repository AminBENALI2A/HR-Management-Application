import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {

  const allowedOrigins = [
    "https://d1pc059cxwtfw0.cloudfront.net", // no trailing slash
    "http://localhost:3000",
    /\.cloudfront\.net$/,                    // wildcard for all CloudFront subdomains
  ].filter(Boolean);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 8080, '0.0.0.0');
  console.log(`Server running on http://0.0.0.0:${process.env.PORT || 8080}`);
}
bootstrap();
