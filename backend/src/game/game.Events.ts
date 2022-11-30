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
import { GameService } from './game.service';
import { Game, GameDTO } from './interfaces/room';
import { QueueService } from './queue.service';

// @UseGuards(JwtWsGuard)
@WebSocketGateway({ cors: '*' })
export class GameEvents {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private authService: IAuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  queueNormal: QueueService = new QueueService();
  game: GameService = new GameService();
  rooms: Map<string, Game> = new Map();

  async handleConnection(client: Socket) {
    // const payload = await this.authService.verify(
    //   client.handshake.headers.accesstoken,
    // );
    // const user = await this.userService.getUserById(payload.id);
    // !user && client.disconnect();
    // client.data.user = user;
    console.log('Lobby', client.id);
  }

  handleDisConnection(clinet: Socket) {
    console.log(`Client Disconnected: ${clinet.id}`);
  }

  @SubscribeMessage('Queue')
  readyGame(@ConnectedSocket() client: any) {
    if (!this.queueNormal.addUser(client)) return;
    if (this.queueNormal.isFull()) this.createRoom(this.queueNormal.Players[0], this.queueNormal.Players[1])
  }

  createRoom(player1: Socket, palyer2: Socket) {

    console.log(player1, palyer2);
    player1.emit('createRoom', { isOwner: true });
    palyer2.emit('createRoom');
    console.log('is okkkkkkkkkkkkkk');
  }

  @SubscribeMessage('startGame')
  startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
      if (client.id === this.queueNormal.Players[0].id) {
      let game: Game = new Game(this.queueNormal.Players[0], this.queueNormal.Players[1]);
      game.game.Players[0].join(data.roomName);
      game.game.Players[1].join(data.roomName);
      this.rooms.set(data.roomName, game);
      console.log('ok');
      this.queueNormal.Players.shift();
      this.queueNormal.Players.shift();
      this.queueNormal.clear();
    }
  }
    
}
