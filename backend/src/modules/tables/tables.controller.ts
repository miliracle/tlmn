import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateTableDto } from './dto/create-table.dto';

@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Request() req, @Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(req.user.id, createTableDto);
  }

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(+id);
  }

  @Post(':id/join')
  join(@Request() req, @Param('id') id: string) {
    return this.tablesService.join(req.user.id, +id);
  }

  @Delete(':id/leave')
  leave(@Request() req, @Param('id') id: string) {
    return this.tablesService.leave(req.user.id, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(+id);
  }

  @UseGuards(AdminGuard)
  @Delete(':id/force')
  forceRemove(@Request() req, @Param('id') id: string) {
    return this.tablesService.forceRemove(+id);
  }
}
