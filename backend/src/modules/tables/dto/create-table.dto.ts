import { IsObject, IsOptional, IsInt, Min, Max, ValidateIf } from 'class-validator';

export class CreateTableDto {
  @IsOptional()
  @IsObject()
  config?: {
    playerCount?: number;
    gameCount?: number;
    [key: string]: any;
  };

  @ValidateIf((o) => !o.config)
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(4)
  playerCount?: number;

  @ValidateIf((o) => !o.config)
  @IsOptional()
  @IsInt()
  @Min(1)
  gameCount?: number;
}
