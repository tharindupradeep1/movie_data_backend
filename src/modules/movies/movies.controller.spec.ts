import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { FilterMovieDto } from "./dto/filter-movie.dto";
import { CommonResponseDto } from "src/common/dtos/common-response.dto";
import { Movie } from "./entities/movie.entity";
import { SortOrder } from "./dto/enums/sort-order.enum";
import { UpdateMovieDto } from "./dto/update-movie.dto";

describe('MoviesController', () => {
    let moviesController: MoviesController;
    let moviesService: MoviesService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [MoviesController],
        providers: [
          {
            provide: MoviesService,
            useValue: {
              findAll: jest.fn(),
              findOne: jest.fn(),
              update: jest.fn(),
            },
          },
        ],
      }).compile();
  
      moviesController = module.get<MoviesController>(MoviesController);
      moviesService = module.get<MoviesService>(MoviesService);
    });
  
    describe('findAll', () => {
      it('should return an array of movies', async () => {
        const result = {
          "data": [
              {
                  "title": "Ella Lola, a la Trilby",
                  "overview": "A young, dark-haired woman performs a dance inspired by George du Maurier's character Trilby, in an early modern dance style reminiscent of Isadora Duncan. She dances barefoot without stockings and is dressed in a long, flowing gown bound across the bosom in Grecian style, with inside fringe and a draped cape hooked to her wrist. She also wears what appears to be a garland headpiece. Holding her gown with one hand throughout, the dancer performs a series of kicks and turns with leg kicks front and back, rocking, and round de jambe.",
                  "releaseDate": "1898-01-01",
                  "runtime": 1,
                  "voteAverage": 4,
                  "genres": [],
                  "id": "a70762e9-2462-45a9-b9eb-5b2ae13ba69b"
              }
          ],
          "meta": {
              "currentPage": 1,
              "pageSize": 1,
              "totalPages": 500
          }
      }

        jest.spyOn(moviesService, 'findAll').mockResolvedValue(result);
  
        const filterMovieDto = {
          page: 1,
          pageSize: 1,
          sortBy: 0,
          sortOrder: SortOrder.ASC,
          filterBy: 0,
          filterByValue: ""
        };

        expect(await moviesController.findAll(filterMovieDto)).toBe(result);
      });
    });
  
    describe('findOne', () => {
      it('should return a single movie', async () => {
        const result: Movie = {
            id: 'a70762e9-2462-45a9-b9eb-5b2ae13ba69b',
            title: 'Test',
            overview: 'Test Overview',
            releaseDate: '2016-07-29',
            runtime: 2,
            voteAverage: 10,
            genres: [],
          };
        
        jest.spyOn(moviesService, 'findOne').mockResolvedValue(result);
  
        expect(await moviesController.findOne('a70762e9-2462-45a9-b9eb-5b2ae13ba69b')).toBe(result);
      });
    });
  
    describe('update', () => {
      it('should update and return the updated movie', async () => {
        const result: Movie = {
          "title": "Test Edit",
          "overview": "Test overview Edit",
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

        jest.spyOn(moviesService, 'update').mockResolvedValue(result);
  
        const updateMovieDto: UpdateMovieDto = {
          "title": "Test Edit",
          "overview": "Test overview Edit",
          "runtime": 2,
          "voteAverage": 10,
          "genres":["35","27"],
          "releaseDate": ""
      };
        expect(await moviesController.update("e3d216f6-abd4-4cc4-8f5d-09bba7d8f065", updateMovieDto)).toBe(result);
      });
    });
  });