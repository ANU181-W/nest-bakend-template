import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CONSTANTS } from 'src/constants';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleGuard } from 'src/role.guard';

import * as bcrypt from 'bcrypt';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';
import { CreateProductDto } from 'src/product/dto/create-product.dto/create-product.dto';
import { UpdateCategoryDto } from 'src/product/dto/update-category.dto/update-category.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto/update-product.dto';
import { CreateCategoryDto } from 'src/product/dto/create-category.dto/create-category.dto';
import { promises } from 'dns';
const saltRounds = 13;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getProducts() {
    let products = await this.productRepository.find();
    return products;
  }

  async getCategories() {
    let categories = await this.categoryRepository.find();
    return categories;
  }

  async getProduct(id: number) {
    let product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    return product;
  }

  async saveProduct(CreateProductDto: CreateProductDto) {
    console.log(CreateProductDto);
    let product = new ProductEntity();
    product.name = CreateProductDto.name;
    product.discription = CreateProductDto.discription;
    product.image = CreateProductDto.image;
    product.price = CreateProductDto.price;
    const category = await this.categoryRepository.findOne({
      where: {
        id: CreateProductDto.category_id,
      },
    });

    product.category = category;
    product = await this.productRepository.save(product);
  }

  async saveCategory(createCategoryDto: CreateCategoryDto) {
    let category = this.categoryRepository.create({ ...createCategoryDto });
    category = await this.categoryRepository.save(category);
  }
  async getProductsByCategory(categoryId: number): Promise<ProductEntity[]> {
    let cat = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    return this.productRepository.find({ where: { category: cat } });
  }

  async updateproduct(id: number, UpdateproductDto: UpdateProductDto) {
    let product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`product with id : ${id} not found`);
    }

    return this.productRepository.update({ id }, UpdateproductDto);
  }

  async updatecategory(id: number, UpdateCategoryDto: UpdateCategoryDto) {
    let category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`category with id : ${id} not found`);
    }

    return this.categoryRepository.update({ id }, UpdateProductDto);
  }

  async deleteProduct(id: number) {
    let product = await this.productRepository.find({ where: { id } });

    if (!product) {
      throw new NotFoundException(`product with id : ${id} not found`);
    }

    console.log('product deleted');
    return this.productRepository.delete({ id });
  }

  async deletecategory(id: number) {
    let category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`category with id : ${id} not found`);
    }

    return this.categoryRepository.delete({ id });
  }

  async getUser(email: string) {
    console.log('usercontrollergetuser', email);
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    console.log(user);
    return user;
  }

  async saveUser(body) {
    if (!body.email || !body.password) {
      return { status: 'fail', message: 'Email and password are required' };
    }
    let user = new UserEntity();
    user.email = body.email;
    user.password = await bcrypt.hash(body.password, saltRounds);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async resetPass(email, body) {
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { status: 'fail', message: 'User not found' };
    }
    if (!body.npassword || !body.opassword) {
      return {
        status: 'fail',
        message: 'New password and old password are required',
      };
    }

    const match = await bcrypt.compare(body.opassword, user.password);
    console.log('match', match);
    if (match) {
      user.password = await bcrypt.hash(body.npassword, saltRounds);
      user = await this.userRepository.save(user);
      delete user.password;
      return user ? { status: 'success' } : BadRequestException;
    }
    return { status: 'fail', message: 'Old password is incorrect' };
  }
}
