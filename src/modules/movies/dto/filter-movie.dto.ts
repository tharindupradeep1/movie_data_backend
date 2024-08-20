import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SortOrder } from "./enums/sort-order.enum";

export class FilterMovieDto {
  
    @IsNumber()
    @IsNotEmpty({message: "Page number cannot be null or undefined"})
    page: number;
  
    @IsNumber()
    @IsNotEmpty({message: "Page size cannot be null or undefined"})
    pageSize: number;

    @IsOptional()
    @IsNumber()
    filterBy: number;

    @IsOptional()
    @IsString()
    filterByValue: string;

    @IsOptional()
    @IsNumber()
    sortBy: number;

    @IsOptional()
    @IsString()
    sortOrder: SortOrder.ASC | SortOrder.DESC;
}