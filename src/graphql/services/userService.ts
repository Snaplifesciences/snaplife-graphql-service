// src/services/userService.ts
import { User } from "../typeDefs/user";
import { userAPI } from "../../datasources/userAPI";
import { wrapServiceError } from '../../utils/apiErrorUtils';

class UserService {

  async fetchUsers(): Promise<User[]> {
    console.log('Fetching all users');
    try {
      return userAPI.getAll();
    } catch (error) {
      throw wrapServiceError(error, 'User service failed while getting all the users');
    }
  }

  async getAuthenticatedUserById(id: string): Promise<User | null> {
    console.log('Getting authenticated user by id:', id);
    try {
      return await userAPI.getAuthenticatedUserById(id);
    } catch (error) {
      throw wrapServiceError(error, 'User service failed while getting authenticated user by id');
    }
  }

  async createUser(user: User): Promise<User> {
    console.log('Creating user:', user);
    try {
      return await userAPI.create(user);
    } catch (error) {
      throw wrapServiceError(error, 'User service failed while creating user');
    }
  }

  async modifyUser(id: string, updatedUser: Partial<User>): Promise<User | null> {
    console.log(`Updating user with id: ${id}`, updatedUser);
    try {
      return await userAPI.update(id, updatedUser);
    } catch (error) {
      throw wrapServiceError(error, `User service failed while updating user id: ${id}`);
    }
  }

  async removeUser(id: string): Promise<boolean> {
    console.log(`Deleting user with id: ${id}`);
    try {
      return await userAPI.delete(id);
    } catch (error) {
      throw wrapServiceError(error, `User service failed while deleting user id: ${id}`);
    }
  }

  async activateUser(activationToken: string, input: any): Promise<boolean> {
    console.log(`Activating user with token: ${activationToken}`, input);
    try {
      await userAPI.activateUser(activationToken, input);
    } catch (error) {
      throw wrapServiceError(error, `User service failed while activating user, token: ${activationToken}`);
    }
    return true;
  }

  async resendActivationToken(activationToken: string): Promise<boolean> {
    console.log(`Resending activation token: ${activationToken}`);
    try {
      await userAPI.resendActivationToken(activationToken);
    } catch (error) {
      throw wrapServiceError(error, `User service failed while resending activation token, token: ${activationToken}`);
    }
    return true;
  }

  async validateToken(activationToken: string): Promise<boolean> {
    console.log(`Validating activation token: ${activationToken}`);
    await userAPI.validateToken(activationToken);
    return true;
  }

}

export default new UserService();
