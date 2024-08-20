
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './modules/movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvProcessService } from './common/services/csv_processor.service';
import { Movie } from './modules/movies/entities/movie.entity';
import { Genre } from './modules/movies/entities/genre.entity';
import * as dotenv from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';


dotenv.config();
@Module({
  imports: [
    MoviesModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Movie, Genre],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Movie, Genre]),
  ],
  controllers: [AppController],
  providers: [CsvProcessService, AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly csvProcessService: CsvProcessService) {}

  async onModuleInit() {
    //read csv & write data to DB if not exists
    const csvFilePath = './movies.csv';
    await this.csvProcessService.insertInitialMoviesFromCsvToDb(csvFilePath);
  }
}
