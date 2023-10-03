import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '@/protocols';
import httpStatus from 'http-status';

export function handleApplicationErrors(
  err: ApplicationError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  /* eslint-disable-next-line no-console */
  console.log({ err, errName: err.name });

  if (err.name === 'MinBalanceError') {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(httpStatus.NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err.name === 'InvalidParamsError') {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
    });
  }

  /* eslint-disable-next-line no-console */
  console.error(err.name);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'InternalServerError',
    message: 'Internal Server Error',
  });
}
