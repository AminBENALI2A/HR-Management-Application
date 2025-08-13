import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
// typeorm-model-generator -h localhost -d hr_management -u admin -x adminpassword -e postgres -o ./src 
@Index("users_email_key", ["email"], { unique: true })
@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom", length: 100 })
  nom: string;

  @Column("character varying", { name: "prenom", length: 100 })
  prenom: string;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", {
    name: "telephone",
    nullable: true,
    length: 20,
  })
  telephone: string | null;

  @Column("character varying", { name: "role", length: 50 })
  role: string;

  @Column("timestamp without time zone", {
    name: "date_creation",
    default: () => "CURRENT_TIMESTAMP",
  })
  dateCreation: Date;

  @Column("timestamp without time zone", {
    name: "date_modification",
    default: () => "CURRENT_TIMESTAMP",
  })
  dateModification: Date;

  @Column("text", { name: "password_hash" })
  passwordHash: string;

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;
}
