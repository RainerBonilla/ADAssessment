import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { ContentfulClientApi } from 'contentful';
import { InternalServerErrorException } from '@nestjs/common';

const mockProductContentList = [
  {
    contentTypeId: 'product',
    fields: {
      sku: '1',
      name: 'one',
      brand: 'brand one',
      model: 'model one',
      category: 'cat one',
      color: 'blue',
      currency: 'USD',
      stock: 33,
    },
  },
  {
    contentTypeId: 'product',
    fields: {
      sku: '2',
      name: 'two',
      brand: 'brand two',
      model: 'model two',
      category: 'cat two',
      color: 'yellow',
      currency: 'USD',
      stock: 15,
    },
  },
];

describe('ContentfulService', () => {
  let service: ContentfulService;
  let client: ContentfulClientApi<undefined>;

  const mockContentfulClient = {
    getEntries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: 'CONTENTFUL_CLIENT',
          useValue: mockContentfulClient,
        },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
    client = module.get<ContentfulClientApi<undefined>>('CONTENTFUL_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return dump from contentful', async () => {
      client.getEntries = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          items: mockProductContentList,
        }),
      );

      const res = await service.getProducts();

      expect(res).toBeDefined();
      expect(res).toHaveLength(2);
      expect(client.getEntries).toHaveBeenCalled();
    });

    it('should throw error while running', async () => {
      client.getEntries = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await service.getProducts();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }

      expect(client.getEntries).toHaveBeenCalled();
    });
  });
});
