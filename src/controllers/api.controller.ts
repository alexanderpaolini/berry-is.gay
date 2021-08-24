import { Controller, Get, HttpException, Param, HttpStatus } from '@nestjs/common'
import { ImagesService, Image } from '../services/images.service'

@Controller('api')
export class ApiController {
  constructor (private images: ImagesService) { }

  @Get('images/:image')
  getImage (@Param('image') imageName: string): Image {
    const image = this.images.getImage(imageName)

    if (!image) throw new HttpException('Berry Not Found', HttpStatus.NOT_FOUND)

    return image
  }
}
