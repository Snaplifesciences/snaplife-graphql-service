import { Contact, CreateContactInput, UpdateContactInput } from '../types/contact';
import { contactAPI } from '../../datasources/contactAPI';
import { logger } from '../../utils/logger';

class ContactService {
  async getContacts(): Promise<Contact[]> {
    try {
      return await contactAPI.getAll();
    } catch (error) {
      logger.error('ContactService::getContacts - Failed to fetch contacts', { error });
      throw error;
    }
  }

  async getContactsByOrganizationId(organizationId: string): Promise<Contact[]> {
    try {
      return await contactAPI.getContactsByOrganizationId(organizationId);
    } catch (error) {
      logger.error('ContactService::getContactsByOrganizationId - Failed to fetch contacts', {
        organizationId,
        error
      });
      throw error;
    }
  }

  async getContactsByCompanyId(companyId: string): Promise<Contact[]> {
    try {
      return await contactAPI.getContactsByCompanyId(companyId);
    } catch (error) {
      logger.error('ContactService::getContactsByCompanyId - Failed to fetch contacts', {
        companyId,
        error
      });
      throw error;
    }
  }

  async getById(id: string): Promise<Contact | null> {
    try {
      return await contactAPI.getById(id);
    } catch (error) {
      logger.error('ContactService::getById - Failed to fetch contact', {
        contactId: id,
        error
      });
      throw error;
    }
  }

  async createContact(input: CreateContactInput): Promise<Contact> {
    try {
      return await contactAPI.create(input);
    } catch (error) {
      logger.error('ContactService::createContact - Failed to create contact', {
        input,
        error
      });
      throw error;
    }
  }

  async updateContact(id: string, input: UpdateContactInput): Promise<Contact> {
    try {
      return await contactAPI.update(id, input);
    } catch (error) {
      logger.error('ContactService::updateContact - Failed to update contact', {
        contactId: id,
        input,
        error
      });
      throw error;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      return await contactAPI.delete(id);
    } catch (error) {
      logger.error('ContactService::deleteContact - Failed to delete contact', {
        contactId: id,
        error
      });
      throw error;
    }
  }
}

// Export singleton instance
export default new ContactService();
