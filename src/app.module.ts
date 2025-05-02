import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { ConfigModule, } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    DatabaseModule,
    TodoModule, 
    UserModule,

    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
