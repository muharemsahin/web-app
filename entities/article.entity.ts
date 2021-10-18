import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { ArticleFeature } from "./article-features.entity";
import { ArticlePrice } from "./article-price.entity";
import { CartArticle } from "./cart-article.entity";
import { Photo } from "./photo.entity";
import { Feature } from "./feature.entity";

@Entity("article")
export class Article {
  @PrimaryGeneratedColumn({ type: "int", name: "article_id", unsigned: true })
  articleId: number;

  @Column( { type:"varchar", length: 128 })
  name: string;

  @Column( { type:"int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column( { type:"varchar", name: "except", length: 255 })
  except: string;

  @Column( { type: "text" })
  description: string;

  @Column( {
    type: "enum",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'",
  })
  status: "available" | "visible" | "hidden";

  @Column( {
    type: "tinyint",
    name: "is_promoted",
    unsigned: true,
    
  })
  isPromoted: number;

  @Column( {
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToOne(
    () => Category,
     (category) => category.article, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  //aritcle_id
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  article: Category;

  @OneToMany(() => ArticleFeature, (articleFeature) => articleFeature.article)
  articleFeatures: ArticleFeature[];

  @ManyToMany(type => Feature, feature => feature.articles)
  @JoinTable({ 
    name: "article_feature",
    joinColumn: { name: "article_id", referencedColumnName: "articleId"},
    inverseJoinColumn : {name: "feature_id", referencedColumnName: "featureId"}
  })
  features: Feature[];

  @OneToMany(() => ArticlePrice, (articlePrice) => articlePrice.article)
  articlePrices: ArticlePrice[];

  @OneToMany(() => CartArticle, (cartArticle) => cartArticle.article)
  cartArticles: CartArticle[];

  @OneToMany(() => Photo, (photo) => photo.article)
  photos: Photo[];
}
