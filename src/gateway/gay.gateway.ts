import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

import { MediaService } from '../services/media.service'

@WebSocketGateway({ path: '/ws', pingInterval: 45e3 })
export class GayGateway {
  @WebSocketServer()
  server: Server

  constructor (private readonly media: MediaService) { }

  currentIndex = 0
  gayArray = this.media.images
    .filter(e => e.type !== 'video')
    .map(e => e.fileName)

  get currentBerry () {
    return this.gayArray[this.currentIndex]
  }

  @SubscribeMessage('BERRY_UP')
  berryUp () {
    this.currentIndex++
    if (this.currentIndex > this.gayArray.length - 1) this.currentIndex = 0

    this.server.emit(
      'BERRY_CHANGE',
      this.currentBerry
    )
  }

  @SubscribeMessage('BERRY_DOWN')
  berryDown () {
    this.currentIndex--
    if (this.currentIndex < 0) this.currentIndex = this.gayArray.length - 1

    this.server.emit(
      'BERRY_CHANGE',
      this.currentBerry
    )
  }

  @SubscribeMessage('IDENTIFY')
  identify (
    @ConnectedSocket() socket: Socket
  ) {
    socket.emit(
      'BERRY_CHANGE',
      this.currentBerry
    )
  }
}
