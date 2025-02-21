import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { queryPriceRangeBuilder, queryProductBuilder } from '../utils/builders';
import { priceDateReportQuery } from './queries/priceDateReportQuery';

const mockedProductList: Product[] = [
  {
    sku: '1',
    name: 'one',
    brand: 'brand one',
    model: 'model one',
    category: 'cat one',
    color: 'blue',
    currency: 'USD',
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
    stock: 15,
    isDeleted: false,
    createdAt: '2025-01-01T00:00:000Z',
    updatedAt: '2025-01-01T00:00:000Z'
  }
];

jest.mock('../utils/builders');
jest.mock('./queries/priceDateReportQuery');


describe('ProductService', () => {
  let service: ProductService;
  let model: Model<Product>;

  const mockProductService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    deletedProductsReport: jest.fn(),
    priceDateRangeReport: jest.fn(),
    brandReport: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductService
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    model = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('it should find all of products', async () => {
      model.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: () => mockedProductList
          })
        })
      });

      (queryPriceRangeBuilder as jest.Mock).mockReturnValue({});
      (queryProductBuilder as jest.Mock).mockReturnValue({});

      const result = await service.findAll({});

      expect(result).toHaveLength(2);
    });

    it('it should find all by condition', async () => {
      model.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: () => [mockedProductList[0]]
          })
        })
      });

      (queryPriceRangeBuilder as jest.Mock).mockReturnValue({});
      (queryProductBuilder as jest.Mock).mockReturnValue({sku: '1'});

      const result = await service.findAll({sku: '1'});

      expect(result).toHaveLength(1);

      expect(result[0]).toBeDefined();
      expect(result[0].sku).toBe('1');
    });

    it('it should throw error if empty list', async () => {
      model.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: () => []
          })
        })
      });

      (queryPriceRangeBuilder as jest.Mock).mockReturnValue({});
      (queryProductBuilder as jest.Mock).mockReturnValue({sku: '99'});

      try {
        await service.findAll({sku: '99'});
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findOne', () => {
    it('should find one product', async () => {
      model.findById = jest.fn().mockReturnValue({
        exec: () => mockedProductList[0]
      });
        
      const res = await service.findOne('22323dsdc');

      expect(res).toBeDefined();
      expect(res.sku).toBe('1');
    });

    it('should throw error when not found', async () => {
      model.findById = jest.fn().mockReturnValue({
        exec: () => {}
      });

      try {
        await service.findOne('22323dsdc');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteOne', () => {
    it('should delete one product', async () => {
      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: () => mockedProductList[0]
      });
        
      const res = await service.deleteOne('22323dsdc');

      expect(res).toBeDefined();
      expect(res).toBeTruthy();
    });

    it('should throw error when not found', async () => {
      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: () => {}
      });

      try {
        await service.deleteOne('22323dsdc');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deletedProductsReport', () => {
    it('bring list of deleted reports', async () => {
      model.aggregate = jest.fn().mockImplementationOnce(() => Promise.resolve(
        [
          {
            isDeleted: true,
            total: 14,
            percentage: 55.553420
          },
          {
            isDeleted: false,
            total: 13,
            percentage: 44.553420
          }
        ]
      ));

      const res = await service.deletedProductsReport();

      expect(model.aggregate).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.total).toBe(14);
    });

    it('throw error when query fails', async () => {
      model.aggregate = jest.fn().mockImplementationOnce(() => Promise.resolve([]
      ));

      try {
        await service.deletedProductsReport();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(model.aggregate).toHaveBeenCalled();
      
    });
  });

  describe('priceDateRangeReport', () => {
    it('bring list of non deleted report', async () => {
      (priceDateReportQuery as jest.Mock).mockReturnValueOnce([
        {
          "$sort": {
              "matched": -1 as any
          }
        }
      ]);
      model.find = jest.fn().mockReturnValue(mockedProductList);
      model.aggregate = jest.fn().mockImplementationOnce(() => Promise.resolve(
        [
          {
            total: 18,
            percentage: 55.553420
          }
        ]
      ));

      const res = await service.priceDateRangeReport({
        price: true,
        dateMin: '2025-01-01',
        dateMax: '2025-01-01',
      });

      expect(model.aggregate).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.total).toBe(18);
    });

    it('throw error when query fails', async () => {
      (priceDateReportQuery as jest.Mock).mockReturnValueOnce([
        {
          "$sort": {
              "matched": -1 as any
          }
        }
      ]);
      model.find = jest.fn().mockReturnValue(mockedProductList);
      model.aggregate = jest.fn().mockImplementationOnce(() => Promise.resolve([]));

      try {
        await service.priceDateRangeReport({
          price: false,
          dateMin: '2026-01-01',
          dateMax: '2026-01-01',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(model.aggregate).toHaveBeenCalled();
      
    });
  });

  describe('brandReport', () => {
    it('bring list of non deleted by brand report', async () => {
      (priceDateReportQuery as jest.Mock).mockReturnValueOnce([
        {
          "$sort": {
              "matched": -1 as any
          }
        }
      ]);
      model.find = jest.fn().mockReturnValue(mockedProductList);
      model.aggregate = jest.fn().mockImplementationOnce(() => Promise.resolve(
        [
          {
            total: 18,
            percentage: 55.553420
          }
        ]
      ));

      const res = await service.brandReport('brand one');

      expect(model.aggregate).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.total).toBe(18);
    });

    it('throw error when query fails', async () => {
      (priceDateReportQuery as jest.Mock).mockReturnValueOnce([
        {
          "$sort": {
              "matched": -1 as any
          }
        }
      ]);
      model.find = jest.fn().mockReturnValue(mockedProductList);
      model.aggregate = jest.fn().mockImplementationOnce(() => Promise.resolve([]));

      try {
        await service.brandReport('brand three');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(model.aggregate).toHaveBeenCalled();
      
    });
  });

  describe('dumpProducts', () => {
    it('should dump reports successfully', async () => {
      model.insertMany = jest.fn();

      await service.dumpProducts(mockedProductList);

      expect(model.insertMany).toHaveBeenCalled();
    });

    it('should throw error if query fails', async () => {
      model.insertMany = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      try {
        await service.dumpProducts(mockedProductList);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }

      expect(model.insertMany).toHaveBeenCalled();
    });
  });

  describe('cleanAll', () => {
    it('should clean collection successfully', async () => {
      model.deleteMany = jest.fn();

      await service.cleanAll();

      expect(model.deleteMany).toHaveBeenCalled();
    });

    it('should throw error if query fails', async () => {
      model.deleteMany = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      try {
        await service.cleanAll();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }

      expect(model.deleteMany).toHaveBeenCalled();
    });
  });
});
