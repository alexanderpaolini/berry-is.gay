import { Controller, Get, HttpException, Param, HttpStatus, Res } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { Readable } from 'stream'
import { MediaService, Media, MediaType } from '../services/media.service'

@Controller('api')
export class ApiController {
  constructor (private images: MediaService) { }

  @Get('images/:image')
  @ApiResponse({ status: HttpStatus.OK, type: Media })
  getImage (@Param('image') imageName: string) {
    const image = this.images.getImage(imageName)

    if (!image) throw new HttpException('Berry Not Found', HttpStatus.NOT_FOUND)

    return image
  }

  @Get('cdn/:file_name')
  sendImage (
    @Param('file_name') imageName: string,
    @Res() res: Response
  ) {
    const image = this.images.getImage(imageName)

    if (!image) throw new HttpException('Berry Not Found', HttpStatus.NOT_FOUND)

    const buffer = this.images.buffers.get(image.fileName)

    if (!buffer) throw new HttpException('Missing Content', HttpStatus.PRECONDITION_FAILED)

    res.set({
      'Content-Type': image.type === MediaType.Video
        ? 'video/mp4'
        : image.type === MediaType.Gif
          ? 'image/gif'
          : 'image/png',
      'Content-Length': buffer.length
    })

    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    stream.pipe(res)
  }
}
