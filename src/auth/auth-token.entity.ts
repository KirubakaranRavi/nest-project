import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('auth_tokens')
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;

  @Column({ default: false })
  is_expired: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expires_at: Date;
}
