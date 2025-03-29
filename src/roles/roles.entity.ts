import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsObject } from 'class-validator';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Role name (e.g., admin, editor, viewer, etc.)

  @Column({ type: 'json', nullable: true }) // JSON column
  @IsObject()
  permissions: Record<string, any>; // Define as an object type

  @Column({ default: true })
  is_active: boolean; // Indicates if the role is active or not

  @Column({ default: false })
  is_deleted: boolean; // Indicates if the role is a default role

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date; // Automatically update this field on any update
}
