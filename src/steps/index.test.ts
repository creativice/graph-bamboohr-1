import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../types';
import { fetchUsers } from './access';
import { fetchAccountDetails } from './account';
import { fetchCompanyDetails } from './company';
import { fetchCompanyFiles } from './company-files';
import { fetchEmployeeFiles } from './employee-files';

const DEFAULT_CLIENT_NAMESPACE = 'creativicetrial';
const DEFAULT_CLIENT_ACCESS_TOKEN = 'client_access_token';

const integrationConfig: IntegrationConfig = {
  clientNamespace: process.env.CLIENT_NAMESPACE || DEFAULT_CLIENT_NAMESPACE,
  clientAccessToken:
    process.env.CLIENT_ACCESS_TOKEN || DEFAULT_CLIENT_ACCESS_TOKEN,
};

jest.setTimeout(1000 * 100);

test('should collect data', async () => {
  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  // Simulates dependency graph execution.
  // See https://github.com/JupiterOne/sdk/issues/262.
  await fetchAccountDetails(context);
  await fetchCompanyDetails(context);
  await fetchUsers(context);
  await fetchCompanyFiles(context);
  await fetchEmployeeFiles(context);

  // Review snapshot, failure is a regression
  expect({
    numCollectedEntities: context.jobState.collectedEntities.length,
    numCollectedRelationships: context.jobState.collectedRelationships.length,
    collectedEntities: context.jobState.collectedEntities,
    collectedRelationships: context.jobState.collectedRelationships,
    encounteredTypes: context.jobState.encounteredTypes,
  }).toMatchSnapshot();

  const accounts = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('Account'),
  );
  expect(accounts.length).toBeGreaterThan(0);
  expect(accounts).toMatchGraphObjectSchema({
    _class: ['Account'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'bamboohr_account' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
        id: {
          type: 'string',
        },
        webLink: {
          type: 'string',
        },
        displayName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
      required: [],
    },
  });

  const companies = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('Organization'),
  );
  expect(companies.length).toBeGreaterThan(0);
  expect(companies).toMatchGraphObjectSchema({
    _class: ['Organization'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'bamboohr_company' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
        name: {
          type: 'string',
        },
        webLink: {
          type: 'string',
        },
      },
      required: [],
    },
  });

  const users = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('User'),
  );
  expect(users.length).toBeGreaterThan(0);
  expect(users).toMatchGraphObjectSchema({
    _class: ['User'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'bamboohr_user' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
        id: {
          type: 'string',
        },
        webLink: {
          type: 'string',
        },
        employeeId: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        displayName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
      required: [],
    },
  });

  const companyFiles = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('DataObject'),
  );
  expect(companyFiles.length).toBeGreaterThan(0);
  expect(companyFiles).toMatchGraphObjectSchema({
    _class: ['DataObject'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'bamboohr_file' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
        id: {
          type: 'string',
        },
        webLink: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        classification: {
          type: 'string',
        },
      },
      required: [],
    },
  });

  const employeeFiles = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('DataObject'),
  );
  expect(employeeFiles.length).toBeGreaterThan(0);
  expect(employeeFiles).toMatchGraphObjectSchema({
    _class: ['DataObject'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'bamboohr_file' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
        id: {
          type: 'string',
        },
        webLink: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        classification: {
          type: 'string',
        },
      },
      required: [],
    },
  });
});
