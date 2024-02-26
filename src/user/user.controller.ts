import {
  Controller,
  Param,
  Post,
  Delete,
  Put,
  UseGuards,
  Request,
  Get,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role.guard';
import { UserService } from './user.service';
import { CreateProductDto } from 'src/product/dto/create-product.dto/create-product.dto';
import { CreateCategoryDto } from 'src/product/dto/create-category.dto/create-category.dto';
import { ProductEntity } from './product.entity';
import { UpdateProductDto } from 'src/product/dto/update-product.dto/update-product.dto';
import { UpdateCategoryDto } from 'src/product/dto/update-category.dto/update-category.dto';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/local.strategy';

@Controller('user')
@UseGuards(AuthGuard('jwt'), new RoleGuard('user'))
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly localstrategy: LocalStrategy;
  @Get('/products')
  async getallproduct() {
    const products = await this.userService.getProducts();
    return products;
  }

  @Post('/products')
  async createproduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.userService.saveProduct(createProductDto);
    return product;
  }
  @Post('/category')
  async createcategory(@Body() createcategoryDto: CreateCategoryDto) {
    const category = await this.userService.saveCategory(createcategoryDto);
    return category;
  }

  @Get('products/category/:categoryname')
  async getproductsbycategory(@Param('categoryname') categoryname: string) {
    return this.userService.getProductsByCategory(categoryname);
  }

  @Delete('products/:Id')
  async deleteproduct(@Param('Id') Id: number) {
    return this.userService.deleteProduct(Id);
  }
  @Delete('products/category/:Id')
  async deletecategory(@Param('Id') Id: number) {
    return this.userService.deletecategory(Id);
  }

  @Put('products/:Id')
  async updateproduct(
    @Param('Id') Id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.userService.updateproduct(Id, updateProductDto);
  }

  @Put('category/:Id')
  async updatecategory(
    @Param('Id') Id: number,
    @Body() UpdateCategoryDto: UpdateCategoryDto,
  ) {
    return this.userService.updateproduct(Id, UpdateCategoryDto);
  }

  @Get('products/:Id')
  async getproduct(@Param('Id') Id: number) {
    return this.userService.getProduct(Id);
  }

  @Get('products')
  async getproducts() {
    return this.userService.getProducts();
  }
  @Get('category')
  async getcategory() {
    return this.userService.getCategories();
  }

  @Post('signup')
  async saveuser(@Body() body: any) {
    return this.userService.saveUser(body);
  }

  //auth
}
