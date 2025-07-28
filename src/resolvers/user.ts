// src/resolvers/user.ts
import userService  from '../services/userService';

export const userResolver = {
  Query: {
    getUsers: async (_parent: any, _args: any, _context: any) => {
        return await userService.fetchUsers();
    },
    getAuthenticatedUserById: async (_parent: any, { id }: { id: string }, _context: any) => {
        return await userService.getAuthenticatedUserById(id);
    },
  },

  Mutation: {
    createUser: async (_parent: any, { input }: { input: any }, _context: any) => {
        return await userService.createUser(input);
    },
    updateUser: async (_parent: any, { id, input }: { id: string; input: any }, _context: any) => {
        return await userService.modifyUser(id, input);
      
    },
    deleteUser: async (_parent: any, { id }: { id: string }, _context: any) => {
        return await userService.removeUser(id);
     
    },
    activateUser: async (_parent: any, { activationToken, input }: { activationToken: string; input: any }, _context: any) => {
        return await userService.activateUser(activationToken, input);
    },
    resendActivationToken: async (_parent: any, { activationToken }: { activationToken: string }, _context: any) => {
        return await userService.resendActivationToken(activationToken);
    },
    validateActivationToken: async (_parent: any, { activationToken }: { activationToken: string }, _context: any) => {
        return await userService.validateToken(activationToken);
    },
  },
};

