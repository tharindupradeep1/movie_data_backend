import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { FilterMovieDto } from "../dto/filter-movie.dto";
import { Movie } from "../entities/movie.entity";
import { Genre } from "../entities/genre.entity";
import { SortOrder } from "../dto/enums/sort-order.enum";
import { isUUID } from "class-validator";


@Injectable()
export class MovieValidationService {
  validateMovieListFilterDto(filterMovieDto: FilterMovieDto) {
    const { filterBy, filterByValue, sortBy, sortOrder, page } = filterMovieDto;

    if (page == 0){
      throw new BadRequestException('Page number can not be 0.');
    }

    // Validate filter criteria
    if(filterBy != null && filterByValue == null){
      throw new BadRequestException('Filter by value cannot be null or undefined');
    }

    // Validate sort order
    if (sortBy != null) {
      if (sortOrder && !(sortOrder === SortOrder.ASC || sortOrder === SortOrder.DESC)) {
        throw new BadRequestException('Sort order must be ASC or DESC');
      }
    }
    
  }

  validateGetMovieRequest(movieId: String){
    if (!movieId) {
      throw new NotFoundException('Movie Id cannot be null or undefined');
    }else{
      if(!isUUID(movieId)){
        throw new NotFoundException('Movie Id should be a valid UUID');
      }
    }
  }

  validateMovieItemResponse(movie: Movie){
    if (!movie) {
      throw new NotFoundException('Movie with ID "${movie.id}" not found');
    }
  }

  validateGenreAvailability(genres: Genre[], movieDtoGenreCount : number){
    if (genres.length !== movieDtoGenreCount) {
      throw new NotFoundException('One or more genres not found');
    }
  }

}
