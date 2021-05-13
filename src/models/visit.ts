// Libraries
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Internal dependencies
import { Link } from './link';

@Entity()
export class Visit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Link, (link) => link.visits)
  @JoinColumn({ name: 'link_id' })
  link: Link;

  @Column({ name: 'ip_address', nullable: false })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: false })
  userAgent: string;

  @Column()
  referrer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
