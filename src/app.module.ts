import { Module } from '@nestjs/common'
import { ApiController } from './controllers/api.controller'
import { ImagesController } from './controllers/images.controller'
import { ImagesService } from './services/images.service'

@Module({
  imports: [],
  controllers: [ApiController, ImagesController],
  providers: [ImagesService]
})
export class AppModule { }
