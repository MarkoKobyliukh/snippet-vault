import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snippet, SnippetDocument } from './schemas/snippet.schema';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { QuerySnippetDto } from './dto/query-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<SnippetDocument>,
  ) {}

  async create(dto: CreateSnippetDto): Promise<SnippetDocument> {
    const snippet = new this.snippetModel(dto);
    return snippet.save();
  }

  async findAll(query: QuerySnippetDto) {
    const { q, tag, page = 1, limit = 10 } = query;
    const filter: Record<string, unknown> = {};

    if (q) {
      filter.$text = { $search: q };
    }

    if (tag) {
      filter.tags = tag;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.snippetModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.snippetModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SnippetDocument> {
    const snippet = await this.snippetModel.findById(id).exec();
    if (!snippet) throw new NotFoundException(`Snippet #${id} not found`);
    return snippet;
  }

  async update(id: string, dto: UpdateSnippetDto): Promise<SnippetDocument> {
    const snippet = await this.snippetModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!snippet) throw new NotFoundException(`Snippet #${id} not found`);
    return snippet;
  }

  async remove(id: string): Promise<void> {
    const result = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Snippet #${id} not found`);
  }
}
