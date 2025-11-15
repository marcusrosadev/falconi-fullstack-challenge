import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para o frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
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

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
  console.log(`📚 Documentação Swagger disponível em http://localhost:${port}/api`);
}
bootstrap();

