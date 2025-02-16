import { Prisma } from '@prisma/client';

export const USER_SELECT: Prisma.UserSelect = {
  id: true,
  email: true,
  username: true,
  walletAddress: true,
  avatar: true,
  posts: true,
};
