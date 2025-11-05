import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BotsService } from './bots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBotDto } from './dto/create-bot.dto';

@Controller('bots')
@UseGuards(JwtAuthGuard)
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  findAll(@Request() req) {
    return this.botsService.findAll(req.user.id);
  }

  @Post()
  create(@Request() req, @Body() createBotDto: CreateBotDto) {
    return this.botsService.create(req.user.id, createBotDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBotDto: Partial<CreateBotDto>) {
    return this.botsService.update(+id, updateBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botsService.remove(+id);
  }

  @Post(':id/test')
  testBot(@Param('id') id: string, @Body() testDto: any) {
    return this.botsService.testBot(+id, testDto);
  }
}

