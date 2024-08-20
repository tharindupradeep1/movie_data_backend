import { Injectable } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { Genre } from './entities/genre.entity';
import { MovieValidationService } from './validation/movie-validation.service';
import { FilterMovieBy } from './dto/enums/filter-movie-by.enum';
import { SortMovieBy } from './dto/enums/sort-movie-by.enum';
import { CommonResponseDto } from '../../common/dtos/common-response.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,

    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,

    private readonly movieValidationService: MovieValidationService, 

  ) {}

  async findAll(filterMovieDto: FilterMovieDto) {

     this.movieValidationService.validateMovieListFilterDto(filterMovieDto);

     const offset = (filterMovieDto.page - 1) * filterMovieDto.pageSize;

    const query = this.movieRepository.createQueryBuilder('movie')
    .leftJoinAndSelect('movie.genres', 'genre');

    //filters
    if(filterMovieDto.filterByValue != ""){
      if (filterMovieDto.filterBy == FilterMovieBy.title) {
        query.andWhere('movie.title ILIKE :title', { title: `%${filterMovieDto.filterByValue}%` });
      }else if(filterMovieDto.filterBy == FilterMovieBy.genre) {
        query.andWhere('genre.name ILIKE :genre', { genre: `%${filterMovieDto.filterByValue}%` });
      }
    }

    //sorting
    if (filterMovieDto.sortBy == SortMovieBy.releaseDate) {
      query.orderBy('movie.releaseDate', filterMovieDto.sortOrder);
    }else if (filterMovieDto.sortBy == SortMovieBy.title) {
      query.orderBy('movie.title', filterMovieDto.sortOrder);
    }

    query
      .skip(offset)
      .take(filterMovieDto.pageSize);

    const [movieList, total] = await query.getManyAndCount();
    const pageCount = total == 0 ? 0 : Math.ceil(total/filterMovieDto.pageSize);

    let meta = new PageMetaDto(filterMovieDto.page, movieList.length, pageCount)
    let response = new CommonResponseDto(movieList,meta)
    return response;
  }

  async findOne(id: string) {
    this.movieValidationService.validateGetMovieRequest(id);

    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['genres'],  // Include related genres if needed
    });
    
    this.movieValidationService.validateMovieItemResponse(movie);
    
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) : Promise<Movie>{
    var movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);

    // Update genres if provided
    if (updateMovieDto.genres) {
      const genres = await this.genreRepository.findByIds(updateMovieDto.genres);
      this.movieValidationService.validateGenreAvailability(genres,updateMovieDto.genres.length);
      movie.genres = genres;  // set new genres
    }

    let result = await this.movieRepository.save(movie);
    return result;
  }

}
