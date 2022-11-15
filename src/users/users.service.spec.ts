import 'reflect-metadata';
import { Container } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { IUsersRepository } from "./users.repository.interface";
import { IUserService } from "./users.service.interface";
import { UserService } from './users.service';
import { TYPES } from '../types';
import { UserModel } from "@prisma/client";
import { User } from "./user.entity";

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};


const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(()=>{
    container.bind<IUserService>(TYPES.UserService).to(UserService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

    configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
})

 let createdUser: UserModel | null;

describe('User Service', () => {

   

    it('createUser', async () => {
        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.create = jest.fn().mockImplementationOnce(
			(newUser: User): UserModel => ({
				name: newUser.name,
				email: newUser.email,
				password: newUser.password,
				id: 1,
			}),
		);
        createdUser = await usersService.createUser({
			email: 'a@a.ru',
			name: 'John',
			password: '1',
		});
       
        expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
    })

    it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

    it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

    it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'bbb@a.ru',
			password: '1',
		});
		expect(res).toBeFalsy();
	});


})