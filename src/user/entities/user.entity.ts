import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enum/user.role.enum';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type:'enum',
    enum:UserRole,
    default:UserRole.USER
  })
  role:UserRole
  

}
