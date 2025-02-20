import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  Index,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Developer } from "./developer.entity";
import { Genre } from "./genre.entity";
import { Progress } from "./progress.entity";
import { Publisher } from "./publisher.entity";
import { Store } from "./store.entity";
import { Tag } from "./tag.entity";
import { Image } from "./image.entity";
import { AbstractEntity } from "./abstract.entity";

@Entity()
export class Game extends AbstractEntity {
  @Column({ nullable: true })
  @ApiProperty({
    description: "unique rawg-api-identifier of the game",
    example: 1212,
    required: false,
  })
  rawg_id?: number;

  @Column()
  @Index()
  @ApiProperty({
    description: "title of the game (extracted from the filename)",
    example: "Grand Theft Auto V",
  })
  title: string;

  @Column()
  @Column({ nullable: true })
  @ApiPropertyOptional({
    description:
      "rawg-api-title of the game (a correction needed if different from title)",
    example: "Grand Theft Auto V",
    required: false,
  })
  rawg_title?: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: "version tag (extracted from the filename e.g. '(v1.0.0)')",
    example: "v1.0.0",
    required: false,
  })
  version?: string;

  @Column()
  @ApiProperty({
    description: "release date of the game (extracted from filename)",
    example: "2013-09-17T00:00:00.000Z",
  })
  release_date: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: "release date of the game (from rawg-api)",
    example: "2013-09-17T00:00:00.000Z",
    required: false,
  })
  rawg_release_date?: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: "date the game was last updated using the rawg-api",
    example: "2021-03-01T00:00:00.000Z",
    required: false,
  })
  cache_date?: Date;

  @Column({ unique: true })
  @ApiProperty({
    description: "filepath to the game (relative to the root)",
    example: "Grand Theft Auto V (v1.0.0).zip",
  })
  file_path: string;

  @Column({
    type: "bigint",
    default: 0,
    transformer: {
      to: (value) => value,
      from: (value) => {
        if (value) return BigInt(value).toString();
        return value;
      },
    },
  })
  @ApiProperty({
    description: "size of the game file in bytes",
    example: "1234567890",
    type: String,
  })
  size: bigint;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "rawg-api description of the game",
    example:
      "An open world action-adventure video game developed by Rockstar North and published by Rockstar Games.",
    required: false,
  })
  description?: string;

  @ManyToOne(() => Image, { nullable: true, eager: true, onDelete: "SET NULL" })
  @JoinColumn()
  @ApiPropertyOptional({
    description: "box image of the game",
    type: () => Image,
    required: false,
  })
  box_image?: Image;

  @ManyToOne(() => Image, { nullable: true, eager: true, onDelete: "SET NULL" })
  @JoinColumn()
  @ApiPropertyOptional({
    description: "background image of the game",
    type: () => Image,
    required: false,
  })
  background_image?: Image;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "website url of the game from rawg-api",
    example: "https://www.escapefromtarkov.com/",
    required: false,
  })
  website_url?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "metacritic rating from rawg-api of the game",
    example: 90,
    required: false,
  })
  metacritic_rating?: number;

  @Column({ nullable: true, type: "integer" })
  @ApiProperty({
    description:
      "average playtime of other people in the game (similar to howlongtobeat.com) from rawg-api (in minutes)",
    example: 180,
    required: false,
  })
  average_playtime?: number;

  @Column()
  @ApiProperty({
    description:
      "indicates if the game is an early access title ('(EA)' Flag in the filename)",
    example: true,
  })
  early_access: boolean;

  @OneToMany(() => Progress, (progress) => progress.game)
  @ApiPropertyOptional({
    description: "progresses associated to the game",
    type: [() => Progress],
    isArray: true,
  })
  progresses: Progress[];

  @JoinTable()
  @ManyToMany(() => Publisher, (publisher) => publisher.games)
  @ApiPropertyOptional({
    description: "publishers of the game",
    type: () => Publisher,
    isArray: true,
  })
  publishers: Publisher[];

  @JoinTable()
  @ManyToMany(() => Developer, (developer) => developer.games)
  @ApiPropertyOptional({
    description: "developers of the game",
    type: () => Developer,
    isArray: true,
  })
  developers: Developer[];

  @JoinTable()
  @ManyToMany(() => Store, (store) => store.games)
  @ApiPropertyOptional({
    description: "stores of the game",
    type: () => Store,
    isArray: true,
  })
  stores: Store[];

  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.games)
  @ApiPropertyOptional({
    description: "tags of the game",
    type: () => Tag,
    isArray: true,
  })
  tags: Tag[];

  @JoinTable()
  @ManyToMany(() => Genre, (genre) => genre.games)
  @ApiPropertyOptional({
    description: "genres of the game",
    type: () => Genre,
    isArray: true,
  })
  genres: Genre[];
}
