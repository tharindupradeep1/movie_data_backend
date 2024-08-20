import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
    @IsOptional()
    @IsString()
    title: string;
  
    @IsOptional()
    @IsString()
    overview: string;

    @IsOptional()
    @IsString()
    releaseDate: string;

    @IsOptional()
    @IsNumber()
    runtime: number;

    @IsOptional()
    @IsNumber()
    voteAverage: number;

    @IsOptional()
    @IsArray()
    genres: string[];

}
