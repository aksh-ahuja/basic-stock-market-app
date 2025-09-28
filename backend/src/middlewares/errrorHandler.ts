import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '@/types/stock';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const errorResponse: ErrorResponse = {
    success: false,
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  if (error.name === 'ValidationError') {
    res.status(400).json(errorResponse);
    return;
  }

  if (error.message.includes('not found') || error.message.includes('Not found')) {
    res.status(404).json(errorResponse);
    return;
  }

  if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
    res.status(429).json(errorResponse);
    return;
  }

  if (error.message.includes('timeout') || error.message.includes('Timeout')) {
    res.status(408).json(errorResponse);
    return;
  }

  if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
    res.status(401).json(errorResponse);
    return;
  }

  res.status(500).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  res.status(404).json(errorResponse);
};