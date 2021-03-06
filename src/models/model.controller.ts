import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SaveFile } from '../helpers/decorators';

let componentOptions = {
  filePath: 'public',
  fileKey: 'image',
} as any;

@Controller('categories')
export class ModelController {
  service;
  settings = {} as any;
  constructor(service: any, settings: any) {
    this.service = service;
    componentOptions = { ...settings };
  }

  @Post()
  @SaveFile(componentOptions.fileKey, componentOptions.filePath)
  async create(@Body() payload: any, @UploadedFile() file?) {
    try {
      if (file) {
        payload.image = {
          ...file,
          url: `${process.env.server_url}/${file.path}`,
        };
      }
      return await this.service.create(payload);
    } catch (e) {
      console.log(e);
    }
  }

  @Get()
  async findAll(@Query() query): Promise<Pagination<any>> {
    return this.service.findAll(query);
  }

  @Get(':id/edit')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Get('list')
  list() {
    return this.service.list();
  }

  @Patch(':id')
  @SaveFile(componentOptions.fileKey, componentOptions.filePath)
  async update(
    @Param('id') id: string,
    @Body() updateGoodsDto: any,
    @UploadedFile() file?,
  ) {
    if (file) {
      updateGoodsDto.image = {
        ...file,
        url: `${process.env.server_url}/${file.path}`,
      };
    }
    console.log(updateGoodsDto);
    return this.service.update(+id, updateGoodsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
