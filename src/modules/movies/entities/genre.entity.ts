import { Column, Entity, ManyToMany, PrimaryColumn} from "typeorm";
import { Movie } from "./movie.entity";

@Entity()
export class Genre {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Movie, (movie) => movie.genres)
    movies: Movie[];

    constructor(id: number, name: string){
        this.id = id,
        this.name = name
    }
}