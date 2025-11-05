import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BotsModule } from './modules/bots/bots.module';
import { TablesModule } from './modules/tables/tables.module';
import { GamesModule } from './modules/games/games.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BotsModule,
    TablesModule,
    GamesModule,
    WebSocketModule,
  ],
})
export class AppModule {}

