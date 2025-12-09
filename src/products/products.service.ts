import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Product } from 'src/generated/prisma/client';
import { PaginationDto } from 'src/common';

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

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPage = await this.prismaService.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalPage / limit);

    return {
      data: await this.prismaService.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        total: totalPage,
        page: page,
        lastpage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findFirst({
      where: { Id: id, available: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with the id #${id} not found!`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prismaService.product.update({
      where: { Id: id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // return this.prismaService.product.delete({ where: { Id: id } });
    return await this.prismaService.product.update({
      where: { Id: id },
      data: { available: false },
    });
  }
}
