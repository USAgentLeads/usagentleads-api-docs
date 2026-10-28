# USAgentLeads API documentation

Mintlify documentation for the v3 API redesign, with the v2 reference retained at openapi-v2.json.

The v3 application and SQL migration are deployed. Growth and Pro accounts can use the direct-contact endpoints; v2 remains supported during migration.

Run `npm run validate` to validate OpenAPI, all configured MDX pages and assets. Generate schemas, endpoint pages and the MCP tool manifest from the application repository with `bun scripts/generate-api-v3-docs.mjs`.

The v3 quickstart returns contacts directly. Guides document credit caps, idempotent recovery, account/IP/concurrency rate limits, suppression, snapshot cursors, asynchronous exports and the v2 migration.

The existing worker continues to serve docs; it does not authenticate or execute data API calls.
