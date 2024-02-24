import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProductEntity, CategoryEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  constructor(){}
}
