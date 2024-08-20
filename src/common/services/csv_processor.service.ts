import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { GatewayTimeoutException, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { Genre } from 'src/modules/movies/entities/genre.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CsvProcessService{

    constructor(
        @InjectRepository(Movie)
        private movieRepository: Repository<Movie>,

      ) {}

    async insertInitialMoviesFromCsvToDb(filePath: string){
        var movielist: Movie[] = [];

        if(await this.isMovieRecordListEmpty()){
            fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) =>
                movielist.push(this.processCSVRowToMovieRecord(data)),
            )
            .on('end', async () => {
                try{
                    await this.movieRepository.save(movielist);
                    console.log('CSV file successfully processed');
                }catch(e){
                    console.log(e);
                }
            });
        }
    }

    private async isMovieRecordListEmpty(): Promise<boolean>{
        var [result, count] = await this.movieRepository.findAndCount();
        return (count === 0);
    }

    private processCSVRowToMovieRecord(row: any): Movie {
        const genreString = row['genres'];
        const genreList: Genre[] = this.getGenreListForMovie(genreString);
        const title = row['title'];
        const overview = row['overview'];
        const releaseDate = row['release_date'];
        const runtime = parseFloat(row['runtime']);
        const runtimeVal = isNaN(runtime) ? 0 : runtime

        const voteAverage = parseFloat(row['vote_average']);
        const voteAverageVal = isNaN(voteAverage) ? 0 : voteAverage

        return new Movie(
          title,
          overview,
          releaseDate,
          runtimeVal,
          voteAverageVal,
          genreList,
        );
      }

    private getGenreListForMovie(genreString: string): Genre[] {
        const genreList: Genre[] = [];
        genreString = genreString.replace(/'/g, '"'); // Convert invalid JSON to valid JSON
        const genres = JSON.parse(genreString);
        for (const genre of genres) {
          let genreEntity = genreList.find((g) => g.id === genre.id);
          if (!genreEntity) {
            genreEntity = new Genre(genre.id, genre.name);
            genreList.push(genreEntity);
          }
        }
        return genreList;
      }

}