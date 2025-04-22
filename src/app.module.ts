import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService ,} from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

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
            entities:[User],
            synchronize:true

        })

    }),
    TodoModule, UserModule,
    //  AuthModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
