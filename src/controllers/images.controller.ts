import { Controller, Get, HttpStatus, Param, Redirect, Render } from '@nestjs/common'
import { MediaService } from '../services/media.service'

@Controller('/')
export class ImagesController {
  constructor (private images: MediaService) { }

  @Get(['/', '/list'])
  @Render('list')
  getList () {
    return {
      image: this.images.defaultImage,
      images: this.images.images
    }
  }

  @Get('/source')
  @Redirect('https://github.com/Million900o/berry-is.gay', HttpStatus.PERMANENT_REDIRECT)
  getSource () { }

  @Get('/:image')
  @Render('image')
  getImage (@Param('image') imageName: string) {
    const image = this.images.getImage(imageName) ??
      this.images.notFound

    return { image: image }
  }
}
