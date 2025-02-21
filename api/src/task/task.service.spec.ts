import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { ContentfulService } from '../contentful/contentful.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/schemas/product.schema';
import { ProductSysSkeleton } from '../contentful/types/product.type';
import { InternalServerErrorException } from '@nestjs/common';

const mockProductContentList: ProductSysSkeleton[] = [
  {
    contentTypeId: 'product',
    sys: {
      createdAt: "2025-01-01T00:00:000Z",
      updatedAt: "2025-01-01T00:00:000Z"
    },
    fields: {
      sku: '1',
      name: 'one',
      brand: 'brand one',
      model: 'model one',
      category: 'cat one',
      color: 'blue',
      currency: 'USD',
      price: 14.88,
      stock: 33,
    }
  },
  {
    contentTypeId: 'product',
    sys: {
      createdAt: "2025-01-01T00:00:000Z",
      updatedAt: "2025-01-01T00:00:000Z"
    },
    fields: {
      sku: '2',
      name: 'two',
      brand: 'brand two',
      model: 'model two',
      category: 'cat two',
      color: 'yellow',
      currency: 'USD',
      price: 435.70,
      stock: 15,
    }
  }
];

const productMongoList: Product[] = [
  {
    sku: '1',
    name: 'one',
    brand: 'brand one',
    model: 'model one',
    category: 'cat one',
    color: 'blue',
    currency: 'USD',
    price: 14.88,
    stock: 33,
    isDeleted: false,
    createdAt: '2025-01-01T00:00:000Z',
    updatedAt: '2025-01-01T00:00:000Z'
  },
  {
    sku: '2',
    name: 'two',
    brand: 'brand two',
    model: 'model two',
    category: 'cat two',
    color: 'yellow',
    currency: 'USD',
    price: 435.70,
    stock: 15,
    isDeleted: false,
    createdAt: '2025-01-01T00:00:000Z',
    updatedAt: '2025-01-01T00:00:000Z'
  }
];

describe('TaskService', () => {
  let service: TaskService;
  let contentService: ContentfulService;
  let productService: ProductService;

  const mockContentService = {
    getProducts: jest.fn(),
  };

  const mockProductService = {
    cleanAll: jest.fn(),
    dumpProducts: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: ContentfulService,
          useValue: mockContentService
        },
        {
          provide: ProductService,
          useValue: mockProductService
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    contentService = module.get<ContentfulService>(ContentfulService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transformProducts', () =>{
    it('should transform products from content api to mongodb', () => {
      const res = service.transformProducts(mockProductContentList);

      expect(res).toHaveLength(2);
      
      expect(res[0].sku).toBe('1');
      expect(res[1].sku).toBe('2');
    });
  });

  describe('fetchContenfulData', () => {
    it('should run the cron job with all the logic', async () => {
      contentService.getProducts = jest.fn().mockImplementationOnce(() => mockProductContentList);

      await service.fetchContenfulData();

      expect(contentService.getProducts).toHaveBeenCalled();
      expect(productService.cleanAll).toHaveBeenCalled();
      expect(productService.dumpProducts).toHaveBeenCalled();
    });

    it('should throw error if something happened', async () => {
      contentService.getProducts = jest.fn().mockImplementationOnce(() => {
        throw new Error()
      });
      
      try {
        await service.fetchContenfulData();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      };

      expect(contentService.getProducts).toHaveBeenCalled();
    });
  });

});
