import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { profile } from './profile';
import { post } from './post';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

@OneToOne(() => profile)
@JoinColumn()
profile:profile;

@OneToMany(() =>post,(post) => post.user)
posts:post[]
}
