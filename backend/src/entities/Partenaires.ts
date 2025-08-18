import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("partenaires_pkey", ["id"], { unique: true })
@Index("partenaires_siren_unique", ["siren"], { unique: true })
@Entity("partenaires", { schema: "public" })
export class Partenaires {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nom_compagnie", length: 255 })
  nomCompagnie: string;

  @Column("character varying", { name: "numero_tva", length: 50 })
  numeroTva: string;

  @Column("jsonb", { name: "contacts" })
  contacts: object;

  @Column("jsonb", { name: "activites" })
  activites: object;

  @Column("text", { name: "adresse", nullable: true })
  adresse: string | null;

  @Column("timestamp without time zone", {
    name: "date_creation",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  dateCreation: Date | null;

  @Column("timestamp without time zone", {
    name: "date_modification",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  dateModification: Date | null;

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "siren", unique: true, length: 9 })
  siren: string;
}
