import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("password_reset_token_pkey", ["id"], { unique: true })
@Entity("password_reset_token", { schema: "public" })
export class PasswordResetToken {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "userId" })
  userId: number;

  @Column("character varying", { name: "tokenHash" })
  tokenHash: string;

  @Column("bigint", { name: "expiresAt" })
  expiresAt: string;

  @Column("timestamp without time zone", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
