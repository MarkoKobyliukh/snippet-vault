import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsEnum(['link', 'note', 'command'], { message: 'Type must be link, note, or command' })
  type!: 'link' | 'note' | 'command';
}
