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

  @Column({ type: 'int', nullable: false, name: 'link_id' })
  linkId: number;

  @Column({ name: 'ip_address', nullable: false })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: false })
  userAgent: string;

  @Column({ nullable: true })
  referrer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Link, (link) => link.visits)
  @JoinColumn({ name: 'link_id' })
  link: Link;
}
