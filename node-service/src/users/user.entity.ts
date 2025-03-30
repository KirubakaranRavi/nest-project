import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  role: string; // Role should be explicitly assigned, no default

  @Column({ default: true })
  is_active: boolean; // Active status

  @Column({ default: false })
  is_deleted: boolean; // Soft delete

  @Column({ default: false })
  is_super: boolean; // Super admin flag

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
