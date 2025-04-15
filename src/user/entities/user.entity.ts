import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { profile } from './profile';
import { post } from './post';
import { userRole } from '../enum/user.role.enum';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type:'enum',
    enum:userRole,
    default:userRole.USER
  })
  role:userRole

@OneToOne(() => profile)
@JoinColumn()
profile:profile;

@OneToMany(() =>post,(post) => post.user)
posts:post[]
}
