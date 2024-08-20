import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import { Genre } from "./genre.entity";
import { IsNotEmpty, IsNumber } from "class-validator";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn('uuid')
    @IsNotEmpty({ message: 'Movie ID cannot be null or undefined' })
    id: string;
  
    @Column()
    title: string;
  
    @Column({nullable: true})
    overview: string;

    @Column({nullable: true})
    releaseDate: string;

    @IsNumber()
    @Column({type: 'float', nullable: true})
    runtime: number;

    @IsNumber()
    @Column({type: 'float', nullable: true})
    voteAverage: number;

    @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: true })
    @JoinTable()
    genres: Genre[];

    constructor(title: string,overview: string,releaseDate: string,runtime: number, voteAverage: number, genres: Genre[]){
        this.title = title
        this.overview = overview
        this.releaseDate = releaseDate
        this.runtime = runtime
        this.voteAverage = voteAverage
        this.genres = genres
    }
}
