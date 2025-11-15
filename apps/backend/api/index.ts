import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import type { Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const express = require('express');

let cachedApp: any;

async function createApp(): Promise<any> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Habilitar CORS para o frontend (desenvolvimento e produção)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://falconi-fullstack-challenge-fronten.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configurar Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Falconi - API de Gerenciamento de Usuários')
    .setDescription('API RESTful para gerenciamento de usuários e perfis')
    .setVersion('1.0')
    .addTag('users', 'Operações relacionadas a usuários')
    .addTag('profiles', 'Operações relacionadas a perfis')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

export default async function handler(req: Request, res: Response) {
  const app = await createApp();
  app(req, res);
}

