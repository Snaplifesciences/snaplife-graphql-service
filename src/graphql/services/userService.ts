// src/services/userService.ts
import { User } from "../typeDefs/user";
import { ActivationInput } from "../typeDefs/user";
import { userAPI } from "../../datasources/userAPI";
import { wrapServiceError } from '../../utils/apiErrorUtils';
import { logger } from '../../utils/logger';



class UserService {

  async createUser(user: User): Promise<User> {
    const sanitizedUser = {
      email: user.email?.replace(/[\r\n]/g, '') || 'unknown',
      firstName: user.firstName || 'unknown',
      lastName: user.lastName || 'unknown'
    };
    logger.info('UserService::createUser initiated', { user: sanitizedUser });
    try {
      const result = await userAPI.create(user);
      logger.info('UserService::createUser completed successfully', { userId: result.id });
      return result;
    } catch (error) {
      logger.error('UserService::createUser failed', error);
      throw wrapServiceError(error, 'User service failed while creating user');
    }
  }

  async fetchUsers(): Promise<User[]> {
    logger.info('UserService::fetchUsers initiated');
    try {
      const result = await userAPI.getAll();
      logger.info('UserService::fetchUsers completed successfully', { count: result.length });
      return result;
    } catch (error) {
      logger.error('UserService::fetchUsers failed', error);
      throw wrapServiceError(error, 'User service failed while getting all the users');
    }
  }

  async getAuthenticatedUserById(id: string): Promise<User | null> {
    logger.info('UserService::getAuthenticatedUserById initiated', { userId: id });
    try {
      const result = await userAPI.getAuthenticatedUserById(id);
      logger.info('UserService::getAuthenticatedUserById completed successfully', { userId: id });
      return result;
    } catch (error) {
      logger.error('UserService::getAuthenticatedUserById failed', error);
      throw wrapServiceError(error, 'User service failed while getting authenticated user by id');
    }
  }

  async modifyUser(id: string, updatedUser: Partial<User>): Promise<User | null> {
    logger.info('UserService::modifyUser initiated', { userId: id });
    try {
      const result = await userAPI.update(id, updatedUser);
      logger.info('UserService::modifyUser completed successfully', { userId: id });
      return result;
    } catch (error) {
      logger.error('UserService::modifyUser failed', error);
      throw wrapServiceError(error, 'User service failed while updating user');
    }
  }

  async removeUser(id: string): Promise<boolean> {
    logger.info('UserService::removeUser initiated', { userId: id });
    try {
      await userAPI.delete(id);
      logger.info('UserService::removeUser completed successfully', { userId: id });
      return true;
    } catch (error) {
      logger.error('UserService::removeUser failed', error);
      throw wrapServiceError(error, 'User service failed while deleting user');
    }
  }

  async activateUser(activationToken: string, input: ActivationInput): Promise<boolean> {
    logger.info('UserService::activateUser initiated');
    try {
      await userAPI.activateUser(activationToken, input);
      logger.info('UserService::activateUser completed successfully');
      return true;
    } catch (error) {
      logger.error('UserService::activateUser failed', error);
      throw wrapServiceError(error, 'User service failed while activating user');
    }
  }

  async resendActivationToken(activationToken: string): Promise<boolean> {
    logger.info('UserService::resendActivationToken initiated');
    try {
      await userAPI.resendActivationToken(activationToken);
      logger.info('UserService::resendActivationToken completed successfully');
    } catch (error) {
      logger.error('UserService::resendActivationToken failed', error);
      throw wrapServiceError(error, 'User service failed while resending activation token');
    }
    return true;
  }

  async validateToken(activationToken: string): Promise<boolean> {
    logger.info('UserService::validateToken initiated');
    try {
      await userAPI.validateToken(activationToken);
      logger.info('UserService::validateToken completed successfully');
      return true;
    } catch (error) {
      logger.error('UserService::validateToken failed', error);
      throw wrapServiceError(error, 'User service failed while validating token');
    }
  }

}

export default new UserService();
