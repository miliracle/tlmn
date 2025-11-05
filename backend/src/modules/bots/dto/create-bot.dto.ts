import { IsString, IsOptional } from 'class-validator';

export class CreateBotDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;
}

