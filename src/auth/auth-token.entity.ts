import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('auth_tokens')
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expires_at: Date;

  // No need to store is_expired, just compute it dynamically
  get is_expired(): boolean {
    return new Date() > this.expires_at;
  }
}
