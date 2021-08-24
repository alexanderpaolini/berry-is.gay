import { HttpException } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

import Images from '../links.json'

export interface Image {
  name: string
  aliases: string[]
  type: string
  width?: number
  height?: number
}

@Injectable()
export class ImagesService {
  public images: Image[] = Images 

  get notFound () {
    const e404 = this.getImage('404')

    if (!e404) throw new HttpException('Interval Server Error', HttpStatus.INTERNAL_SERVER_ERROR)

    return e404
  }

  get defaultImage () {
    const e404 = this.getImage('')

    if (!e404) throw new HttpException('Interval Server Error', HttpStatus.INTERNAL_SERVER_ERROR)

    return e404
  }

  public getImage (image: string) {
    return this.images.find(x =>
      x.name === image ||
      x.aliases.includes(image)
    )
  }
}
