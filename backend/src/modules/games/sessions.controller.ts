import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':id')
  getSession(@Request() req, @Param('id') id: string) {
    return this.gamesService.getSession(+id, req.user.id);
  }
}
