import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Product } from 'src/generated/prisma/client';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  constructor(private prismaService: PrismaService) {}

  async onModuleInit() {
    await this.prismaService.$connect();
    this.logger.log(`Database connected!`);
  }
  create(createProductDto: CreateProductDto) {
    return this.prismaService.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log({ updateProductDto });
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
