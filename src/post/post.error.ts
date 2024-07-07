export class PostCreateServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostCreateServiceError';
    this.message = message;
  }
}

export class PostFindAllServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostFindAllServiceError';
    this.message = message;
  }
}

export class PostFindOneServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostFindOneServiceError';
    this.message = message;
  }
}

export class PostUpdateServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostUpdateServiceError';
    this.message = message;
  }
}

export class PostRemoveServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostRemoveServiceError';
    this.message = message;
  }
}
