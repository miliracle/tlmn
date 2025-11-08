import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { SessionsController } from './sessions.controller';
import { GamesService } from './games.service';

@Module({
  controllers: [GamesController, SessionsController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
