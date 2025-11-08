import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';

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
  findOne(@Request() req, @Param('id') id: string) {
    return this.botsService.findOne(+id, req.user.id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
    return this.botsService.update(+id, req.user.id, updateBotDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.botsService.remove(+id, req.user.id);
  }

  @Post(':id/test')
  testBot(@Request() req, @Param('id') id: string, @Body() testDto: any) {
    return this.botsService.testBot(+id, req.user.id, testDto);
  }
}
