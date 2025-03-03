import { Prisma } from '@prisma/client';

export const USER_SELECT: Prisma.UserSelect = {
  id: true,
  email: true,
  username: true,
  github: true,
  walletAddress: true,
  avatar: {
    select: {
      id: true,
      url: true,
      filename: true,
    },
  },
  posts: true,
};
