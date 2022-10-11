import { Request, Response, NextFunction, Router } from 'express';

export interface IControllerRoute {
  path: string;
  func: (reg: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
}
