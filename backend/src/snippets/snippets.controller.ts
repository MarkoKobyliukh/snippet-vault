import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { QuerySnippetDto } from './dto/query-snippet.dto';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  create(@Body() dto: CreateSnippetDto) {
    return this.snippetsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QuerySnippetDto) {
    return this.snippetsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSnippetDto) {
    return this.snippetsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.snippetsService.remove(id);
  }
}
