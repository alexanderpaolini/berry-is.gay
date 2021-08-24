import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { resolve } from 'path'

import { NestExpressApplication } from '@nestjs/platform-express'

import { config } from 'dotenv'
config()

const PORT = Number(process.env['PORT'] as string ?? 3000)
const BERRY = process.env['BERRY'] as 'GAY' | undefined

if (!PORT) throw new Error('PORT environment variable not provided')
if (BERRY !== 'GAY') throw new Error('BERRY environment variable not gay')

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
  
  await app.listen(PORT)
}

void bootstrap()
