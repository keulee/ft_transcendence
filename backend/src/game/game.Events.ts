import {
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard } from 'src/auth/guards/jwt.ws.guard';
import { IAuthService } from 'src/auth/services/auth/auth.interface';
import { UserService } from 'src/users/services/user/user.service';
import { Game, Status } from './interfaces/room';
import { QueueService } from './queue.service';
import { Logger } from '@nestjs/common';
import { dataCollectionPhase } from 'typeorm-model-generator/dist/src/Engine';

// @UseGuards(JwtWsGuard)
@WebSocketGateway({ cors: '*' })
export class GameEvents {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}
 
  private logger = new Logger('Gateway');

  @WebSocketServer()
  server: Server;

  queueNormal: QueueService = new QueueService();
  // game: GameService = new GameService();
  rooms: Map<string, Game> = new Map();
  roomList: string[];

  async handleConnection(client: Socket) {
    // const payload = await this.authService.verify(
    //   client.handshake.headers.accesstoken,
    // );
    // const user = await this.userService.getUserById(payload.id);
    // !user && client.disconnect();
    // client.data.user = user;
    this.logger.log('Lobby', client.id);
  }

  async handleDisConnection(client: Socket) {
    
    // Queue case 
    if (this.queueNormal.Players.indexOf(client) != -1)
      return this.queueNormal.Players.splice(this.queueNormal.Players.indexOf(client), 1);
    
    // InGame case
    for (const room of this.rooms.values())
      if (room.Players.indexOf(client) != -1)
        // game end 
        return room.Players.splice(room.Players.indexOf(client), 1)
    
    // Watcher case
    for (const room of this.rooms.values())
      if (room.Watchers.indexOf(client) != -1)
        return room.Watchers.splice(room.Watchers.indexOf(client), 1)
    this.logger.log('disconnection', client.id);
  }

  @SubscribeMessage('Queue')
  readyGame(@ConnectedSocket() client: any) {
    if (!this.queueNormal.addUser(client)) return;
    if (this.queueNormal.isFull()) this.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1])
  }

  createRoom(player1: Socket, palyer2: Socket) {

    console.log(player1.id, palyer2.id);
    player1.emit('createRoom', { isOwner: true });
    palyer2.emit('createRoom', { isOwner: false });
  }

  @SubscribeMessage('startGame')
  startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
      try {
        if (client.id === this.queueNormal.Players[0].id) {
        const game = new Game(this.queueNormal.Players, Status.READY, data.roomName, this.queueNormal.Players[0].id, data.speed, data.ballSize)
        // game.Players[0].join(data.roomName);
        // game.Players[1].join(data.roomName);
        this.queueNormal.Players.shift().join(data.roomName);
        this.queueNormal.Players.shift().join(data.roomName);
        this.queueNormal.size = 0;
        this.rooms.set(data.roomName, game);
        this.liveGame(data.roomName, game);
      }
     }
     catch{}
    }

  async liveGame(name:string, game: Game) {  
    await this.server.to(name).emit('enterGame', name);
  }
    
  @SubscribeMessage('room-list')
  handleRoomList() {
    try {
      for (const name of this.rooms.keys())
      this.roomList.push(name);
    return this.roomList;
    }
    catch{}
  }

  @SubscribeMessage('watchGame')
  watchGame(
    @ConnectedSocket() watcher: Socket, 
    @MessageBody() data:any) {
      if (!data.roomName)
        return ;
      for (const room of this.rooms.values())
         if (room.roomName === data.roomName) {
           watcher.join(data.roomName);
           room.Watchers.push(watcher);
           this.server.to(data.roomName).emit('watcher', data.roomName);
      }
  }
}


