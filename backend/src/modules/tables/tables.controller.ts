import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Request() req, @Body() createTableDto: any) {
    return this.tablesService.create(req.user.id, createTableDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Post(':id/join')
  join(@Request() req, @Param('id') id: string) {
    return this.tablesService.join(req.user.id, id);
  }

  @Delete(':id/leave')
  leave(@Request() req, @Param('id') id: string) {
    return this.tablesService.leave(req.user.id, id);
  }
}

