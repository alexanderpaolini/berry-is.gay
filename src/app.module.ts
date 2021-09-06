import { Module } from '@nestjs/common'

import { ApiController } from './controllers/api.controller'
import { ImagesController } from './controllers/images.controller'

import { MediaService } from './services/media.service'

import { GayGateway } from './gateway/gay.gateway'

@Module({
  imports: [],
  controllers: [ApiController, ImagesController],
  providers: [
    MediaService,

    GayGateway
  ]
})
export class AppModule { }
