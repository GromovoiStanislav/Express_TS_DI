import express, { Express } from 'express';
import { Server } from 'node:http';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controler';

export class App {
  app: Express;
  port: number;
  server: Server;
  logger: LoggerService;
  userController: UserController;

  constructor(logger: LoggerService, userController: UserController) {
    this.app = express();
    this.port = 3000;
    this.logger = logger;
    this.userController = userController;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.log(
      `Example app listening on port http://localhost:${this.port}/`
    );
  }
}
