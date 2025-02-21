import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user.schema';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

const mockUser: User = {
  email: 'test@test.com',
  password: '12swee331',
};

const token = {
  accessToken: '12sndcee4Gsdsdn3rrrqwww1'
};

const hashedPass = 'ww2wddf342ssafH!wwweff';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
    insertOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('return user if validated', async () => {
      userService.findOne = jest.fn().mockReturnValueOnce(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);

      const res = await service.validate(mockUser);

      expect(res).toBeDefined();
      expect(res.email).toBe(mockUser.email);
      expect(userService.findOne).toHaveBeenCalled();
    });

    it('throw error if user not found', async () => {
      userService.findOne = jest.fn().mockReturnValueOnce(undefined);
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);

      try {
        await service.validate(mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      };

      expect(userService.findOne).toHaveBeenCalled();
    });

    it('throw error if password mismatch', async () => {
      userService.findOne = jest.fn().mockReturnValueOnce(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);

      try {
        await service.validate(mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      };

      expect(userService.findOne).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      jwtService.sign = jest.fn().mockReturnValueOnce(token.accessToken);

      const res = await service.login(mockUser);

      expect(res).toBeDefined();
      expect(res.accessToken).toBe(token.accessToken);
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should return token after registering user', async () => {
      jwtService.sign = jest.fn().mockReturnValueOnce(token.accessToken);
      userService.findOne = jest.fn().mockReturnValueOnce(undefined);
      (bcrypt.hash as jest.Mock).mockReturnValueOnce(hashedPass);
      userService.insertOne = jest.fn().mockReturnValueOnce(true);

      const res = await service.register(mockUser);

      expect(res).toBeDefined();
      expect(res.accessToken).toBe(token.accessToken);
      expect(userService.findOne).toHaveBeenCalled();
      expect(userService.insertOne).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw error if user exists', async () => {
      jwtService.sign = jest.fn().mockReturnValueOnce(token.accessToken);
      userService.findOne = jest.fn().mockReturnValueOnce(mockUser);
      (bcrypt.hash as jest.Mock).mockReturnValueOnce(hashedPass);
      userService.insertOne = jest.fn().mockReturnValueOnce(true);

      try {
        await service.register(mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      };
      
      expect(userService.findOne).toHaveBeenCalled();
    });

    it('should throw error if could not add user into the db', async () => {
      jwtService.sign = jest.fn().mockReturnValueOnce(token.accessToken);
      userService.findOne = jest.fn().mockReturnValueOnce(undefined);
      (bcrypt.hash as jest.Mock).mockReturnValueOnce(hashedPass);
      userService.insertOne = jest.fn().mockReturnValueOnce(false);

      try {
        await service.register(mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      };
      
      expect(userService.findOne).toHaveBeenCalled();
      expect(userService.insertOne).toHaveBeenCalled();
    });
  });
});
