import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Query } from 'mongoose';

const mockedUser = {
  email: "test@test.com",
  password: "awwwq1"
};

describe('UserService', () => {
  let userService: UserService;
  let model: Model<User>;

  const mockUserService = {
    findOne: jest.fn(),
    insertOne: jest.fn(),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('it should return user', async () => {
      jest.spyOn(model, 'findOne').mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockedUser),
        } as unknown as Query<User, any>);

      const result = await userService.findOne(mockedUser);

      expect(result).not.toBeUndefined();
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('password');

      expect(result?.email).toBe('test@test.com');
      expect(result?.password).toBe('awwwq1');
    });

    it('it should return undefined', async () => {
      jest.spyOn(model, 'findOne').mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(undefined),
        } as unknown as Query<User, any>);

      const result = await userService.findOne(mockedUser);

      expect(result).toBeUndefined();
    });
  });

  describe('insertOne', () => {
    it('it should return true if inserted', async () => {
      model.insertOne = jest.fn().mockImplementationOnce(() => Promise.resolve(mockedUser));

      const result = await userService.insertOne(mockedUser);

      expect(result).toBeTruthy();
    });

    it('it should return false if not inserted', async () => {
      model.insertOne = jest.fn().mockImplementationOnce(() => Promise.resolve(undefined));

      const result = await userService.insertOne(mockedUser);

      expect(result).toBeFalsy();
    });
  });
});
