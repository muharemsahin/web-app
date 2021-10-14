import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { Feature } from "./feature.entity";

@Index("uq_category_name", ["name"], { unique: true })
@Index("uq_category_image_path", ["imagePath"], { unique: true })
@Index("fk_category_parent__category_id", ["parentCategoryId"], {})
@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column( {
    type: "varchar",
    unique: true,
    length: 32,
  })
  name: string;

  @Column( {
    type: "varchar",
    name: "image_path",
    unique: true,
    length: 128,
  })
  imagePath: string;

  @Column( {
    type: "int",
    name: "parent__category_id",
    nullable: true,
    unsigned: true,
  })
  //kada imas odredjeno polje  odredjeni tio moze biti number ili null
  parentCategoryId: number | null;

  @OneToOne(() => Article, (article) => article.article)
  article: Article;

  @ManyToOne(() => Category, (category) => category.categories, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "parent__category_id", referencedColumnName: "categoryId" },
  ])
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[];

  @OneToMany(() => Feature, (feature) => feature.category)
  features: Feature[];
}
