---
"emdash": patch
---

Fixes EmDash on sites that set Astro's `trailingSlash: "always"`. The admin, the REST API, OAuth sign-in and the MCP OAuth discovery documents returned 404 when requested without a trailing slash, so the admin could not load and MCP clients such as Claude and Codex could not connect. EmDash now serves these routes with or without the slash, and an unauthenticated request to `/_emdash/api/mcp/` returns the same OAuth discovery `401` as `/_emdash/api/mcp`.
