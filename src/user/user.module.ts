import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';

import { AuthModule } from 'src/auth/auth.module';
import { LocalStrategy } from 'src/auth/local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProductEntity, CategoryEntity,LocalStrategy ])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  constructor(){}
}
