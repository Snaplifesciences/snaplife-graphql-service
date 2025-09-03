import { userAPI, StatusResponse } from '../../datasources/userAPI';
import { wrapServiceError } from '../../error/apiErrorUtils';
import { logger } from '../../utils/logger';
import { CreateUserInput, UpdateUserInput, User, ActivateAccountInput } from '../types/user';

class UserService {
  async createUser(user: CreateUserInput): Promise<User> {
    const sanitizedUser = {
      email: user.email?.replace(/[\r\n]/g, '') || 'unknown',
      firstName: user.firstName || 'unknown',
      lastName: user.lastName || 'unknown'
    };
    logger.info('UserService::createUser initiated', { user: sanitizedUser });
    try {
      const result = await userAPI.create(user as Partial<User>);
      logger.info('UserService::createUser completed successfully', { userId: result.id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('UserService::createUser failed', { error: errorMessage });
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('UserService::fetchUsers failed', { error: errorMessage });
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('UserService::getAuthenticatedUserById failed', { error: errorMessage });
      throw wrapServiceError(error, 'User service failed while getting authenticated user by id');
    }
  }

  async modifyUser(id: string, updatedUser: UpdateUserInput): Promise<User | null> {
    if (!updatedUser || typeof updatedUser !== 'object') {
      throw new Error('Invalid user data: must be a valid object');
    }
    logger.info('UserService::modifyUser initiated', { userId: id });
    try {
      const result = await userAPI.update(id, updatedUser as Partial<User>);
      logger.info('UserService::modifyUser completed successfully', { userId: id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('UserService::modifyUser failed', { error: errorMessage });
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('UserService::removeUser failed', { error: errorMessage });
      throw wrapServiceError(error, 'User service failed while deleting user');
    }
  }

  async setupProfile(activationToken: string, input: ActivateAccountInput): Promise<StatusResponse> {
    const sanitizedToken = activationToken.substring(0, 8) + '...';
    logger.info('UserService::setupProfile initiated', { activationToken: sanitizedToken });
    // The API layer now handles errors gracefully and returns a status object.
    return userAPI.activateUser(activationToken, input);
  }

  async resendActivationToken(activationToken: string): Promise<StatusResponse> {
    logger.info('UserService::resendActivationToken initiated');
    // The API layer now handles errors gracefully and returns a status object.
    return userAPI.resendActivationToken(activationToken);
  }

  async validateToken(activationToken: string): Promise<StatusResponse> {
    logger.info('UserService::validateToken initiated');
    // The API layer now handles errors gracefully and returns a status object.
    return userAPI.validateToken(activationToken);
  }

}

export default new UserService();