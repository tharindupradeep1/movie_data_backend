import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from './entities/genre.entity';
import { MovieValidationService } from './validation/movie-validation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { SortOrder } from './dto/enums/sort-order.enum';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let genreRepository: Repository<Genre>;
  let movieValidationService: MovieValidationService;
  const defaultMovie: Movie = {
    "title": "Test",
    "overview": "Test overview",
    "releaseDate": "",
    "runtime": 2,
    "voteAverage": 10,
    "genres": [
        {
          "id": 35,
          "name": "Comedy",
          movies: []
        },
        {
          "id": 27,
          "name": "Horror",
          movies: []
        }
    ],
    "id": "e3d216f6-abd4-4cc4-8f5d-09bba7d8f065"
};
const defaultMovieId = 'e3d216f6-abd4-4cc4-8f5d-09bba7d8f065';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
        {
          provide: MovieValidationService,
          useValue: {
            validateMovieListFilterDto: jest.fn(),
            validateGetMovieRequest: jest.fn(),
            validateMovieItemResponse: jest.fn(),
            validateGenreAvailability: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
    movieValidationService = module.get<MovieValidationService>(MovieValidationService);
  });

  describe('findAll', () => {
    it('should return a list of movies with pagination data', async () => {
      const filterMovieDto: FilterMovieDto = {
        page: 1,
        pageSize: 1,
        filterBy: 0,
        filterByValue: '',
        sortBy: 0,
        sortOrder: SortOrder.ASC,
      };

      const movieList = {
        "data": [
            defaultMovie
        ],
        "meta": {
            "currentPage": 1,
            "pageSize": 1,
            "totalPages": 500
        }
    };
      const total = 1;

      jest.spyOn(movieRepository, 'createQueryBuilder').mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([movieList, total]),
      }) as any);

      const result = await service.findAll(filterMovieDto);
      expect(result.data).toEqual(movieList);
      expect(result.meta.totalPages).toEqual(1);
    });
  });

  describe('findOne', () => {
    it('should return a single movie object', async () => {

      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(defaultMovie);

      const result = await service.findOne(defaultMovieId);
      expect(result).toEqual(defaultMovie);
    });

    it('should throw an error if the movie does not exist', async () => {  
      await expect(service.findOne('non-id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update and return the updated movie', async () => {
      const updatedMovie: Movie = {
        "title": "Test",
        "overview": "Test overview",
        "releaseDate": "",
        "runtime": 2,
        "voteAverage": 10,
        "genres": [
            {
              "id": 35,
              "name": "Comedy",
              movies: []
            },
            {
              "id": 27,
              "name": "Horror",
              movies: []
            }
        ],
        "id": "e3d216f6-abd4-4cc4-8f5d-09bba7d8f065"
    };
      const updateMovieDto = {
        title: 'Test Edit', genres: [],
        overview: 'Test overview Edit',
        releaseDate: '',
        runtime: 0,
        voteAverage: 0
      };

      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(defaultMovie);
      jest.spyOn(genreRepository, 'findByIds').mockResolvedValue(defaultMovie.genres);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(updatedMovie);

      const result = await service.update(defaultMovieId, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });
  });

  it('should throw an error if the movie to update does not exist', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie', genres: [],
      overview: '',
      releaseDate: '',
      runtime: 0,
      voteAverage: 0
    };
    await expect(service.update('nonexistent-id', updateMovieDto)).rejects.toThrow();
  });

  it('should throw an error if the provided genres do not exist', async () => {
    const movie = { id: '1', title: 'Movie 1', genres: [] };

    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie', genres: ['nonexistent-genre-id'],
      overview: '',
      releaseDate: '',
      runtime: 0,
      voteAverage: 0
    };
    await expect(service.update(defaultMovieId, updateMovieDto)).rejects.toThrow();
  });
});