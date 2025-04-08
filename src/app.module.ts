import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService ,} from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { profile } from './user/entities/profile';
import { post } from './user/entities/post';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal:true}), TypeOrmModule.forRootAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory:(ConfigService:ConfigService)=>({
            type:'mysql',
            host:ConfigService.getOrThrow('DB_HOST'),
            port:ConfigService.getOrThrow('DB_PORT'),
            username:ConfigService.getOrThrow('DB_USERNAME'),
            password:ConfigService.getOrThrow('DB_PASSWORD'),
            database:ConfigService.getOrThrow('DB_NAME'),
            entities:[User,profile,post],
            synchronize:true

        })

    }),
    TodoModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
