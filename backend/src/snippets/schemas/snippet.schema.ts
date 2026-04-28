import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SnippetDocument = HydratedDocument<Snippet>;

export type SnippetType = 'link' | 'note' | 'command';

@Schema({ timestamps: true })
export class Snippet {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ required: true, enum: ['link', 'note', 'command'] })
  type!: SnippetType;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

SnippetSchema.index({ title: 'text', content: 'text' });
