// Libraries
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

// Internal dependencies
import { Visit } from './visit';

@Entity()
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: false })
  target: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'disabled_at', default: null })
  disabledAt: Date;

  @OneToMany(() => Visit, (visit) => visit.link)
  visits: Visit[];
}
