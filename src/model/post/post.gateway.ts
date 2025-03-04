import { OnEvent } from '@nestjs/event-emitter';
import { PostService } from './post.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class PostGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly postService: PostService) {}

  async sendUpdatedPosts() {
    const posts = await this.postService.findPosts();
    this.server.emit('AllPosts', posts);
  }

  async handleConnection(client: Socket) {
    await this.sendUpdatedPosts();
  }

  @SubscribeMessage('getAllPosts')
  async handleGetAllPosts(client: Socket) {
    const posts = await this.postService.findPosts();
    client.emit('AllPosts', posts);
  }

  @OnEvent('post.updated')
  async handlePostUpdate() {
    await this.sendUpdatedPosts();
  }
}
