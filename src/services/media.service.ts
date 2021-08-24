import { HttpException } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import Aliases from '../aliases.json'

import fs from 'fs'
import path from 'path'

export enum MediaType {
  Video = 'video',
  Gif = 'gif',
  Image = 'image'
}

export class Media {
  @ApiProperty({
    description: 'Name of the image',
    example: 'berry'
  })
  name: string

  @ApiProperty({
    description: 'Aliases for the image',
    example: ['me']
  })
  aliases?: string[]

  @ApiProperty({
    description: 'File name of the image',
    example: 'berry'
  })
  fileName: string

  @ApiProperty({
    description: 'Type of image or video',
    example: MediaType.Image
  })
  type: MediaType

  @ApiProperty({
    description: 'Width of the video',
    example: 800
  })
  width?: number

  @ApiProperty({
    description: 'Height of the video',
    example: 800
  })
  height?: number
}

@Injectable()
export class MediaService {
  public images: Media[] = []
  public buffers: Map<string, Buffer> = new Map()

  constructor () {
    const files = fs.readdirSync(path.resolve(__dirname, '../../src', 'media'))

    files.forEach(fileName => {
      const name = fileName
        .split('.')
        .slice(0, -1) // remove extension
        .join('.')

      this.images.push({
        aliases: Aliases[name],
        fileName,
        type: fileName.endsWith('.mp4')
          ? MediaType.Video
          : fileName.endsWith('.gif')
            ? MediaType.Gif
            : MediaType.Image,
        name
      })

      const file = fs.readFileSync(path.resolve(__dirname, '../../src', 'media', fileName))

      this.buffers.set(fileName, file)
    })
  }

  get notFound () {
    const e404 = this.getImage('404')

    if (!e404) throw new HttpException('Interval Server Error', HttpStatus.INTERNAL_SERVER_ERROR)

    return e404
  }

  get defaultImage () {
    const def = this.getImage('berry')

    if (!def) throw new HttpException('Interval Server Error', HttpStatus.INTERNAL_SERVER_ERROR)

    return def
  }

  public getImage (image: string) {
    return this.images.find(x =>
      x.name === image ||
      x.fileName === image ||
      x.aliases?.includes(image)
    )
  }
}
