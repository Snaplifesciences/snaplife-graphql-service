export const contactTypeDefs = `#graphql
  """
  Audit information for tracking creation and updates
  """
  type Audit {
    "Timestamp when the record was created"
    createdAt: String!
    "User or service that created the record"
    createdBy: String!
    "Timestamp when the record was last updated"
    updatedAt: String!
    "User or service that last updated the record"
    updatedBy: String!
  }

  """
  Contact information for company representatives
  """
  type Contact {
    "Unique identifier for the contact"
    id: ID!
    "Current status of the contact (e.g., ACTIVE, INACTIVE)"
    status: String!
    "Contact's first name"
    firstName: String!
    "Contact's last name"
    lastName: String!
    "Contact's email address"
    email: String!
    "Contact's phone number (optional)"
    phone: String
    "Contact's job title (e.g., ANALYST, ENGINEER)"
    jobTitle: String
    "ID of the company this contact belongs to"
    companyId: String!
    "Detailed company information"
    company: Company
    "Audit information for tracking changes (optional)"
    audit: Audit
  }

  """
  Input for creating a new contact
  """
  input CreateContactInput {
    "Contact's first name"
    firstName: String!
    "Contact's last name"
    lastName: String!
    "Contact's email address"
    email: String!
    "Contact's phone number (optional)"
    phone: String
    "Contact's job title"
    jobTitle: String
    "Contact's professional title"
    title: String
    "ID of the company this contact belongs to"
    companyId: String!
  }

  """
  Input for updating an existing contact
  """
  input UpdateContactInput {
    "Updated first name"
    firstName: String
    "Updated last name"
    lastName: String
    "Updated email address"
    email: String
    "Updated phone number"
    phone: String
    "Updated job title"
    jobTitle: String
    "Status of the contact (e.g., ACTIVE, INACTIVE)"
    status: String
  }

  extend type Query {
    "Retrieve all contacts based on user's permissions"
    contacts: [Contact!]!
  }

  extend type Mutation {
    """
    Create a new contact
    Requires MANAGE_CONTACTS permission
    """
    createContact(input: CreateContactInput!): Contact!

    """
    Update an existing contact
    Requires MANAGE_CONTACTS permission
    """
    updateContact(id: ID!, input: UpdateContactInput!): Contact!

    """
    Delete a contact
    Requires MANAGE_CONTACTS permission
    Returns true if deletion was successful
    """
    deleteContact(id: ID!): Boolean!
  }
`;
