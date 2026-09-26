import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPassword')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

bcrypt.hash.mockImplementation(() => Promise.resolve('hashedPassword'));
bcrypt.compare.mockImplementation(() => Promise.resolve(true));