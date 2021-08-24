import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { resolve } from 'path'

import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Berry Is Gay')
    .setDescription('Display images of berry in his gayest form')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/swagger', app, document)

  app.useStaticAssets(resolve(__dirname, '../src', './public'))
  app.setBaseViewsDir(resolve(__dirname, '../src', './views'))
  app.setViewEngine('ejs')
  
  await app.listen(3000)
}

void bootstrap()
