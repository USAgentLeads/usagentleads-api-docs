# USAgentLeads API documentation

Mintlify documentation for the USAgentLeads v3 API.

The v3 application and SQL migration are deployed. Growth and Pro accounts can use the direct-contact endpoints.

Run `npm run validate` to validate OpenAPI, all configured MDX pages and assets. Generate schemas, endpoint pages and the MCP tool manifest from the application repository with `bun scripts/generate-api-v3-docs.mjs`.

The v3 quickstart returns contacts directly. Guides document credit caps, idempotent recovery, account/IP/concurrency rate limits, suppression, snapshot cursors, asynchronous exports and search recovery.

The existing worker continues to serve docs; it does not authenticate or execute data API calls.

Name-based agent lookup and name filters are defined in the generated v3.1 contract. The application release requires migration `20261031134658_api_v3_agent_name_lookup` before serving these requests. The docs include a preview-first workflow for selecting IDs and exporting available business addresses.
