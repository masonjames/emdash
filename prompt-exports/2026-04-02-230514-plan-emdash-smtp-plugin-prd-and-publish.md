<user_instructions>
<taskname="Emdash SMTP PRD"/>
<task>Plan and specify a production-ready `emdash-smtp` plugin for EmDash (repo/package target: `masonjames/emdash-smtp`, npm scope like `@masonjames`). Do not implement code. Produce an execution-ready plan and documentation spec that another engineer can follow to build, package, document, and publish the plugin with production quality UX and Gravity SMTP feature/provider parity. Treat auth/publish credentials as user-supplied runtime steps; do not embed secrets.</task>

<architecture>
EmDash plugin system and publishing:
- Plugin docs and conventions are defined in `emdash/docs/src/content/docs/plugins/*.mdx`.
- Runtime plugin model is centered on `definePlugin`, manifest schema/types, hook registration, settings routes, admin UI routes, and sandbox support.
- Publish flow is implemented by CLI commands `emdash plugin bundle` and `emdash plugin publish` with validation, bundling, and marketplace publishing semantics.

Email-specific integration path in EmDash:
- Email delivery uses plugin hooks (notably exclusive hook behavior), provider selection/settings APIs, and runtime hook resolution.
- Core files show how exclusive hooks are managed and how selected handlers are resolved at runtime.

Reference plugin patterns:
- `packages/plugins/marketplace-test` shows a minimal standard/sandboxed plugin shape and package metadata.
- `packages/plugins/atproto` and `emdash-restrict-with-stripe` show more complete plugin descriptor/runtime/admin route composition patterns.

Gravity SMTP parity reference:
- Provider inventory and connector architecture are defined by Gravity SMTP connector service/config/factory classes.
- Operational surfaces include alerts, logging/debug, suppression, tracking, migration, and managed email controls.
</architecture>

<selected_context>
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/overview.mdx: Official plugin concepts, native vs standard plugin format context.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/creating-plugins.mdx: Canonical plugin scaffolding and structure expectations.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/installing.mdx: Installation flow and `astro.config.mjs` integration requirements.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/publishing.mdx: Packaging + marketplace publishing guidance (`emdash plugin publish`).
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/hooks.mdx: Hook contracts and registration model.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/settings.mdx: Plugin settings registration/API patterns.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/storage.mdx: Plugin storage APIs and persistence conventions.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/api-routes.mdx: API route extension patterns for plugins.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/admin-ui.mdx: Admin UI integration patterns.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/sandbox.mdx: Sandboxed/standard plugin constraints and entrypoints.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/block-kit.mdx: Block Kit/UI extension patterns relevant to polished UX planning.

/Users/masonjames/Projects/emdash/packages/core/src/plugins/types.ts: Core plugin, hook, settings, descriptor, and runtime types.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manifest-schema.ts: Manifest validation schema used in bundling/publishing.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/define-plugin.ts: Authoring helper for plugin runtime declaration.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manager.ts: Plugin registration/lifecycle management.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/hooks.ts: Hook registry/execution behavior, including exclusive hook mechanics.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/email.ts: Email hook/provider integration points.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/email-console.ts: Dev email provider behavior and diagnostics context.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/context.ts: Runtime context passed into plugin handlers.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/routes.ts: Plugin route registration and integration.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/state.ts: Plugin state and registration internals.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/adapt-sandbox-entry.ts: Sandbox entry adaptation and capability mapping.

/Users/masonjames/Projects/emdash/packages/core/src/astro/integration/index.ts: Astro integration entry for plugin system.
/Users/masonjames/Projects/emdash/packages/core/src/astro/integration/runtime.ts: Runtime bootstrapping and plugin load path.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/settings/email.ts: Email settings API route surface.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/admin/hooks/exclusive/index.ts: Exclusive hook listing/inspection API.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/admin/hooks/exclusive/[hookName].ts: Exclusive hook selection/update API.
/Users/masonjames/Projects/emdash/packages/core/src/emdash-runtime.ts: Full runtime wiring for plugins, hooks, settings, and marketplace loading.

/Users/masonjames/Projects/emdash/packages/core/src/cli/commands/bundle.ts: Plugin bundling implementation and artifact structure.
/Users/masonjames/Projects/emdash/packages/core/src/cli/commands/publish.ts: Publish workflow, validation, auth, version checks, registry interactions.

/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/src/index.ts: Standard plugin descriptor example.
/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/src/sandbox-entry.ts: Sandboxed backend/admin entry example.
/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/package.json: Plugin package metadata conventions.
/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/README.md: Minimal plugin usage and local testing notes.
/Users/masonjames/Projects/emdash/packages/plugins/atproto/src/index.ts: Production plugin descriptor pattern.
/Users/masonjames/Projects/emdash/packages/plugins/atproto/src/sandbox-entry.ts: Production-grade sandbox route/admin pattern.

/Users/masonjames/Projects/emdash-restrict-with-stripe/src/index.ts: Plugin descriptor for standalone repo plugin.
/Users/masonjames/Projects/emdash-restrict-with-stripe/src/plugin.ts: Runtime/plugin definition pattern in a separate plugin repo.
/Users/masonjames/Projects/emdash-restrict-with-stripe/README.md: Installation/configuration docs style for plugin consumers.

/Users/masonjames/Projects/gravitysmtp/includes/connectors/class-connector-service-provider.php: Authoritative provider list and connector registration order.
/Users/masonjames/Projects/gravitysmtp/includes/connectors/class-connector-factory.php: Connector instantiation strategy.
/Users/masonjames/Projects/gravitysmtp/includes/connectors/config/class-connector-config.php: Connector settings config pattern.
/Users/masonjames/Projects/gravitysmtp/includes/connectors/config/class-connector-endpoints-config.php: Connector endpoint exposure pattern.
/Users/masonjames/Projects/gravitysmtp/includes/alerts/config/class-alerts-config.php: Alerts UX/config surface.
/Users/masonjames/Projects/gravitysmtp/includes/email-management/class-email-management-service-provider.php: Managed email feature surface.
/Users/masonjames/Projects/gravitysmtp/includes/email-management/config/class-managed-email-types-config.php: Managed email types config.
/Users/masonjames/Projects/gravitysmtp/includes/logging/class-logging-service-provider.php: Logging/debug capability surface.
/Users/masonjames/Projects/gravitysmtp/includes/logging/config/class-logging-endpoints-config.php: Logging API endpoints surface.
/Users/masonjames/Projects/gravitysmtp/includes/suppression/class-suppression-service-provider.php: Suppression list feature surface.
/Users/masonjames/Projects/gravitysmtp/includes/suppression/config/class-suppression-settings-config.php: Suppression settings model.
/Users/masonjames/Projects/gravitysmtp/includes/tracking/class-tracking-service-provider.php: Tracking/open events feature surface.
/Users/masonjames/Projects/gravitysmtp/includes/migration/class-migration-service-provider.php: Migration framework surface.
/Users/masonjames/Projects/gravitysmtp/includes/migration/config/class-migration-endpoints-config.php: Migration endpoint surface.
/Users/masonjames/Projects/gravitysmtp/CLAUDE.md: High-level architecture and UX/features summary.
</selected_context>

<relationships>
- `astro.config.mjs` plugin installation -> EmDash Astro integration runtime -> plugin manifest + backend/admin entry loading.
- `definePlugin` + `types.ts` + `manifest-schema.ts` -> governs valid plugin capabilities and publishability.
- Exclusive hook APIs (`/api/admin/hooks/exclusive/*`) -> select active implementation for hooks like email delivery.
- `emdash plugin bundle` -> manifest extraction + admin/backend bundling -> tarball artifact.
- `emdash plugin publish` -> auth/version/audit checks -> marketplace publication.
- Gravity SMTP connector service provider -> defines provider coverage baseline to mirror in emdash-smtp planning.
- emdash-restrict-with-stripe and atproto/marketplace-test -> concrete repo/package and runtime patterns to emulate for production plugin UX and structure.
</relationships>

<provider_parity_baseline>
Target parity providers from Gravity SMTP connector registration:
- Amazon SES
- Brevo
- Elastic Email
- Emailit
- Generic SMTP
- Google/Gmail
- Mailchimp
- MailerSend
- Mailgun
- Mailjet
- Microsoft
- PHP Mail
- Postmark
- Resend
- SendGrid
- SMTP2GO
- SparkPost
- Zoho
</provider_parity_baseline>

<deliverables>
Produce markdown planning docs (no implementation) for `emdash-smtp`:
- PRD (`docs/prd.md`): goals, non-goals, personas, UX principles, feature matrix, provider parity matrix, acceptance criteria, release gates.
- Technical architecture spec (`docs/architecture.md`): package layout, plugin format decision (native vs standard + rationale), runtime boundaries, hook strategy, settings/admin/API/storage model, security and sandboxing.
- Provider implementation plan (`docs/providers.md`): per-provider auth method, required secrets, scopes/permissions, API/send strategy, fallback/retry behavior, testing plan.
- UX/product spec (`docs/ux.md`): IA, setup wizard, provider onboarding flows, diagnostics/logging UX, backup routing UX, suppression/tracking UX, migration UX, delight details.
- Publishing/release runbook (`docs/release.md`): repo bootstrap, package metadata, npm scope publish workflow with user credentials, semantic versioning, changelog strategy, `emdash plugin publish` workflow.
- Integration guide (`README.md` + `docs/install.md`): install from npm scope, `astro.config.mjs` configuration examples, environment variable contract, local validation and smoke test steps.
- Execution plan (`docs/implementation-plan.md`): phased milestones, dependencies, risk register, test matrix, definition of done.
</deliverables>

<constraints>
- Do not include any raw npm/auth tokens in docs or prompts.
- Treat publishing auth as explicit operator steps (npm login/token setup by user, EmDash publish auth by user).
- Keep plan production-ready: reliability, observability, migration strategy, and UX polish are required.
- Ensure plan is actionable for creating new repository/package `masonjames/emdash-smtp` and publishing under Mason James-controlled npm scope.
</constraints>

<ambiguities>
- Exact parity interpretation: Gravity SMTP includes broad operational surfaces (alerts, suppression, tracking, migration, managed email controls). Confirm whether parity means all surfaces in v1 or staged parity with explicit phase gates.
- Plugin format choice: EmDash supports native and standard formats; marketplace publication expectations favor standard packaging. Confirm final distribution strategy (single format vs dual support).
- Provider depth: Some providers may support multiple auth variants/modes; confirm minimum acceptable per-provider scope for v1 parity.
</ambiguities>
</user_instructions>
<file_map>
/Users/masonjames/Projects/emdash-smtp

/Users/masonjames/Projects/emdash
├── docs
│   ├── src
│   │   ├── content
│   │   │   └── docs
│   │   │       ├── plugins
│   │   │       │   ├── admin-ui.mdx *
│   │   │       │   ├── api-routes.mdx *
│   │   │       │   ├── block-kit.mdx *
│   │   │       │   ├── creating-plugins.mdx *
│   │   │       │   ├── hooks.mdx *
│   │   │       │   ├── installing.mdx *
│   │   │       │   ├── overview.mdx *
│   │   │       │   ├── publishing.mdx *
│   │   │       │   ├── sandbox.mdx *
│   │   │       │   ├── settings.mdx *
│   │   │       │   └── storage.mdx *
│   │   │       ├── coming-from
│   │   │       ├── concepts
│   │   │       ├── contributing
│   │   │       ├── deployment
│   │   │       ├── guides
│   │   │       ├── migration
│   │   │       ├── reference
│   │   │       └── themes
│   │   ├── assets
│   │   │   └── screenshots
│   │   └── styles
│   └── public
├── packages
│   ├── core
│   │   ├── src
│   │   │   ├── astro
│   │   │   │   ├── integration
│   │   │   │   │   ├── index.ts * +
│   │   │   │   │   └── runtime.ts * +
│   │   │   │   ├── routes
│   │   │   │   │   └── api
│   │   │   │   │       ├── admin
│   │   │   │   │       │   ├── hooks
│   │   │   │   │       │   │   └── exclusive
│   │   │   │   │       │   │       ├── [hookName].ts * +
│   │   │   │   │       │   │       └── index.ts * +
│   │   │   │   │       │   ├── allowed-domains
│   │   │   │   │       │   ├── api-tokens
│   │   │   │   │       │   ├── bylines
│   │   │   │   │       │   │   └── [id]
│   │   │   │   │       │   ├── comments
│   │   │   │   │       │   │   └── [id]
│   │   │   │   │       │   ├── oauth-clients
│   │   │   │   │       │   ├── plugins
│   │   │   │   │       │   │   ├── [id]
│   │   │   │   │       │   │   └── marketplace
│   │   │   │   │       │   │       └── [id]
│   │   │   │   │       │   ├── themes
│   │   │   │   │       │   │   └── marketplace
│   │   │   │   │       │   │       └── [id]
│   │   │   │   │       │   └── users
│   │   │   │   │       │       └── [id]
│   │   │   │   │       ├── settings
│   │   │   │   │       │   └── email.ts * +
│   │   │   │   │       ├── auth
│   │   │   │   │       │   ├── invite
│   │   │   │   │       │   ├── magic-link
│   │   │   │   │       │   ├── oauth
│   │   │   │   │       │   │   └── [provider]
│   │   │   │   │       │   ├── passkey
│   │   │   │   │       │   │   └── register
│   │   │   │   │       │   └── signup
│   │   │   │   │       ├── comments
│   │   │   │   │       │   └── [collection]
│   │   │   │   │       │       └── [contentId]
│   │   │   │   │       ├── content
│   │   │   │   │       │   └── [collection]
│   │   │   │   │       │       └── [id]
│   │   │   │   │       │           └── terms
│   │   │   │   │       ├── dev
│   │   │   │   │       ├── import
│   │   │   │   │       │   ├── wordpress
│   │   │   │   │       │   └── wordpress-plugin
│   │   │   │   │       ├── media
│   │   │   │   │       │   ├── [id]
│   │   │   │   │       │   ├── file
│   │   │   │   │       │   └── providers
│   │   │   │   │       │       └── [providerId]
│   │   │   │   │       ├── menus
│   │   │   │   │       │   └── [name]
│   │   │   │   │       ├── oauth
│   │   │   │   │       │   ├── device
│   │   │   │   │       │   └── token
│   │   │   │   │       ├── plugins
│   │   │   │   │       │   └── [pluginId]
│   │   │   │   │       ├── redirects
│   │   │   │   │       │   └── 404s
│   │   │   │   │       ├── revisions
│   │   │   │   │       │   └── [revisionId]
│   │   │   │   │       ├── schema
│   │   │   │   │       │   ├── collections
│   │   │   │   │       │   │   └── [slug]
│   │   │   │   │       │   │       └── fields
│   │   │   │   │       │   └── orphans
│   │   │   │   │       ├── search
│   │   │   │   │       ├── sections
│   │   │   │   │       ├── setup
│   │   │   │   │       ├── taxonomies
│   │   │   │   │       │   └── [name]
│   │   │   │   │       │       └── terms
│   │   │   │   │       ├── themes
│   │   │   │   │       ├── well-known
│   │   │   │   │       └── widget-areas
│   │   │   │   │           └── [name]
│   │   │   │   │               └── widgets
│   │   │   │   ├── middleware
│   │   │   │   └── storage
│   │   │   ├── cli
│   │   │   │   ├── commands
│   │   │   │   │   ├── import
│   │   │   │   │   ├── bundle.ts * +
│   │   │   │   │   └── publish.ts * +
│   │   │   │   └── wxr
│   │   │   ├── plugins
│   │   │   │   ├── sandbox
│   │   │   │   ├── scheduler
│   │   │   │   ├── adapt-sandbox-entry.ts * +
│   │   │   │   ├── context.ts * +
│   │   │   │   ├── define-plugin.ts * +
│   │   │   │   ├── email-console.ts * +
│   │   │   │   ├── email.ts * +
│   │   │   │   ├── hooks.ts * +
│   │   │   │   ├── manager.ts * +
│   │   │   │   ├── manifest-schema.ts * +
│   │   │   │   ├── routes.ts * +
│   │   │   │   ├── state.ts * +
│   │   │   │   └── types.ts * +
│   │   │   ├── api
│   │   │   │   ├── handlers
│   │   │   │   ├── openapi
│   │   │   │   └── schemas
│   │   │   ├── auth
│   │   │   ├── bylines
│   │   │   ├── client
│   │   │   ├── comments
│   │   │   ├── components
│   │   │   │   ├── marks
│   │   │   │   └── widgets
│   │   │   ├── content
│   │   │   │   └── converters
│   │   │   ├── database
│   │   │   │   ├── migrations
│   │   │   │   └── repositories
│   │   │   ├── db
│   │   │   ├── fields
│   │   │   ├── i18n
│   │   │   ├── import
│   │   │   │   ├── ghost
│   │   │   │   └── sources
│   │   │   ├── mcp
│   │   │   ├── media
│   │   │   ├── menus
│   │   │   ├── page
│   │   │   ├── preview
│   │   │   ├── redirects
│   │   │   ├── schema
│   │   │   ├── search
│   │   │   ├── sections
│   │   │   ├── seed
│   │   │   ├── seo
│   │   │   ├── settings
│   │   │   ├── storage
│   │   │   ├── taxonomies
│   │   │   ├── utils
│   │   │   ├── visual-editing
│   │   │   ├── widgets
│   │   │   └── emdash-runtime.ts * +
│   │   ├── dist
│   │   │   ├── astro
│   │   │   │   └── middleware
│   │   │   ├── cli
│   │   │   ├── client
│   │   │   ├── db
│   │   │   ├── media
│   │   │   ├── page
│   │   │   ├── plugins
│   │   │   ├── seed
│   │   │   ├── seo
│   │   │   └── storage
│   │   └── tests
│   │       ├── database
│   │       │   └── repositories
│   │       ├── fields
│   │       ├── integration
│   │       │   ├── auth
│   │       │   ├── cli
│   │       │   ├── client
│   │       │   ├── comments
│   │       │   ├── database
│   │       │   ├── fixture
│   │       │   │   ├── .astro
│   │       │   │   ├── .emdash
│   │       │   │   └── src
│   │       │   │       └── pages
│   │       │   │           └── posts
│   │       │   ├── i18n
│   │       │   ├── openapi
│   │       │   ├── plugins
│   │       │   ├── redirects
│   │       │   ├── seo
│   │       │   ├── smoke
│   │       │   ├── snapshot
│   │       │   ├── wordpress-import
│   │       │   │   └── fixtures
│   │       │   └── wordpress-migration
│   │       ├── unit
│   │       │   ├── api
│   │       │   ├── astro
│   │       │   ├── auth
│   │       │   ├── bylines
│   │       │   ├── cli
│   │       │   ├── client
│   │       │   ├── converters
│   │       │   ├── database
│   │       │   │   ├── migrations
│   │       │   │   └── repositories
│   │       │   ├── fields
│   │       │   ├── import
│   │       │   ├── mcp
│   │       │   ├── media
│   │       │   ├── menus
│   │       │   ├── plugins
│   │       │   ├── preview
│   │       │   ├── redirects
│   │       │   ├── schema
│   │       │   ├── seed
│   │       │   ├── settings
│   │       │   ├── taxonomies
│   │       │   ├── url-pattern
│   │       │   ├── visual-editing
│   │       │   └── widgets
│   │       └── utils
│   ├── plugins
│   │   ├── atproto
│   │   │   ├── src
│   │   │   │   ├── index.ts * +
│   │   │   │   └── sandbox-entry.ts * +
│   │   │   └── tests
│   │   ├── marketplace-test
│   │   │   ├── src
│   │   │   │   ├── index.ts * +
│   │   │   │   └── sandbox-entry.ts * +
│   │   │   ├── dist
│   │   │   ├── screenshots
│   │   │   ├── README.md *
│   │   │   └── package.json *
│   │   ├── ai-moderation
│   │   │   ├── src
│   │   │   └── tests
│   │   ├── api-test
│   │   │   └── src
│   │   ├── audit-log
│   │   │   └── src
│   │   ├── color
│   │   │   └── src
│   │   ├── embeds
│   │   │   └── src
│   │   │       └── astro
│   │   ├── forms
│   │   │   └── src
│   │   │       ├── astro
│   │   │       ├── client
│   │   │       ├── handlers
│   │   │       └── styles
│   │   ├── sandboxed-test
│   │   │   ├── dist
│   │   │   └── src
│   │   └── webhook-notifier
│   │       └── src
│   ├── admin
│   │   ├── dist
│   │   ├── src
│   │   │   ├── components
│   │   │   │   ├── auth
│   │   │   │   ├── comments
│   │   │   │   ├── editor
│   │   │   │   ├── settings
│   │   │   │   └── users
│   │   │   ├── lib
│   │   │   │   └── api
│   │   │   └── routes
│   │   └── tests
│   │       ├── components
│   │       │   ├── settings
│   │       │   └── users
│   │       ├── editor
│   │       ├── lib
│   │       └── utils
│   ├── auth
│   │   ├── dist
│   │   │   ├── adapters
│   │   │   ├── oauth
│   │   │   │   └── providers
│   │   │   └── passkey
│   │   └── src
│   │       ├── adapters
│   │       ├── magic-link
│   │       ├── oauth
│   │       │   └── providers
│   │       └── passkey
│   ├── blocks
│   │   ├── dist
│   │   ├── playground
│   │   │   ├── dist
│   │   │   │   └── assets
│   │   │   └── src
│   │   ├── src
│   │   │   ├── blocks
│   │   │   └── elements
│   │   └── tests
│   ├── cloudflare
│   │   ├── dist
│   │   │   ├── auth
│   │   │   ├── cache
│   │   │   ├── db
│   │   │   ├── media
│   │   │   ├── plugins
│   │   │   ├── sandbox
│   │   │   └── storage
│   │   ├── src
│   │   │   ├── auth
│   │   │   ├── cache
│   │   │   ├── db
│   │   │   ├── media
│   │   │   ├── plugins
│   │   │   ├── sandbox
│   │   │   └── storage
│   │   └── tests
│   │       └── db
│   ├── create-emdash
│   │   ├── dist
│   │   └── src
│   ├── gutenberg-to-portable-text
│   │   ├── dist
│   │   ├── src
│   │   │   └── transformers
│   │   └── tests
│   ├── marketplace
│   │   ├── src
│   │   │   ├── audit
│   │   │   ├── db
│   │   │   ├── routes
│   │   │   └── workflows
│   │   └── tests
│   │       └── fixtures
│   │           └── audit
│   │               ├── benign-network-usage
│   │               ├── brand-impersonation
│   │               ├── clean-seo-plugin
│   │               ├── clean-with-images
│   │               ├── credential-harvester
│   │               ├── crypto-miner
│   │               ├── data-exfiltration
│   │               ├── dynamic-url-construction
│   │               ├── hate-imagery
│   │               ├── misleading-screenshot
│   │               ├── obfuscated-payload
│   │               ├── prompt-injection
│   │               └── social-engineering
│   └── x402
│       ├── dist
│       ├── src
│       └── tests
├── .changeset
├── .claude
├── .github
│   └── workflows
├── assets
│   └── templates
│       ├── blog
│       │   └── latest
│       ├── marketing
│       │   └── latest
│       └── portfolio
│           └── latest
├── demos
│   ├── cloudflare
│   │   ├── plugins
│   │   │   └── sandbox-test
│   │   ├── scripts
│   │   ├── seed
│   │   └── src
│   │       ├── components
│   │       ├── layouts
│   │       ├── pages
│   │       │   ├── category
│   │       │   ├── pages
│   │       │   ├── posts
│   │       │   └── tag
│   │       ├── styles
│   │       └── utils
│   ├── playground
│   │   ├── seed
│   │   └── src
│   │       ├── components
│   │       ├── layouts
│   │       ├── pages
│   │       │   ├── category
│   │       │   ├── pages
│   │       │   ├── posts
│   │       │   └── tag
│   │       ├── styles
│   │       └── utils
│   ├── plugins-demo
│   │   └── src
│   │       └── pages
│   │           └── posts
│   ├── postgres
│   │   ├── seed
│   │   └── src
│   │       ├── components
│   │       ├── layouts
│   │       ├── pages
│   │       │   ├── category
│   │       │   ├── pages
│   │       │   ├── posts
│   │       │   └── tag
│   │       ├── styles
│   │       └── utils
│   ├── preview
│   │   └── src
│   │       ├── components
│   │       ├── layouts
│   │       ├── pages
│   │       │   ├── category
│   │       │   ├── pages
│   │       │   ├── posts
│   │       │   └── tag
│   │       ├── styles
│   │       └── utils
│   └── simple
│       ├── seed
│       └── src
│           ├── components
│           ├── layouts
│           ├── pages
│           │   ├── category
│           │   ├── pages
│           │   ├── posts
│           │   └── tag
│           ├── styles
│           └── utils
├── e2e
│   ├── fixture
│   │   ├── .emdash
│   │   └── src
│   │       └── pages
│   │           └── posts
│   ├── fixtures
│   │   └── assets
│   └── tests
├── prompt-exports
├── scripts
├── skills
│   ├── adversarial-reviewer
│   ├── agent-browser
│   ├── building-emdash-site
│   │   └── references
│   ├── creating-plugins
│   │   └── references
│   ├── emdash-cli
│   ├── wordpress-plugin-to-emdash
│   └── wordpress-theme-to-emdash
│       ├── phases
│       ├── references
│       └── scaffold
│           ├── public
│           └── src
│               ├── components
│               ├── layouts
│               ├── pages
│               │   ├── categories
│               │   ├── pages
│               │   ├── posts
│               │   └── tags
│               └── styles
└── templates
    ├── blank
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   └── src
    │       └── pages
    ├── blog
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   ├── seed
    │   └── src
    │       ├── components
    │       ├── layouts
    │       ├── pages
    │       │   ├── category
    │       │   ├── pages
    │       │   ├── posts
    │       │   └── tag
    │       ├── styles
    │       └── utils
    ├── blog-cloudflare
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   ├── seed
    │   └── src
    │       ├── components
    │       ├── layouts
    │       ├── pages
    │       │   ├── category
    │       │   ├── pages
    │       │   ├── posts
    │       │   └── tag
    │       ├── styles
    │       └── utils
    ├── marketing
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   ├── public
    │   ├── seed
    │   └── src
    │       ├── components
    │       │   └── blocks
    │       ├── layouts
    │       └── pages
    ├── marketing-cloudflare
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   ├── public
    │   ├── seed
    │   └── src
    │       ├── components
    │       │   └── blocks
    │       ├── layouts
    │       └── pages
    ├── portfolio
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   ├── seed
    │   └── src
    │       ├── components
    │       ├── layouts
    │       └── pages
    │           └── work
    ├── portfolio-cloudflare
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   ├── seed
    │   └── src
    │       ├── components
    │       ├── layouts
    │       └── pages
    │           └── work
    ├── starter
    │   ├── .agents
    │   │   └── skills
    │   │       ├── building-emdash-site
    │   │       │   └── references
    │   │       ├── creating-plugins
    │   │       │   └── references
    │   │       └── emdash-cli
    │   ├── seed
    │   └── src
    │       ├── layouts
    │       └── pages
    │           ├── category
    │           ├── posts
    │           └── tag
    └── starter-cloudflare
        ├── .agents
        │   └── skills
        │       ├── building-emdash-site
        │       │   └── references
        │       ├── creating-plugins
        │       │   └── references
        │       └── emdash-cli
        ├── seed
        └── src
            ├── layouts
            └── pages
                ├── category
                ├── posts
                └── tag

/Users/masonjames/Projects/emdash-restrict-with-stripe
├── src
│   ├── handlers
│   ├── index.ts * +
│   └── plugin.ts * +
└── README.md *

/Users/masonjames/Library/Application Support/RepoPrompt/Workspaces/Workspace-emdash-table-of-contents (1)-83629FA3-3311-452C-97C3-37BD78123142/_git_data

/Users/masonjames/Projects/gravitysmtp
├── includes
│   ├── alerts
│   │   ├── config
│   │   │   └── class-alerts-config.php * +
│   │   ├── connectors
│   │   └── endpoints
│   ├── connectors
│   │   ├── config
│   │   │   ├── class-connector-config.php * +
│   │   │   └── class-connector-endpoints-config.php * +
│   │   ├── endpoints
│   │   ├── oauth
│   │   ├── types
│   │   ├── class-connector-factory.php * +
│   │   └── class-connector-service-provider.php * +
│   ├── email-management
│   │   ├── config
│   │   │   └── class-managed-email-types-config.php * +
│   │   └── class-email-management-service-provider.php * +
│   ├── logging
│   │   ├── config
│   │   │   └── class-logging-endpoints-config.php * +
│   │   ├── debug
│   │   ├── endpoints
│   │   ├── log
│   │   ├── scheduling
│   │   └── class-logging-service-provider.php * +
│   ├── migration
│   │   ├── config
│   │   │   └── class-migration-endpoints-config.php * +
│   │   ├── data
│   │   ├── endpoints
│   │   └── class-migration-service-provider.php * +
│   ├── suppression
│   │   ├── config
│   │   │   └── class-suppression-settings-config.php * +
│   │   ├── endpoints
│   │   └── class-suppression-service-provider.php * +
│   ├── tracking
│   │   └── class-tracking-service-provider.php * +
│   ├── apps
│   │   ├── config
│   │   ├── endpoints
│   │   └── setup-wizard
│   │       ├── config
│   │       └── endpoints
│   ├── assets
│   ├── datastore
│   ├── enums
│   ├── environment
│   │   ├── config
│   │   └── endpoints
│   ├── errors
│   ├── experimental-features
│   ├── feature-flags
│   │   └── config
│   ├── handler
│   │   ├── config
│   │   ├── endpoints
│   │   └── external
│   ├── models
│   │   ├── hydrators
│   │   └── traits
│   ├── notifications
│   │   └── config
│   ├── pages
│   ├── routing
│   │   └── handlers
│   ├── telemetry
│   ├── translations
│   ├── updates
│   ├── users
│   └── utils
├── assets
│   ├── css
│   │   └── dist
│   ├── fonts
│   ├── images
│   │   ├── email-templates
│   │   │   └── send-test
│   │   ├── plugin-icons
│   │   ├── setup-wizard
│   │   └── svgs
│   └── js
│       └── dist
├── email-templates
├── languages
├── vendor
│   ├── composer
│   └── gravityforms
│       └── gravity-tools
│           ├── bin
│           ├── src
│           │   ├── API
│           │   ├── Apps
│           │   ├── Assets
│           │   ├── Background_Processing
│           │   ├── Cache
│           │   ├── Config
│           │   ├── Data
│           │   ├── Data_Import
│           │   │   └── Sources
│           │   ├── Emails
│           │   ├── Endpoints
│           │   ├── Hermes
│           │   │   ├── Enum
│           │   │   ├── Models
│           │   │   ├── Runners
│           │   │   ├── Tokens
│           │   │   │   └── Mutations
│           │   │   │       ├── Connect
│           │   │   │       ├── Delete
│           │   │   │       ├── Insert
│           │   │   │       └── Update
│           │   │   └── Utils
│           │   ├── License
│           │   ├── Logging
│           │   │   └── parsers
│           │   ├── Model
│           │   ├── Providers
│           │   ├── System_Report
│           │   ├── Telemetry
│           │   ├── Updates
│           │   ├── Upgrades
│           │   └── Utils
│           └── tests
│               ├── _data
│               ├── emails
│               ├── hermes
│               │   ├── enum
│               │   ├── mutations
│               │   ├── queries
│               │   └── tokens
│               │       └── mutations
│               ├── system_report
│               └── utils
└── CLAUDE.md *


(* denotes selected files)
(+ denotes code-map available)
Config: directory-only view; selected files shown.
</file_map>
<file_contents>
File: /Users/masonjames/Projects/emdash-restrict-with-stripe/src/index.ts
```ts
export function restrictWithStripe() {
	return {
		id: "restrict-with-stripe",
		version: "0.1.0",
		entrypoint: "emdash-restrict-with-stripe/plugin",
		adminEntry: "emdash-restrict-with-stripe/admin",
		options: {},
		capabilities: ["network:fetch", "email:send"],
		allowedHosts: ["api.stripe.com"],
		storage: {
			restrictions: {
				indexes: ["contentId", "collectionSlug", "slug"],
			},
			taxonomyRestrictions: {
				indexes: ["taxonomyName", "termId"],
			},
			customers: {
				indexes: ["email"],
			},
			authTokens: {
				indexes: ["email", "expiresAt"],
			},
			sessions: {
				indexes: ["email", "expiresAt"],
			},
		},
		adminPages: [
			{ path: "/settings", label: "RWStripe Settings" },
			{ path: "/restrictions", label: "RWStripe Restrictions" },
		],
		adminWidgets: [{ id: "overview", title: "Restrict With Stripe" }],
	};
}

export default restrictWithStripe;

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/admin-ui.mdx
```mdx
---
title: Admin UI
description: Add admin pages and dashboard widgets to the EmDash admin panel.
---

import { Aside, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

Plugins can extend the admin panel with custom pages and dashboard widgets. These are React components that render alongside core admin functionality.

## Admin Entry Point

Plugins with admin UI export components from an `admin` entry point:

```typescript title="src/admin.tsx"
import { SEOSettingsPage } from "./components/SEOSettingsPage";
import { SEODashboardWidget } from "./components/SEODashboardWidget";

// Dashboard widgets
export const widgets = {
	"seo-overview": SEODashboardWidget,
};

// Admin pages
export const pages = {
	"/settings": SEOSettingsPage,
};
```

Configure the entry point in `package.json`:

```json title="package.json"
{
	"exports": {
		".": "./dist/index.js",
		"./admin": "./dist/admin.js"
	}
}
```

Reference it in your plugin definition:

```typescript title="src/index.ts"
definePlugin({
	id: "seo",
	version: "1.0.0",

	admin: {
		entry: "@my-org/plugin-seo/admin",
		pages: [{ path: "/settings", label: "SEO Settings", icon: "settings" }],
		widgets: [{ id: "seo-overview", title: "SEO Overview", size: "half" }],
	},
});
```

## Admin Pages

Admin pages are React components that receive the plugin context via hooks.

### Page Definition

Define pages in `admin.pages`:

```typescript
admin: {
	pages: [
		{
			path: "/settings", // URL path (relative to plugin base)
			label: "Settings", // Sidebar label
			icon: "settings", // Icon name (optional)
		},
		{
			path: "/reports",
			label: "Reports",
			icon: "chart",
		},
	];
}
```

Pages mount at `/_emdash/admin/plugins/<plugin-id>/<path>`.

### Page Component

```typescript title="src/components/SettingsPage.tsx"
import { useState, useEffect } from "react";
import { usePluginAPI } from "@emdash-cms/admin";

export function SettingsPage() {
  const api = usePluginAPI();
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("settings").then(setSettings);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await api.post("settings/save", settings);
    setSaving(false);
  };

  return (
    <div>
      <h1>Plugin Settings</h1>

      <label>
        Site Title
        <input
          type="text"
          value={settings.siteTitle || ""}
          onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.enabled ?? true}
          onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
        />
        Enabled
      </label>

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
```

### Plugin API Hook

Use `usePluginAPI()` to call your plugin's routes:

```typescript
import { usePluginAPI } from "@emdash-cms/admin";

function MyComponent() {
	const api = usePluginAPI();

	// GET request to plugin route
	const data = await api.get("status");

	// POST request with body
	await api.post("settings/save", { enabled: true });

	// With URL parameters
	const result = await api.get("history?limit=50");
}
```

The hook automatically adds the plugin ID prefix to route URLs.

## Dashboard Widgets

Widgets appear on the admin dashboard and provide at-a-glance information.

### Widget Definition

Define widgets in `admin.widgets`:

```typescript
admin: {
	widgets: [
		{
			id: "seo-overview", // Unique widget ID
			title: "SEO Overview", // Widget title (optional)
			size: "half", // "full" | "half" | "third"
		},
	];
}
```

### Widget Component

```typescript title="src/components/SEOWidget.tsx"
import { useState, useEffect } from "react";
import { usePluginAPI } from "@emdash-cms/admin";

export function SEOWidget() {
  const api = usePluginAPI();
  const [data, setData] = useState({ score: 0, issues: [] });

  useEffect(() => {
    api.get("analyze").then(setData);
  }, []);

  return (
    <div className="widget-content">
      <div className="score">{data.score}%</div>
      <ul>
        {data.issues.map((issue, i) => (
          <li key={i}>{issue.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Widget Sizes

| Size    | Description               |
| ------- | ------------------------- |
| `full`  | Full dashboard width      |
| `half`  | Half dashboard width      |
| `third` | One-third dashboard width |

Widgets wrap automatically based on screen width.

## Export Structure

The admin entry point exports two objects:

```typescript title="src/admin.tsx"
import { SettingsPage } from "./components/SettingsPage";
import { ReportsPage } from "./components/ReportsPage";
import { StatusWidget } from "./components/StatusWidget";
import { OverviewWidget } from "./components/OverviewWidget";

// Pages keyed by path
export const pages = {
	"/settings": SettingsPage,
	"/reports": ReportsPage,
};

// Widgets keyed by ID
export const widgets = {
	status: StatusWidget,
	overview: OverviewWidget,
};
```

<Aside type="caution">
	Page paths in `pages` must match the `path` values in `admin.pages`. Widget keys must match the
	`id` values in `admin.widgets`.
</Aside>

## Using Admin Components

EmDash provides pre-built components for common patterns:

```typescript
import {
  Card,
  Button,
  Input,
  Select,
  Toggle,
  Table,
  Pagination,
  Alert,
  Loading
} from "@emdash-cms/admin";

function SettingsPage() {
  return (
    <Card title="Settings">
      <Input label="API Key" type="password" />
      <Toggle label="Enabled" defaultChecked />
      <Button variant="primary">Save</Button>
    </Card>
  );
}
```

## Auto-Generated Settings UI

If your plugin only needs a settings form, use `admin.settingsSchema` without custom components:

```typescript
admin: {
  settingsSchema: {
    apiKey: { type: "secret", label: "API Key" },
    enabled: { type: "boolean", label: "Enabled", default: true }
  }
}
```

EmDash generates a settings page automatically. Add custom pages only for functionality beyond basic settings.

## Navigation

Plugin pages appear in the admin sidebar under the plugin name. The order matches the `admin.pages` array.

```typescript
admin: {
	pages: [
		{ path: "/settings", label: "Settings", icon: "settings" }, // First
		{ path: "/history", label: "History", icon: "history" }, // Second
		{ path: "/reports", label: "Reports", icon: "chart" }, // Third
	];
}
```

## Build Configuration

Admin components need a separate build entry point. Configure your bundler:

<Tabs>
  <TabItem label="tsdown">
```typescript title="tsdown.config.ts"
export default {
  entry: {
    index: "src/index.ts",
    admin: "src/admin.tsx"
  },
  format: "esm",
  dts: true,
  external: ["react", "react-dom", "emdash", "@emdash-cms/admin"]
};
```
  </TabItem>
  <TabItem label="tsup">
```typescript title="tsup.config.ts"
export default {
  entry: ["src/index.ts", "src/admin.tsx"],
  format: "esm",
  dts: true,
  external: ["react", "react-dom", "emdash", "@emdash-cms/admin"]
};
```
  </TabItem>
</Tabs>

Keep React and EmDash admin as external dependencies to avoid bundling duplicates.

## Plugin Enable/Disable

When a plugin is disabled in the admin:

- Sidebar links are hidden
- Dashboard widgets are not rendered
- Admin pages return 404
- Backend hooks still execute (for data safety)

Plugins can check their enabled state:

```typescript
const enabled = await ctx.kv.get<boolean>("_emdash:enabled");
```

## Example: Complete Admin UI

```typescript title="src/index.ts"
import { definePlugin } from "emdash";

export default definePlugin({
	id: "analytics",
	version: "1.0.0",

	capabilities: ["network:fetch"],
	allowedHosts: ["api.analytics.example.com"],

	storage: {
		events: { indexes: ["type", "createdAt"] },
	},

	admin: {
		entry: "@my-org/plugin-analytics/admin",
		settingsSchema: {
			trackingId: { type: "string", label: "Tracking ID" },
			enabled: { type: "boolean", label: "Enabled", default: true },
		},
		pages: [
			{ path: "/dashboard", label: "Dashboard", icon: "chart" },
			{ path: "/settings", label: "Settings", icon: "settings" },
		],
		widgets: [{ id: "events-today", title: "Events Today", size: "third" }],
	},

	routes: {
		stats: {
			handler: async (ctx) => {
				const today = new Date().toISOString().split("T")[0];
				const count = await ctx.storage.events!.count({
					createdAt: { gte: today },
				});
				return { today: count };
			},
		},
	},
});
```

```typescript title="src/admin.tsx"
import { EventsWidget } from "./components/EventsWidget";
import { DashboardPage } from "./components/DashboardPage";
import { SettingsPage } from "./components/SettingsPage";

export const widgets = {
	"events-today": EventsWidget,
};

export const pages = {
	"/dashboard": DashboardPage,
	"/settings": SettingsPage,
};
```

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/hooks.mdx
```mdx
---
title: Plugin Hooks
description: Hook into content, media, and plugin lifecycle events.
---

import { Aside, Tabs, TabItem } from "@astrojs/starlight/components";

Hooks let plugins run code in response to events. All hooks receive an event object and the plugin context. Hooks are declared at plugin definition time, not registered dynamically at runtime.

## Hook Signature

Every hook handler receives two arguments:

```typescript
async (event: EventType, ctx: PluginContext) => ReturnType;
```

- `event` — Data about the event (content being saved, media uploaded, etc.)
- `ctx` — The [plugin context](/plugins/overview/#plugin-context) with storage, KV, logging, and capability-gated APIs

## Hook Configuration

Hooks can be declared as a simple handler or with full configuration:

<Tabs>
  <TabItem label="Simple">
```typescript
hooks: {
  "content:afterSave": async (event, ctx) => {
    ctx.log.info("Content saved");
  }
}
```
  </TabItem>
  <TabItem label="Full Config">
```typescript
hooks: {
  "content:afterSave": {
    priority: 100,
    timeout: 5000,
    dependencies: ["audit-log"],
    errorPolicy: "continue",
    handler: async (event, ctx) => {
      ctx.log.info("Content saved");
    }
  }
}
```
  </TabItem>
</Tabs>

### Configuration Options

| Option         | Type                    | Default   | Description                                |
| -------------- | ----------------------- | --------- | ------------------------------------------ |
| `priority`     | `number`                | `100`     | Execution order. Lower numbers run first.  |
| `timeout`      | `number`                | `5000`    | Maximum execution time in milliseconds.    |
| `dependencies` | `string[]`              | `[]`      | Plugin IDs that must run before this hook. |
| `errorPolicy`  | `"abort" \| "continue"` | `"abort"` | Whether to stop the pipeline on error.     |
| `handler`      | `function`              | —         | The hook handler function. Required.       |

<Aside type="tip">
	Use `errorPolicy: "continue"` for non-critical hooks like notifications. Use `"abort"` (the
	default) when the hook's result is essential.
</Aside>

## Lifecycle Hooks

Lifecycle hooks run during plugin installation, activation, and deactivation.

### `plugin:install`

Runs once when the plugin is first added to a site.

```typescript
"plugin:install": async (_event, ctx) => {
  ctx.log.info("Installing plugin...");

  // Seed default data
  await ctx.kv.set("settings:enabled", true);
  await ctx.storage.items!.put("default", { name: "Default Item" });
}
```

**Event:** `{}`  
**Returns:** `Promise<void>`

### `plugin:activate`

Runs when the plugin is enabled (after install or when re-enabled).

```typescript
"plugin:activate": async (_event, ctx) => {
  ctx.log.info("Plugin activated");
}
```

**Event:** `{}`  
**Returns:** `Promise<void>`

### `plugin:deactivate`

Runs when the plugin is disabled (but not removed).

```typescript
"plugin:deactivate": async (_event, ctx) => {
  ctx.log.info("Plugin deactivated");
  // Release resources, pause background work
}
```

**Event:** `{}`  
**Returns:** `Promise<void>`

### `plugin:uninstall`

Runs when the plugin is removed from a site.

```typescript
"plugin:uninstall": async (event, ctx) => {
  ctx.log.info("Uninstalling plugin...");

  if (event.deleteData) {
    // User opted to delete plugin data
    const result = await ctx.storage.items!.query({ limit: 1000 });
    await ctx.storage.items!.deleteMany(result.items.map(i => i.id));
  }
}
```

**Event:** `{ deleteData: boolean }`  
**Returns:** `Promise<void>`

<Aside type="caution">
	Be conservative in `plugin:uninstall`. Default to preserving data—users may reinstall. Only delete
	when `event.deleteData` is `true`.
</Aside>

## Content Hooks

Content hooks run during create, update, and delete operations.

### `content:beforeSave`

Runs before content is saved. Return modified content or `void` to keep it unchanged. Throw to cancel the save.

```typescript
"content:beforeSave": async (event, ctx) => {
  const { content, collection, isNew } = event;

  // Validate
  if (collection === "posts" && !content.title) {
    throw new Error("Posts require a title");
  }

  // Transform
  if (content.slug) {
    content.slug = content.slug.toLowerCase().replace(/\s+/g, "-");
  }

  return content;
}
```

**Event:**

```typescript
{
	content: Record<string, unknown>; // Content data being saved
	collection: string; // Collection name
	isNew: boolean; // True if creating, false if updating
}
```

**Returns:** `Promise<Record<string, unknown> | void>`

### `content:afterSave`

Runs after content is successfully saved. Use for side effects like notifications, logging, or syncing to external systems.

```typescript
"content:afterSave": async (event, ctx) => {
  const { content, collection, isNew } = event;

  ctx.log.info(`${isNew ? "Created" : "Updated"} ${collection}/${content.id}`);

  // Trigger external sync
  if (ctx.http) {
    await ctx.http.fetch("https://api.example.com/webhook", {
      method: "POST",
      body: JSON.stringify({ event: "content:save", id: content.id })
    });
  }
}
```

**Event:**

```typescript
{
	content: Record<string, unknown>; // Saved content (includes id, timestamps)
	collection: string;
	isNew: boolean;
}
```

**Returns:** `Promise<void>`

### `content:beforeDelete`

Runs before content is deleted. Return `false` to cancel the deletion, `true` or `void` to allow it.

```typescript
"content:beforeDelete": async (event, ctx) => {
  const { id, collection } = event;

  // Prevent deletion of protected content
  if (collection === "pages" && id === "home") {
    ctx.log.warn("Cannot delete home page");
    return false;
  }

  return true;
}
```

**Event:**

```typescript
{
	id: string; // Content ID being deleted
	collection: string;
}
```

**Returns:** `Promise<boolean | void>`

### `content:afterDelete`

Runs after content is successfully deleted.

```typescript
"content:afterDelete": async (event, ctx) => {
  const { id, collection } = event;

  ctx.log.info(`Deleted ${collection}/${id}`);

  // Clean up related plugin data
  await ctx.storage.cache!.delete(`${collection}:${id}`);
}
```

**Event:**

```typescript
{
	id: string;
	collection: string;
}
```

**Returns:** `Promise<void>`

## Media Hooks

Media hooks run during file uploads.

### `media:beforeUpload`

Runs before a file is uploaded. Return modified file info or `void` to keep it unchanged. Throw to cancel the upload.

```typescript
"media:beforeUpload": async (event, ctx) => {
  const { file } = event;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only images are allowed");
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File too large");
  }

  // Rename file
  return {
    ...file,
    name: `${Date.now()}-${file.name}`
  };
}
```

**Event:**

```typescript
{
	file: {
		name: string; // Original filename
		type: string; // MIME type
		size: number; // Size in bytes
	}
}
```

**Returns:** `Promise<{ name: string; type: string; size: number } | void>`

### `media:afterUpload`

Runs after a file is successfully uploaded.

```typescript
"media:afterUpload": async (event, ctx) => {
  const { media } = event;

  ctx.log.info(`Uploaded ${media.filename}`, {
    id: media.id,
    size: media.size,
    mimeType: media.mimeType
  });
}
```

**Event:**

```typescript
{
	media: {
		id: string;
		filename: string;
		mimeType: string;
		size: number | null;
		url: string;
		createdAt: string;
	}
}
```

**Returns:** `Promise<void>`

## Hook Execution Order

Hooks run in this order:

1. Hooks with lower `priority` values run first
2. For equal priorities, hooks run in plugin registration order
3. Hooks with `dependencies` wait for those plugins to complete

```typescript
// Plugin A
"content:afterSave": {
  priority: 50,  // Runs first
  handler: async () => {}
}

// Plugin B
"content:afterSave": {
  priority: 100,  // Runs second (default priority)
  handler: async () => {}
}

// Plugin C
"content:afterSave": {
  priority: 200,
  dependencies: ["plugin-a"],  // Runs after A, even if priority was lower
  handler: async () => {}
}
```

## Error Handling

When a hook throws or times out:

- **`errorPolicy: "abort"`** — The entire pipeline stops. The original operation may fail.
- **`errorPolicy: "continue"`** — The error is logged, and remaining hooks still run.

```typescript
"content:afterSave": {
  timeout: 5000,
  errorPolicy: "continue",  // Don't fail the save if this hook fails
  handler: async (event, ctx) => {
    // External API call that might fail
    await ctx.http!.fetch("https://unreliable-api.com/notify");
  }
}
```

<Aside type="tip">
	Use `errorPolicy: "continue"` for non-critical operations like analytics, notifications, or
	external syncs. The content save succeeds even if the hook fails.
</Aside>

## Timeouts

Hooks have a default timeout of 5000ms (5 seconds). Increase it for operations that may take longer:

```typescript
"content:afterSave": {
  timeout: 30000,  // 30 seconds
  handler: async (event, ctx) => {
    // Long-running operation
  }
}
```

<Aside type="caution">
	In sandboxed mode on Cloudflare, resource limits are enforced at the isolate level. Long-running
	hooks may be terminated regardless of the configured timeout.
</Aside>

## Public Page Hooks

Public page hooks let plugins contribute to the `<head>` and `<body>` of rendered pages. Templates opt in using the `<EmDashHead>`, `<EmDashBodyStart>`, and `<EmDashBodyEnd>` components from `emdash/ui`.

### `page:metadata`

Contributes typed metadata to `<head>` — meta tags, OpenGraph properties, canonical/alternate links, and JSON-LD structured data. Works in both trusted and sandboxed modes.

Core validates, deduplicates, and renders the contributions. Plugins return structured data, never raw HTML.

```typescript
"page:metadata": async (event, ctx) => {
  if (event.page.kind !== "content") return null;

  return {
    kind: "jsonld",
    id: `schema:${event.page.content?.collection}:${event.page.content?.id}`,
    graph: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: event.page.title,
      description: event.page.description,
    },
  };
}
```

**Event:**

```typescript
{
  page: {
    url: string;
    path: string;
    locale: string | null;
    kind: "content" | "custom";
    pageType: string;
    title: string | null;
    description: string | null;
    canonical: string | null;
    image: string | null;
    content?: { collection: string; id: string; slug: string | null };
  }
}
```

**Returns:** `PageMetadataContribution | PageMetadataContribution[] | null`

**Contribution types:**

| Kind       | Renders                                            | Dedupe key              |
| ---------- | -------------------------------------------------- | ----------------------- |
| `meta`     | `<meta name="..." content="...">`                  | `key` or `name`         |
| `property` | `<meta property="..." content="...">`              | `key` or `property`     |
| `link`     | `<link rel="canonical\|alternate" href="...">`     | canonical: singleton; alternate: `key` or `hreflang` |
| `jsonld`   | `<script type="application/ld+json">`              | `id` (if present)       |

First contribution wins for any dedupe key. Link hrefs must be HTTP or HTTPS.

### `page:fragments`

Contributes raw HTML, scripts, or markup to page insertion points. **Trusted plugins only** — sandboxed plugins cannot use this hook.

```typescript
"page:fragments": async (event, ctx) => {
  return {
    kind: "external-script",
    placement: "head",
    src: "https://www.googletagmanager.com/gtm.js?id=GTM-XXXXX",
    async: true,
  };
}
```

**Returns:** `PageFragmentContribution | PageFragmentContribution[] | null`

Placements: `"head"`, `"body:start"`, `"body:end"`. Templates that omit a component for a placement silently ignore contributions targeting it.

<Aside type="caution">
	`page:fragments` is trusted-only because its output runs as first-party code in the browser.
	Worker Loader isolation does not extend to browser-executed scripts. Use `page:metadata` for
	sandbox-safe contributions.
</Aside>

## Hooks Reference

| Hook                   | Trigger                   | Return                        |
| ---------------------- | ------------------------- | ----------------------------- |
| `plugin:install`       | First plugin installation | `void`                        |
| `plugin:activate`      | Plugin enabled            | `void`                        |
| `plugin:deactivate`    | Plugin disabled           | `void`                        |
| `plugin:uninstall`     | Plugin removed            | `void`                        |
| `content:beforeSave`   | Before content save       | Modified content or `void`    |
| `content:afterSave`    | After content save        | `void`                        |
| `content:beforeDelete` | Before content delete     | `false` to cancel, else allow |
| `content:afterDelete`  | After content delete      | `void`                        |
| `media:beforeUpload`   | Before file upload        | Modified file info or `void`  |
| `media:afterUpload`    | After file upload         | `void`                        |
| `page:metadata`        | Page render               | Contributions or `null`       |
| `page:fragments`       | Page render (trusted)     | Contributions or `null`       |

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/settings.mdx
```mdx
---
title: Plugin Settings
description: Configure plugins with settings schemas and the KV store.
---

import { Aside, Tabs, TabItem } from "@astrojs/starlight/components";

Plugins need configuration—API keys, feature flags, display preferences. EmDash provides two mechanisms: a **settings schema** for admin-configurable options and a **KV store** for programmatic access.

## Settings Schema

Declare a settings schema in `admin.settingsSchema` to auto-generate an admin UI:

```typescript
import { definePlugin } from "emdash";

export default definePlugin({
	id: "seo",
	version: "1.0.0",

	admin: {
		settingsSchema: {
			siteTitle: {
				type: "string",
				label: "Site Title",
				description: "Used in title tags and meta",
				default: "",
			},
			maxTitleLength: {
				type: "number",
				label: "Max Title Length",
				description: "Characters before truncation",
				default: 60,
				min: 30,
				max: 100,
			},
			generateSitemap: {
				type: "boolean",
				label: "Generate Sitemap",
				description: "Automatically generate sitemap.xml",
				default: true,
			},
			defaultRobots: {
				type: "select",
				label: "Default Robots",
				options: [
					{ value: "index,follow", label: "Index & Follow" },
					{ value: "noindex,follow", label: "No Index, Follow" },
					{ value: "noindex,nofollow", label: "No Index, No Follow" },
				],
				default: "index,follow",
			},
			apiKey: {
				type: "secret",
				label: "API Key",
				description: "Encrypted at rest",
			},
		},
	},
});
```

EmDash generates a settings form in the plugin's admin section. Users edit settings without touching code.

## Field Types

### String

Text input for single-line or multiline strings.

```typescript
siteTitle: {
  type: "string",
  label: "Site Title",
  description: "Optional help text",
  default: "My Site",
  multiline: false  // Set true for textarea
}
```

### Number

Numeric input with optional min/max constraints.

```typescript
maxItems: {
  type: "number",
  label: "Maximum Items",
  default: 100,
  min: 1,
  max: 1000
}
```

### Boolean

Toggle switch for true/false values.

```typescript
enabled: {
  type: "boolean",
  label: "Enabled",
  description: "Turn this feature on or off",
  default: true
}
```

### Select

Dropdown for predefined options.

```typescript
theme: {
  type: "select",
  label: "Theme",
  options: [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "auto", label: "System" }
  ],
  default: "auto"
}
```

### Secret

Encrypted field for sensitive values like API keys. Never sent to the client after saving.

```typescript
apiKey: {
  type: "secret",
  label: "API Key",
  description: "Stored encrypted"
}
```

<Aside type="caution">
	Secret fields are encrypted at rest using the site's encryption key. They're never exposed in the
	admin UI after the initial save—only a masked placeholder is shown.
</Aside>

## Accessing Settings

Read settings in hooks and routes via `ctx.kv`:

```typescript
"content:beforeSave": async (event, ctx) => {
  // Read a setting
  const maxLength = await ctx.kv.get<number>("settings:maxTitleLength");
  const apiKey = await ctx.kv.get<string>("settings:apiKey");

  // Use defaults if not set
  const limit = maxLength ?? 60;

  ctx.log.info("Using max length", { limit });
  return event.content;
}
```

Settings are stored with the `settings:` prefix by convention. This distinguishes user-configurable values from internal plugin state.

## KV Store API

The KV store (`ctx.kv`) is a general-purpose key-value store for plugin data:

```typescript
interface KVAccess {
	get<T>(key: string): Promise<T | null>;
	set(key: string, value: unknown): Promise<void>;
	delete(key: string): Promise<boolean>;
	list(prefix?: string): Promise<Array<{ key: string; value: unknown }>>;
}
```

### Reading Values

```typescript
// Get a single value
const enabled = await ctx.kv.get<boolean>("settings:enabled");

// Get with type
const config = await ctx.kv.get<{ url: string; timeout: number }>("state:config");
```

### Writing Values

```typescript
// Set a value
await ctx.kv.set("settings:lastSync", new Date().toISOString());

// Set complex values
await ctx.kv.set("state:cache", {
	data: items,
	expiry: Date.now() + 3600000,
});
```

### Listing Values

```typescript
// List all settings
const settings = await ctx.kv.list("settings:");
// Returns: [{ key: "settings:enabled", value: true }, ...]

// List all plugin keys
const all = await ctx.kv.list();
```

### Deleting Values

```typescript
const deleted = await ctx.kv.delete("state:tempData");
// Returns true if key existed
```

## Key Naming Conventions

Use prefixes to organize KV data:

| Prefix      | Purpose                       | Example           |
| ----------- | ----------------------------- | ----------------- |
| `settings:` | User-configurable preferences | `settings:apiKey` |
| `state:`    | Internal plugin state         | `state:lastSync`  |
| `cache:`    | Cached data                   | `cache:results`   |

```typescript
// Good: clear prefixes
await ctx.kv.set("settings:webhookUrl", url);
await ctx.kv.set("state:lastRun", timestamp);
await ctx.kv.set("cache:feed", feedData);

// Avoid: no prefix, unclear purpose
await ctx.kv.set("url", url);
```

<Aside type="tip">
	The `settings:` prefix is a convention for values shown in the auto-generated settings UI. Other
	prefixes are for plugin-internal use.
</Aside>

## Settings vs Storage vs KV

Choose the right storage mechanism:

| Use Case                   | Mechanism                                          |
| -------------------------- | -------------------------------------------------- |
| Admin-editable preferences | `admin.settingsSchema` + `ctx.kv` with `settings:` |
| Internal plugin state      | `ctx.kv` with `state:`                             |
| Collections of documents   | `ctx.storage`                                      |

**Settings** are for user-configurable values—things an admin might change. They get an auto-generated UI.

**KV** is for internal state like timestamps, sync cursors, or cached computations. No UI, just code.

**Storage** is for document collections with indexed queries—form submissions, audit logs, etc.

## Loading Settings in Routes

API routes can expose settings to admin UI components:

```typescript
routes: {
  settings: {
    handler: async (ctx) => {
      const settings = await ctx.kv.list("settings:");
      const result: Record<string, unknown> = {};

      for (const entry of settings) {
        const key = entry.key.replace("settings:", "");
        result[key] = entry.value;
      }

      return result;
    }
  },

  "settings/save": {
    handler: async (ctx) => {
      const input = ctx.input as Record<string, unknown>;

      for (const [key, value] of Object.entries(input)) {
        if (value !== undefined) {
          await ctx.kv.set(`settings:${key}`, value);
        }
      }

      return { success: true };
    }
  }
}
```

## Default Values

Settings from `settingsSchema` are not automatically persisted. They're defaults in the admin UI. Your code should handle missing values:

```typescript
"content:afterSave": async (event, ctx) => {
  // Always provide a fallback
  const enabled = await ctx.kv.get<boolean>("settings:enabled") ?? true;
  const maxItems = await ctx.kv.get<number>("settings:maxItems") ?? 100;

  if (!enabled) return;
  // ...
}
```

Alternatively, persist defaults in `plugin:install`:

```typescript
hooks: {
  "plugin:install": async (_event, ctx) => {
    // Persist schema defaults
    await ctx.kv.set("settings:enabled", true);
    await ctx.kv.set("settings:maxItems", 100);
  }
}
```

## Storage Implementation

KV values are stored in the `_options` table with plugin-namespaced keys:

```sql
INSERT INTO _options (name, value) VALUES
  ('plugin:seo:settings:siteTitle', '"My Site"'),
  ('plugin:seo:settings:maxTitleLength', '60');
```

The `plugin:seo:` prefix is added automatically. Your code uses `settings:siteTitle`, and EmDash stores it as `plugin:seo:settings:siteTitle`.

This ensures plugins can't accidentally overwrite each other's data.

```

File: /Users/masonjames/Projects/gravitysmtp/includes/email-management/class-email-management-service-provider.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Email_Management;

use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Email_Management\Config\Managed_Email_Types_Config;
use Gravity_Forms\Gravity_SMTP\Feature_Flags\Feature_Flag_Manager;
use Gravity_Forms\Gravity_SMTP\Managed_Email_Types;
use Gravity_Forms\Gravity_Tools\Providers\Config_Service_Provider;
use Gravity_Forms\Gravity_Tools\Service_Container;

class Email_Management_Service_Provider extends Config_Service_Provider {

	const EMAIL_STOPPER = 'email_stopper';
	const MANAGED_EMAIL_TYPES = 'managed_email_types';

	const MANAGED_EMAIL_TYPES_CONFIG = 'managed_email_types_config';

	protected $configs = array(
		self::MANAGED_EMAIL_TYPES_CONFIG => Managed_Email_Types_Config::class,
	);

	public function register( Service_Container $container ) {
		parent::register( $container );

		$container->add( self::EMAIL_STOPPER, function () use ( $container ) {
			return new Email_Stopper( $container->get( Connector_Service_Provider::DATA_STORE_ROUTER ), $container->get( Connector_Service_Provider::DATA_STORE_PLUGIN_OPTS ) );
		} );

		$container->add( self::MANAGED_EMAIL_TYPES, function () {
			$emails = new Managed_Email_Types();

			return $emails->types();
		} );
	}

	public function init( \Gravity_Forms\Gravity_Tools\Service_Container $container ) {
		$email_types = $container->get( self::MANAGED_EMAIL_TYPES );

		/**
		 * @var Email_Stopper $stopper
		 */
		$stopper = $container->get( self::EMAIL_STOPPER );
		add_action( 'init', function () use ( $stopper, $email_types ) {
			foreach ( $email_types as $values ) {
				$type = new Managed_Email( $values['key'], $values['label'], $values['description'], $values['category'], $values['disable_callback'] );
				$stopper->add( $type );
			}
		}, 11 );

		add_action( 'init', function() use ( $container ) {
			$container->get( self::EMAIL_STOPPER )->stop_all();
		}, 12 );
	}

}
```

File: /Users/masonjames/Projects/emdash-restrict-with-stripe/src/plugin.ts
```ts
import { definePlugin } from "emdash";

import { accessHandler } from "./handlers/access.js";
import { logoutHandler, sendLinkHandler, sessionHandler, verifyHandler } from "./handlers/auth.js";
import { checkoutHandler } from "./handlers/checkout.js";
import { portalHandler } from "./handlers/portal.js";
import { productsHandler } from "./handlers/products.js";
import { restrictionsHandler } from "./handlers/restrictions.js";
import { settingsHandler } from "./handlers/settings.js";

export function createPlugin(_options: Record<string, unknown> = {}) {
	return definePlugin({
		id: "restrict-with-stripe",
		version: "0.1.0",
		capabilities: ["network:fetch", "email:send"],
		allowedHosts: ["api.stripe.com"],
		storage: {
			restrictions: {
				indexes: ["contentId", "collectionSlug", "slug"],
			},
			taxonomyRestrictions: {
				indexes: ["taxonomyName", "termId"],
			},
			customers: {
				indexes: ["email"],
			},
			authTokens: {
				indexes: ["email", "expiresAt"],
			},
			sessions: {
				indexes: ["email", "expiresAt"],
			},
		},
		routes: {
			checkout: { public: true, handler: checkoutHandler },
			portal: { public: true, handler: portalHandler },
			access: { public: true, handler: accessHandler },
			"admin/products": { handler: productsHandler },
			"admin/restrictions": { handler: restrictionsHandler },
			"admin/settings": { handler: settingsHandler },
			"auth/send-link": { public: true, handler: sendLinkHandler },
			"auth/verify": { public: true, handler: verifyHandler },
			"auth/session": { public: true, handler: sessionHandler },
			"auth/logout": { public: true, handler: logoutHandler },
		},
		admin: {
			entry: "emdash-restrict-with-stripe/admin",
			pages: [
				{ path: "/settings", label: "RWStripe Settings" },
				{ path: "/restrictions", label: "RWStripe Restrictions" },
			],
			widgets: [{ id: "overview", title: "Restrict With Stripe" }],
		},
	});
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/emdash-runtime.ts
```ts
/**
 * EmDashRuntime - Core runtime for EmDash CMS
 *
 * Manages database, storage, plugins (trusted + sandboxed), hooks, and
 * provides handlers for content/media operations.
 *
 * Created once per worker lifetime, cached and reused across requests.
 */

import type { Element } from "@emdash-cms/blocks";
import { Kysely, sql, type Dialect } from "kysely";

import { validateRev } from "./api/rev.js";
import type {
	EmDashConfig,
	PluginAdminPage,
	PluginDashboardWidget,
} from "./astro/integration/runtime.js";
import type { EmDashManifest, ManifestCollection } from "./astro/types.js";
import { getAuthMode } from "./auth/mode.js";
import { isSqlite } from "./database/dialect-helpers.js";
import { runMigrations } from "./database/migrations/runner.js";
import { RevisionRepository } from "./database/repositories/revision.js";
import type { ContentItem as ContentItemInternal } from "./database/repositories/types.js";
import { normalizeMediaValue } from "./media/normalize.js";
import type { MediaProvider, MediaProviderCapabilities } from "./media/types.js";
import type { SandboxedPlugin, SandboxRunner } from "./plugins/sandbox/types.js";
import type {
	ResolvedPlugin,
	MediaItem,
	PluginManifest,
	PluginCapability,
	PluginStorageConfig,
	PublicPageContext,
	PageMetadataContribution,
	PageFragmentContribution,
} from "./plugins/types.js";
import type { FieldType } from "./schema/types.js";
import { hashString } from "./utils/hash.js";

const LEADING_SLASH_PATTERN = /^\//;

/** Combined result from a single-pass page contribution collection */
interface PageContributions {
	metadata: PageMetadataContribution[];
	fragments: PageFragmentContribution[];
}

const VALID_METADATA_KINDS = new Set(["title", "meta", "property", "link", "jsonld"]);

/** Security-critical allowlist for link rel values from sandboxed plugins */
const VALID_LINK_REL = new Set([
	"canonical",
	"alternate",
	"author",
	"license",
	"site.standard.document",
]);

/**
 * Runtime validation for sandboxed plugin metadata contributions.
 * Sandboxed plugins return `unknown` across the RPC boundary — we must
 * verify the shape before passing to the metadata collector.
 */
export function isValidMetadataContribution(c: unknown): c is PageMetadataContribution {
	if (!c || typeof c !== "object" || !("kind" in c)) return false;
	const obj = c as Record<string, unknown>;
	if (typeof obj.kind !== "string" || !VALID_METADATA_KINDS.has(obj.kind)) return false;

	switch (obj.kind) {
		case "title":
			return typeof obj.text === "string";
		case "meta":
			return typeof obj.name === "string" && typeof obj.content === "string";
		case "property":
			return typeof obj.property === "string" && typeof obj.content === "string";
		case "link":
			return (
				typeof obj.href === "string" && typeof obj.rel === "string" && VALID_LINK_REL.has(obj.rel)
			);
		case "jsonld":
			return obj.graph != null && typeof obj.graph === "object";
		default:
			return false;
	}
}

import { loadBundleFromR2 } from "./api/handlers/marketplace.js";
import { runSystemCleanup } from "./cleanup.js";
import {
	DEFAULT_COMMENT_MODERATOR_PLUGIN_ID,
	defaultCommentModerate,
} from "./comments/moderator.js";
import { OptionsRepository } from "./database/repositories/options.js";
import {
	handleContentList,
	handleContentGet,
	handleContentGetIncludingTrashed,
	handleContentCreate,
	handleContentUpdate,
	handleContentDelete,
	handleContentDuplicate,
	handleContentRestore,
	handleContentPermanentDelete,
	handleContentListTrashed,
	handleContentCountTrashed,
	handleContentPublish,
	handleContentUnpublish,
	handleContentSchedule,
	handleContentUnschedule,
	handleContentCountScheduled,
	handleContentDiscardDraft,
	handleContentCompare,
	handleContentTranslations,
	handleMediaList,
	handleMediaGet,
	handleMediaCreate,
	handleMediaUpdate,
	handleMediaDelete,
	handleRevisionList,
	handleRevisionGet,
	handleRevisionRestore,
	SchemaRegistry,
	type Database,
	type Storage,
} from "./index.js";
import { getDb } from "./loader.js";
import { CronExecutor, type InvokeCronHookFn } from "./plugins/cron.js";
import { definePlugin } from "./plugins/define-plugin.js";
import { DEV_CONSOLE_EMAIL_PLUGIN_ID, devConsoleEmailDeliver } from "./plugins/email-console.js";
import { EmailPipeline } from "./plugins/email.js";
import {
	createHookPipeline,
	resolveExclusiveHooks as resolveExclusiveHooksShared,
	type HookPipeline,
} from "./plugins/hooks.js";
import { normalizeManifestRoute } from "./plugins/manifest-schema.js";
import { extractRequestMeta, sanitizeHeadersForSandbox } from "./plugins/request-meta.js";
import { PluginRouteRegistry, type RouteMeta } from "./plugins/routes.js";
import { NodeCronScheduler } from "./plugins/scheduler/node.js";
import { PiggybackScheduler } from "./plugins/scheduler/piggyback.js";
import type { CronScheduler } from "./plugins/scheduler/types.js";
import { PluginStateRepository } from "./plugins/state.js";
import { getRequestContext } from "./request-context.js";
import { FTSManager } from "./search/fts-manager.js";

/**
 * Map schema field types to editor field kinds
 */
const FIELD_TYPE_TO_KIND: Record<FieldType, string> = {
	string: "string",
	slug: "string",
	text: "richText",
	number: "number",
	integer: "number",
	boolean: "boolean",
	datetime: "datetime",
	select: "select",
	multiSelect: "multiSelect",
	portableText: "portableText",
	image: "image",
	file: "file",
	reference: "reference",
	json: "json",
};

/**
 * Sandboxed plugin entry from virtual module
 */
export interface SandboxedPluginEntry {
	id: string;
	version: string;
	options: Record<string, unknown>;
	code: string;
	/** Capabilities the plugin requests */
	capabilities: PluginCapability[];
	/** Allowed hosts for network:fetch */
	allowedHosts: string[];
	/** Declared storage collections */
	storage: PluginStorageConfig;
	/** Admin pages */
	adminPages?: Array<{ path: string; label?: string; icon?: string }>;
	/** Dashboard widgets */
	adminWidgets?: Array<{ id: string; title?: string; size?: string }>;
	/** Admin entry module */
	adminEntry?: string;
	/**
	 * Exclusive hooks this plugin should be auto-selected for.
	 * Weaker than an existing admin DB selection — config order wins when no selection exists.
	 */
	preferred?: string[];
}

/**
 * Media provider entry from virtual module
 */
export interface MediaProviderEntry {
	id: string;
	name: string;
	icon?: string;
	capabilities: MediaProviderCapabilities;
	/** Factory function to create the provider instance */
	createProvider: (ctx: MediaProviderContext) => MediaProvider;
}

/**
 * Context passed to media provider factory functions
 */
export interface MediaProviderContext {
	db: Kysely<Database>;
	storage: Storage | null;
}

/**
 * Dependencies injected from virtual modules (middleware reads these)
 */
export interface RuntimeDependencies {
	config: EmDashConfig;
	plugins: ResolvedPlugin[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createDialect: (config: any) => Dialect;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createStorage: ((config: any) => Storage) | null;
	sandboxEnabled: boolean;
	/** Media provider entries from virtual module */
	mediaProviderEntries?: MediaProviderEntry[];
	sandboxedPluginEntries: SandboxedPluginEntry[];
	/** Factory function matching SandboxRunnerFactory signature */
	createSandboxRunner: ((opts: { db: Kysely<Database> }) => SandboxRunner) | null;
}

/**
 * Convert a ContentItem to Record<string, unknown> for hook consumption.
 * Hooks receive the full item as a flat record.
 */
function contentItemToRecord(item: ContentItemInternal): Record<string, unknown> {
	return { ...item };
}

// Module-level caches (persist across requests within worker)
const dbCache = new Map<string, Kysely<Database>>();
let dbInitPromise: Promise<Kysely<Database>> | null = null;
const storageCache = new Map<string, Storage>();
const sandboxedPluginCache = new Map<string, SandboxedPlugin>();
const marketplacePluginKeys = new Set<string>();
/** Manifest metadata for marketplace plugins: pluginId -> manifest admin config */
const marketplaceManifestCache = new Map<
	string,
	{
		id: string;
		version: string;
		admin?: { pages?: PluginAdminPage[]; widgets?: PluginDashboardWidget[] };
	}
>();
/** Route metadata for sandboxed plugins: pluginId -> routeName -> RouteMeta */
const sandboxedRouteMetaCache = new Map<string, Map<string, RouteMeta>>();
let sandboxRunner: SandboxRunner | null = null;

/**
 * EmDashRuntime - singleton per worker
 */
export class EmDashRuntime {
	/**
	 * The singleton database instance (worker-lifetime cached).
	 * Use the `db` getter instead — it checks the request context first
	 * for per-request overrides (D1 read replica sessions, DO multi-site).
	 */
	private readonly _db: Kysely<Database>;
	readonly storage: Storage | null;
	readonly configuredPlugins: ResolvedPlugin[];
	readonly sandboxedPlugins: Map<string, SandboxedPlugin>;
	readonly sandboxedPluginEntries: SandboxedPluginEntry[];
	readonly schemaRegistry: SchemaRegistry;
	private _hooks!: HookPipeline;
	readonly config: EmDashConfig;
	readonly mediaProviders: Map<string, MediaProvider>;
	readonly mediaProviderEntries: MediaProviderEntry[];
	readonly cronExecutor: CronExecutor | null;
	readonly email: EmailPipeline | null;

	private cronScheduler: CronScheduler | null;
	private enabledPlugins: Set<string>;
	private pluginStates: Map<string, string>;

	/** Current hook pipeline. Use the `hooks` getter for external access. */
	get hooks(): HookPipeline {
		return this._hooks;
	}

	/** All plugins eligible for the hook pipeline (includes built-in plugins).
	 *  Stored so we can rebuild the pipeline when plugins are enabled/disabled. */
	private allPipelinePlugins: ResolvedPlugin[];
	/** Factory options for the hook pipeline context factory */
	private pipelineFactoryOptions: {
		db: Kysely<Database>;
		storage?: Storage;
		siteInfo?: { siteName?: string; siteUrl?: string; locale?: string };
	};
	/** Dependencies needed for exclusive hook resolution */
	private runtimeDeps: RuntimeDependencies;
	/** Mutable ref for the cron invokeCronHook closure to read the current pipeline */
	private pipelineRef!: { current: HookPipeline };

	/**
	 * Get the database instance for the current request.
	 *
	 * Checks the ALS-based request context first — middleware sets a
	 * per-request Kysely instance there for D1 read replica sessions
	 * or DO preview databases. Falls back to the singleton instance.
	 */
	get db(): Kysely<Database> {
		const ctx = getRequestContext();
		if (ctx?.db) {
			// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- db in context is set by middleware with correct type
			return ctx.db as Kysely<Database>;
		}
		return this._db;
	}

	private constructor(
		db: Kysely<Database>,
		storage: Storage | null,
		configuredPlugins: ResolvedPlugin[],
		sandboxedPlugins: Map<string, SandboxedPlugin>,
		sandboxedPluginEntries: SandboxedPluginEntry[],
		hooks: HookPipeline,
		enabledPlugins: Set<string>,
		pluginStates: Map<string, string>,
		config: EmDashConfig,
		mediaProviders: Map<string, MediaProvider>,
		mediaProviderEntries: MediaProviderEntry[],
		cronExecutor: CronExecutor | null,
		cronScheduler: CronScheduler | null,
		emailPipeline: EmailPipeline | null,
		allPipelinePlugins: ResolvedPlugin[],
		pipelineFactoryOptions: {
			db: Kysely<Database>;
			storage?: Storage;
			siteInfo?: { siteName?: string; siteUrl?: string; locale?: string };
		},
		runtimeDeps: RuntimeDependencies,
		pipelineRef: { current: HookPipeline },
	) {
		this._db = db;
		this.storage = storage;
		this.configuredPlugins = configuredPlugins;
		this.sandboxedPlugins = sandboxedPlugins;
		this.sandboxedPluginEntries = sandboxedPluginEntries;
		this.schemaRegistry = new SchemaRegistry(db);
		this._hooks = hooks;
		this.enabledPlugins = enabledPlugins;
		this.pluginStates = pluginStates;
		this.config = config;
		this.mediaProviders = mediaProviders;
		this.mediaProviderEntries = mediaProviderEntries;
		this.cronExecutor = cronExecutor;
		this.cronScheduler = cronScheduler;
		this.email = emailPipeline;
		this.allPipelinePlugins = allPipelinePlugins;
		this.pipelineFactoryOptions = pipelineFactoryOptions;
		this.runtimeDeps = runtimeDeps;
		this.pipelineRef = pipelineRef;
	}

	/**
	 * Get the sandbox runner instance (for marketplace install/update)
	 */
	getSandboxRunner(): SandboxRunner | null {
		return sandboxRunner;
	}

	/**
	 * Tick the cron system from request context (piggyback mode).
	 * Call this from middleware on each request to ensure cron tasks
	 * execute even when no dedicated scheduler is available.
	 */
	tickCron(): void {
		if (this.cronScheduler instanceof PiggybackScheduler) {
			this.cronScheduler.onRequest();
		}
	}

	/**
	 * Stop the cron scheduler gracefully.
	 * Call during worker shutdown or hot-reload.
	 */
	async stopCron(): Promise<void> {
		if (this.cronScheduler) {
			await this.cronScheduler.stop();
		}
	}

	/**
	 * Update in-memory plugin status and rebuild the hook pipeline.
	 *
	 * Rebuilding the pipeline ensures disabled plugins' hooks stop firing
	 * and re-enabled plugins' hooks start firing again without a restart.
	 * Exclusive hook selections are re-resolved after each rebuild.
	 */
	async setPluginStatus(pluginId: string, status: "active" | "inactive"): Promise<void> {
		this.pluginStates.set(pluginId, status);
		if (status === "active") {
			this.enabledPlugins.add(pluginId);
		} else {
			this.enabledPlugins.delete(pluginId);
		}

		await this.rebuildHookPipeline();
	}

	/**
	 * Rebuild the hook pipeline from the current set of enabled plugins.
	 *
	 * Filters `allPipelinePlugins` to only those in `enabledPlugins`,
	 * creates a fresh HookPipeline, re-resolves exclusive hook selections,
	 * and re-wires the context factory so existing references (cron
	 * callbacks, email pipeline) use the new pipeline.
	 */
	private async rebuildHookPipeline(): Promise<void> {
		const enabledList = this.allPipelinePlugins.filter((p) => this.enabledPlugins.has(p.id));
		const newPipeline = createHookPipeline(enabledList, this.pipelineFactoryOptions);

		// Re-resolve exclusive hooks against the new pipeline
		await EmDashRuntime.resolveExclusiveHooks(newPipeline, this.db, this.runtimeDeps);

		// Carry over context factory options from the old pipeline so that
		// email, cron reschedule, and other wired-in options are preserved.
		// The old pipeline's contextFactoryOptions were built up incrementally
		// via setContextFactory calls during create(). We replay them here.
		if (this.email) {
			newPipeline.setContextFactory({ db: this.db, emailPipeline: this.email });
		}
		if (this.cronScheduler) {
			const scheduler = this.cronScheduler;
			newPipeline.setContextFactory({
				cronReschedule: () => scheduler.reschedule(),
			});
		}

		// Update the email pipeline to use the new hook pipeline
		if (this.email) {
			this.email.setPipeline(newPipeline);
		}

		// Update the mutable ref so the cron closure dispatches through
		// the new pipeline without needing to reconstruct the CronExecutor.
		this.pipelineRef.current = newPipeline;

		this._hooks = newPipeline;
	}

	/**
	 * Synchronize marketplace plugin runtime state with DB + storage.
	 *
	 * Ensures install/update/uninstall changes take effect immediately in the
	 * current worker: loads newly active plugins and removes uninstalled ones.
	 */
	async syncMarketplacePlugins(): Promise<void> {
		if (!this.config.marketplace || !this.storage) return;
		if (!sandboxRunner || !sandboxRunner.isAvailable()) return;

		try {
			const stateRepo = new PluginStateRepository(this.db);
			const marketplaceStates = await stateRepo.getMarketplacePlugins();

			const desired = new Map<string, string>();
			for (const state of marketplaceStates) {
				this.pluginStates.set(state.pluginId, state.status);
				if (state.status === "active") {
					this.enabledPlugins.add(state.pluginId);
				} else {
					this.enabledPlugins.delete(state.pluginId);
				}
				if (state.status !== "active") continue;
				desired.set(state.pluginId, state.marketplaceVersion ?? state.version);
			}

			// Remove uninstalled or no-longer-active marketplace plugins from memory.
			const keysToRemove: string[] = [];
			for (const key of marketplacePluginKeys) {
				const [pluginId] = key.split(":");
				if (!pluginId) continue;
				const desiredVersion = desired.get(pluginId);
				if (desiredVersion && key === `${pluginId}:${desiredVersion}`) continue;
				keysToRemove.push(key);
			}

			for (const key of keysToRemove) {
				const [pluginId] = key.split(":");
				if (!pluginId) continue;
				const desiredVersion = desired.get(pluginId);
				if (!desiredVersion) {
					this.pluginStates.delete(pluginId);
					this.enabledPlugins.delete(pluginId);
				}

				const existing = sandboxedPluginCache.get(key);
				if (existing) {
					try {
						await existing.terminate();
					} catch (error) {
						console.warn(`EmDash: Failed to terminate sandboxed plugin ${key}:`, error);
					}
				}

				sandboxedPluginCache.delete(key);
				this.sandboxedPlugins.delete(key);
				marketplacePluginKeys.delete(key);
				if (pluginId) {
					sandboxedRouteMetaCache.delete(pluginId);
					marketplaceManifestCache.delete(pluginId);
				}
			}

			// Load newly active marketplace plugins.
			for (const [pluginId, version] of desired) {
				const key = `${pluginId}:${version}`;
				if (sandboxedPluginCache.has(key)) {
					marketplacePluginKeys.add(key);
					continue;
				}

				const bundle = await loadBundleFromR2(this.storage, pluginId, version);
				if (!bundle) {
					console.warn(`EmDash: Marketplace plugin ${pluginId}@${version} not found in R2`);
					continue;
				}

				const loaded = await sandboxRunner.load(bundle.manifest, bundle.backendCode);
				sandboxedPluginCache.set(key, loaded);
				this.sandboxedPlugins.set(key, loaded);
				marketplacePluginKeys.add(key);

				// Cache manifest admin config for getManifest()
				marketplaceManifestCache.set(pluginId, {
					id: bundle.manifest.id,
					version: bundle.manifest.version,
					admin: bundle.manifest.admin,
				});

				// Cache route metadata from manifest for auth decisions
				if (bundle.manifest.routes.length > 0) {
					const routeMetaMap = new Map<string, RouteMeta>();
					for (const entry of bundle.manifest.routes) {
						const normalized = normalizeManifestRoute(entry);
						routeMetaMap.set(normalized.name, { public: normalized.public === true });
					}
					sandboxedRouteMetaCache.set(pluginId, routeMetaMap);
				} else {
					sandboxedRouteMetaCache.delete(pluginId);
				}
			}
		} catch (error) {
			console.error("EmDash: Failed to sync marketplace plugins:", error);
		}
	}

	/**
	 * Create and initialize the runtime
	 */
	static async create(deps: RuntimeDependencies): Promise<EmDashRuntime> {
		// Initialize database
		const db = await EmDashRuntime.getDatabase(deps);

		// Verify and repair FTS indexes (auto-heal crash corruption)
		// FTS5 is SQLite-only; on other dialects, search is a no-op until
		// the pluggable SearchProvider work lands.
		if (isSqlite(db)) {
			try {
				const ftsManager = new FTSManager(db);
				const repaired = await ftsManager.verifyAndRepairAll();
				if (repaired > 0) {
					console.log(`Repaired ${repaired} corrupted FTS index(es) at startup`);
				}
			} catch {
				// FTS tables may not exist yet (pre-setup). Non-fatal.
			}
		}

		// Initialize storage
		const storage = EmDashRuntime.getStorage(deps);

		// Fetch plugin states from database
		let pluginStates: Map<string, string> = new Map();
		try {
			const states = await db.selectFrom("_plugin_state").select(["plugin_id", "status"]).execute();
			pluginStates = new Map(states.map((s) => [s.plugin_id, s.status]));
		} catch {
			// Plugin state table may not exist yet
		}

		// Build set of enabled plugins
		const enabledPlugins = new Set<string>();
		for (const plugin of deps.plugins) {
			const status = pluginStates.get(plugin.id);
			if (status === undefined || status === "active") {
				enabledPlugins.add(plugin.id);
			}
		}

		// Load site info for plugin context extensions
		let siteInfo: { siteName?: string; siteUrl?: string; locale?: string } | undefined;
		try {
			const optionsRepo = new OptionsRepository(db);
			const siteName = await optionsRepo.get<string>("emdash:site_title");
			const siteUrl = await optionsRepo.get<string>("emdash:site_url");
			const locale = await optionsRepo.get<string>("emdash:locale");
			siteInfo = {
				siteName: siteName ?? undefined,
				siteUrl: siteUrl ?? undefined,
				locale: locale ?? undefined,
			};
		} catch {
			// Options table may not exist yet (pre-setup)
		}

		// Build the full list of pipeline-eligible plugins: all configured
		// plugins (regardless of current enabled status) plus built-in plugins.
		// rebuildHookPipeline() filters this to only enabled plugins.
		const allPipelinePlugins: ResolvedPlugin[] = [...deps.plugins];

		// In dev mode, register a built-in console email provider.
		// It participates in exclusive hook resolution like any other plugin —
		// auto-selected when it's the sole provider, overridden when a real one is configured.
		// Gated by import.meta.env.DEV to prevent silent email loss in production.
		if (import.meta.env.DEV) {
			try {
				const devConsolePlugin = definePlugin({
					id: DEV_CONSOLE_EMAIL_PLUGIN_ID,
					version: "0.0.0",
					capabilities: ["email:provide"],
					hooks: {
						"email:deliver": {
							exclusive: true,
							handler: devConsoleEmailDeliver,
						},
					},
				});
				allPipelinePlugins.push(devConsolePlugin);
				// Built-in plugins are always enabled
				enabledPlugins.add(devConsolePlugin.id);
			} catch (error) {
				console.warn("[email] Failed to register dev console email provider:", error);
			}
		}

		// Register built-in default comment moderator.
		// Always present — auto-selected as the sole comment:moderate provider
		// unless a plugin (e.g. AI moderation) provides its own.
		try {
			const defaultModeratorPlugin = definePlugin({
				id: DEFAULT_COMMENT_MODERATOR_PLUGIN_ID,
				version: "0.0.0",
				capabilities: ["read:users"],
				hooks: {
					"comment:moderate": {
						exclusive: true,
						handler: defaultCommentModerate,
					},
				},
			});
			allPipelinePlugins.push(defaultModeratorPlugin);
			// Built-in plugins are always enabled
			enabledPlugins.add(defaultModeratorPlugin.id);
		} catch (error) {
			console.warn("[comments] Failed to register default moderator:", error);
		}

		// Filter to currently enabled plugins for the initial pipeline
		const enabledPluginList = allPipelinePlugins.filter((p) => enabledPlugins.has(p.id));

		// Create hook pipeline
		const pipelineFactoryOptions = {
			db,
			storage: storage ?? undefined,
			siteInfo,
		};
		const pipeline = createHookPipeline(enabledPluginList, pipelineFactoryOptions);

		// Load sandboxed plugins (build-time)
		const sandboxedPlugins = await EmDashRuntime.loadSandboxedPlugins(deps, db);

		// Cold-start: load marketplace-installed plugins from site R2
		if (deps.config.marketplace && storage) {
			await EmDashRuntime.loadMarketplacePlugins(db, storage, deps, sandboxedPlugins);
		}

		// Initialize media providers
		const mediaProviders = new Map<string, MediaProvider>();
		const mediaProviderEntries = deps.mediaProviderEntries ?? [];
		const providerContext: MediaProviderContext = { db, storage };

		for (const entry of mediaProviderEntries) {
			try {
				const provider = entry.createProvider(providerContext);
				mediaProviders.set(entry.id, provider);
			} catch (error) {
				console.warn(`Failed to initialize media provider "${entry.id}":`, error);
			}
		}

		// Resolve exclusive hooks — auto-select providers and sync with DB
		await EmDashRuntime.resolveExclusiveHooks(pipeline, db, deps);

		// ── Email pipeline ───────────────────────────────────────────────
		// The email pipeline orchestrates beforeSend → deliver → afterSend.
		// The dev console provider was registered above and will be auto-selected
		// by resolveExclusiveHooks if it's the sole email:deliver provider.
		const emailPipeline = new EmailPipeline(pipeline);

		// Wire email send into sandbox runner (created earlier but without
		// email pipeline since it didn't exist yet)
		if (sandboxRunner) {
			sandboxRunner.setEmailSend((message, pluginId) => emailPipeline.send(message, pluginId));
		}

		// ── Cron system ──────────────────────────────────────────────────
		// Create executor with a hook dispatch function that uses the pipeline.
		// The callback reads from a mutable ref so that rebuildHookPipeline()
		// can swap the pipeline without reconstructing the CronExecutor.
		const pipelineRef = { current: pipeline };
		const invokeCronHook: InvokeCronHookFn = async (pluginId, event) => {
			const result = await pipelineRef.current.invokeCronHook(pluginId, event);
			if (!result.success && result.error) {
				throw result.error;
			}
		};

		// Wire email pipeline into context factory (independent of cron —
		// must not be inside the cron try/catch or ctx.email breaks when cron fails)
		pipeline.setContextFactory({ db, emailPipeline });

		let cronExecutor: CronExecutor | null = null;
		let cronScheduler: CronScheduler | null = null;

		try {
			cronExecutor = new CronExecutor(db, invokeCronHook);

			// Recover stale locks from previous crashes
			const recovered = await cronExecutor.recoverStaleLocks();
			if (recovered > 0) {
				console.log(`[cron] Recovered ${recovered} stale task lock(s)`);
			}

			// Detect platform and create appropriate scheduler.
			// On Cloudflare Workers, setTimeout is available but unreliable for
			// long durations — use PiggybackScheduler as default.
			// In Node/Bun, use NodeCronScheduler with real timers.
			const isWorkersRuntime =
				typeof globalThis.navigator !== "undefined" &&
				globalThis.navigator.userAgent === "Cloudflare-Workers";

			if (isWorkersRuntime) {
				cronScheduler = new PiggybackScheduler(cronExecutor);
			} else {
				cronScheduler = new NodeCronScheduler(cronExecutor);
			}

			// Register system cleanup to run alongside each scheduler tick.
			// Pass storage so cleanupPendingUploads can delete orphaned files.
			cronScheduler.setSystemCleanup(async () => {
				try {
					await runSystemCleanup(db, storage ?? undefined);
				} catch (error) {
					// Non-fatal -- individual cleanup failures are already logged
					// by runSystemCleanup. This catches unexpected errors.
					console.error("[cleanup] System cleanup failed:", error);
				}
			});

			// Add cron reschedule callback (merges with existing factory options)
			pipeline.setContextFactory({
				cronReschedule: () => cronScheduler?.reschedule(),
			});

			// Start the scheduler
			await cronScheduler.start();
		} catch (error) {
			console.warn("[cron] Failed to initialize cron system:", error);
			// Non-fatal — CMS works without cron
		}

		return new EmDashRuntime(
			db,
			storage,
			deps.plugins,
			sandboxedPlugins,
			deps.sandboxedPluginEntries,
			pipeline,
			enabledPlugins,
			pluginStates,
			deps.config,
			mediaProviders,
			mediaProviderEntries,
			cronExecutor,
			cronScheduler,
			emailPipeline,
			allPipelinePlugins,
			pipelineFactoryOptions,
			deps,
			pipelineRef,
		);
	}

	/**
	 * Get a media provider by ID
	 */
	getMediaProvider(providerId: string): MediaProvider | undefined {
		return this.mediaProviders.get(providerId);
	}

	/**
	 * Get all media provider entries (for admin UI)
	 */
	getMediaProviderList(): Array<{
		id: string;
		name: string;
		icon?: string;
		capabilities: MediaProviderCapabilities;
	}> {
		return this.mediaProviderEntries.map((e) => ({
			id: e.id,
			name: e.name,
			icon: e.icon,
			capabilities: e.capabilities,
		}));
	}

	/**
	 * Get or create database instance
	 */
	private static async getDatabase(deps: RuntimeDependencies): Promise<Kysely<Database>> {
		// If a per-request DB override is set (e.g. by the playground middleware
		// which runs before the runtime init), use that directly. This allows
		// the runtime to initialize against the real DO database instead of
		// the dummy singleton dialect.
		const ctx = getRequestContext();
		if (ctx?.db) {
			// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- db in context is typed as unknown to avoid circular deps
			return ctx.db as Kysely<Database>;
		}

		const dbConfig = deps.config.database;

		// If no database configured in integration, try to get from loader
		if (!dbConfig) {
			try {
				return await getDb();
			} catch {
				throw new Error(
					"EmDash database not configured. Either configure database in astro.config.mjs or use emdashLoader in live.config.ts",
				);
			}
		}

		const cacheKey = dbConfig.entrypoint;

		// Return cached instance if available
		const cached = dbCache.get(cacheKey);
		if (cached) {
			return cached;
		}

		// Use initialization lock to prevent race conditions.
		// Sharing this promise across requests is safe because the Kysely instance
		// doesn't hold a request-scoped resource — the DO dialect uses a getStub()
		// factory that creates a fresh stub per query execution.
		if (dbInitPromise) {
			return dbInitPromise;
		}

		dbInitPromise = (async () => {
			const dialect = deps.createDialect(dbConfig.config);
			const db = new Kysely<Database>({ dialect });

			await runMigrations(db);

			// Auto-seed schema if no collections exist and setup hasn't run.
			// This covers first-load on sites that skip the setup wizard.
			// Dev-bypass and the wizard apply seeds explicitly.
			try {
				const [collectionCount, setupOption] = await Promise.all([
					db
						.selectFrom("_emdash_collections")
						.select((eb) => eb.fn.countAll<number>().as("count"))
						.executeTakeFirstOrThrow(),
					db
						.selectFrom("options")
						.select("value")
						.where("name", "=", "emdash:setup_complete")
						.executeTakeFirst(),
				]);

				const setupDone = (() => {
					try {
						return setupOption && JSON.parse(setupOption.value) === true;
					} catch {
						return false;
					}
				})();

				if (collectionCount.count === 0 && !setupDone) {
					const { applySeed } = await import("./seed/apply.js");
					const { loadSeed } = await import("./seed/load.js");
					const { validateSeed } = await import("./seed/validate.js");

					const seed = await loadSeed();
					const validation = validateSeed(seed);
					if (validation.valid) {
						await applySeed(db, seed, { onConflict: "skip" });
						console.log("Auto-seeded default collections");
					}
				}
			} catch {
				// Tables may not exist yet. Non-fatal.
			}

			dbCache.set(cacheKey, db);
			return db;
		})();

		try {
			return await dbInitPromise;
		} finally {
			dbInitPromise = null;
		}
	}

	/**
	 * Get or create storage instance
	 */
	private static getStorage(deps: RuntimeDependencies): Storage | null {
		const storageConfig = deps.config.storage;
		if (!storageConfig || !deps.createStorage) {
			return null;
		}

		const cacheKey = storageConfig.entrypoint;
		const cached = storageCache.get(cacheKey);
		if (cached) {
			return cached;
		}

		const storage = deps.createStorage(storageConfig.config);
		storageCache.set(cacheKey, storage);
		return storage;
	}

	/**
	 * Load sandboxed plugins using SandboxRunner
	 */
	private static async loadSandboxedPlugins(
		deps: RuntimeDependencies,
		db: Kysely<Database>,
	): Promise<Map<string, SandboxedPlugin>> {
		// Return cached plugins if already loaded
		if (sandboxedPluginCache.size > 0) {
			return sandboxedPluginCache;
		}

		// Check if sandboxing is enabled
		if (!deps.sandboxEnabled || deps.sandboxedPluginEntries.length === 0) {
			return sandboxedPluginCache;
		}

		// Create sandbox runner if not exists
		if (!sandboxRunner && deps.createSandboxRunner) {
			sandboxRunner = deps.createSandboxRunner({ db });
		}

		if (!sandboxRunner) {
			return sandboxedPluginCache;
		}

		// Check if the runner is actually available (has required bindings)
		if (!sandboxRunner.isAvailable()) {
			console.debug("EmDash: Sandbox runner not available (missing bindings), skipping sandbox");
			return sandboxedPluginCache;
		}

		// Load each sandboxed plugin
		for (const entry of deps.sandboxedPluginEntries) {
			const pluginKey = `${entry.id}:${entry.version}`;
			if (sandboxedPluginCache.has(pluginKey)) {
				continue;
			}

			try {
				// Build manifest from entry's declared config
				const manifest: PluginManifest = {
					id: entry.id,
					version: entry.version,
					capabilities: entry.capabilities ?? [],
					allowedHosts: entry.allowedHosts ?? [],
					storage: entry.storage ?? {},
					hooks: [],
					routes: [],
					admin: {},
				};

				const plugin = await sandboxRunner.load(manifest, entry.code);
				sandboxedPluginCache.set(pluginKey, plugin);
				console.log(
					`EmDash: Loaded sandboxed plugin ${pluginKey} with capabilities: [${manifest.capabilities.join(", ")}]`,
				);
			} catch (error) {
				console.error(`EmDash: Failed to load sandboxed plugin ${entry.id}:`, error);
			}
		}

		return sandboxedPluginCache;
	}

	/**
	 * Cold-start: load marketplace-installed plugins from site-local R2 storage
	 *
	 * Queries _plugin_state for source='marketplace' rows, fetches each bundle
	 * from R2, and loads via SandboxRunner.
	 */
	private static async loadMarketplacePlugins(
		db: Kysely<Database>,
		storage: Storage,
		deps: RuntimeDependencies,
		cache: Map<string, SandboxedPlugin>,
	): Promise<void> {
		// Ensure sandbox runner exists
		if (!sandboxRunner && deps.createSandboxRunner) {
			sandboxRunner = deps.createSandboxRunner({ db });
		}
		if (!sandboxRunner || !sandboxRunner.isAvailable()) {
			return;
		}

		try {
			const stateRepo = new PluginStateRepository(db);
			const marketplacePlugins = await stateRepo.getMarketplacePlugins();

			for (const plugin of marketplacePlugins) {
				if (plugin.status !== "active") continue;

				const version = plugin.marketplaceVersion ?? plugin.version;
				const pluginKey = `${plugin.pluginId}:${version}`;

				// Skip if already loaded (shouldn't happen, but guard)
				if (cache.has(pluginKey)) continue;

				try {
					const bundle = await loadBundleFromR2(storage, plugin.pluginId, version);
					if (!bundle) {
						console.warn(
							`EmDash: Marketplace plugin ${plugin.pluginId}@${version} not found in R2`,
						);
						continue;
					}

					const loaded = await sandboxRunner.load(bundle.manifest, bundle.backendCode);
					cache.set(pluginKey, loaded);
					marketplacePluginKeys.add(pluginKey);

					// Cache manifest admin config for getManifest()
					marketplaceManifestCache.set(plugin.pluginId, {
						id: bundle.manifest.id,
						version: bundle.manifest.version,
						admin: bundle.manifest.admin,
					});

					// Cache route metadata from manifest for auth decisions
					if (bundle.manifest.routes.length > 0) {
						const routeMeta = new Map<string, RouteMeta>();
						for (const entry of bundle.manifest.routes) {
							const normalized = normalizeManifestRoute(entry);
							routeMeta.set(normalized.name, { public: normalized.public === true });
						}
						sandboxedRouteMetaCache.set(plugin.pluginId, routeMeta);
					}

					console.log(
						`EmDash: Loaded marketplace plugin ${pluginKey} with capabilities: [${bundle.manifest.capabilities.join(", ")}]`,
					);
				} catch (error) {
					console.error(`EmDash: Failed to load marketplace plugin ${plugin.pluginId}:`, error);
				}
			}
		} catch {
			// _plugin_state table may not exist yet (pre-migration)
		}
	}

	/**
	 * Resolve exclusive hook selections on startup.
	 *
	 * Delegates to the shared resolveExclusiveHooks() in hooks.ts.
	 * The runtime version considers all pipeline providers as "active" since
	 * the pipeline was already built from only active/enabled plugins.
	 */
	private static async resolveExclusiveHooks(
		pipeline: HookPipeline,
		db: Kysely<Database>,
		deps: RuntimeDependencies,
	): Promise<void> {
		const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();
		if (exclusiveHookNames.length === 0) return;

		let optionsRepo: OptionsRepository;
		try {
			optionsRepo = new OptionsRepository(db);
		} catch {
			return; // Options table may not exist yet
		}

		// Build preferred hints from sandboxed plugin entries
		const preferredHints = new Map<string, string[]>();
		for (const entry of deps.sandboxedPluginEntries) {
			if (entry.preferred && entry.preferred.length > 0) {
				preferredHints.set(entry.id, entry.preferred);
			}
		}

		// The pipeline was created from only enabled plugins, so all providers
		// in it are active. The isActive check always returns true.
		await resolveExclusiveHooksShared({
			pipeline,
			isActive: () => true,
			getOption: (key) => optionsRepo.get<string>(key),
			setOption: (key, value) => optionsRepo.set(key, value),
			deleteOption: async (key) => {
				await optionsRepo.delete(key);
			},
			preferredHints,
		});
	}

	// =========================================================================
	// Manifest
	// =========================================================================

	/**
	 * Build the manifest (rebuilt on each request for freshness)
	 */
	async getManifest(): Promise<EmDashManifest> {
		// Build collections from database.
		// Use this.db (ALS-aware getter) so playground mode picks up the
		// per-session DO database instead of the hardcoded singleton.
		const manifestCollections: Record<string, ManifestCollection> = {};
		try {
			const registry = new SchemaRegistry(this.db);
			const dbCollections = await registry.listCollections();
			for (const collection of dbCollections) {
				const collectionWithFields = await registry.getCollectionWithFields(collection.slug);
				const fields: Record<
					string,
					{
						kind: string;
						label?: string;
						required?: boolean;
						widget?: string;
						options?: Array<{ value: string; label: string }>;
					}
				> = {};

				if (collectionWithFields?.fields) {
					for (const field of collectionWithFields.fields) {
						const entry: (typeof fields)[string] = {
							kind: FIELD_TYPE_TO_KIND[field.type] ?? "string",
							label: field.label,
							required: field.required,
						};
						if (field.widget) entry.widget = field.widget;
						// Include select/multiSelect options from validation
						if (field.validation?.options) {
							entry.options = field.validation.options.map((v) => ({
								value: v,
								label: v.charAt(0).toUpperCase() + v.slice(1),
							}));
						}
						fields[field.slug] = entry;
					}
				}

				manifestCollections[collection.slug] = {
					label: collection.label,
					labelSingular: collection.labelSingular || collection.label,
					supports: collection.supports || [],
					hasSeo: collection.hasSeo,
					fields,
				};
			}
		} catch (error) {
			console.debug("EmDash: Could not load database collections:", error);
		}

		// Build plugins manifest
		const manifestPlugins: Record<
			string,
			{
				version?: string;
				enabled?: boolean;
				sandboxed?: boolean;
				adminMode?: "react" | "blocks" | "none";
				adminPages?: Array<{ path: string; label?: string; icon?: string }>;
				dashboardWidgets?: Array<{
					id: string;
					title?: string;
					size?: string;
				}>;
				portableTextBlocks?: Array<{
					type: string;
					label: string;
					icon?: string;
					description?: string;
					placeholder?: string;
					fields?: Element[];
				}>;
				fieldWidgets?: Array<{
					name: string;
					label: string;
					fieldTypes: string[];
					elements?: Element[];
				}>;
			}
		> = {};

		for (const plugin of this.configuredPlugins) {
			const status = this.pluginStates.get(plugin.id);
			const enabled = status === undefined || status === "active";

			// Determine admin mode: has admin entry → react, has pages/widgets → blocks, else none
			const hasAdminEntry = !!plugin.admin?.entry;
			const hasAdminPages = (plugin.admin?.pages?.length ?? 0) > 0;
			const hasWidgets = (plugin.admin?.widgets?.length ?? 0) > 0;
			let adminMode: "react" | "blocks" | "none" = "none";
			if (hasAdminEntry) {
				adminMode = "react";
			} else if (hasAdminPages || hasWidgets) {
				adminMode = "blocks";
			}

			manifestPlugins[plugin.id] = {
				version: plugin.version,
				enabled,
				adminMode,
				adminPages: plugin.admin?.pages,
				dashboardWidgets: plugin.admin?.widgets,
				portableTextBlocks: plugin.admin?.portableTextBlocks,
				fieldWidgets: plugin.admin?.fieldWidgets,
			};
		}

		// Add sandboxed plugins (use entries for admin config)
		// TODO: sandboxed plugins need fieldWidgets extracted from their manifest
		// to support Block Kit field widgets. Currently only trusted plugins carry
		// fieldWidgets through the admin.fieldWidgets path.
		for (const entry of this.sandboxedPluginEntries) {
			const status = this.pluginStates.get(entry.id);
			const enabled = status === undefined || status === "active";

			const hasAdminPages = (entry.adminPages?.length ?? 0) > 0;
			const hasWidgets = (entry.adminWidgets?.length ?? 0) > 0;

			manifestPlugins[entry.id] = {
				version: entry.version,
				enabled,
				sandboxed: true,
				adminMode: hasAdminPages || hasWidgets ? "blocks" : "none",
				adminPages: entry.adminPages,
				dashboardWidgets: entry.adminWidgets,
			};
		}

		// Add marketplace-installed plugins (dynamically loaded from R2)
		for (const [pluginId, meta] of marketplaceManifestCache) {
			// Skip if already included from build-time config
			if (manifestPlugins[pluginId]) continue;

			const status = this.pluginStates.get(pluginId);
			const enabled = status === "active";

			const pages = meta.admin?.pages;
			const widgets = meta.admin?.widgets;
			const hasAdminPages = (pages?.length ?? 0) > 0;
			const hasWidgets = (widgets?.length ?? 0) > 0;

			manifestPlugins[pluginId] = {
				version: meta.version,
				enabled,
				sandboxed: true,
				adminMode: hasAdminPages || hasWidgets ? "blocks" : "none",
				adminPages: pages,
				dashboardWidgets: widgets,
			};
		}

		// Generate hash from both collections and plugins so cache invalidates
		// when plugins are enabled/disabled or their config changes
		const manifestHash = await hashString(
			JSON.stringify(manifestCollections) + JSON.stringify(manifestPlugins),
		);

		// Determine auth mode
		const authMode = getAuthMode(this.config);
		const authModeValue = authMode.type === "external" ? authMode.providerType : "passkey";

		// Include i18n config if enabled
		const { getI18nConfig, isI18nEnabled } = await import("./i18n/config.js");
		const i18nConfig = getI18nConfig();
		const i18n =
			isI18nEnabled() && i18nConfig
				? { defaultLocale: i18nConfig.defaultLocale, locales: i18nConfig.locales }
				: undefined;

		return {
			version: "0.1.0",
			hash: manifestHash,
			collections: manifestCollections,
			plugins: manifestPlugins,
			authMode: authModeValue,
			i18n,
			marketplace: !!this.config.marketplace,
		};
	}

	/**
	 * Invalidate the cached manifest (no-op now that we don't cache).
	 * Kept for API compatibility.
	 */
	invalidateManifest(): void {
		// No-op - manifest is rebuilt on each request
	}

	// =========================================================================
	// Content Handlers
	// =========================================================================

	async handleContentList(
		collection: string,
		params: {
			cursor?: string;
			limit?: number;
			status?: string;
			orderBy?: string;
			order?: "asc" | "desc";
			locale?: string;
		},
	) {
		return handleContentList(this.db, collection, params);
	}

	async handleContentGet(collection: string, id: string, locale?: string) {
		return handleContentGet(this.db, collection, id, locale);
	}

	async handleContentGetIncludingTrashed(collection: string, id: string, locale?: string) {
		return handleContentGetIncludingTrashed(this.db, collection, id, locale);
	}

	async handleContentCreate(
		collection: string,
		body: {
			data: Record<string, unknown>;
			slug?: string;
			status?: string;
			authorId?: string;
			bylines?: Array<{ bylineId: string; roleLabel?: string | null }>;
			locale?: string;
			translationOf?: string;
		},
	) {
		// Run beforeSave hooks (trusted plugins)
		let processedData = body.data;
		if (this.hooks.hasHooks("content:beforeSave")) {
			const hookResult = await this.hooks.runContentBeforeSave(body.data, collection, true);
			processedData = hookResult.content;
		}

		// Run beforeSave hooks (sandboxed plugins)
		processedData = await this.runSandboxedBeforeSave(processedData, collection, true);

		// Normalize media fields (fill dimensions, storageKey, etc.)
		processedData = await this.normalizeMediaFields(collection, processedData);

		// Create the content
		const result = await handleContentCreate(this.db, collection, {
			...body,
			data: processedData,
			authorId: body.authorId,
			bylines: body.bylines,
		});

		// Run afterSave hooks (fire-and-forget)
		if (result.success && result.data) {
			this.runAfterSaveHooks(contentItemToRecord(result.data.item), collection, true);
		}

		return result;
	}

	async handleContentUpdate(
		collection: string,
		id: string,
		body: {
			data?: Record<string, unknown>;
			slug?: string;
			status?: string;
			authorId?: string | null;
			bylines?: Array<{ bylineId: string; roleLabel?: string | null }>;
			/** Skip revision creation (used by autosave) */
			skipRevision?: boolean;
			_rev?: string;
		},
	) {
		// Resolve slug → ID if needed (before any lookups)
		const { ContentRepository } = await import("./database/repositories/content.js");
		const repo = new ContentRepository(this.db);
		const resolvedItem = await repo.findByIdOrSlug(collection, id);
		const resolvedId = resolvedItem?.id ?? id;

		// Validate _rev early — before draft revision writes which modify updated_at.
		// After validation, strip _rev so the handler doesn't double-check against
		// the now-modified timestamp.
		if (body._rev) {
			if (!resolvedItem) {
				return {
					success: false as const,
					error: { code: "NOT_FOUND", message: `Content item not found: ${id}` },
				};
			}
			const revCheck = validateRev(body._rev, resolvedItem);
			if (!revCheck.valid) {
				return {
					success: false as const,
					error: { code: "CONFLICT", message: revCheck.message },
				};
			}
		}
		const { _rev: _discardedRev, ...bodyWithoutRev } = body;

		// Run beforeSave hooks if data is provided
		let processedData = bodyWithoutRev.data;
		if (bodyWithoutRev.data) {
			if (this.hooks.hasHooks("content:beforeSave")) {
				const hookResult = await this.hooks.runContentBeforeSave(
					bodyWithoutRev.data,
					collection,
					false,
				);
				processedData = hookResult.content;
			}

			// Run sandboxed beforeSave hooks
			processedData = await this.runSandboxedBeforeSave(processedData!, collection, false);

			// Normalize media fields (fill dimensions, storageKey, etc.)
			processedData = await this.normalizeMediaFields(collection, processedData);
		}

		// Draft-aware revision handling (if collection supports revisions)
		// Content table columns = published data (never written by saves).
		// Draft data lives only in the revisions table.
		let usesDraftRevisions = false;
		if (processedData) {
			try {
				const collectionInfo = await this.schemaRegistry.getCollectionWithFields(collection);
				if (collectionInfo?.supports?.includes("revisions")) {
					usesDraftRevisions = true;
					const revisionRepo = new RevisionRepository(this.db);
					// Re-fetch to get latest state (resolvedItem may be stale after _rev check)
					const existing = await repo.findById(collection, resolvedId);

					if (existing) {
						// Build the draft data: merge with existing draft revision if one exists,
						// otherwise merge with the published data from the content table
						let baseData: Record<string, unknown>;
						if (existing.draftRevisionId) {
							const draftRevision = await revisionRepo.findById(existing.draftRevisionId);
							baseData = draftRevision?.data ?? existing.data;
						} else {
							baseData = existing.data;
						}

						// Include slug in the revision data if it changed
						const mergedData = { ...baseData, ...processedData };
						if (bodyWithoutRev.slug !== undefined) {
							mergedData._slug = bodyWithoutRev.slug;
						}

						if (bodyWithoutRev.skipRevision && existing.draftRevisionId) {
							// Autosave: update existing draft revision in place
							await revisionRepo.updateData(existing.draftRevisionId, mergedData);
						} else {
							// Create new draft revision
							const revision = await revisionRepo.create({
								collection,
								entryId: resolvedId,
								data: mergedData,
								authorId: bodyWithoutRev.authorId ?? undefined,
							});

							// Update entry to point to new draft (metadata only, not data columns)
							const tableName = `ec_${collection}`;
							await sql`
								UPDATE ${sql.ref(tableName)}
								SET draft_revision_id = ${revision.id},
									updated_at = ${new Date().toISOString()}
								WHERE id = ${resolvedId}
							`.execute(this.db);

							// Fire-and-forget: prune old revisions to prevent unbounded growth
							void revisionRepo.pruneOldRevisions(collection, resolvedId, 50).catch(() => {});
						}
					}
				}
			} catch {
				// Don't fail the update if revision creation fails
			}
		}

		// Update the content table:
		// - If collection uses draft revisions: only update metadata (no data fields, no slug)
		// - Otherwise: update everything as before
		const result = await handleContentUpdate(this.db, collection, resolvedId, {
			...bodyWithoutRev,
			data: usesDraftRevisions ? undefined : processedData,
			slug: usesDraftRevisions ? undefined : bodyWithoutRev.slug,
			authorId: bodyWithoutRev.authorId,
			bylines: bodyWithoutRev.bylines,
		});

		// Run afterSave hooks (fire-and-forget)
		if (result.success && result.data) {
			this.runAfterSaveHooks(contentItemToRecord(result.data.item), collection, false);
		}

		return result;
	}

	async handleContentDelete(collection: string, id: string) {
		// Run beforeDelete hooks (trusted plugins)
		if (this.hooks.hasHooks("content:beforeDelete")) {
			const { allowed } = await this.hooks.runContentBeforeDelete(id, collection);
			if (!allowed) {
				return {
					success: false,
					error: {
						code: "DELETE_BLOCKED",
						message: "Delete blocked by plugin hook",
					},
				};
			}
		}

		// Run sandboxed beforeDelete hooks
		const sandboxAllowed = await this.runSandboxedBeforeDelete(id, collection);
		if (!sandboxAllowed) {
			return {
				success: false,
				error: {
					code: "DELETE_BLOCKED",
					message: "Delete blocked by sandboxed plugin hook",
				},
			};
		}

		// Delete the content
		const result = await handleContentDelete(this.db, collection, id);

		// Run afterDelete hooks (fire-and-forget)
		if (result.success) {
			this.runAfterDeleteHooks(id, collection);
		}

		return result;
	}

	// =========================================================================
	// Trash Handlers
	// =========================================================================

	async handleContentListTrashed(
		collection: string,
		params: { cursor?: string; limit?: number } = {},
	) {
		return handleContentListTrashed(this.db, collection, params);
	}

	async handleContentRestore(collection: string, id: string) {
		return handleContentRestore(this.db, collection, id);
	}

	async handleContentPermanentDelete(collection: string, id: string) {
		return handleContentPermanentDelete(this.db, collection, id);
	}

	async handleContentCountTrashed(collection: string) {
		return handleContentCountTrashed(this.db, collection);
	}

	async handleContentDuplicate(collection: string, id: string, authorId?: string) {
		return handleContentDuplicate(this.db, collection, id, authorId);
	}

	// =========================================================================
	// Publishing & Scheduling Handlers
	// =========================================================================

	async handleContentPublish(collection: string, id: string) {
		return handleContentPublish(this.db, collection, id);
	}

	async handleContentUnpublish(collection: string, id: string) {
		return handleContentUnpublish(this.db, collection, id);
	}

	async handleContentSchedule(collection: string, id: string, scheduledAt: string) {
		return handleContentSchedule(this.db, collection, id, scheduledAt);
	}

	async handleContentUnschedule(collection: string, id: string) {
		return handleContentUnschedule(this.db, collection, id);
	}

	async handleContentCountScheduled(collection: string) {
		return handleContentCountScheduled(this.db, collection);
	}

	async handleContentDiscardDraft(collection: string, id: string) {
		return handleContentDiscardDraft(this.db, collection, id);
	}

	async handleContentCompare(collection: string, id: string) {
		return handleContentCompare(this.db, collection, id);
	}

	async handleContentTranslations(collection: string, id: string) {
		return handleContentTranslations(this.db, collection, id);
	}

	// =========================================================================
	// Media Handlers
	// =========================================================================

	async handleMediaList(params: { cursor?: string; limit?: number; mimeType?: string }) {
		return handleMediaList(this.db, params);
	}

	async handleMediaGet(id: string) {
		return handleMediaGet(this.db, id);
	}

	async handleMediaCreate(input: {
		filename: string;
		mimeType: string;
		size?: number;
		width?: number;
		height?: number;
		storageKey: string;
		contentHash?: string;
		blurhash?: string;
		dominantColor?: string;
	}) {
		// Run beforeUpload hooks
		let processedInput = input;
		if (this.hooks.hasHooks("media:beforeUpload")) {
			const hookResult = await this.hooks.runMediaBeforeUpload({
				name: input.filename,
				type: input.mimeType,
				size: input.size || 0,
			});
			processedInput = {
				...input,
				filename: hookResult.file.name,
				mimeType: hookResult.file.type,
				size: hookResult.file.size,
			};
		}

		// Create the media record
		const result = await handleMediaCreate(this.db, processedInput);

		// Run afterUpload hooks (fire-and-forget)
		if (result.success && this.hooks.hasHooks("media:afterUpload")) {
			const item = result.data.item;
			const mediaItem: MediaItem = {
				id: item.id,
				filename: item.filename,
				mimeType: item.mimeType,
				size: item.size,
				url: `/media/${item.id}/${item.filename}`,
				createdAt: item.createdAt,
			};
			this.hooks
				.runMediaAfterUpload(mediaItem)
				.catch((err) => console.error("EmDash afterUpload hook error:", err));
		}

		return result;
	}

	async handleMediaUpdate(
		id: string,
		input: { alt?: string; caption?: string; width?: number; height?: number },
	) {
		return handleMediaUpdate(this.db, id, input);
	}

	async handleMediaDelete(id: string) {
		return handleMediaDelete(this.db, id);
	}

	// =========================================================================
	// Revision Handlers
	// =========================================================================

	async handleRevisionList(collection: string, entryId: string, params: { limit?: number } = {}) {
		return handleRevisionList(this.db, collection, entryId, params);
	}

	async handleRevisionGet(revisionId: string) {
		return handleRevisionGet(this.db, revisionId);
	}

	async handleRevisionRestore(revisionId: string, callerUserId: string) {
		return handleRevisionRestore(this.db, revisionId, callerUserId);
	}

	// =========================================================================
	// Plugin Routes
	// =========================================================================

	/**
	 * Get route metadata for a plugin route without invoking the handler.
	 * Used by the catch-all route to decide auth before dispatch.
	 * Returns null if the plugin or route doesn't exist.
	 */
	getPluginRouteMeta(pluginId: string, path: string): RouteMeta | null {
		if (!this.isPluginEnabled(pluginId)) return null;

		const routeKey = path.replace(LEADING_SLASH_PATTERN, "");

		// Check trusted plugins first
		const trustedPlugin = this.configuredPlugins.find((p) => p.id === pluginId);
		if (trustedPlugin) {
			const route = trustedPlugin.routes[routeKey];
			if (!route) return null;
			return { public: route.public === true };
		}

		// Check sandboxed plugin route metadata cache
		const meta = sandboxedRouteMetaCache.get(pluginId);
		if (meta) {
			const routeMeta = meta.get(routeKey);
			if (routeMeta) return routeMeta;
		}

		// The "admin" route is implicitly available for any sandboxed plugin
		// that declares admin pages or widgets. This handles plugins installed
		// from bundles that predate the explicit admin route requirement.
		if (routeKey === "admin") {
			const manifestMeta = marketplaceManifestCache.get(pluginId);
			if (manifestMeta?.admin?.pages?.length || manifestMeta?.admin?.widgets?.length) {
				return { public: false };
			}
			// Also check build-time sandboxed entries
			const entry = this.sandboxedPluginEntries.find((e) => e.id === pluginId);
			if (entry?.adminPages?.length || entry?.adminWidgets?.length) {
				return { public: false };
			}
		}

		// Fallback: if the plugin exists in the sandbox cache, allow the route.
		// The sandbox runner will return an error if the route doesn't actually exist.
		if (this.findSandboxedPlugin(pluginId)) {
			return { public: false };
		}

		return null;
	}

	async handlePluginApiRoute(pluginId: string, _method: string, path: string, request: Request) {
		if (!this.isPluginEnabled(pluginId)) {
			return {
				success: false,
				error: { code: "NOT_FOUND", message: `Plugin not enabled: ${pluginId}` },
			};
		}

		// Check trusted (configured) plugins first — this must match the
		// resolution order in getPluginRouteMeta to avoid auth/execution mismatches.
		const trustedPlugin = this.configuredPlugins.find((p) => p.id === pluginId);
		if (trustedPlugin && this.enabledPlugins.has(trustedPlugin.id)) {
			const routeRegistry = new PluginRouteRegistry({ db: this.db });
			routeRegistry.register(trustedPlugin);

			const routeKey = path.replace(LEADING_SLASH_PATTERN, "");

			let body: unknown = undefined;
			try {
				body = await request.json();
			} catch {
				// No body or not JSON
			}

			return routeRegistry.invoke(pluginId, routeKey, { request, body });
		}

		// Check sandboxed (marketplace) plugins second
		const sandboxedPlugin = this.findSandboxedPlugin(pluginId);
		if (sandboxedPlugin) {
			return this.handleSandboxedRoute(sandboxedPlugin, path, request);
		}

		return {
			success: false,
			error: { code: "NOT_FOUND", message: `Plugin not found: ${pluginId}` },
		};
	}

	// =========================================================================
	// Sandboxed Plugin Helpers
	// =========================================================================

	private findSandboxedPlugin(pluginId: string): SandboxedPlugin | undefined {
		for (const [key, plugin] of this.sandboxedPlugins) {
			if (key.startsWith(pluginId + ":")) {
				return plugin;
			}
		}
		return undefined;
	}

	/**
	 * Normalize image/file fields in content data.
	 * Fills missing dimensions, storageKey, mimeType, and filename from providers.
	 */
	private async normalizeMediaFields(
		collection: string,
		data: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		let collectionInfo;
		try {
			collectionInfo = await this.schemaRegistry.getCollectionWithFields(collection);
		} catch {
			return data;
		}
		if (!collectionInfo?.fields) return data;

		const imageFields = collectionInfo.fields.filter(
			(f) => f.type === "image" || f.type === "file",
		);
		if (imageFields.length === 0) return data;

		const getProvider = (id: string) => this.getMediaProvider(id);
		const result = { ...data };

		for (const field of imageFields) {
			const value = result[field.slug];
			if (value == null) continue;

			try {
				const normalized = await normalizeMediaValue(value, getProvider);
				if (normalized) {
					result[field.slug] = normalized;
				}
			} catch {
				// Don't fail the save if normalization fails for a single field
			}
		}

		return result;
	}

	private async runSandboxedBeforeSave(
		content: Record<string, unknown>,
		collection: string,
		isNew: boolean,
	): Promise<Record<string, unknown>> {
		let result = content;

		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [id] = pluginKey.split(":");
			if (!id || !this.isPluginEnabled(id)) continue;

			try {
				const hookResult = await plugin.invokeHook("content:beforeSave", {
					content: result,
					collection,
					isNew,
				});
				if (hookResult && typeof hookResult === "object" && !Array.isArray(hookResult)) {
					// Sandbox returns unknown; convert to record by iterating own properties
					const record: Record<string, unknown> = {};
					for (const [k, v] of Object.entries(hookResult)) {
						record[k] = v;
					}
					result = record;
				}
			} catch (error) {
				console.error(`EmDash: Sandboxed plugin ${id} beforeSave hook error:`, error);
			}
		}

		return result;
	}

	private async runSandboxedBeforeDelete(id: string, collection: string): Promise<boolean> {
		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [pluginId] = pluginKey.split(":");
			if (!pluginId || !this.isPluginEnabled(pluginId)) continue;

			try {
				const result = await plugin.invokeHook("content:beforeDelete", {
					id,
					collection,
				});
				if (result === false) {
					return false;
				}
			} catch (error) {
				console.error(`EmDash: Sandboxed plugin ${pluginId} beforeDelete hook error:`, error);
			}
		}

		return true;
	}

	private runAfterSaveHooks(
		content: Record<string, unknown>,
		collection: string,
		isNew: boolean,
	): void {
		// Trusted plugins
		if (this.hooks.hasHooks("content:afterSave")) {
			this.hooks
				.runContentAfterSave(content, collection, isNew)
				.catch((err) => console.error("EmDash afterSave hook error:", err));
		}

		// Sandboxed plugins
		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [id] = pluginKey.split(":");
			if (!id || !this.isPluginEnabled(id)) continue;

			plugin
				.invokeHook("content:afterSave", { content, collection, isNew })
				.catch((err) => console.error(`EmDash: Sandboxed plugin ${id} afterSave error:`, err));
		}
	}

	private runAfterDeleteHooks(id: string, collection: string): void {
		// Trusted plugins
		if (this.hooks.hasHooks("content:afterDelete")) {
			this.hooks
				.runContentAfterDelete(id, collection)
				.catch((err) => console.error("EmDash afterDelete hook error:", err));
		}

		// Sandboxed plugins
		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [pluginId] = pluginKey.split(":");
			if (!pluginId || !this.isPluginEnabled(pluginId)) continue;

			plugin
				.invokeHook("content:afterDelete", { id, collection })
				.catch((err) =>
					console.error(`EmDash: Sandboxed plugin ${pluginId} afterDelete error:`, err),
				);
		}
	}

	private async handleSandboxedRoute(
		plugin: SandboxedPlugin,
		path: string,
		request: Request,
	): Promise<{
		success: boolean;
		data?: unknown;
		error?: { code: string; message: string };
	}> {
		const routeName = path.replace(LEADING_SLASH_PATTERN, "");

		let body: unknown = undefined;
		try {
			body = await request.json();
		} catch {
			// No body or not JSON
		}

		try {
			const headers = sanitizeHeadersForSandbox(request.headers);
			const meta = extractRequestMeta(request);
			const result = await plugin.invokeRoute(routeName, body, {
				url: request.url,
				method: request.method,
				headers,
				meta,
			});
			return { success: true, data: result };
		} catch (error) {
			console.error(`EmDash: Sandboxed plugin route error:`, error);
			return {
				success: false,
				error: {
					code: "ROUTE_ERROR",
					message: error instanceof Error ? error.message : String(error),
				},
			};
		}
	}

	// =========================================================================
	// Public Page Contributions
	// =========================================================================

	/**
	 * Cache for page contributions. Uses a WeakMap keyed on the PublicPageContext
	 * object so results are collected once per page context per request, even when
	 * multiple render components (EmDashHead, EmDashBodyStart, EmDashBodyEnd)
	 * request contributions from the same page.
	 */
	private pageContributionCache = new WeakMap<PublicPageContext, Promise<PageContributions>>();

	/**
	 * Collect all page contributions (metadata + fragments) in a single pass.
	 * Results are cached by page context object identity.
	 */
	async collectPageContributions(page: PublicPageContext): Promise<PageContributions> {
		const cached = this.pageContributionCache.get(page);
		if (cached) return cached;

		const promise = this.doCollectPageContributions(page);
		this.pageContributionCache.set(page, promise);
		return promise;
	}

	private async doCollectPageContributions(page: PublicPageContext): Promise<PageContributions> {
		const metadata: PageMetadataContribution[] = [];
		const fragments: PageFragmentContribution[] = [];

		// Trusted plugins via HookPipeline — both metadata and fragments
		if (this.hooks.hasHooks("page:metadata")) {
			const results = await this.hooks.runPageMetadata({ page });
			for (const r of results) {
				metadata.push(...r.contributions);
			}
		}

		if (this.hooks.hasHooks("page:fragments")) {
			const results = await this.hooks.runPageFragments({ page });
			for (const r of results) {
				fragments.push(...r.contributions);
			}
		}

		// Sandboxed plugins — metadata only, never fragments
		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [id] = pluginKey.split(":");
			if (!id || !this.isPluginEnabled(id)) continue;

			try {
				const result = await plugin.invokeHook("page:metadata", { page });
				if (result != null) {
					const items = Array.isArray(result) ? result : [result];
					for (const item of items) {
						if (isValidMetadataContribution(item)) {
							metadata.push(item);
						}
					}
				}
			} catch (error) {
				console.error(`EmDash: Sandboxed plugin ${id} page:metadata error:`, error);
			}
		}

		return { metadata, fragments };
	}

	/**
	 * Collect page metadata contributions from trusted and sandboxed plugins.
	 * Delegates to the single-pass collector and returns the metadata portion.
	 */
	async collectPageMetadata(page: PublicPageContext): Promise<PageMetadataContribution[]> {
		const { metadata } = await this.collectPageContributions(page);
		return metadata;
	}

	/**
	 * Collect page fragment contributions from trusted plugins only.
	 * Delegates to the single-pass collector and returns the fragments portion.
	 */
	async collectPageFragments(page: PublicPageContext): Promise<PageFragmentContribution[]> {
		const { fragments } = await this.collectPageContributions(page);
		return fragments;
	}

	private isPluginEnabled(pluginId: string): boolean {
		const status = this.pluginStates.get(pluginId);
		return status === undefined || status === "active";
	}
}

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/block-kit.mdx
```mdx
---
title: Block Kit
description: Declarative UI blocks for sandboxed plugin admin pages and widgets.
---

import { Aside } from "@astrojs/starlight/components";

EmDash's Block Kit lets sandboxed plugins describe their admin UI as JSON. The host renders the blocks — no plugin-supplied JavaScript ever runs in the browser.

<Aside>
Trusted plugins (declared in `astro.config.ts`) can still ship custom React components. Block Kit is for runtime-installed sandboxed plugins that cannot be trusted with DOM access.
</Aside>

<Aside type="tip">
Block Kit elements are also used for [Portable Text block editing fields](/plugins/creating-plugins/#portable-text-block-types). When a plugin declares `fields` on a block type, the editor renders a Block Kit form for editing block data (URL, title, parameters, etc.).
</Aside>

## How it works

1. User navigates to a plugin's admin page
2. The admin sends a `page_load` interaction to the plugin's admin route
3. The plugin returns a `BlockResponse` containing an array of blocks
4. The admin renders the blocks using the `BlockRenderer` component
5. When the user interacts (clicks a button, submits a form), the admin sends the interaction back to the plugin
6. The plugin returns new blocks, and the cycle repeats

```typescript
// Plugin admin route handler
routes: {
  admin: {
    handler: async (ctx, { request }) => {
      const interaction = await request.json();

      if (interaction.type === "page_load") {
        return {
          blocks: [
            { type: "header", text: "My Plugin Settings" },
            {
              type: "form",
              block_id: "settings",
              fields: [
                { type: "text_input", action_id: "api_url", label: "API URL" },
                { type: "toggle", action_id: "enabled", label: "Enabled", initial_value: true },
              ],
              submit: { label: "Save", action_id: "save" },
            },
          ],
        };
      }

      if (interaction.type === "form_submit" && interaction.action_id === "save") {
        await ctx.kv.set("settings", interaction.values);
        return {
          blocks: [/* ... updated blocks ... */],
          toast: { message: "Settings saved", type: "success" },
        };
      }
    },
  },
}
```

## Block types

| Type | Description |
|------|-------------|
| `header` | Large bold heading |
| `section` | Text with optional accessory element |
| `divider` | Horizontal rule |
| `fields` | Two-column label/value grid |
| `table` | Data table with formatting, sorting, pagination |
| `actions` | Horizontal row of buttons and controls |
| `stats` | Dashboard metric cards with trend indicators |
| `form` | Input fields with conditional visibility and submit |
| `image` | Block-level image with caption |
| `context` | Small muted help text |
| `columns` | 2-3 column layout with nested blocks |

## Element types

| Type | Description |
|------|-------------|
| `button` | Action button with optional confirmation dialog |
| `text_input` | Single-line or multiline text input |
| `number_input` | Numeric input with min/max |
| `select` | Dropdown select |
| `toggle` | On/off switch |
| `secret_input` | Masked input for API keys and tokens |

## Builder helpers

The `@emdash-cms/blocks` package exports builder helpers for cleaner code:

```typescript
import { blocks, elements } from "@emdash-cms/blocks";

const { header, form, section, stats } = blocks;
const { textInput, toggle, select, button } = elements;

return {
  blocks: [
    header("SEO Settings"),
    form({
      blockId: "settings",
      fields: [
        textInput("site_title", "Site Title", { initialValue: "My Site" }),
        toggle("generate_sitemap", "Generate Sitemap", { initialValue: true }),
        select("robots", "Default Robots", [
          { label: "Index, Follow", value: "index,follow" },
          { label: "No Index", value: "noindex,follow" },
        ]),
      ],
      submit: { label: "Save", actionId: "save" },
    }),
  ],
};
```

## Conditional fields

Form fields can be conditionally shown based on other field values:

```json
{
  "type": "toggle",
  "action_id": "auth_enabled",
  "label": "Enable Authentication"
}
```

```json
{
  "type": "secret_input",
  "action_id": "api_key",
  "label": "API Key",
  "condition": { "field": "auth_enabled", "eq": true }
}
```

The `api_key` field only appears when `auth_enabled` is toggled on. Conditions are evaluated client-side with no round-trip.

## Try it

Use the [Block Playground](https://emdash-blocks.cto.cloudflare.dev/) to interactively build and test block layouts.

```

File: /Users/masonjames/Projects/gravitysmtp/includes/connectors/class-connector-service-provider.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Connectors;

use Gravity_Forms\Gravity_SMTP\Apps\Config\Tools_Config;
use Gravity_Forms\Gravity_SMTP\Connectors\Config\Connector_Config;
use Gravity_Forms\Gravity_SMTP\Connectors\Config\Connector_Endpoints_Config;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Check_Background_Tasks_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Cleanup_Data_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Get_Connector_Emails;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Get_Single_Email_Data_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Save_Connector_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Save_Plugin_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Send_Test_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Oauth\Google_Oauth_Handler;
use Gravity_Forms\Gravity_SMTP\Connectors\Oauth\Microsoft_Oauth_Handler;
use Gravity_Forms\Gravity_SMTP\Connectors\Oauth\Zoho_Oauth_Handler;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Amazon;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Brevo;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Elastic_Email;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Emailit;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Generic;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Google;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Mailchimp;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Mailersend;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Mailgun;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Mailjet;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Microsoft;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_PHPMail;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Postmark;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Resend;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Sendgrid;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_SMTP2GO;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Sparkpost;
use Gravity_Forms\Gravity_SMTP\Connectors\Types\Connector_Zoho;
use Gravity_Forms\Gravity_SMTP\Data_Store\Const_Data_Store;
use Gravity_Forms\Gravity_SMTP\Data_Store\Data_Store_Router;
use Gravity_Forms\Gravity_SMTP\Data_Store\Opts_Data_Store;
use Gravity_Forms\Gravity_SMTP\Data_Store\Plugin_Opts_Data_Store;
use Gravity_Forms\Gravity_SMTP\Logging\Debug\Debug_Logger;
use Gravity_Forms\Gravity_SMTP\Logging\Log\Logger;
use Gravity_Forms\Gravity_SMTP\Logging\Logging_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Models\Debug_Log_Model;
use Gravity_Forms\Gravity_SMTP\Models\Event_Model;
use Gravity_Forms\Gravity_SMTP\Models\Hydrators\Hydrator_Factory;
use Gravity_Forms\Gravity_SMTP\Models\Log_Details_Model;
use Gravity_Forms\Gravity_SMTP\Models\Notifications_Model;
use Gravity_Forms\Gravity_SMTP\Utils\Booliesh;
use Gravity_Forms\Gravity_Tools\Logging\DB_Logging_Provider;
use Gravity_Forms\Gravity_Tools\Providers\Config_Collection_Service_Provider;
use Gravity_Forms\Gravity_Tools\Providers\Config_Service_Provider;
use Gravity_Forms\Gravity_Tools\Updates\Updates_Service_Provider;
use Gravity_Forms\Gravity_Tools\Utils\Utils_Service_Provider;

class Connector_Service_Provider extends Config_Service_Provider {

	const CONNECTOR_FACTORY      = 'connector_factory';
	const PHPMAILER              = 'phpmailer';
	const DATA_STORE_CONST       = 'data_store_const';
	const DATA_STORE_OPTS        = 'data_store_opts';
	const DATA_STORE_PLUGIN_OPTS = 'data_store_plugin_opts';
	const DATA_STORE_ROUTER      = 'data_store_router';
	const EVENT_MODEL            = 'event_model';
	const LOG_DETAILS_MODEL      = 'log_details_model';
	const NOTIFICATIONS_MODEL    = 'notifications_model';
	const HYDRATOR_FACTORY       = 'hydrator_factory';
	const NAME_MAP               = 'name_map';
	const REGISTERED_CONNECTORS  = 'registered_connectors';
	const CONNECTOR_DATA_MAP     = 'connector_data_map';

	const OAUTH_DATA_HANDLER      = 'oauth_data_handler';
	const GOOGLE_OAUTH_HANDLER    = 'google_oauth_handler';
	const MICROSOFT_OAUTH_HANDLER = 'microsoft_oauth_handler';
	const ZOHO_OAUTH_HANDLER      = 'zoho_oauth_handler';

	const SEND_TEST_ENDPOINT               = 'send_test_endpoint';
	const CLEANUP_DATA_ENDPOINT            = 'cleanup_data_endpoint';
	const SAVE_CONNECTOR_SETTINGS_ENDPOINT = 'save_connector_settings_endpoint';
	const SAVE_PLUGIN_SETTINGS_ENDPOINT    = 'save_plugin_settings_endpoint';
	const GET_SINGLE_EMAIL_DATA_ENDPOINT   = 'get_single_email_data_endpoint';
	const CHECK_BACKGROUND_TASKS_ENDPOINT  = 'check_background_tasks_endpoint';
	const GET_CONNECTOR_EMAILS_ENDPOINT    = 'get_connector_emails_endpoint';

	const CONNECTOR_ENDPOINTS_CONFIG = 'connector_endpoints_config';

	const CONNECTOR_AMAZON_SES    = 'Amazon';
	const CONNECTOR_BREVO         = 'Brevo';
	const CONNECTOR_ELASTIC_EMAIL = 'Elastic_Email';
	const CONNECTOR_EMAILIT       = 'Emailit';
	const CONNECTOR_GENERIC       = 'Generic';
	const CONNECTOR_GOOGLE        = 'Google';
	const CONNECTOR_MAILCHIMP     = 'Mailchimp';
	const CONNECTOR_MAILERSEND    = 'MailerSend';
	const CONNECTOR_MAILGUN       = 'Mailgun';
	const CONNECTOR_MAILJET       = 'Mailjet';
	const CONNECTOR_MICROSOFT     = 'Microsoft';
	const CONNECTOR_PHPMAIL       = 'Phpmail';
	const CONNECTOR_POSTMARK      = 'Postmark';
	const CONNECTOR_RESEND        = 'Resend';
	const CONNECTOR_SENDGRID      = 'Sendgrid';
	const CONNECTOR_SMTP2GO       = 'SMTP2GO';
	const CONNECTOR_SPARKPOST     = 'Sparkpost';
	const CONNECTOR_ZOHO          = 'Zoho';

	protected $connectors = array(
		self::CONNECTOR_AMAZON_SES    => Connector_Amazon::class,
		self::CONNECTOR_BREVO         => Connector_Brevo::class,
		self::CONNECTOR_ELASTIC_EMAIL => Connector_Elastic_Email::class,
		self::CONNECTOR_EMAILIT       => Connector_Emailit::class,
		self::CONNECTOR_GENERIC       => Connector_Generic::class,
		self::CONNECTOR_GOOGLE        => Connector_Google::class,
		self::CONNECTOR_MAILCHIMP     => Connector_Mailchimp::class,
		self::CONNECTOR_MAILERSEND    => Connector_Mailersend::class,
		self::CONNECTOR_MAILGUN       => Connector_Mailgun::class,
		self::CONNECTOR_MAILJET       => Connector_Mailjet::class,
		self::CONNECTOR_MICROSOFT     => Connector_Microsoft::class,
		self::CONNECTOR_PHPMAIL       => Connector_PHPMail::class,
		self::CONNECTOR_POSTMARK      => Connector_Postmark::class,
		self::CONNECTOR_RESEND        => Connector_Resend::class,
		self::CONNECTOR_SENDGRID      => Connector_Sendgrid::class,
		self::CONNECTOR_SMTP2GO       => Connector_SMTP2GO::class,
		self::CONNECTOR_SPARKPOST     => Connector_Sparkpost::class,
		self::CONNECTOR_ZOHO          => Connector_Zoho::class,
	);

	protected $configs = array(
		self::CONNECTOR_ENDPOINTS_CONFIG => Connector_Endpoints_Config::class,
	);

	public function register( \Gravity_Forms\Gravity_Tools\Service_Container $container ) {
		parent::register( $container );

		$self = $this;

		$this->container->add( self::PHPMAILER, function () {
			global $phpmailer;

			// (Re)create it, if it's gone missing.
			if ( ! ( $phpmailer ) ) {
				if ( file_exists( ABSPATH . WPINC . '/PHPMailer/PHPMailer.php' ) ) {
					require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
					require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
					require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';
					$phpmailer = new \PHPMailer\PHPMailer\PHPMailer( true );
				} elseif ( file_exists( ABSPATH . WPINC . '/class-phpmailer.php' ) ) {
					require_once ABSPATH . WPINC . '/class-phpmailer.php';
					require_once ABSPATH . WPINC . '/class-smtp.php';
					$phpmailer = new PHPMailer( true );
				}

				$phpmailer::$validator = static function ( $email ) {
					return (bool) is_email( $email );
				};
			}

			return $phpmailer;
		} );

		$this->container->add( self::HYDRATOR_FACTORY, function () {
			return new Hydrator_Factory();
		} );

		$this->container->add( self::DATA_STORE_CONST, function () {
			return new Const_Data_Store();
		} );

		$this->container->add( self::DATA_STORE_OPTS, function () {
			return new Opts_Data_Store();
		} );

		$this->container->add( self::DATA_STORE_PLUGIN_OPTS, function () {
			return new Plugin_Opts_Data_Store();
		} );

		$this->container->add( self::EVENT_MODEL, function () use ( $container ) {
			return new Event_Model( $container->get( self::HYDRATOR_FACTORY ), $container->get( self::DATA_STORE_ROUTER ), $container->get( Utils_Service_Provider::RECIPIENT_PARSER ), $container->get( Utils_Service_Provider::FILTER_PARSER ) );
		} );

		$this->container->add( self::LOG_DETAILS_MODEL, function () use ( $container ) {
			return new Log_Details_Model( $container->get( self::DATA_STORE_PLUGIN_OPTS ) );
		} );

		$this->container->add( self::NOTIFICATIONS_MODEL, function () use ( $container ) {
			return new Notifications_Model();
		} );

		$this->container->add( Logging_Service_Provider::LOGGER, function () use ( $container ) {
			return new Logger( $container->get( self::LOG_DETAILS_MODEL ) );
		} );

		$this->container->add( Logging_Service_Provider::DEBUG_LOG_MODEL, function () use ( $container ) {
			return new Debug_Log_Model();
		} );

		$this->container->add( Logging_Service_Provider::DB_LOGGING_PROVIDER, function () use ( $container ) {
			return new DB_Logging_Provider( $container->get( Logging_Service_Provider::DEBUG_LOG_MODEL ) );
		} );

		$this->container->add( Logging_Service_Provider::DEBUG_LOGGER, function () use ( $container ) {
			$data      = $container->get( self::DATA_STORE_ROUTER );
			$log_level = $data->get_plugin_setting( Tools_Config::SETTING_DEBUG_LOG_LEVEL, DB_Logging_Provider::DEBUG );

			return new Debug_Logger( $container->get( Logging_Service_Provider::DB_LOGGING_PROVIDER ), $log_level );
		} );

		$this->container->add( self::DATA_STORE_ROUTER, function () use ( $container ) {
			return new Data_Store_Router( $container->get( self::DATA_STORE_CONST ), $container->get( self::DATA_STORE_OPTS ), $container->get( self::DATA_STORE_PLUGIN_OPTS ) );
		} );

		$this->container->add( self::CONNECTOR_FACTORY, function () use ( $container ) {
			return new Connector_Factory(
				$container->get( self::PHPMAILER ),
				$container->get( self::DATA_STORE_ROUTER ),
				$container->get( Logging_Service_Provider::LOGGER ),
				$container->get( self::EVENT_MODEL ),
				$container->get( Utils_Service_Provider::HEADER_PARSER ),
				$container->get( Utils_Service_Provider::RECIPIENT_PARSER ),
				$container->get( Logging_Service_Provider::DEBUG_LOGGER )
			);
		} );

		$this->container->add( self::SAVE_CONNECTOR_SETTINGS_ENDPOINT, function () use ( $container ) {
			return new Save_Connector_Settings_Endpoint( $container->get( self::DATA_STORE_OPTS ), $container->get( self::DATA_STORE_PLUGIN_OPTS ), $container->get( self::CONNECTOR_FACTORY ) );
		} );

		$this->container->add( self::CLEANUP_DATA_ENDPOINT, function () use ( $container ) {
			return new Cleanup_Data_Endpoint( $container->get( self::DATA_STORE_PLUGIN_OPTS ) );
		} );

		$this->container->add( self::SAVE_PLUGIN_SETTINGS_ENDPOINT, function () use ( $container ) {
			return new Save_Plugin_Settings_Endpoint( $container->get( self::DATA_STORE_PLUGIN_OPTS ), $container->get( Updates_Service_Provider::LICENSE_API_CONNECTOR ) );
		} );

		$this->container->add( self::GET_SINGLE_EMAIL_DATA_ENDPOINT, function () use ( $container ) {
			return new Get_Single_Email_Data_Endpoint( $container->get( self::LOG_DETAILS_MODEL ), $container->get( self::EVENT_MODEL ) );
		} );

		$this->container->add( self::CHECK_BACKGROUND_TASKS_ENDPOINT, function () {
			return new Check_Background_Tasks_Endpoint();
		} );

		$this->container->add( self::SEND_TEST_ENDPOINT, function () use ( $container ) {
			return new Send_Test_Endpoint( $container->get( self::CONNECTOR_FACTORY ), $container->get( self::DATA_STORE_ROUTER ), $container->get( self::EVENT_MODEL ), $container->get( self::LOG_DETAILS_MODEL ), $container->get( self::GET_SINGLE_EMAIL_DATA_ENDPOINT ) );
		} );

		$this->container->add( self::GET_CONNECTOR_EMAILS_ENDPOINT, function () use ( $container ) {
			return new Get_Connector_Emails( $container->get( self::NOTIFICATIONS_MODEL ) );
		} );

		$this->container->add( self::OAUTH_DATA_HANDLER, function () use ( $container ) {
			return new Oauth_Data_Handler( $container->get( self::DATA_STORE_ROUTER ), $container->get( self::DATA_STORE_OPTS ) );
		} );

		$this->container->add( self::GOOGLE_OAUTH_HANDLER, function () use ( $container ) {
			return new Google_Oauth_Handler( $container->get( self::OAUTH_DATA_HANDLER ) );
		} );

		$this->container->add( self::MICROSOFT_OAUTH_HANDLER, function () use ( $container ) {
			return new Microsoft_Oauth_Handler( $container->get( self::OAUTH_DATA_HANDLER ) );
		} );

		$this->container->add( self::ZOHO_OAUTH_HANDLER, function () use ( $container ) {
			return new Zoho_Oauth_Handler( $container->get( self::OAUTH_DATA_HANDLER ) );
		} );

		$this->container->add( self::REGISTERED_CONNECTORS, function () use ( $self ) {
			return $self->connectors;
		} );

		$this->register_connector_data();
	}

	public function init( \Gravity_Forms\Gravity_Tools\Service_Container $container ) {
		add_action( 'init', function () use ( $container ) {
			$page = filter_input( INPUT_GET, 'page' );

			if ( $page !== 'gravitysmtp-settings' ) {
				return;
			}

			$connectors = $container->get( self::REGISTERED_CONNECTORS );

			foreach ( $connectors as $service => $class ) {
				$configured_key = sprintf( 'gsmtp_connector_configured_%s', strtolower( $service ) );
				delete_transient( $configured_key );
			}
		}, 11 );

		// @todo - replace this with some AJAX action via JS
		add_action( 'admin_post_smtp_disconnect_google', function () use ( $container ) {
			$configured_key = sprintf( 'gsmtp_connector_configured_%s', 'google' );

			delete_transient( $configured_key );

			/**
			 * @var Opts_Data_Store $data
			 */
			$data = $container->get( self::DATA_STORE_OPTS );

			/**
			 * @var Data_Store_Router
			 */
			$data_router = $container->get( self::DATA_STORE_ROUTER );

			/**
			 * @var Plugin_Opts_Data_Store
			 */
			$plugin_data_store = $container->get( self::DATA_STORE_PLUGIN_OPTS );

			$data->delete_all( 'google' );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_PRIMARY_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['google'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_PRIMARY_CONNECTOR, $connector_values );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_BACKUP_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['google'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_BACKUP_CONNECTOR, $connector_values );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_ENABLED_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['google'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_ENABLED_CONNECTOR, $connector_values );

			/**
			 * @var Google_Oauth_Handler $oauth_handler
			 */
			$oauth_handler = $container->get( self::GOOGLE_OAUTH_HANDLER );
			$return_url    = urldecode( $oauth_handler->get_return_url( false ) );

			wp_safe_redirect( $return_url );
		} );

		add_action( 'admin_post_smtp_disconnect_microsoft', function () use ( $container ) {
			$configured_key = sprintf( 'gsmtp_connector_configured_%s', 'microsoft' );

			delete_transient( $configured_key );

			/**
			 * @var Opts_Data_Store $data
			 */
			$data = $container->get( self::DATA_STORE_OPTS );

			/**
			 * @var Data_Store_Router
			 */
			$data_router = $container->get( self::DATA_STORE_ROUTER );

			/**
			 * @var Plugin_Opts_Data_Store
			 */
			$plugin_data_store = $container->get( self::DATA_STORE_PLUGIN_OPTS );

			$data->delete_all( 'microsoft' );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_PRIMARY_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['microsoft'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_PRIMARY_CONNECTOR, $connector_values );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_BACKUP_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['microsoft'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_BACKUP_CONNECTOR, $connector_values );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_ENABLED_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['microsoft'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_ENABLED_CONNECTOR, $connector_values );

			/**
			 * @var Microsoft_Oauth_Handler $oauth_handler
			 */
			$oauth_handler = $container->get( self::MICROSOFT_OAUTH_HANDLER );
			$return_url    = urldecode( $oauth_handler->get_return_url( 'settings' ) );

			wp_safe_redirect( $return_url );
		} );

		add_action( 'admin_post_smtp_disconnect_zoho', function () use ( $container ) {
			$configured_key = sprintf( 'gsmtp_connector_configured_%s', 'zoho' );

			delete_transient( $configured_key );

			/**
			 * @var Opts_Data_Store $data
			 */
			$data = $container->get( self::DATA_STORE_OPTS );

			/**
			 * @var Data_Store_Router
			 */
			$data_router = $container->get( self::DATA_STORE_ROUTER );

			/**
			 * @var Plugin_Opts_Data_Store
			 */
			$plugin_data_store = $container->get( self::DATA_STORE_PLUGIN_OPTS );

			$data->delete_all( 'zoho' );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_PRIMARY_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['zoho'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_PRIMARY_CONNECTOR, $connector_values );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_BACKUP_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['zoho'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_BACKUP_CONNECTOR, $connector_values );

			$connector_values = $data_router->get_plugin_setting( Save_Connector_Settings_Endpoint::SETTING_ENABLED_CONNECTOR, array() );

			if ( ! is_array( $connector_values ) ) {
				$connector_values = array();
			}

			$connector_values['zoho'] = 'false';
			$plugin_data_store->save( Save_Connector_Settings_Endpoint::SETTING_ENABLED_CONNECTOR, $connector_values );

			/**
			 * @var Zoho_Oauth_Handler $oauth_handler
			 */
			$oauth_handler = $container->get( self::ZOHO_OAUTH_HANDLER );
			$return_url    = urldecode( $oauth_handler->get_return_url( false ) );

			wp_safe_redirect( $return_url );
		} );

		add_action( 'wp_ajax_' . Cleanup_Data_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::CLEANUP_DATA_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Send_Test_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::SEND_TEST_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Save_Connector_Settings_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::SAVE_CONNECTOR_SETTINGS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Save_Plugin_Settings_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::SAVE_PLUGIN_SETTINGS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Get_Single_Email_Data_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::GET_SINGLE_EMAIL_DATA_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Check_Background_Tasks_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::CHECK_BACKGROUND_TASKS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Get_Connector_Emails::ACTION_NAME, function () use ( $container ) {
			$container->get( self::GET_CONNECTOR_EMAILS_ENDPOINT )->handle();
		} );

		add_filter( 'gform_localized_script_data_gravitysmtp_admin_config', function ( $data ) {
			if (
				empty( $data['components']['settings']['data']['integrations'] ) &&
				empty( $data['components']['setup_wizard']['data']['integrations'] ) &&
				empty( $data['components']['tools']['data']['integrations'] )
			) {
				return $data;
			}

			$order = array(
				'amazon-ses',
				'brevo',
				'elastic_email',
				'emailit',
				'generic',
				'google-gmail',
				'mailchimp',
				'mailersend',
				'mailgun',
				'microsoft',
				'phpmail',
				'postmark',
				'sendgrid',
				'smtp2go',
				'sparkpost',
				'zoho-mail',
			);

			// todo: setup wizard data should only be injected if should display is true for the app: includes/apps/setup-wizard/config/class-setup-wizard-config.php:18
			foreach ( array( 'settings', 'setup_wizard', 'tools' ) as $app ) {
				if ( empty( $data['components'][ $app ]['data']['integrations'] ) ) {
					continue;
				}

				$integrations = $data['components'][ $app ]['data']['integrations'];

				usort( $integrations, function ( $a, $b ) use ( $order ) {
					$a_pos = array_search( $a['id'], $order );
					$b_pos = array_search( $b['id'], $order );

					if ( $a_pos === $b_pos ) {
						return 0;
					}

					return $a_pos < $b_pos ? - 1 : 1;
				} );

				$data['components'][ $app ]['data']['integrations'] = $integrations;
			}

			return $data;
		} );
	}

	private function register_connector_data() {
		$is_ajax = defined( 'DOING_AJAX' ) && DOING_AJAX;

		$page = filter_input( INPUT_GET, 'page' );

		if ( ! $is_ajax && ! is_string( $page ) ) {
			return;
		}

		if ( ! empty( $page ) ) {
			$page = htmlspecialchars( $page );
		}

		if ( is_null( $page ) ) {
			$page = '';
		}

		$plugin_data_store = $this->container->get( self::DATA_STORE_PLUGIN_OPTS );
		$should_display    = Booliesh::get( $plugin_data_store->get( Save_Plugin_Settings_Endpoint::PARAM_SETUP_WIZARD_SHOULD_DISPLAY, 'config', 'true' ) );

		$should_register = $should_display ? strpos( $page, 'gravitysmtp-' ) !== false : in_array( $page, array(
			'gravitysmtp-activity-log',
			'gravitysmtp-dashboard',
			'gravitysmtp-settings',
			'gravitysmtp-suppression',
			'gravitysmtp-tools',
		) );

		if ( $is_ajax ) {
			$action = filter_input( INPUT_POST, 'action' );

			if ( $action === 'migrate_settings' || $action === 'get_dashboard_data' ) {
				$should_register = true;
			}
		}

		if ( empty( $should_register ) ) {
			return;
		}

		$connectors        = apply_filters( 'gravitysmtp_connector_types', $this->connectors );
		$config_collection = $this->container->get( Config_Collection_Service_Provider::CONFIG_COLLECTION );
		$parser            = $this->container->get( Config_Collection_Service_Provider::DATA_PARSER );

		/**
		 * @var Connector_Factory $factory
		 */
		$factory  = $this->container->get( self::CONNECTOR_FACTORY );
		$name_map = array();
		$data_map = array();

		foreach ( $connectors as $connector_name => $connector ) {
			$instance       = $factory->create( $connector_name );
			$config         = new Connector_Config( $parser );
			$connector_data = $instance->get_data();
			$config->set_data( $connector_data );
			$config_collection->add_config( $config );

			$name_map[ $connector_data['name'] ] = $connector_data['title'];
			$data_map[ $connector_data['name'] ] = $connector_data;
		}

		$this->container->add( self::NAME_MAP, $name_map );
		$this->container->add( self::CONNECTOR_DATA_MAP, $data_map );
	}
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/admin/hooks/exclusive/index.ts
```ts
/**
 * Exclusive hooks list endpoint
 *
 * GET /_emdash/api/admin/hooks/exclusive
 *
 * Lists all exclusive hooks with their providers and current selections.
 * Requires admin role.
 */

import type { APIRoute } from "astro";

import { requirePerm } from "#api/authorize.js";
import { apiError, apiSuccess, handleError } from "#api/error.js";
import { OptionsRepository } from "#db/repositories/options.js";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const { emdash, user } = locals;

	if (!emdash?.db) {
		return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	}

	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;

	try {
		const pipeline = emdash.hooks;
		const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();
		const optionsRepo = new OptionsRepository(emdash.db);

		const hooks = [];
		for (const hookName of exclusiveHookNames) {
			const providers = pipeline.getExclusiveHookProviders(hookName);
			const selection = await optionsRepo.get<string>(`emdash:exclusive_hook:${hookName}`);

			hooks.push({
				hookName,
				providers: providers.map((provider: { pluginId: string }) => ({
					pluginId: provider.pluginId,
				})),
				selectedPluginId: selection,
			});
		}

		return apiSuccess({ items: hooks });
	} catch (error) {
		return handleError(error, "Failed to list exclusive hooks", "EXCLUSIVE_HOOKS_LIST_ERROR");
	}
};

```

File: /Users/masonjames/Projects/emdash-restrict-with-stripe/README.md
```md
# Restrict With Stripe for EmDash

Restrict content and sell access with Stripe. The first membership plugin for [EmDash CMS](https://emdashcms.com).

## Features

- **Content Restriction** — Restrict any post or page to require a Stripe product purchase
- **Stripe Connect** — One-click connection to your Stripe account via Stripe Connect OAuth
- **Checkout** — Redirect visitors to Stripe Checkout to purchase access
- **Customer Portal** — Let customers manage their subscriptions via Stripe's billing portal
- **Magic Link Login** — Returning customers log in via email link (no passwords)
- **Admin UI** — Settings page, restrictions manager, dashboard widget, and toolbar button in the content editor
- **Real-time Access Checks** — Verifies purchases against the Stripe API on every page load. No stale local data.

## Installation

```bash
npm install emdash-restrict-with-stripe
```

## Setup

### 1. Add the plugin to your EmDash site

```js
// astro.config.mjs
import { restrictWithStripe } from "emdash-restrict-with-stripe";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [restrictWithStripe()],
    }),
  ],
});
```

### 2. Add the frontend script to your theme

Add the content gating script to your base layout, just before `</body>`:

```astro
<!-- src/layouts/Base.astro -->
<EmDashBodyEnd page={pageCtx} />
<script is:inline src="/_emdash/api/plugins/restrict-with-stripe/assets/rwstripe.js" defer></script>
```

> **Note:** EmDash plugins cannot currently inject scripts into themes automatically. This manual step will be unnecessary once EmDash adds full `page:fragments` support for plugin-injected scripts.

### 3. Add the verify page for magic link login

Create a page at `src/pages/account/verify.astro` that handles magic link authentication:

```astro
---
const token = Astro.url.searchParams.get("token");
const redirect = Astro.url.searchParams.get("redirect") || "/";
let error = "";
let sessionToken = "";
let redirectUrl = redirect;

if (token) {
  try {
    const res = await fetch(
      `http://127.0.0.1:4321/_emdash/api/plugins/restrict-with-stripe/auth/verify?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirect)}`
    );
    const json = await res.json();
    const data = json.data || json;
    if (data.ok && data.sessionToken) {
      sessionToken = data.sessionToken;
      redirectUrl = data.redirect || redirect;
    } else {
      error = data.error || "Invalid or expired login link.";
    }
  } catch {
    error = "Verification failed.";
  }
} else {
  error = "No token provided.";
}
---

<html>
<body>
  {error ? (
    <p>{error}</p>
  ) : (
    <script is:inline define:vars={{ sessionToken, redirectUrl }}>
      document.cookie = `rwstripe_session=${sessionToken}; path=/; max-age=${30*24*60*60}; SameSite=Lax`;
      window.location.href = redirectUrl;
    </script>
  )}
</body>
</html>
```

Adjust the port (`4321`) to match your dev server.

### 4. Connect to Stripe

1. Go to your EmDash admin: `/_emdash/admin`
2. Navigate to **RWStripe Settings** in the sidebar
3. Click **Connect to Stripe** (or check "Connect in Test Mode" first for testing)
4. Authorize the connection on Stripe's site
5. You'll be redirected back to your EmDash admin with the connection confirmed

### 5. Create products in Stripe

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create products with prices (one-time or recurring)
3. Each product needs at least one **default price**

### 6. Restrict content

1. Edit any post or page in the EmDash admin
2. Click the **Restrict** button in the toolbar (lock icon, next to Preview)
3. Select which Stripe products are required to view the content
4. Click **Apply**

Visitors without access will see a paywall with options to purchase or log in.

## How It Works

### For new visitors (purchase flow)

1. Visitor hits a restricted page
2. Content is replaced with a paywall showing "Purchase" and "Log In" tabs
3. On the **Purchase** tab: enter email, select product, click checkout
4. Redirected to Stripe Checkout to complete payment
5. After payment, Stripe redirects back to the page with a session token
6. Session cookie is set automatically — content is now visible

### For returning visitors (login flow)

1. Visitor hits a restricted page, session cookie has expired
2. Click the **Log In** tab, enter email
3. A magic link is sent to their inbox
4. Click the link → session cookie set → content visible
5. Access is verified against Stripe's API (active subscription or paid invoice)

### Access verification

Every access check queries the Stripe API directly:

1. Look up customer by email (`GET /v1/customers?email=...`)
2. Check active/trialing subscriptions for the required products
3. Check paid invoices for one-time purchases
4. Grant or deny access based on the results

No local state is trusted. The Stripe API is the source of truth.

## Plugin Architecture

```
src/
  index.ts          # Plugin descriptor (loaded by astro.config.mjs)
  plugin.ts         # Plugin implementation (hooks, routes, storage)
  admin.tsx         # React admin UI (settings, restrictions, toolbar button, modal)
  stripe.ts         # Fetch-based Stripe API client (no SDK dependency)
  handlers/
    auth.ts         # Magic link send + verify
    checkout.ts     # Stripe Checkout session creation
    portal.ts       # Stripe Customer Portal session
    access.ts       # Content access verification
    products.ts     # List Stripe products
    restrictions.ts # CRUD for content restrictions
    settings.ts     # Plugin settings (Stripe keys, display prefs)
```

### Plugin Storage

The plugin uses EmDash's plugin storage system (SQLite-backed):

| Collection | Purpose |
|---|---|
| `restrictions` | Which content requires which Stripe products |
| `taxonomyRestrictions` | Category/tag-level restrictions |
| `customers` | Email → Stripe customer ID mapping |
| `authTokens` | Magic link tokens (15-minute expiry) |
| `sessions` | Login sessions (30-day expiry) |

### API Routes

| Route | Auth | Purpose |
|---|---|---|
| `POST /checkout` | Public | Create Stripe Checkout session |
| `GET /access` | Public | Check if current user can view content |
| `GET /portal` | Session | Get Stripe Customer Portal URL |
| `POST /auth/send-link` | Public | Send magic link email |
| `GET /auth/verify` | Public | Verify magic link token |
| `GET /auth/logout` | Public | Clear session |
| `GET /admin/products` | Public | List Stripe products |
| `GET/POST/DELETE /admin/restrictions` | Admin | Manage restrictions |
| `GET/POST /admin/settings` | Admin | Plugin settings |

## Email Configuration

Magic link emails are sent via SMTP. Configure in the plugin's KV store:

| Key | Default | Description |
|---|---|---|
| `smtp_host` | `127.0.0.1` | SMTP server host |
| `smtp_port` | `1025` | SMTP server port |
| `from_email` | `noreply@emdash.local` | Sender email address |
| `site_name` | `EmDash Site` | Site name in emails |

For local development, use [Mailpit](https://mailpit.axllent.org/) to capture emails.

For production, configure a real SMTP server or update the auth handler to use an email API (Resend, SES, etc.).

## Requirements

- EmDash CMS v0.1.0+
- Node.js runtime (not Cloudflare Workers — uses `node:net` for SMTP)
- A Stripe account with products and prices configured

## WordPress Comparison

This plugin is a direct port of [Restrict With Stripe](https://restrictwithstripe.com) for WordPress. Key differences:

| Feature | WordPress Version | EmDash Version |
|---|---|---|
| Content restriction | Post meta + term meta | Plugin storage (SQLite) |
| Content filtering | `the_content` filter | Client-side JS gating |
| User accounts | WordPress users | Magic link sessions |
| Checkout | WP REST API + Stripe Checkout | Plugin route + Stripe Checkout |
| Admin UI | WP Settings page + meta boxes | React admin pages + toolbar button |
| Stripe SDK | PHP SDK | Fetch-based client (no SDK) |

## License

GPL-2.0-or-later

## Credits

Built by [Stranger Studios](https://strangerstudios.com), the team behind [Paid Memberships Pro](https://www.paidmembershipspro.com).

```

File: /Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/package.json
```json
{
	"name": "@emdash-cms/plugin-marketplace-test",
	"private": true,
	"version": "0.1.2",
	"description": "Test plugin for end-to-end marketplace publishing and audit workflow testing",
	"type": "module",
	"main": "dist/index.mjs",
	"exports": {
		".": {
			"import": "./dist/index.mjs",
			"types": "./dist/index.d.mts"
		},
		"./sandbox": "./dist/sandbox-entry.mjs"
	},
	"files": [
		"dist"
	],
	"scripts": {
		"build": "tsdown src/index.ts src/sandbox-entry.ts --format esm --dts --clean",
		"dev": "tsdown src/index.ts src/sandbox-entry.ts --format esm --dts --watch",
		"typecheck": "tsgo --noEmit"
	},
	"keywords": [
		"emdash",
		"cms",
		"plugin",
		"test",
		"marketplace"
	],
	"author": "Matt Kane",
	"license": "MIT",
	"dependencies": {
		"emdash": "workspace:*"
	},
	"devDependencies": {
		"tsdown": "catalog:",
		"typescript": "catalog:"
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/emdash-cms/emdash.git",
		"directory": "packages/plugins/marketplace-test"
	}
}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/connectors/class-connector-factory.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Connectors;

class Connector_Factory {

	protected $php_mailer;
	protected $data_store;
	protected $logger;
	protected $emails;
	protected $header_parser;
	protected $recipient_parser;
	protected $debug_logger;

	public function __construct( $php_mailer, $data_store, $logger, $emails, $header_parser, $recipient_parser, $debug_logger ) {
		$this->php_mailer       = $php_mailer;
		$this->data_store       = $data_store;
		$this->logger           = $logger;
		$this->emails           = $emails;
		$this->header_parser    = $header_parser;
		$this->recipient_parser = $recipient_parser;
		$this->debug_logger     = $debug_logger;
	}

	public function create( $type ) {
		if ( $type === 'amazon-ses' ) {
			$type = 'Amazon_SES';
		}

		if ( $type === 'mailersend' ) {
			$type = 'MailerSend';
		}

		if ( $type === 'elastic_email' ) {
			$type = 'Elastic_Email';
		}

		if( $type === 'SMTP2GO' ) {
			$type = 'smtp2go';
		}

		$classname = sprintf( '%s\Types\Connector_%s', __NAMESPACE__, ucfirst( $type ) );

		if ( ! class_exists( $classname ) ) {
			throw new \InvalidArgumentException( 'Connector type for type ' . $type . ' with class ' . $classname . ' does not exist.' );
		}

		return new $classname( $this->php_mailer, $this->data_store, $this->logger, $this->emails, $this->header_parser, $this->recipient_parser, $this->debug_logger );
	}

}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/suppression/config/class-suppression-settings-config.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Suppression\Config;

use Gravity_Forms\Gravity_SMTP\Apps\App_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Save_Plugin_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Enums\Suppression_Reason_Enum;
use Gravity_Forms\Gravity_SMTP\Gravity_SMTP;
use Gravity_Forms\Gravity_SMTP\Handler\Endpoints\Resend_Email_Endpoint;
use Gravity_Forms\Gravity_SMTP\Suppression\Endpoints\Add_Suppressed_Emails_Endpoint;
use Gravity_Forms\Gravity_SMTP\Suppression\Endpoints\Reactivate_Suppressed_Emails_Endpoint;
use Gravity_Forms\Gravity_SMTP\Suppression\Suppression_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Users\Roles;
use Gravity_Forms\Gravity_Tools\Config;

class Suppression_Settings_Config extends Config {

	protected $script_to_localize = 'gravitysmtp_scripts_admin';
	protected $name               = 'gravitysmtp_admin_config';

	public function should_enqueue() {
		$page = filter_input( INPUT_GET, 'page' );

		if ( ! is_string( $page ) ) {
			return false;
		}

		$page = htmlspecialchars( $page );

		return $page === 'gravitysmtp-suppression';
	}

	public function data() {
		$opts     = Gravity_SMTP::container()->get( Connector_Service_Provider::DATA_STORE_ROUTER );
		$per_page = $opts->get_plugin_setting( Save_Plugin_Settings_Endpoint::PARAM_PER_PAGE, 20 );

		return array(
			'components' => array(
				'suppression' => array(
					'endpoints' => array(
						Add_Suppressed_Emails_Endpoint::ACTION_NAME        => array(
							'action' => array(
								'value'   => Add_Suppressed_Emails_Endpoint::ACTION_NAME,
								'default' => 'mock_endpoint',
							),
							'nonce'  => array(
								'value'   => wp_create_nonce( Add_Suppressed_Emails_Endpoint::ACTION_NAME ),
								'default' => 'nonce',
							),
						),
						Reactivate_Suppressed_Emails_Endpoint::ACTION_NAME => array(
							'action' => array(
								'value'   => Reactivate_Suppressed_Emails_Endpoint::ACTION_NAME,
								'default' => 'mock_endpoint',
							),
							'nonce'  => array(
								'value'   => wp_create_nonce( Reactivate_Suppressed_Emails_Endpoint::ACTION_NAME ),
								'default' => 'nonce',
							),
						),
						'suppressed_emails_page'                           => array(
							'action' => array(
								'value'   => 'suppressed_emails_page',
								'default' => 'mock_endpoint',
							),
							'nonce'  => array(
								'value'   => wp_create_nonce( 'suppressed_emails_page' ),
								'default' => 'nonce',
							),
						),
					),
					'i18n' => array(
						'suppression'    => array(
							'top_heading'                   => esc_html__( 'Suppressions', 'gravitysmtp' ),
							'top_content'                   => __( "Add specific email addresses to a blacklist to suppress send attempts to those recipients.", 'gravitysmtp' ),
							'data_grid'                     => array(
								'bulk_select'                               => esc_html__( 'Select all rows', 'gravitysmtp' ),
								'top_heading'                               => esc_html__( 'Suppressed Recipients', 'gravitysmtp' ),
								'clear_search_aria_label'                   => esc_html__( 'Clear search', 'gravitysmtp' ),
								'empty_title'                               => esc_html__( 'No suppressions', 'gravitysmtp' ),
								'empty_message'                             => esc_html__( 'You will see suppressions here when you set some up.', 'gravitysmtp' ),
								'grid_controls_search_button_label'         => esc_html__( 'Search', 'gravitysmtp' ),
								'grid_controls_search_placeholder'          => esc_html__( 'Search', 'gravitysmtp' ),
								'grid_controls_bulk_actions_select_label'   => esc_html__( 'Select bulk actions', 'gravitysmtp' ),
								'grid_controls_bulk_actions_button_label'   => esc_html__( 'Apply', 'gravitysmtp' ),
								/* translators: 1: number of selected entries. */
								'select_notice_selected_number_entries'     => esc_html__( 'All %1$s suppressions on this page are selected', 'gravitysmtp' ),
								/* translators: 1: number of selected entries. */
								'select_notice_selected_all_number_entries' => esc_html__( 'All %1$s suppressions are selected', 'gravitysmtp' ),
								/* translators: 1: number of entries to be selected. */
								'select_notice_select_all_number_entries'   => esc_html__( 'Select All %1$s Suppressions', 'gravitysmtp' ),
								'select_notice_clear_selection'             => esc_html__( 'Clear Selection', 'gravitysmtp' ),
								'pagination_next'                           => esc_html__( 'Next', 'gravitysmtp' ),
								'pagination_prev'                           => esc_html__( 'Previous', 'gravitysmtp' ),
								'pagination_next_aria_label'                => esc_html__( 'Next Page', 'gravitysmtp' ),
								'pagination_prev_aria_label'                => esc_html__( 'Previous Page', 'gravitysmtp' ),
								'search_no_results_title'                   => esc_html__( 'No results found', 'gravitysmtp' ),
								'search_no_results_message'                 => esc_html__( 'No results found for your search', 'gravitysmtp' ),
							),
							'dialog' => array(
								'add_note'                 => esc_html__( 'Add Note', 'gravitysmtp' ),
								'cancel'                   => esc_html__( 'Cancel', 'gravitysmtp' ),
								'confirm_add'              => esc_html__( 'Add Suppressed Recipients', 'gravitysmtp' ),
								'confirm_reactivate'       => esc_html__( 'Reactivate', 'gravitysmtp' ),
								'description_add'          => esc_html__( 'Recipients on the suppression list will not receive emails.', 'gravitysmtp' ),
								'email_addresses'          => esc_html__( 'Email Addresses', 'gravitysmtp' ),
								'heading_add'              => esc_html__( 'Add Recipients', 'gravitysmtp' ),
								'heading_reactivate'       => esc_html__( 'Reactivate', 'gravitysmtp' ),
								'manually_add'             => esc_html__( 'Manually Add', 'gravitysmtp' ),
								'mb_heading_email_address' => esc_html__( 'Email Address', 'gravitysmtp' ),
								'mb_heading_reason'        => esc_html__( 'Reason', 'gravitysmtp' ),
								'mb_heading_note'          => esc_html__( 'Note', 'gravitysmtp' ),
								'mb_heading_date'          => esc_html__( 'Date Suppressed', 'gravitysmtp' ),
							),
							'snackbar' => array(
								'emails_reactivated'             => esc_html__( 'Emails reactivated.', 'gravitysmtp' ),
								'emails_reactivated_error'       => esc_html__( 'Error reactivating emails.', 'gravitysmtp' ),
								'fetching_suppressions_error'    => esc_html__( 'Error getting suppressions for requested page.', 'gravitysmtp' ) ,
								'suppressions_added'             => esc_html__( 'Suppressions added.', 'gravitysmtp' ),
								'suppressions_added_error'       => esc_html__( 'Error adding suppressions.', 'gravitysmtp' ),
							),
						),
						'debug_messages' => array(
							/* translators: %s: body of the ajax request. */
							'adding_suppressed_emails'             => esc_html__( 'Adding suppressed emails: %s', 'gravitysmtp' ),
							/* translators: %s: error data. */
							'adding_suppressed_emails_error'       => esc_html__( 'Error adding suppressed emails: %s', 'gravitysmtp' ),
							/* translators: %s: body of the ajax request. */
							'fetching_suppressions_page'           => esc_html__( 'Fetching suppressions page: %1$s', 'gravitysmtp' ),
							/* translators: %s: error data. */
							'fetching_suppressions_page_error'     => esc_html__( 'Error fetching suppressions page: %1$s', 'gravitysmtp' ),
							/* translators: %s: body of the ajax request. */
							'reactivating_suppressed_emails'       => esc_html__( 'Reactivating suppressed emails: %s', 'gravitysmtp' ),
							/* translators: %s: error data. */
							'reactivating_suppressed_emails_error' => esc_html__( 'Error reactivating suppressed emails: %s', 'gravitysmtp' ),

						),
					),
					'data'      => array(
						'caps'              => array(
							Roles::VIEW_EMAIL_SUPPRESSION_SETTINGS => current_user_can( Roles::VIEW_EMAIL_SUPPRESSION_SETTINGS ),
							Roles::EDIT_EMAIL_SUPPRESSION_SETTINGS => current_user_can( Roles::EDIT_EMAIL_SUPPRESSION_SETTINGS ),
						),
						'suppressed_emails' => array(
							'ajax_grid_pagination_url' => trailingslashit( GF_GRAVITY_SMTP_PLUGIN_URL ) . 'includes/suppression/endpoints/get-paginated-items.php',
							'bulk_actions_options'     => $this->get_suppression_bulk_actions(),
							'columns'                  => $this->get_suppression_columns(),
							'column_style_props'       => $this->get_suppression_column_style_props(),
							'initial_row_count'        => $this->get_suppression_data_row_count(),
							'initial_load_timestamp'   => current_time( 'mysql', true ),
							'rows_per_page'            => $per_page,
							'data'                     => array(
								'value'   => $this->get_suppression_data_rows(),
								'default' => array(),
							),
						),
					)
				),
			),
		);
	}

	public function get_suppression_bulk_actions() {
		return array(
			array(
				'label' => esc_html__( 'Bulk Actions', 'gravitysmtp' ),
				'value' => '-1',
			),
			array(
				'label' => esc_html__( 'Reactivate', 'gravitysmtp' ),
				'value' => 'reactivate',
			),
		);
	}

	public function get_suppression_columns() {
		$columns = array(
			array(
				'component'       => 'Text',
				'hideWhenLoading' => true,
				'key'             => 'email',
				'props'           => array(
					'content' => esc_html__( 'Email', 'gravitysmtp' ),
					'size'    => 'text-sm',
					'weight'  => 'medium',
				),
				'sortable'        => true,
				'variableLoader'  => true,
			),
			array(
				'component'       => 'Text',
				'hideWhenLoading' => true,
				'key'             => 'reason',
				'props'           => array(
					'content' => esc_html__( 'Reason', 'gravitysmtp' ),
					'size'    => 'text-sm',
					'weight'  => 'medium',
				),
				'sortable'        => true,
			),
			array(
				'component'       => 'Text',
				'hideAt'          => 640,
				'hideWhenLoading' => false,
				'key'             => 'date',
				'props'           => array(
					'content' => esc_html__( 'Date Suppressed', 'gravitysmtp' ),
					'size'    => 'text-sm',
					'weight'  => 'medium',
				),
				'sortable'        => true,
			),
			array(
				'component' => 'Text',
				'hideAt'    => 640,
				'key'       => 'actions',
				'props'     => array(
					'content' => esc_html__( 'Actions', 'gravitysmtp' ),
					'size'    => 'text-sm',
					'weight'  => 'medium',
				),
			),
		);

		return apply_filters( 'gravitysmtp_email_suppression_columns', $columns );
	}

	public function get_suppression_column_style_props() {
		$props = array(
			'email'   => array( 'flexBasis' => '292px' ),
			'reason'  => array( 'flex' => '0 0 200px' ),
			'date'    => array( 'flexBasis' => '250px' ),
			'actions' => array( 'flex' => '0 0 130px' ),
		);

		return apply_filters( 'gravitysmtp_email_suppression_column_style_props', $props );
	}

	public function get_suppression_data_rows() {
		$opts     = Gravity_SMTP::container()->get( Connector_Service_Provider::DATA_STORE_ROUTER );
		$per_page = $opts->get_plugin_setting( Save_Plugin_Settings_Endpoint::PARAM_PER_PAGE, 20 );

		$current_page = filter_input( INPUT_GET, 'log_page', FILTER_SANITIZE_NUMBER_INT );
		$search_term  = filter_input( INPUT_GET, 'search_term' );
		if ( empty( $current_page ) ) {
			$current_page = 1;
		}

		$suppressed_emails = Gravity_SMTP::$container->get( Suppression_Service_Provider::SUPPRESSED_EMAILS_MODEL );
		$data              = $suppressed_emails->paginate( $current_page, $per_page, $search_term, null, null);

		return $suppressed_emails->format_as_data_rows( $data );
	}

	public function get_suppression_data_row_count() {
		$suppressed_emails = Gravity_SMTP::$container->get( Suppression_Service_Provider::SUPPRESSED_EMAILS_MODEL );
		return $suppressed_emails->count();
	}

}

```

File: /Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/README.md
```md
# Marketplace Test Plugin

End-to-end test plugin for the EmDash marketplace publish and audit pipeline.

## What it does

- Hooks into `content:beforeSave` to log save events
- Exposes a `/ping` route and an `/events` route
- Declares `read:content` and `write:content` capabilities
- Includes icon and screenshot assets for image audit testing

## Usage

Bundle and publish to a marketplace instance:

```bash
emdash plugin bundle --dir packages/plugins/marketplace-test
emdash plugin publish dist/marketplace-test-0.1.0.tar.gz --registry https://emdash-marketplace.cto.cloudflare.dev
```

## Testing

This plugin is designed to exercise every step of the marketplace pipeline:

1. **Bundle** — `emdash plugin bundle` builds `backend.js` from `sandbox-entry.ts`
2. **Upload** — tarball includes manifest, backend, icon, screenshot, README
3. **Code audit** — Workers AI analyzes `backend.js` (should pass — clean code)
4. **Image audit** — Workers AI analyzes `icon.png` and `screenshots/` (should pass)
5. **Status resolution** — enforcement mode determines final status

```

File: /Users/masonjames/Projects/emdash/packages/core/src/cli/commands/bundle.ts
```ts
/**
 * emdash plugin bundle
 *
 * Produces a publishable plugin tarball from a plugin source directory.
 *
 * Steps:
 * 1. Resolve plugin entrypoint (finds definePlugin() export)
 * 2. Bundle backend code with tsdown → backend.js (single ES module, tree-shaken)
 * 3. Bundle admin code if present → admin.js
 * 4. Extract manifest from definePlugin() → manifest.json
 * 5. Collect assets (README.md, icon.png, screenshots/)
 * 6. Validate bundle (manifest schema, size limits, no Node.js builtins)
 * 7. Create tarball ({id}-{version}.tar.gz)
 */

import { createHash } from "node:crypto";
import { readFile, stat, mkdir, writeFile, rm, copyFile, symlink, readdir } from "node:fs/promises";
import { resolve, join, extname, basename } from "node:path";

import { defineCommand } from "citty";
import consola from "consola";

import type { ResolvedPlugin } from "../../plugins/types.js";
import {
	fileExists,
	readImageDimensions,
	extractManifest,
	findNodeBuiltinImports,
	findBuildOutput,
	resolveSourceEntry,
	calculateDirectorySize,
	createTarball,
	MAX_BUNDLE_SIZE,
	MAX_SCREENSHOTS,
	MAX_SCREENSHOT_WIDTH,
	MAX_SCREENSHOT_HEIGHT,
	ICON_SIZE,
} from "./bundle-utils.js";

const TS_EXT_RE = /\.tsx?$/;
const SLASH_RE = /\//g;
const LEADING_AT_RE = /^@/;
const emdash_SCOPE_RE = /^@emdash-cms\//;

export const bundleCommand = defineCommand({
	meta: {
		name: "bundle",
		description: "Bundle a plugin for marketplace distribution",
	},
	args: {
		dir: {
			type: "string",
			description: "Plugin directory (default: current directory)",
			default: process.cwd(),
		},
		outDir: {
			type: "string",
			alias: "o",
			description: "Output directory for the tarball (default: ./dist)",
			default: "dist",
		},
		validateOnly: {
			type: "boolean",
			description: "Run validation only, skip tarball creation",
			default: false,
		},
	},
	async run({ args }) {
		const pluginDir = resolve(args.dir);
		const outDir = resolve(pluginDir, args.outDir);
		const validateOnly = args.validateOnly;

		consola.start(validateOnly ? "Validating plugin..." : "Bundling plugin...");

		// ── Step 1: Read package.json and resolve entrypoints ──

		const pkgPath = join(pluginDir, "package.json");
		if (!(await fileExists(pkgPath))) {
			consola.error("No package.json found in", pluginDir);
			process.exit(1);
		}

		const pkg = JSON.parse(await readFile(pkgPath, "utf-8")) as {
			name?: string;
			main?: string;
			exports?: Record<string, unknown>;
		};

		// Find the sandbox entrypoint — look for ./sandbox export first, then main
		let backendEntry: string | undefined;
		let adminEntry: string | undefined;

		if (pkg.exports) {
			// Check for explicit sandbox export
			const sandboxExport = pkg.exports["./sandbox"];
			if (typeof sandboxExport === "string") {
				backendEntry = await resolveSourceEntry(pluginDir, sandboxExport);
			} else if (sandboxExport && typeof sandboxExport === "object" && "import" in sandboxExport) {
				backendEntry = await resolveSourceEntry(
					pluginDir,
					(sandboxExport as { import: string }).import,
				);
			}

			// Check for admin export
			const adminExport = pkg.exports["./admin"];
			if (typeof adminExport === "string") {
				adminEntry = await resolveSourceEntry(pluginDir, adminExport);
			} else if (adminExport && typeof adminExport === "object" && "import" in adminExport) {
				adminEntry = await resolveSourceEntry(
					pluginDir,
					(adminExport as { import: string }).import,
				);
			}
		}

		// If no sandbox export, look for src/sandbox-entry.ts
		if (!backendEntry) {
			const defaultSandbox = join(pluginDir, "src/sandbox-entry.ts");
			if (await fileExists(defaultSandbox)) {
				backendEntry = defaultSandbox;
			}
		}

		// Find the main entry for manifest extraction
		let mainEntry: string | undefined;
		if (pkg.exports?.["."] !== undefined) {
			const mainExport = pkg.exports["."];
			if (typeof mainExport === "string") {
				mainEntry = await resolveSourceEntry(pluginDir, mainExport);
			} else if (mainExport && typeof mainExport === "object" && "import" in mainExport) {
				mainEntry = await resolveSourceEntry(pluginDir, (mainExport as { import: string }).import);
			}
		}
		if (!mainEntry && pkg.main) {
			mainEntry = await resolveSourceEntry(pluginDir, pkg.main);
		}
		if (!mainEntry) {
			const defaultMain = join(pluginDir, "src/index.ts");
			if (await fileExists(defaultMain)) {
				mainEntry = defaultMain;
			}
		}

		if (!mainEntry) {
			consola.error(
				"Cannot find plugin entrypoint. Expected src/index.ts or main/exports in package.json",
			);
			process.exit(1);
		}

		consola.info(`Main entry: ${mainEntry}`);
		if (backendEntry) consola.info(`Backend entry: ${backendEntry}`);
		if (adminEntry) consola.info(`Admin entry: ${adminEntry}`);

		// ── Step 2: Extract manifest by importing the plugin ──

		consola.start("Extracting plugin manifest...");

		// Build the main entry first so we can import it
		const { build } = await import("tsdown");
		const tmpDir = join(pluginDir, ".emdash-bundle-tmp");

		try {
			await mkdir(tmpDir, { recursive: true });

			// Build main entry to extract manifest.
			// Externalize emdash and sibling packages — they'll resolve
			// via the symlinked node_modules below.
			const mainOutDir = join(tmpDir, "main");
			await build({
				config: false,
				entry: [mainEntry],
				format: "esm",
				outDir: mainOutDir,
				dts: false,
				platform: "node",
				external: ["emdash", emdash_SCOPE_RE],
			});

			// Symlink plugin's node_modules so the built module can resolve
			// external dependencies (emdash, @emdash-cms/*, etc.)
			const pluginNodeModules = join(pluginDir, "node_modules");
			const tmpNodeModules = join(mainOutDir, "node_modules");
			if (await fileExists(pluginNodeModules)) {
				await symlink(pluginNodeModules, tmpNodeModules, "junction");
			}

			// Import the built module to get the resolved plugin
			const mainBaseName = basename(mainEntry).replace(TS_EXT_RE, "");
			const mainOutputPath = await findBuildOutput(mainOutDir, mainBaseName);

			if (!mainOutputPath) {
				consola.error("Failed to build main entry — no output found in", mainOutDir);
				process.exit(1);
			}

			// Dynamic import of the built plugin
			const pluginModule = (await import(mainOutputPath)) as Record<string, unknown>;

			// Extract manifest from the imported module.
			// Supports three patterns:
			//   1. Native: createPlugin() export -> ResolvedPlugin
			//   2. Native: default export that is/returns a ResolvedPlugin (has id+version)
			//   3. Standard: descriptor factory function (returns { id, version, ... })
			let resolvedPlugin: ResolvedPlugin | undefined;

			if (typeof pluginModule.createPlugin === "function") {
				resolvedPlugin = pluginModule.createPlugin() as ResolvedPlugin;
			} else if (typeof pluginModule.default === "function") {
				resolvedPlugin = pluginModule.default() as ResolvedPlugin;
			} else if (typeof pluginModule.default === "object" && pluginModule.default !== null) {
				const defaultExport = pluginModule.default as Record<string, unknown>;
				if ("id" in defaultExport && "version" in defaultExport) {
					resolvedPlugin = defaultExport as unknown as ResolvedPlugin;
				}
			}

			// Standard format: no createPlugin, no default with id/version.
			// Look for a descriptor factory -- any named export function that
			// returns an object with { id, version }.
			if (!resolvedPlugin) {
				for (const [key, value] of Object.entries(pluginModule)) {
					if (key === "default" || typeof value !== "function") continue;
					try {
						const result = (value as () => unknown)() as Record<string, unknown> | null;
						if (result && typeof result === "object" && "id" in result && "version" in result) {
							resolvedPlugin = {
								id: result.id,
								version: result.version,
								capabilities: result.capabilities ?? [],
								allowedHosts: result.allowedHosts ?? [],
								storage: result.storage ?? {},
								hooks: {},
								routes: {},
								admin: {
									pages: result.adminPages,
									widgets: result.adminWidgets,
								},
							} as ResolvedPlugin;

							// If there's a sandbox entry, build and import it
							// to get hook/route names for the manifest.
							if (backendEntry) {
								const backendProbeDir = join(tmpDir, "backend-probe");
								const probeShimDir = join(tmpDir, "probe-shims");
								await mkdir(probeShimDir, { recursive: true });
								await writeFile(
									join(probeShimDir, "emdash.mjs"),
									"export const definePlugin = (d) => d;\n",
								);
								await build({
									config: false,
									entry: [backendEntry],
									format: "esm",
									outDir: backendProbeDir,
									dts: false,
									platform: "neutral",
									external: [],
									alias: { emdash: join(probeShimDir, "emdash.mjs") },
									treeshake: true,
								});
								const backendBaseName = basename(backendEntry).replace(TS_EXT_RE, "");
								const backendProbePath = await findBuildOutput(backendProbeDir, backendBaseName);
								if (backendProbePath) {
									const backendModule = (await import(backendProbePath)) as Record<string, unknown>;
									const standardDef = (backendModule.default ?? {}) as Record<string, unknown>;
									const hooks = standardDef.hooks as Record<string, unknown> | undefined;
									const routes = standardDef.routes as Record<string, unknown> | undefined;
									if (hooks) {
										for (const hookName of Object.keys(hooks)) {
											const hookEntry = hooks[hookName];
											const isConfig =
												typeof hookEntry === "object" &&
												hookEntry !== null &&
												"handler" in hookEntry;
											const config = isConfig ? (hookEntry as Record<string, unknown>) : {};
											(resolvedPlugin.hooks as Record<string, unknown>)[hookName] = {
												handler: isConfig
													? (hookEntry as Record<string, unknown>).handler
													: hookEntry,
												priority: (config.priority as number) ?? 100,
												timeout: (config.timeout as number) ?? 5000,
												dependencies: (config.dependencies as string[]) ?? [],
												errorPolicy: (config.errorPolicy as string) ?? "abort",
												exclusive: (config.exclusive as boolean) ?? false,
												pluginId: result.id,
											};
										}
									}
									if (routes) {
										for (const [name, route] of Object.entries(routes)) {
											const routeObj = route as Record<string, unknown>;
											(resolvedPlugin.routes as Record<string, unknown>)[name] = {
												handler: routeObj.handler,
												public: routeObj.public,
											};
										}
									}
								}
							}
							break;
						}
					} catch {
						// Not a descriptor factory, skip
					}
				}
			}

			if (!resolvedPlugin?.id || !resolvedPlugin?.version) {
				consola.error(
					"Could not extract plugin definition. Expected one of:\n" +
						"  - createPlugin() export (native format)\n" +
						"  - Descriptor factory function returning { id, version, ... } (standard format)",
				);
				process.exit(1);
			}

			const manifest = extractManifest(resolvedPlugin);

			// Validate format consistency: bundled plugins are for the marketplace
			// (sandboxed), so they must be standard format without trusted-only features.
			if (resolvedPlugin.admin?.entry) {
				consola.error(
					`Plugin declares adminEntry — React admin components require native/trusted mode. ` +
						`Use Block Kit for sandboxed admin pages, or remove adminEntry.`,
				);
				process.exit(1);
			}
			if (
				resolvedPlugin.admin?.portableTextBlocks &&
				resolvedPlugin.admin.portableTextBlocks.length > 0
			) {
				consola.error(
					`Plugin declares portableTextBlocks — these require native/trusted mode ` +
						`and cannot be bundled for the marketplace.`,
				);
				process.exit(1);
			}

			consola.success(`Plugin: ${manifest.id}@${manifest.version}`);
			consola.info(
				`  Capabilities: ${manifest.capabilities.length > 0 ? manifest.capabilities.join(", ") : "(none)"}`,
			);
			consola.info(
				`  Hooks: ${manifest.hooks.length > 0 ? manifest.hooks.map((h) => (typeof h === "string" ? h : h.name)).join(", ") : "(none)"}`,
			);
			consola.info(
				`  Routes: ${manifest.routes.length > 0 ? manifest.routes.map((r) => (typeof r === "string" ? r : r.name)).join(", ") : "(none)"}`,
			);

			// ── Step 3: Bundle backend.js ──

			const bundleDir = join(tmpDir, "bundle");
			await mkdir(bundleDir, { recursive: true });

			if (backendEntry) {
				consola.start("Bundling backend...");

				// Create a shim for emdash so the sandbox entry doesn't pull in the
				// entire core package. definePlugin is an identity function for standard
				// format, and PluginContext is a type-only import that disappears.
				const shimDir = join(tmpDir, "shims");
				await mkdir(shimDir, { recursive: true });
				await writeFile(join(shimDir, "emdash.mjs"), "export const definePlugin = (d) => d;\n");

				await build({
					config: false,
					entry: [backendEntry],
					format: "esm",
					outDir: join(tmpDir, "backend"),
					dts: false,
					platform: "neutral",
					// Bundle everything for a self-contained sandbox file,
					// but alias emdash to our shim so we don't pull in the core.
					external: [],
					alias: { emdash: join(shimDir, "emdash.mjs") },
					minify: true,
					treeshake: true,
				});

				const backendBaseName = basename(backendEntry).replace(TS_EXT_RE, "");
				const backendOutputPath = await findBuildOutput(join(tmpDir, "backend"), backendBaseName);

				if (backendOutputPath) {
					await copyFile(backendOutputPath, join(bundleDir, "backend.js"));
					consola.success("Built backend.js");
				} else {
					consola.error("Backend build produced no output");
					process.exit(1);
				}
			} else {
				consola.warn("No sandbox entry found — bundle will have no backend.js");
				consola.warn('  Add a "sandbox-entry.ts" in src/ or a "./sandbox" export in package.json');
			}

			// ── Step 4: Bundle admin.js ──

			if (adminEntry) {
				consola.start("Bundling admin...");
				await build({
					config: false,
					entry: [adminEntry],
					format: "esm",
					outDir: join(tmpDir, "admin"),
					dts: false,
					platform: "neutral",
					external: [],
					minify: true,
					treeshake: true,
				});

				const adminBaseName = basename(adminEntry).replace(TS_EXT_RE, "");
				const adminOutputPath = await findBuildOutput(join(tmpDir, "admin"), adminBaseName);

				if (adminOutputPath) {
					await copyFile(adminOutputPath, join(bundleDir, "admin.js"));
					consola.success("Built admin.js");
				}
			}

			// ── Step 5: Write manifest.json ──

			await writeFile(join(bundleDir, "manifest.json"), JSON.stringify(manifest, null, 2));

			// ── Step 6: Collect assets ──

			consola.start("Collecting assets...");

			// README.md
			const readmePath = join(pluginDir, "README.md");
			if (await fileExists(readmePath)) {
				await copyFile(readmePath, join(bundleDir, "README.md"));
				consola.success("Included README.md");
			}

			// icon.png
			const iconPath = join(pluginDir, "icon.png");
			if (await fileExists(iconPath)) {
				const iconBuf = await readFile(iconPath);
				const dims = readImageDimensions(iconBuf);
				if (!dims) {
					consola.warn("icon.png is not a valid PNG — skipping");
				} else if (dims[0] !== ICON_SIZE || dims[1] !== ICON_SIZE) {
					consola.warn(
						`icon.png is ${dims[0]}x${dims[1]}, expected ${ICON_SIZE}x${ICON_SIZE} — including anyway`,
					);
					await copyFile(iconPath, join(bundleDir, "icon.png"));
				} else {
					await copyFile(iconPath, join(bundleDir, "icon.png"));
					consola.success("Included icon.png");
				}
			}

			// screenshots/
			const screenshotsDir = join(pluginDir, "screenshots");
			if (await fileExists(screenshotsDir)) {
				const screenshotFiles = (await readdir(screenshotsDir))
					.filter((f) => {
						const ext = extname(f).toLowerCase();
						return ext === ".png" || ext === ".jpg" || ext === ".jpeg";
					})
					.toSorted()
					.slice(0, MAX_SCREENSHOTS);

				if (screenshotFiles.length > 0) {
					await mkdir(join(bundleDir, "screenshots"), { recursive: true });

					for (const file of screenshotFiles) {
						const filePath = join(screenshotsDir, file);
						const buf = await readFile(filePath);

						const dims = readImageDimensions(buf);

						if (!dims) {
							consola.warn(`screenshots/${file} — cannot read dimensions, skipping`);
							continue;
						}

						if (dims[0] > MAX_SCREENSHOT_WIDTH || dims[1] > MAX_SCREENSHOT_HEIGHT) {
							consola.warn(
								`screenshots/${file} is ${dims[0]}x${dims[1]}, max ${MAX_SCREENSHOT_WIDTH}x${MAX_SCREENSHOT_HEIGHT} — including anyway`,
							);
						}

						await copyFile(filePath, join(bundleDir, "screenshots", file));
					}

					consola.success(`Included ${screenshotFiles.length} screenshot(s)`);
				}
			}

			// ── Step 7: Validation ──

			consola.start("Validating bundle...");
			let hasErrors = false;

			// Check for Node.js builtins in backend.js
			const backendPath = join(bundleDir, "backend.js");
			if (await fileExists(backendPath)) {
				const backendCode = await readFile(backendPath, "utf-8");
				const builtins = findNodeBuiltinImports(backendCode);
				if (builtins.length > 0) {
					consola.error(`backend.js imports Node.js built-in modules: ${builtins.join(", ")}`);
					consola.error("Sandboxed plugins cannot use Node.js APIs");
					hasErrors = true;
				}
			}

			// Check capabilities warnings
			if (manifest.capabilities.includes("network:fetch:any")) {
				consola.warn(
					"Plugin declares unrestricted network access (network:fetch:any) — it can make requests to any host",
				);
			} else if (
				manifest.capabilities.includes("network:fetch") &&
				manifest.allowedHosts.length === 0
			) {
				consola.warn(
					"Plugin declares network:fetch capability but no allowedHosts — all fetch requests will be blocked",
				);
			}

			// Check for features that won't work in sandboxed mode
			if (
				resolvedPlugin.admin?.portableTextBlocks &&
				resolvedPlugin.admin.portableTextBlocks.length > 0
			) {
				consola.warn(
					"Plugin declares portableTextBlocks — these require trusted mode and will be ignored in sandboxed plugins",
				);
			}
			if (resolvedPlugin.admin?.entry) {
				consola.warn(
					"Plugin declares admin.entry — custom React components require trusted mode. Use Block Kit for sandboxed admin pages",
				);
			}
			// Check for page:fragments hook — trusted-only, not allowed in sandbox
			if (resolvedPlugin.hooks["page:fragments"]) {
				consola.warn(
					"Plugin declares page:fragments hook — this is trusted-only and will not work in sandboxed mode",
				);
			}

			// Check: if plugin declares admin pages or widgets, it must have an "admin" route
			const hasAdminPages = (manifest.admin?.pages?.length ?? 0) > 0;
			const hasAdminWidgets = (manifest.admin?.widgets?.length ?? 0) > 0;
			if (hasAdminPages || hasAdminWidgets) {
				const routeNames = manifest.routes.map((r: string | { name: string }) =>
					typeof r === "string" ? r : r.name,
				);
				if (!routeNames.includes("admin")) {
					consola.error(
						`Plugin declares ${hasAdminPages ? "adminPages" : ""}${hasAdminPages && hasAdminWidgets ? " and " : ""}${hasAdminWidgets ? "adminWidgets" : ""} ` +
							`but the sandbox entry has no "admin" route. ` +
							`Add an admin route handler to serve Block Kit pages.`,
					);
					hasErrors = true;
				}
			}

			// Calculate total bundle size
			const totalSize = await calculateDirectorySize(bundleDir);
			if (totalSize > MAX_BUNDLE_SIZE) {
				const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
				consola.error(`Bundle size ${sizeMB}MB exceeds maximum of 5MB`);
				hasErrors = true;
			} else {
				const sizeKB = (totalSize / 1024).toFixed(1);
				consola.info(`Bundle size: ${sizeKB}KB`);
			}

			if (hasErrors) {
				consola.error("Bundle validation failed");
				process.exit(1);
			}

			consola.success("Validation passed");

			if (validateOnly) {
				return;
			}

			// ── Step 8: Create tarball ──

			await mkdir(outDir, { recursive: true });
			const tarballName = `${manifest.id.replace(SLASH_RE, "-").replace(LEADING_AT_RE, "")}-${manifest.version}.tar.gz`;
			const tarballPath = join(outDir, tarballName);

			consola.start("Creating tarball...");
			await createTarball(bundleDir, tarballPath);

			const tarballStat = await stat(tarballPath);
			const tarballSizeKB = (tarballStat.size / 1024).toFixed(1);

			// Calculate checksum
			const tarballBuf = await readFile(tarballPath);
			const checksum = createHash("sha256").update(tarballBuf).digest("hex");

			consola.success(`Created ${tarballName} (${tarballSizeKB}KB)`);
			consola.info(`  SHA-256: ${checksum}`);
			consola.info(`  Path: ${tarballPath}`);
		} finally {
			if (tmpDir.endsWith(".emdash-bundle-tmp")) {
				await rm(tmpDir, { recursive: true, force: true });
			}
		}
	},
});

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/manager.ts
```ts
/**
 * Plugin Manager v2
 *
 * Central orchestrator for the plugin system:
 * - Loads and resolves plugins
 * - Manages plugin lifecycle (install, activate, deactivate, uninstall)
 * - Dispatches hooks across all plugins
 * - Routes API requests to plugins
 *
 */

import type { Kysely } from "kysely";
import { sql } from "kysely";

import { OptionsRepository } from "../database/repositories/options.js";
import type { Database } from "../database/types.js";
import type { Storage } from "../storage/types.js";
import type { PluginContextFactoryOptions } from "./context.js";
import { setCronTasksEnabled } from "./cron.js";
import { definePlugin } from "./define-plugin.js";
import {
	HookPipeline,
	type HookResult,
	resolveExclusiveHooks as resolveExclusiveHooksShared,
} from "./hooks.js";
import { PluginRouteRegistry, type RouteResult, type InvokeRouteOptions } from "./routes.js";
import type {
	PluginDefinition,
	ResolvedPlugin,
	PluginStorageConfig,
	MediaItem,
	CronEvent,
} from "./types.js";

/** Options table key prefix for exclusive hook DB reads via PluginManager */
const EXCLUSIVE_HOOK_KEY_PREFIX = "emdash:exclusive_hook:";

/**
 * Plugin state in the manager
 */
export type PluginState = "registered" | "installed" | "active" | "inactive";

/**
 * Plugin entry in the manager
 */
interface PluginEntry {
	plugin: ResolvedPlugin;
	state: PluginState;
}

/**
 * Plugin manager options
 */
export interface PluginManagerOptions {
	/** Database instance */
	db: Kysely<Database>;
	/** Storage backend for direct media uploads */
	storage?: Storage;
	/** Function to generate upload URLs for media */
	getUploadUrl?: (
		filename: string,
		contentType: string,
	) => Promise<{ uploadUrl: string; mediaId: string }>;
}

/**
 * Plugin Manager v2
 *
 * Manages the full lifecycle of plugins and coordinates hooks/routes.
 */
export class PluginManager {
	private plugins: Map<string, PluginEntry> = new Map();
	private hookPipeline: HookPipeline | null = null;
	private routeRegistry: PluginRouteRegistry | null = null;
	private factoryOptions: PluginContextFactoryOptions;
	private initialized = false;

	constructor(private options: PluginManagerOptions) {
		this.factoryOptions = {
			db: options.db,
			storage: options.storage,
			getUploadUrl: options.getUploadUrl,
		};
	}

	// =========================================================================
	// Plugin Registration
	// =========================================================================

	/**
	 * Register a plugin definition
	 * This resolves the definition and adds it to the manager, but doesn't install it
	 */
	register<TStorage extends PluginStorageConfig>(
		definition: PluginDefinition<TStorage>,
	): ResolvedPlugin<TStorage> {
		const resolved = definePlugin(definition);

		if (this.plugins.has(resolved.id)) {
			throw new Error(`Plugin "${resolved.id}" is already registered`);
		}

		this.plugins.set(resolved.id, {
			plugin: resolved,
			state: "registered",
		});

		// Mark as needing reinitialization
		this.initialized = false;

		return resolved;
	}

	/**
	 * Register multiple plugins
	 */
	registerAll(definitions: PluginDefinition[]): void {
		for (const def of definitions) {
			this.register(def);
		}
	}

	/**
	 * Unregister a plugin
	 * Plugin must be inactive or just registered
	 */
	unregister(pluginId: string): boolean {
		const entry = this.plugins.get(pluginId);
		if (!entry) return false;

		if (entry.state === "active") {
			throw new Error(`Cannot unregister active plugin "${pluginId}". Deactivate it first.`);
		}

		this.plugins.delete(pluginId);
		this.initialized = false;
		return true;
	}

	// =========================================================================
	// Plugin Lifecycle
	// =========================================================================

	/**
	 * Install a plugin (run install hooks, set up storage)
	 */
	async install(pluginId: string): Promise<HookResult<void>[]> {
		const entry = this.plugins.get(pluginId);
		if (!entry) {
			throw new Error(`Plugin "${pluginId}" not found`);
		}

		if (entry.state !== "registered") {
			throw new Error(`Plugin "${pluginId}" is already installed (state: ${entry.state})`);
		}

		this.ensureInitialized();

		// Run install hooks
		const results = await this.hookPipeline!.runPluginInstall(pluginId);

		// Check for errors
		const failed = results.find((r) => !r.success);
		if (failed) {
			throw new Error(`Plugin install failed: ${failed.error?.message ?? "Unknown error"}`);
		}

		entry.state = "installed";
		return results;
	}

	/**
	 * Activate a plugin (run activate hooks, enable hooks/routes)
	 */
	async activate(pluginId: string): Promise<HookResult<void>[]> {
		const entry = this.plugins.get(pluginId);
		if (!entry) {
			throw new Error(`Plugin "${pluginId}" not found`);
		}

		if (entry.state === "active") {
			return []; // Already active
		}

		if (entry.state === "registered") {
			// Auto-install if not installed
			await this.install(pluginId);
		}

		this.ensureInitialized();

		// Run activate hooks
		const results = await this.hookPipeline!.runPluginActivate(pluginId);

		// Check for errors
		const failed = results.find((r) => !r.success);
		if (failed) {
			throw new Error(`Plugin activation failed: ${failed.error?.message ?? "Unknown error"}`);
		}

		entry.state = "active";

		// Re-enable cron tasks for the activated plugin
		await setCronTasksEnabled(this.options.db, pluginId, true);

		// Reinitialize pipeline so the newly active plugin's hooks are registered
		this.reinitialize();

		// Resolve exclusive hooks (new provider may need auto-selection)
		await this.resolveExclusiveHooks();

		return results;
	}

	/**
	 * Deactivate a plugin (run deactivate hooks, disable hooks/routes)
	 */
	async deactivate(pluginId: string): Promise<HookResult<void>[]> {
		const entry = this.plugins.get(pluginId);
		if (!entry) {
			throw new Error(`Plugin "${pluginId}" not found`);
		}

		if (entry.state !== "active") {
			return []; // Not active
		}

		this.ensureInitialized();

		// Run deactivate hooks
		const results = await this.hookPipeline!.runPluginDeactivate(pluginId);

		// Disable cron tasks for the deactivated plugin
		await setCronTasksEnabled(this.options.db, pluginId, false);

		entry.state = "inactive";

		// Reinitialize pipeline so the deactivated plugin's hooks are removed
		this.reinitialize();

		// Resolve exclusive hooks (deactivated provider may need clearing)
		await this.resolveExclusiveHooks();

		return results;
	}

	/**
	 * Uninstall a plugin (run uninstall hooks, optionally delete data)
	 */
	async uninstall(pluginId: string, deleteData: boolean = false): Promise<HookResult<void>[]> {
		const entry = this.plugins.get(pluginId);
		if (!entry) {
			throw new Error(`Plugin "${pluginId}" not found`);
		}

		// Deactivate first if active (this also resolves exclusive hooks)
		if (entry.state === "active") {
			await this.deactivate(pluginId);
		}

		this.ensureInitialized();

		// Run uninstall hooks
		const results = await this.hookPipeline!.runPluginUninstall(pluginId, deleteData);

		// Delete all cron tasks for the uninstalled plugin
		await this.deleteCronTasks(pluginId);

		// Remove from manager
		this.plugins.delete(pluginId);
		this.initialized = false;

		// Resolve exclusive hooks after removal
		await this.resolveExclusiveHooks();

		return results;
	}

	// =========================================================================
	// Hook Dispatch
	// =========================================================================

	/**
	 * Run content:beforeSave hooks across all active plugins
	 */
	async runContentBeforeSave(
		content: Record<string, unknown>,
		collection: string,
		isNew: boolean,
	): Promise<{
		content: Record<string, unknown>;
		results: HookResult<Record<string, unknown>>[];
	}> {
		this.ensureInitialized();
		return this.hookPipeline!.runContentBeforeSave(content, collection, isNew);
	}

	/**
	 * Run content:afterSave hooks across all active plugins
	 */
	async runContentAfterSave(
		content: Record<string, unknown>,
		collection: string,
		isNew: boolean,
	): Promise<HookResult<void>[]> {
		this.ensureInitialized();
		return this.hookPipeline!.runContentAfterSave(content, collection, isNew);
	}

	/**
	 * Run content:beforeDelete hooks across all active plugins
	 */
	async runContentBeforeDelete(
		id: string,
		collection: string,
	): Promise<{ allowed: boolean; results: HookResult<boolean>[] }> {
		this.ensureInitialized();
		return this.hookPipeline!.runContentBeforeDelete(id, collection);
	}

	/**
	 * Run content:afterDelete hooks across all active plugins
	 */
	async runContentAfterDelete(id: string, collection: string): Promise<HookResult<void>[]> {
		this.ensureInitialized();
		return this.hookPipeline!.runContentAfterDelete(id, collection);
	}

	/**
	 * Run media:beforeUpload hooks across all active plugins
	 */
	async runMediaBeforeUpload(file: { name: string; type: string; size: number }): Promise<{
		file: { name: string; type: string; size: number };
		results: HookResult<{ name: string; type: string; size: number }>[];
	}> {
		this.ensureInitialized();
		return this.hookPipeline!.runMediaBeforeUpload(file);
	}

	/**
	 * Run media:afterUpload hooks across all active plugins
	 */
	async runMediaAfterUpload(media: MediaItem): Promise<HookResult<void>[]> {
		this.ensureInitialized();
		return this.hookPipeline!.runMediaAfterUpload(media);
	}

	/**
	 * Invoke the cron hook for a specific plugin (per-plugin dispatch).
	 * Used as the InvokeCronHookFn callback for CronExecutor.
	 */
	async invokeCronHook(pluginId: string, event: CronEvent): Promise<void> {
		this.ensureInitialized();
		const result = await this.hookPipeline!.invokeCronHook(pluginId, event);
		if (!result.success && result.error) {
			throw result.error;
		}
	}

	// =========================================================================
	// Route Dispatch
	// =========================================================================

	/**
	 * Invoke a plugin route
	 */
	async invokeRoute(
		pluginId: string,
		routeName: string,
		options: InvokeRouteOptions,
	): Promise<RouteResult> {
		this.ensureInitialized();
		return this.routeRegistry!.invoke(pluginId, routeName, options);
	}

	/**
	 * Get all routes for a plugin
	 */
	getPluginRoutes(pluginId: string): string[] {
		this.ensureInitialized();
		return this.routeRegistry!.getRoutes(pluginId);
	}

	// =========================================================================
	// Query Methods
	// =========================================================================

	/**
	 * Get a plugin by ID
	 */
	getPlugin(pluginId: string): ResolvedPlugin | undefined {
		return this.plugins.get(pluginId)?.plugin;
	}

	/**
	 * Get plugin state
	 */
	getPluginState(pluginId: string): PluginState | undefined {
		return this.plugins.get(pluginId)?.state;
	}

	/**
	 * Get all registered plugins
	 */
	getAllPlugins(): Array<{ plugin: ResolvedPlugin; state: PluginState }> {
		return Array.from(this.plugins.values(), (entry) => ({
			plugin: entry.plugin,
			state: entry.state,
		}));
	}

	/**
	 * Get all active plugins
	 */
	getActivePlugins(): ResolvedPlugin[] {
		return [...this.plugins.values()]
			.filter((entry) => entry.state === "active")
			.map((entry) => entry.plugin);
	}

	/**
	 * Check if a plugin exists
	 */
	hasPlugin(pluginId: string): boolean {
		return this.plugins.has(pluginId);
	}

	/**
	 * Check if a plugin is active
	 */
	isActive(pluginId: string): boolean {
		return this.plugins.get(pluginId)?.state === "active";
	}

	// =========================================================================
	// Exclusive Hooks
	// =========================================================================

	/**
	 * Get all plugins that registered a handler for an exclusive hook.
	 */
	getExclusiveHookProviders(hookName: string): Array<{ pluginId: string; pluginName: string }> {
		this.ensureInitialized();
		return this.hookPipeline!.getExclusiveHookProviders(hookName).map((p) => {
			const plugin = this.plugins.get(p.pluginId);
			return {
				pluginId: p.pluginId,
				pluginName: plugin?.plugin.id ?? p.pluginId,
			};
		});
	}

	/**
	 * Read the selected provider for an exclusive hook from the options table.
	 */
	async getExclusiveHookSelection(hookName: string): Promise<string | null> {
		const optionsRepo = new OptionsRepository(this.options.db);
		return optionsRepo.get<string>(`${EXCLUSIVE_HOOK_KEY_PREFIX}${hookName}`);
	}

	/**
	 * Set the selected provider for an exclusive hook in the options table.
	 * Pass null to clear the selection.
	 */
	async setExclusiveHookSelection(hookName: string, pluginId: string | null): Promise<void> {
		const optionsRepo = new OptionsRepository(this.options.db);
		const key = `${EXCLUSIVE_HOOK_KEY_PREFIX}${hookName}`;

		if (pluginId === null) {
			await optionsRepo.delete(key);
			this.hookPipeline?.clearExclusiveSelection(hookName);
			return;
		}

		// Validate plugin exists and is active
		const entry = this.plugins.get(pluginId);
		if (!entry) {
			throw new Error(`Plugin "${pluginId}" not found`);
		}
		if (entry.state !== "active") {
			throw new Error(`Plugin "${pluginId}" is not active`);
		}

		await optionsRepo.set(key, pluginId);
		this.hookPipeline?.setExclusiveSelection(hookName, pluginId);
	}

	/**
	 * Resolution algorithm for exclusive hooks.
	 *
	 * Delegates to the shared resolveExclusiveHooks() function.
	 * See hooks.ts for the full algorithm description.
	 */
	async resolveExclusiveHooks(preferredHints?: Map<string, string[]>): Promise<void> {
		this.ensureInitialized();

		const optionsRepo = new OptionsRepository(this.options.db);

		await resolveExclusiveHooksShared({
			pipeline: this.hookPipeline!,
			isActive: (pluginId) => this.isActive(pluginId),
			getOption: (key) => optionsRepo.get<string>(key),
			setOption: (key, value) => optionsRepo.set(key, value),
			deleteOption: async (key) => {
				await optionsRepo.delete(key);
			},
			preferredHints,
		});
	}

	/**
	 * Get all exclusive hooks with their providers and current selections.
	 * Used by the admin API.
	 */
	async getExclusiveHooksInfo(): Promise<
		Array<{
			hookName: string;
			providers: Array<{ pluginId: string }>;
			selectedPluginId: string | null;
		}>
	> {
		this.ensureInitialized();
		const exclusiveHookNames = this.hookPipeline!.getRegisteredExclusiveHooks();
		const result = [];

		for (const hookName of exclusiveHookNames) {
			const providers = this.hookPipeline!.getExclusiveHookProviders(hookName);
			const selection = await this.getExclusiveHookSelection(hookName);
			result.push({
				hookName,
				providers,
				selectedPluginId: selection,
			});
		}

		return result;
	}

	// =========================================================================
	// Internal Methods
	// =========================================================================

	/**
	 * Initialize or reinitialize the hook pipeline and route registry
	 */
	private ensureInitialized(): void {
		if (this.initialized) return;

		// Get all active plugins for hooks
		const activePlugins = this.getActivePlugins();

		// Create hook pipeline with active plugins
		this.hookPipeline = new HookPipeline(activePlugins, this.factoryOptions);

		// Create route registry
		this.routeRegistry = new PluginRouteRegistry(this.factoryOptions);

		// Register routes for active plugins
		for (const plugin of activePlugins) {
			this.routeRegistry.register(plugin);
		}

		this.initialized = true;
	}

	/**
	 * Force reinitialization (useful after plugin state changes)
	 */
	reinitialize(): void {
		this.initialized = false;
		this.ensureInitialized();
	}

	/**
	 * Delete all cron tasks for a plugin.
	 * Used during uninstall.
	 */
	private async deleteCronTasks(pluginId: string): Promise<void> {
		try {
			await sql`
				DELETE FROM _emdash_cron_tasks
				WHERE plugin_id = ${pluginId}
			`.execute(this.options.db);
		} catch {
			// Cron table may not exist yet (pre-migration). Non-fatal.
		}
	}
}

/**
 * Create a plugin manager
 */
export function createPluginManager(options: PluginManagerOptions): PluginManager {
	return new PluginManager(options);
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/email.ts
```ts
/**
 * Email Pipeline
 *
 * Orchestrates the three-stage email pipeline:
 * 1. email:beforeSend hooks (middleware — transform, validate, cancel)
 * 2. email:deliver hook (exclusive — exactly one provider delivers)
 * 3. email:afterSend hooks (logging, analytics, fire-and-forget)
 *
 * Security features:
 * - Recursion guard prevents re-entrant sends (e.g. plugin calling ctx.email.send from a hook)
 * - System emails (source="system") bypass email:beforeSend and email:afterSend hooks entirely
 *   to protect auth tokens from exfiltration by plugin hooks
 *
 */

import { AsyncLocalStorage } from "node:async_hooks";

import type { HookPipeline } from "./hooks.js";
import type { EmailDeliverEvent, EmailMessage } from "./types.js";

/** Hook name for the exclusive email delivery hook */
const EMAIL_DELIVER_HOOK = "email:deliver";

/** Source value used for auth emails (magic links, invites, password resets) */
const SYSTEM_SOURCE = "system";

/**
 * Error thrown when ctx.email.send() is called but no provider is configured.
 */
export class EmailNotConfiguredError extends Error {
	constructor() {
		super(
			"No email provider is configured. Install and activate an email provider plugin, " +
				"then select it in Settings > Email.",
		);
		this.name = "EmailNotConfiguredError";
	}
}

/**
 * Error thrown when a recursive email send is detected.
 */
export class EmailRecursionError extends Error {
	constructor() {
		super(
			"Recursive email send detected. A plugin hook attempted to send an email " +
				"from within the email pipeline, which would cause infinite recursion.",
		);
		this.name = "EmailRecursionError";
	}
}

/**
 * Recursion guard using AsyncLocalStorage.
 *
 * EmailPipeline is a singleton (worker-lifetime cached via EmDashRuntime).
 * Instance state like `sendDepth` would false-positive under concurrent
 * requests because two unrelated sends would increment the same counter.
 * ALS scopes the guard to the current async execution context, so concurrent
 * requests each get their own independent recursion tracking.
 */
const emailSendALS = new AsyncLocalStorage<{ depth: number }>();

/**
 * EmailPipeline orchestrates email delivery through the plugin hook system.
 *
 * The pipeline runs in three stages:
 * 1. email:beforeSend — middleware hooks that can transform or cancel messages
 * 2. email:deliver — exclusive hook dispatching to the selected provider
 * 3. email:afterSend — fire-and-forget hooks for logging/analytics
 */
export class EmailPipeline {
	private pipeline: HookPipeline;

	constructor(pipeline: HookPipeline) {
		this.pipeline = pipeline;
	}

	/**
	 * Replace the underlying hook pipeline.
	 *
	 * Called by the runtime when rebuilding the hook pipeline after a
	 * plugin is enabled or disabled, so the email pipeline dispatches
	 * to the current set of active hooks.
	 */
	setPipeline(pipeline: HookPipeline): void {
		this.pipeline = pipeline;
	}

	/**
	 * Send an email through the full pipeline.
	 *
	 * @param message - The email to send
	 * @param source - Where the email originated ("system" for auth, plugin ID for plugins)
	 * @throws EmailNotConfiguredError if no provider is selected
	 * @throws EmailRecursionError if called re-entrantly from within a hook
	 * @throws Error if the provider handler throws
	 */
	async send(message: EmailMessage, source: string): Promise<void> {
		// Recursion guard: a plugin with email:send + email:intercept calling
		// ctx.email.send() from an email hook would loop forever.
		// Uses AsyncLocalStorage so concurrent requests don't interfere —
		// each async context tracks its own depth independently.
		const store = emailSendALS.getStore();
		if (store && store.depth > 0) {
			throw new EmailRecursionError();
		}

		const run = () => this.sendInner(message, source);
		if (store) {
			// Already inside an ALS context (e.g. nested call) — increment depth
			store.depth++;
			try {
				await run();
			} finally {
				store.depth--;
			}
		} else {
			// First call — create new ALS context
			await emailSendALS.run({ depth: 1 }, run);
		}
	}

	/**
	 * Inner send implementation, separated from the recursion guard.
	 */
	private async sendInner(message: EmailMessage, source: string): Promise<void> {
		// Validate message fields at the pipeline boundary. TypeScript enforces
		// this at compile time, but sandboxed plugins cross an RPC boundary
		// where runtime types aren't guaranteed.
		if (!message || typeof message !== "object") {
			throw new Error("Invalid email message: message must be an object");
		}
		if (!message.to || typeof message.to !== "string") {
			throw new Error("Invalid email message: 'to' is required and must be a string");
		}
		if (!message.subject || typeof message.subject !== "string") {
			throw new Error("Invalid email message: 'subject' is required and must be a string");
		}
		if (!message.text || typeof message.text !== "string") {
			throw new Error("Invalid email message: 'text' is required and must be a string");
		}

		const isSystemEmail = source === SYSTEM_SOURCE;

		// System emails (auth tokens, magic links, invites) skip the
		// email:beforeSend pipeline entirely. These contain sensitive tokens
		// that must never be exposed to plugin hooks — a malicious interceptor
		// could rewrite the body/URL to steal auth tokens even if the `to`
		// field is protected.
		let finalMessage: EmailMessage;
		if (isSystemEmail) {
			finalMessage = message;
		} else {
			// Stage 1: email:beforeSend middleware (can transform or cancel)
			const beforeResult = await this.pipeline.runEmailBeforeSend(message, source);

			if (beforeResult.message === false) {
				// Cancelled by middleware — find which plugin cancelled for audit log
				const cancellingResult = beforeResult.results.find((r) => r.value === false);
				const cancelledBy = cancellingResult?.pluginId ?? "unknown";

				console.info(`[email] Email to "${message.to}" cancelled by plugin "${cancelledBy}"`);
				return;
			}

			finalMessage = beforeResult.message;
		}

		// Stage 2: email:deliver (exclusive hook)
		const deliverEvent: EmailDeliverEvent = { message: finalMessage, source };
		const deliverResult = await this.pipeline.invokeExclusiveHook(EMAIL_DELIVER_HOOK, deliverEvent);

		if (!deliverResult) {
			throw new EmailNotConfiguredError();
		}

		if (deliverResult.error) {
			throw deliverResult.error;
		}

		// Stage 3: email:afterSend (fire-and-forget)
		// System emails skip afterSend for the same reason they skip beforeSend:
		// the message contains plaintext auth tokens that must not be exposed to
		// plugin hooks. A logging/analytics hook could exfiltrate magic link URLs.
		// Errors are logged internally by the pipeline, not propagated.
		if (!isSystemEmail) {
			this.pipeline
				.runEmailAfterSend(finalMessage, source)
				.catch((err) =>
					console.error(
						"[email] afterSend pipeline error:",
						err instanceof Error ? err.message : err,
					),
				);
		}
	}

	/**
	 * Check if an email provider is configured and available.
	 *
	 * Returns true if an email:deliver provider is selected in the exclusive
	 * hook system. Plugins and auth code use this to decide whether to show
	 * "send invite" vs "copy invite link" UI.
	 */
	isAvailable(): boolean {
		return this.pipeline.getExclusiveSelection(EMAIL_DELIVER_HOOK) !== undefined;
	}
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/routes.ts
```ts
/**
 * Plugin Routes v2
 *
 * Handles plugin API route invocation with:
 * - Input validation via Zod schemas
 * - Route context creation
 * - Error handling
 *
 */

import { PluginContextFactory, type PluginContextFactoryOptions } from "./context.js";
import { extractRequestMeta } from "./request-meta.js";
import type { ResolvedPlugin, RouteContext, PluginRoute } from "./types.js";

/**
 * Route metadata (public flag) without the handler.
 * Used by the catch-all route to decide auth before dispatch.
 */
export interface RouteMeta {
	public: boolean;
}

/**
 * Result from a route invocation
 */
export interface RouteResult<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: unknown;
	};
	status: number;
}

/**
 * Route invocation options
 */
export interface InvokeRouteOptions {
	/** The original request */
	request: Request;
	/** Request body (already parsed) */
	body?: unknown;
}

/**
 * Route handler for a plugin
 */
export class PluginRouteHandler {
	private contextFactory: PluginContextFactory;
	private plugin: ResolvedPlugin;

	constructor(plugin: ResolvedPlugin, factoryOptions: PluginContextFactoryOptions) {
		this.plugin = plugin;
		this.contextFactory = new PluginContextFactory(factoryOptions);
	}

	/**
	 * Invoke a route by name
	 */
	async invoke(routeName: string, options: InvokeRouteOptions): Promise<RouteResult> {
		const route = this.plugin.routes[routeName];

		if (!route) {
			return {
				success: false,
				error: {
					code: "ROUTE_NOT_FOUND",
					message: `Route "${routeName}" not found in plugin "${this.plugin.id}"`,
				},
				status: 404,
			};
		}

		// Validate input if schema is provided
		let validatedInput: unknown;
		if (route.input) {
			const parseResult = route.input.safeParse(options.body);
			if (!parseResult.success) {
				return {
					success: false,
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid request body",
						details: parseResult.error.format(),
					},
					status: 400,
				};
			}
			validatedInput = parseResult.data;
		} else {
			validatedInput = options.body;
		}

		// Create route context
		const baseContext = this.contextFactory.createContext(this.plugin);
		const routeContext: RouteContext = {
			...baseContext,
			input: validatedInput,
			request: options.request,
			requestMeta: extractRequestMeta(options.request),
		};

		// Execute handler
		try {
			const result = await route.handler(routeContext);
			return {
				success: true,
				data: result,
				status: 200,
			};
		} catch (error) {
			// Handle known error types
			if (error instanceof PluginRouteError) {
				return {
					success: false,
					error: {
						code: error.code,
						message: error.message,
						details: error.details,
					},
					status: error.status,
				};
			}

			// Unknown error
			const message = error instanceof Error ? error.message : String(error);
			return {
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: `Route handler failed: ${message}`,
				},
				status: 500,
			};
		}
	}

	/**
	 * Get all route names
	 */
	getRouteNames(): string[] {
		return Object.keys(this.plugin.routes);
	}

	/**
	 * Check if a route exists
	 */
	hasRoute(name: string): boolean {
		return name in this.plugin.routes;
	}

	/**
	 * Get route metadata without invoking the handler.
	 * Returns null if the route doesn't exist.
	 */
	getRouteMeta(name: string): RouteMeta | null {
		const route: PluginRoute | undefined = this.plugin.routes[name];
		if (!route) return null;
		return { public: route.public === true };
	}
}

/**
 * Error class for plugin routes
 * Allows plugins to return structured errors with specific HTTP status codes
 */
export class PluginRouteError extends Error {
	constructor(
		public code: string,
		message: string,
		public status: number = 400,
		public details?: unknown,
	) {
		super(message);
		this.name = "PluginRouteError";
	}

	/**
	 * Create a bad request error (400)
	 */
	static badRequest(message: string, details?: unknown): PluginRouteError {
		return new PluginRouteError("BAD_REQUEST", message, 400, details);
	}

	/**
	 * Create an unauthorized error (401)
	 */
	static unauthorized(message: string = "Unauthorized"): PluginRouteError {
		return new PluginRouteError("UNAUTHORIZED", message, 401);
	}

	/**
	 * Create a forbidden error (403)
	 */
	static forbidden(message: string = "Forbidden"): PluginRouteError {
		return new PluginRouteError("FORBIDDEN", message, 403);
	}

	/**
	 * Create a not found error (404)
	 */
	static notFound(message: string = "Not found"): PluginRouteError {
		return new PluginRouteError("NOT_FOUND", message, 404);
	}

	/**
	 * Create a conflict error (409)
	 */
	static conflict(message: string, details?: unknown): PluginRouteError {
		return new PluginRouteError("CONFLICT", message, 409, details);
	}

	/**
	 * Create an internal error (500)
	 */
	static internal(message: string = "Internal error"): PluginRouteError {
		return new PluginRouteError("INTERNAL_ERROR", message, 500);
	}
}

/**
 * Registry for all plugin route handlers
 */
export class PluginRouteRegistry {
	private handlers: Map<string, PluginRouteHandler> = new Map();

	constructor(private factoryOptions: PluginContextFactoryOptions) {}

	/**
	 * Register a plugin's routes
	 */
	register(plugin: ResolvedPlugin): void {
		const handler = new PluginRouteHandler(plugin, this.factoryOptions);
		this.handlers.set(plugin.id, handler);
	}

	/**
	 * Unregister a plugin's routes
	 */
	unregister(pluginId: string): void {
		this.handlers.delete(pluginId);
	}

	/**
	 * Invoke a plugin route
	 */
	async invoke(
		pluginId: string,
		routeName: string,
		options: InvokeRouteOptions,
	): Promise<RouteResult> {
		const handler = this.handlers.get(pluginId);

		if (!handler) {
			return {
				success: false,
				error: {
					code: "PLUGIN_NOT_FOUND",
					message: `Plugin "${pluginId}" not found`,
				},
				status: 404,
			};
		}

		return handler.invoke(routeName, options);
	}

	/**
	 * Get all registered plugin IDs
	 */
	getPluginIds(): string[] {
		return [...this.handlers.keys()];
	}

	/**
	 * Get routes for a plugin
	 */
	getRoutes(pluginId: string): string[] {
		return this.handlers.get(pluginId)?.getRouteNames() ?? [];
	}

	/**
	 * Get route metadata for a specific plugin route.
	 * Returns null if the plugin or route doesn't exist.
	 */
	getRouteMeta(pluginId: string, routeName: string): RouteMeta | null {
		const handler = this.handlers.get(pluginId);
		if (!handler) return null;
		return handler.getRouteMeta(routeName);
	}
}

/**
 * Create a route registry
 */
export function createRouteRegistry(
	factoryOptions: PluginContextFactoryOptions,
): PluginRouteRegistry {
	return new PluginRouteRegistry(factoryOptions);
}

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/publishing.mdx
```mdx
---
title: Publishing Plugins
description: Bundle and publish your EmDash plugin to the marketplace.
---

import { Aside, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

Once you've built a plugin, you can publish it to the EmDash Marketplace so other sites can install it from the admin dashboard.

## Prerequisites

Before publishing, make sure your plugin:

- Has a valid `package.json` with the `"."` export pointing to your plugin entry
- Uses `definePlugin()` with a unique `id` and valid semver `version`
- Declares its `capabilities` (what APIs it needs access to)

## Bundle Format

Published plugins are distributed as `.tar.gz` tarballs containing:

| File             | Required | Description                            |
| ---------------- | -------- | -------------------------------------- |
| `manifest.json`  | Yes      | Plugin metadata extracted from `definePlugin()` |
| `backend.js`     | No       | Bundled sandbox code (self-contained ES module) |
| `admin.js`       | No       | Bundled admin UI code                  |
| `README.md`      | No       | Plugin documentation                   |
| `icon.png`       | No       | Plugin icon (256x256 PNG)              |
| `screenshots/`   | No       | Up to 5 screenshots (PNG/JPEG, max 1920x1080) |

The `manifest.json` is generated automatically from your `definePlugin()` call. It contains the plugin ID, version, capabilities, hook names, route names, and admin configuration — but no executable code.

## Building a Bundle

The `emdash plugin bundle` command produces a tarball from your plugin source:

```bash
cd packages/plugins/my-plugin
emdash plugin bundle
```

This will:

<Steps>
1. Read your `package.json` to find entrypoints
2. Build the main entry with tsdown to extract the manifest
3. Bundle `backend.js` (minified, tree-shaken, self-contained)
4. Bundle `admin.js` if an `"./admin"` export exists
5. Collect assets (README, icon, screenshots)
6. Validate the bundle (size limits, no Node.js built-ins in backend)
7. Write `{id}-{version}.tar.gz` to `dist/`
</Steps>

### Entrypoint Resolution

The bundle command finds your code through `package.json` exports:

```json title="package.json"
{
  "exports": {
    ".": { "import": "./dist/index.mjs" },
    "./sandbox": { "import": "./dist/sandbox-entry.mjs" },
    "./admin": { "import": "./dist/admin.mjs" }
  }
}
```

| Export       | Purpose | Built as |
| ------------ | ------- | -------- |
| `"."`        | Main entry — used to extract the manifest | Externals: `emdash`, `@emdash-cms/*` |
| `"./sandbox"` | Backend code that runs in the sandbox | Fully self-contained (no externals) |
| `"./admin"`  | Admin UI components | Fully self-contained |

If `"./sandbox"` is missing, the command looks for `src/sandbox-entry.ts` as a fallback.

<Aside type="note">
  The bundle command maps dist paths back to source automatically. If your `"."` export points to `./dist/index.mjs`, it will find and build `src/index.ts`.
</Aside>

### Options

```bash
emdash plugin bundle [--dir <path>] [--outDir <path>]
```

| Flag | Default | Description |
| ---- | ------- | ----------- |
| `--dir` | Current directory | Plugin source directory |
| `--outDir`, `-o` | `dist` | Output directory for the tarball |

### Validation

The bundle command checks:

- **Size limit** — Total bundle must be under 5MB
- **No Node.js built-ins** — `backend.js` cannot import `fs`, `path`, `child_process`, etc. (sandbox code runs in a V8 isolate, not Node.js)
- **Icon dimensions** — `icon.png` should be 256x256 (warns if wrong, still includes it)
- **Screenshot limits** — Max 5 screenshots, max 1920x1080

<Aside type="tip">
  If your backend code imports a Node.js built-in, the bundle will fail validation. Replace Node.js APIs with Web APIs or move the logic to a trusted plugin instead.
</Aside>

## Publishing

The `emdash plugin publish` command uploads your tarball to the marketplace:

```bash
emdash plugin publish
```

This will find the most recent `.tar.gz` in your `dist/` directory and upload it. You can also specify the tarball explicitly or build before publishing:

```bash
# Explicit tarball path
emdash plugin publish --tarball dist/my-plugin-1.0.0.tar.gz

# Build first, then publish
emdash plugin publish --build
```

### Authentication

The first time you publish, the CLI authenticates you via GitHub:

<Steps>
1. The CLI opens your browser to GitHub's device authorization page
2. You enter the code displayed in your terminal
3. GitHub issues an access token
4. The CLI exchanges it for a marketplace JWT (stored in `~/.config/emdash/auth.json`)
</Steps>

The token lasts 30 days. After it expires, you'll be prompted to re-authenticate on the next publish.

You can also manage authentication separately:

```bash
# Log in without publishing
emdash plugin login

# Log out (clear stored token)
emdash plugin logout
```

### First-Time Registration

If your plugin ID doesn't exist in the marketplace yet, `emdash plugin publish` registers it automatically before uploading the first version.

### Version Requirements

Each published version must have a higher semver than the last. You cannot overwrite or republish an existing version.

### Security Audit

Every published version goes through an automated security audit. The marketplace scans your `backend.js` and `admin.js` for:

- Data exfiltration patterns
- Credential harvesting via settings
- Obfuscated code
- Resource abuse (crypto mining, etc.)
- Suspicious network activity

The audit produces a verdict of **pass**, **warn**, or **fail**, which is displayed on the plugin's marketplace listing. Depending on the marketplace's enforcement level, a **fail** verdict may block publication entirely.

### Options

```bash
emdash plugin publish [--tarball <path>] [--build] [--dir <path>] [--registry <url>]
```

| Flag | Default | Description |
| ---- | ------- | ----------- |
| `--tarball` | Latest `.tar.gz` in `dist/` | Explicit tarball path |
| `--build` | `false` | Run `emdash plugin bundle` before publishing |
| `--dir` | Current directory | Plugin directory (used with `--build`) |
| `--registry` | `https://marketplace.emdashcms.com` | Marketplace URL |

## Complete Workflow

Here's the typical publish cycle:

```bash
# 1. Make your changes
# 2. Bump the version in definePlugin() and package.json
# 3. Bundle and publish in one step
emdash plugin publish --build
```

Or if you prefer to inspect the bundle first:

```bash
# Build the tarball
emdash plugin bundle

# Check the output
tar tzf dist/my-plugin-1.1.0.tar.gz

# Publish
emdash plugin publish
```

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/types.ts
```ts
/**
 * Plugin System Types v2
 *
 * New plugin API with:
 * - Single unified context shape for all hooks and routes
 * - Paginated storage queries (no async iterators)
 * - Unified KV API (replaces settings + options)
 * - Explicit ctx.http and ctx.log
 *
 */

import type { Element } from "@emdash-cms/blocks";
import type { JSX } from "astro/jsx-runtime";
import type { z } from "astro/zod";

import type { FieldType } from "../schema/types.js";

// =============================================================================
// Core Types
// =============================================================================

/**
 * Plugin capabilities determine what APIs are available in context
 */
export type PluginCapability =
	| "network:fetch" // ctx.http is available (host-restricted via allowedHosts)
	| "network:fetch:any" // ctx.http is available (unrestricted outbound — use for user-configured URLs)
	| "read:content" // ctx.content.get/list available
	| "write:content" // ctx.content.create/update/delete available
	| "read:media" // ctx.media.get/list available
	| "write:media" // ctx.media.getUploadUrl/delete available
	| "read:users" // ctx.users is available
	| "email:send" // ctx.email is available (when a provider is configured)
	| "email:provide" // can register email:deliver exclusive hook (transport provider)
	| "email:intercept" // can register email:beforeSend / email:afterSend hooks
	| "page:inject"; // can register page:fragments hook (inject scripts/styles into pages)

// =============================================================================
// Storage Types
// =============================================================================

/**
 * Storage collection declaration in plugin definition
 */
export interface StorageCollectionConfig {
	/**
	 * Fields to index for querying.
	 * Each entry can be a single field name or an array for composite indexes.
	 */
	indexes: Array<string | string[]>;
	/**
	 * Fields with unique constraints.
	 * Each entry can be a single field name or an array for composite unique indexes.
	 * Unique indexes are also queryable (no need to duplicate in `indexes`).
	 */
	uniqueIndexes?: Array<string | string[]>;
}

/**
 * Plugin storage configuration
 */
export type PluginStorageConfig = Record<string, StorageCollectionConfig>;

/**
 * Query filter operators
 */
export interface RangeFilter {
	gt?: number | string;
	gte?: number | string;
	lt?: number | string;
	lte?: number | string;
}

export interface InFilter {
	in: Array<string | number>;
}

export interface StartsWithFilter {
	startsWith: string;
}

/**
 * Where clause value types
 */
export type WhereValue =
	| string
	| number
	| boolean
	| null
	| RangeFilter
	| InFilter
	| StartsWithFilter;

/**
 * Where clause for storage queries
 */
export type WhereClause = Record<string, WhereValue>;

/**
 * Query options for storage.query()
 */
export interface QueryOptions {
	where?: WhereClause;
	orderBy?: Record<string, "asc" | "desc">;
	limit?: number; // Default 50, max 1000
	cursor?: string;
}

/**
 * Paginated result (used by storage.query, content.list, media.list)
 */
export interface PaginatedResult<T> {
	items: T[];
	cursor?: string;
	hasMore: boolean;
}

/**
 * Storage collection interface - the API exposed to plugins
 * No async iterators - all operations return promises with pagination
 */
export interface StorageCollection<T = unknown> {
	// Basic CRUD
	get(id: string): Promise<T | null>;
	put(id: string, data: T): Promise<void>;
	delete(id: string): Promise<boolean>;
	exists(id: string): Promise<boolean>;

	// Batch operations
	getMany(ids: string[]): Promise<Map<string, T>>;
	putMany(items: Array<{ id: string; data: T }>): Promise<void>;
	deleteMany(ids: string[]): Promise<number>;

	// Query - always paginated
	query(options?: QueryOptions): Promise<PaginatedResult<{ id: string; data: T }>>;
	count(where?: WhereClause): Promise<number>;
}

/**
 * Plugin storage context - typed based on declared collections
 */
export type PluginStorage<T extends PluginStorageConfig> = {
	[K in keyof T]: StorageCollection;
};

// =============================================================================
// Context APIs
// =============================================================================

/**
 * KV store interface - unified replacement for settings + options
 *
 * Convention:
 * - `settings:*` - User-configurable preferences (shown in admin UI)
 * - `state:*` - Internal plugin state (not shown to users)
 */
export interface KVAccess {
	get<T>(key: string): Promise<T | null>;
	set(key: string, value: unknown): Promise<void>;
	delete(key: string): Promise<boolean>;
	list(prefix?: string): Promise<Array<{ key: string; value: unknown }>>;
}

/**
 * Content item returned from content API
 */
export interface ContentItem {
	id: string;
	type: string;
	data: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

/**
 * Content list options
 */
export interface ContentListOptions {
	limit?: number;
	cursor?: string;
	orderBy?: Record<string, "asc" | "desc">;
}

/**
 * Content access interface - capability-gated
 */
export interface ContentAccess {
	// Read operations (requires read:content)
	get(collection: string, id: string): Promise<ContentItem | null>;
	list(collection: string, options?: ContentListOptions): Promise<PaginatedResult<ContentItem>>;

	// Write operations (requires write:content) - optional on interface
	create?(collection: string, data: Record<string, unknown>): Promise<ContentItem>;
	update?(collection: string, id: string, data: Record<string, unknown>): Promise<ContentItem>;
	delete?(collection: string, id: string): Promise<boolean>;
}

/**
 * Full content access with write operations
 */
export interface ContentAccessWithWrite extends ContentAccess {
	create(collection: string, data: Record<string, unknown>): Promise<ContentItem>;
	update(collection: string, id: string, data: Record<string, unknown>): Promise<ContentItem>;
	delete(collection: string, id: string): Promise<boolean>;
}

/**
 * Media item returned from media API
 */
export interface MediaItem {
	id: string;
	filename: string;
	mimeType: string;
	size: number | null;
	url: string;
	createdAt: string;
}

/**
 * Media list options
 */
export interface MediaListOptions {
	limit?: number;
	cursor?: string;
	mimeType?: string; // Filter by mime type prefix, e.g., "image/"
}

/**
 * Media access interface - capability-gated
 */
export interface MediaAccess {
	// Read operations (requires read:media)
	get(id: string): Promise<MediaItem | null>;
	list(options?: MediaListOptions): Promise<PaginatedResult<MediaItem>>;

	// Write operations (requires write:media) - optional on interface
	getUploadUrl?(
		filename: string,
		contentType: string,
	): Promise<{ uploadUrl: string; mediaId: string }>;
	/**
	 * Upload media bytes directly. Preferred in sandboxed mode where
	 * plugins cannot make external requests to a presigned URL.
	 * Returns the created media item.
	 */
	upload?(
		filename: string,
		contentType: string,
		bytes: ArrayBuffer,
	): Promise<{ mediaId: string; storageKey: string; url: string }>;
	delete?(id: string): Promise<boolean>;
}

/**
 * Full media access with write operations
 */
export interface MediaAccessWithWrite extends MediaAccess {
	getUploadUrl(
		filename: string,
		contentType: string,
	): Promise<{ uploadUrl: string; mediaId: string }>;
	upload(
		filename: string,
		contentType: string,
		bytes: ArrayBuffer,
	): Promise<{ mediaId: string; storageKey: string; url: string }>;
	delete(id: string): Promise<boolean>;
}

/**
 * HTTP client interface - requires network:fetch capability
 */
export interface HttpAccess {
	fetch(url: string, init?: RequestInit): Promise<Response>;
}

/**
 * Logger interface - always available
 */
export interface LogAccess {
	debug(message: string, data?: unknown): void;
	info(message: string, data?: unknown): void;
	warn(message: string, data?: unknown): void;
	error(message: string, data?: unknown): void;
}

// =============================================================================
// Site & User Access
// =============================================================================

/**
 * Site information available to all plugins
 */
export interface SiteInfo {
	/** Site name (from settings) */
	name: string;
	/** Site URL (from settings or request) */
	url: string;
	/** Site locale (from settings, defaults to "en") */
	locale: string;
}

/**
 * Read-only user information exposed to plugins.
 * Sensitive fields (password hashes, sessions, passkeys) are excluded.
 */
export interface UserInfo {
	id: string;
	email: string;
	name: string | null;
	role: number;
	createdAt: string;
}

/**
 * User access interface - requires read:users capability
 */
export interface UserAccess {
	/** Get a user by ID */
	get(id: string): Promise<UserInfo | null>;
	/** Get a user by email */
	getByEmail(email: string): Promise<UserInfo | null>;
	/** List users with optional filters */
	list(opts?: { role?: number; limit?: number; cursor?: string }): Promise<{
		items: UserInfo[];
		nextCursor?: string;
	}>;
}

// =============================================================================
// Plugin Context
// =============================================================================

/**
 * The unified plugin context - same shape for all hooks and routes
 */
export interface PluginContext<TStorage extends PluginStorageConfig = PluginStorageConfig> {
	/** Plugin metadata */
	plugin: {
		id: string;
		version: string;
	};

	/** Storage collections - only if plugin declares storage */
	storage: PluginStorage<TStorage>;

	/** Key-value store for config and state */
	kv: KVAccess;

	/** Content access - only if read:content or write:content capability */
	content?: ContentAccess | ContentAccessWithWrite;

	/** Media access - only if read:media or write:media capability */
	media?: MediaAccess | MediaAccessWithWrite;

	/** HTTP client - only if network:fetch capability */
	http?: HttpAccess;

	/** Logger - always available */
	log: LogAccess;

	/** Site information - always available */
	site: SiteInfo;

	/** URL helper - generates absolute URLs from paths. Always available. */
	url(path: string): string;

	/** User access - only if read:users capability */
	users?: UserAccess;

	/** Cron task scheduling - always available, scoped to plugin */
	cron?: CronAccess;

	/** Email access - only if email:send capability and a provider is configured */
	email?: EmailAccess;
}

// =============================================================================
// Cron Types
// =============================================================================

/**
 * Cron access interface �� always available on plugin context, scoped to plugin.
 */
export interface CronAccess {
	/** Schedule a recurring or one-shot task */
	schedule(name: string, opts: { schedule: string; data?: Record<string, unknown> }): Promise<void>;
	/** Cancel a scheduled task */
	cancel(name: string): Promise<void>;
	/** List this plugin's scheduled tasks */
	list(): Promise<CronTaskInfo[]>;
}

/**
 * Task info returned from CronAccess.list()
 */
export interface CronTaskInfo {
	name: string;
	schedule: string;
	nextRunAt: string;
	lastRunAt: string | null;
}

/**
 * Event passed to the `cron` hook handler
 */
export interface CronEvent {
	name: string;
	data?: Record<string, unknown>;
	scheduledAt: string;
}

/**
 * Cron hook handler type
 */
export type CronHandler = (event: CronEvent, ctx: PluginContext) => Promise<void>;

// =============================================================================
// Email Types
// =============================================================================

/**
 * Email access interface — requires `email:send` capability.
 * Undefined when no `email:deliver` provider is configured.
 *
 * Related capabilities:
 * - `email:send` — grants ctx.email (this interface)
 * - `email:provide` — allows registering the `email:deliver` exclusive hook
 * - `email:intercept` — allows registering `email:beforeSend` / `email:afterSend` hooks
 */
export interface EmailAccess {
	send(message: EmailMessage): Promise<void>;
}

/**
 * Email message shape
 */
export interface EmailMessage {
	to: string;
	subject: string;
	text: string;
	html?: string;
}

/**
 * Event passed to email:beforeSend hooks (middleware — transform, validate, cancel)
 */
export interface EmailBeforeSendEvent {
	message: EmailMessage;
	/** Where the email originated — "system" for auth emails, plugin ID for plugin emails */
	source: string;
}

/**
 * Event passed to email:deliver hook (exclusive — exactly one provider delivers)
 */
export interface EmailDeliverEvent {
	message: EmailMessage;
	source: string;
}

/**
 * Event passed to email:afterSend hooks (logging, analytics, fire-and-forget)
 */
export interface EmailAfterSendEvent {
	message: EmailMessage;
	source: string;
}

/**
 * Handler type for email:beforeSend hooks.
 * Returns modified message, or false to cancel delivery.
 */
export type EmailBeforeSendHandler = (
	event: EmailBeforeSendEvent,
	ctx: PluginContext,
) => Promise<EmailMessage | false>;

/**
 * Handler type for email:deliver hooks (exclusive provider).
 */
export type EmailDeliverHandler = (event: EmailDeliverEvent, ctx: PluginContext) => Promise<void>;

/**
 * Handler type for email:afterSend hooks (fire-and-forget).
 */
export type EmailAfterSendHandler = (
	event: EmailAfterSendEvent,
	ctx: PluginContext,
) => Promise<void>;

// =============================================================================
// Comment Types
// =============================================================================

/**
 * Collection comment settings (read from _emdash_collections)
 */
export interface CollectionCommentSettings {
	commentsEnabled: boolean;
	commentsModeration: "all" | "first_time" | "none";
	commentsClosedAfterDays: number;
	commentsAutoApproveUsers: boolean;
}

/**
 * Event passed to comment:beforeCreate hooks (middleware — transform, enrich, reject)
 */
export interface CommentBeforeCreateEvent {
	comment: {
		collection: string;
		contentId: string;
		parentId: string | null;
		authorName: string;
		authorEmail: string;
		authorUserId: string | null;
		body: string;
		ipHash: string | null;
		userAgent: string | null;
	};
	/** Metadata bag — plugins can attach signals for the moderator */
	metadata: Record<string, unknown>;
}

/**
 * Event passed to comment:moderate hook (exclusive — decides initial status)
 */
export interface CommentModerateEvent {
	comment: CommentBeforeCreateEvent["comment"];
	metadata: Record<string, unknown>;
	collectionSettings: CollectionCommentSettings;
	/** Number of prior approved comments from this email address */
	priorApprovedCount: number;
}

/**
 * Moderation decision returned by the comment:moderate handler
 */
export interface ModerationDecision {
	status: "approved" | "pending" | "spam";
	/** Optional reason for admin visibility */
	reason?: string;
}

/**
 * Stored comment shape (full record with id, status, timestamps)
 */
export interface StoredComment {
	id: string;
	collection: string;
	contentId: string;
	parentId: string | null;
	authorName: string;
	authorEmail: string;
	authorUserId: string | null;
	body: string;
	status: string;
	moderationMetadata: Record<string, unknown> | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * Event passed to comment:afterCreate hooks (fire-and-forget)
 */
export interface CommentAfterCreateEvent {
	comment: StoredComment;
	metadata: Record<string, unknown>;
	/** The content item the comment is on */
	content: { id: string; collection: string; slug: string; title?: string };
	/** The content author (for notifications) */
	contentAuthor?: { id: string; name: string | null; email: string };
}

/**
 * Event passed to comment:afterModerate hooks (fire-and-forget, admin status change)
 */
export interface CommentAfterModerateEvent {
	comment: StoredComment;
	previousStatus: string;
	newStatus: string;
	/** The admin who moderated */
	moderator: { id: string; name: string | null };
}

/**
 * Handler type for comment:beforeCreate hooks.
 * Returns modified event, or false to reject the comment.
 */
export type CommentBeforeCreateHandler = (
	event: CommentBeforeCreateEvent,
	ctx: PluginContext,
) => Promise<CommentBeforeCreateEvent | false | void>;

/**
 * Handler type for comment:moderate hook (exclusive provider).
 */
export type CommentModerateHandler = (
	event: CommentModerateEvent,
	ctx: PluginContext,
) => Promise<ModerationDecision>;

/**
 * Handler type for comment:afterCreate hooks (fire-and-forget).
 */
export type CommentAfterCreateHandler = (
	event: CommentAfterCreateEvent,
	ctx: PluginContext,
) => Promise<void>;

/**
 * Handler type for comment:afterModerate hooks (fire-and-forget).
 */
export type CommentAfterModerateHandler = (
	event: CommentAfterModerateEvent,
	ctx: PluginContext,
) => Promise<void>;

// =============================================================================
// Hook Types
// =============================================================================

/**
 * Hook configuration
 */
export interface HookConfig<THandler> {
	/** Explicit ordering - lower numbers run first (default: 100) */
	priority?: number;
	/** Max execution time in ms (default: 5000) */
	timeout?: number;
	/** Run after these plugins */
	dependencies?: string[];
	/** Error handling policy */
	errorPolicy?: "continue" | "abort";
	/**
	 * Mark this hook as exclusive — only one plugin can be the active provider.
	 * Exclusive hooks skip the priority pipeline and dispatch only to the
	 * admin-selected provider. Used for email:deliver, search, image optimization, etc.
	 */
	exclusive?: boolean;
	/** The hook handler */
	handler: THandler;
}

/**
 * Content hook event
 */
export interface ContentHookEvent {
	content: Record<string, unknown>;
	collection: string;
	isNew: boolean;
}

/**
 * Content delete hook event
 */
export interface ContentDeleteEvent {
	id: string;
	collection: string;
}

/**
 * Media hook event
 */
export interface MediaUploadEvent {
	file: { name: string; type: string; size: number };
}

/**
 * Media after upload event
 */
export interface MediaAfterUploadEvent {
	media: MediaItem;
}

/**
 * Lifecycle hook event
 */
export interface LifecycleEvent {
	// Empty for install/activate/deactivate
}

/**
 * Uninstall hook event
 */
export interface UninstallEvent {
	deleteData: boolean;
}

// Hook handler types - all receive (event, ctx) with unified context
export type ContentBeforeSaveHandler = (
	event: ContentHookEvent,
	ctx: PluginContext,
) => Promise<Record<string, unknown> | void>;

export type ContentAfterSaveHandler = (
	event: ContentHookEvent,
	ctx: PluginContext,
) => Promise<void>;

export type ContentBeforeDeleteHandler = (
	event: ContentDeleteEvent,
	ctx: PluginContext,
) => Promise<boolean | void>;

export type ContentAfterDeleteHandler = (
	event: ContentDeleteEvent,
	ctx: PluginContext,
) => Promise<void>;

export type MediaBeforeUploadHandler = (
	event: MediaUploadEvent,
	ctx: PluginContext,
) => Promise<{ name: string; type: string; size: number } | void>;

export type MediaAfterUploadHandler = (
	event: MediaAfterUploadEvent,
	ctx: PluginContext,
) => Promise<void>;

export type LifecycleHandler = (event: LifecycleEvent, ctx: PluginContext) => Promise<void>;

export type UninstallHandler = (event: UninstallEvent, ctx: PluginContext) => Promise<void>;

// =============================================================================
// Public Page Contribution Types
// =============================================================================

/** Placement targets for page fragment contributions */
export type PagePlacement = "head" | "body:start" | "body:end";

/**
 * Describes the page being rendered. Passed to page hooks so plugins
 * can decide what to contribute without fetching content themselves.
 */
export interface PublicPageContext {
	url: string;
	path: string;
	locale: string | null;
	kind: "content" | "custom";
	pageType: string;
	title: string | null;
	description: string | null;
	canonical: string | null;
	image: string | null;
	content?: {
		collection: string;
		id: string;
		slug: string | null;
	};
	/** SEO meta for base metadata generation in EmDashHead */
	seo?: {
		ogTitle?: string | null;
		ogDescription?: string | null;
		ogImage?: string | null;
		robots?: string | null;
	};
	/** Article metadata for Open Graph article: tags */
	articleMeta?: {
		publishedTime?: string | null;
		modifiedTime?: string | null;
		author?: string | null;
	};
	/** Site name for structured data and og:site_name */
	siteName?: string;
}

// ── page:metadata ───────────────────────────────────────────────

export interface PageMetadataEvent {
	page: PublicPageContext;
}

/**
 * Allowed rel values for link contributions.
 * This is a security-critical allowlist -- sandboxed plugins can only inject
 * link tags with these rel values. Adding "stylesheet", "prefetch", "prerender"
 * etc. would allow sandboxed plugins to inject external resources.
 */
export type PageMetadataLinkRel =
	| "canonical"
	| "alternate"
	| "author"
	| "license"
	| "site.standard.document";

export type PageMetadataContribution =
	| { kind: "title"; text: string }
	| { kind: "meta"; name: string; content: string; key?: string }
	| { kind: "property"; property: string; content: string; key?: string }
	| { kind: "link"; rel: PageMetadataLinkRel; href: string; hreflang?: string; key?: string }
	| {
			kind: "jsonld";
			id?: string;
			graph: Record<string, unknown> | Array<Record<string, unknown>>;
	  };

export type PageMetadataHandler = (
	event: PageMetadataEvent,
	ctx: PluginContext,
) =>
	| PageMetadataContribution
	| PageMetadataContribution[]
	| null
	| Promise<PageMetadataContribution | PageMetadataContribution[] | null>;

// ── page:fragments (trusted-only) ──────────────────────────────

export interface PageFragmentEvent {
	page: PublicPageContext;
}

export type PageFragmentContribution =
	| {
			kind: "external-script";
			placement: PagePlacement;
			src: string;
			async?: boolean;
			defer?: boolean;
			attributes?: Record<string, string>;
			key?: string;
	  }
	| {
			kind: "inline-script";
			placement: PagePlacement;
			code: string;
			attributes?: Record<string, string>;
			key?: string;
	  }
	| {
			kind: "html";
			placement: PagePlacement;
			html: string;
			key?: string;
	  };

export type PageFragmentHandler = (
	event: PageFragmentEvent,
	ctx: PluginContext,
) =>
	| PageFragmentContribution
	| PageFragmentContribution[]
	| null
	| Promise<PageFragmentContribution | PageFragmentContribution[] | null>;

/**
 * Plugin hooks definition
 */
export interface PluginHooks {
	// Lifecycle hooks
	"plugin:install"?: HookConfig<LifecycleHandler> | LifecycleHandler;
	"plugin:activate"?: HookConfig<LifecycleHandler> | LifecycleHandler;
	"plugin:deactivate"?: HookConfig<LifecycleHandler> | LifecycleHandler;
	"plugin:uninstall"?: HookConfig<UninstallHandler> | UninstallHandler;

	// Content hooks
	"content:beforeSave"?: HookConfig<ContentBeforeSaveHandler> | ContentBeforeSaveHandler;
	"content:afterSave"?: HookConfig<ContentAfterSaveHandler> | ContentAfterSaveHandler;
	"content:beforeDelete"?: HookConfig<ContentBeforeDeleteHandler> | ContentBeforeDeleteHandler;
	"content:afterDelete"?: HookConfig<ContentAfterDeleteHandler> | ContentAfterDeleteHandler;

	// Media hooks
	"media:beforeUpload"?: HookConfig<MediaBeforeUploadHandler> | MediaBeforeUploadHandler;
	"media:afterUpload"?: HookConfig<MediaAfterUploadHandler> | MediaAfterUploadHandler;

	// Cron hook
	cron?: HookConfig<CronHandler> | CronHandler;

	// Email hooks
	"email:beforeSend"?: HookConfig<EmailBeforeSendHandler> | EmailBeforeSendHandler;
	"email:deliver"?: HookConfig<EmailDeliverHandler> | EmailDeliverHandler;
	"email:afterSend"?: HookConfig<EmailAfterSendHandler> | EmailAfterSendHandler;

	// Comment hooks
	"comment:beforeCreate"?: HookConfig<CommentBeforeCreateHandler> | CommentBeforeCreateHandler;
	"comment:moderate"?: HookConfig<CommentModerateHandler> | CommentModerateHandler;
	"comment:afterCreate"?: HookConfig<CommentAfterCreateHandler> | CommentAfterCreateHandler;
	"comment:afterModerate"?: HookConfig<CommentAfterModerateHandler> | CommentAfterModerateHandler;

	// Public page hooks
	"page:metadata"?: HookConfig<PageMetadataHandler> | PageMetadataHandler;
	"page:fragments"?: HookConfig<PageFragmentHandler> | PageFragmentHandler;
}

/**
 * Hook names
 */
export type HookName = keyof PluginHooks;

/**
 * Hook metadata entry in a plugin manifest.
 * Replaces the plain hook name string with structured metadata.
 */
export interface ManifestHookEntry {
	name: string;
	exclusive?: boolean;
	priority?: number;
	timeout?: number;
}

/**
 * Route metadata entry in a plugin manifest.
 * Replaces the plain route name string with structured metadata.
 */
export interface ManifestRouteEntry {
	name: string;
	public?: boolean;
}

/**
 * Resolved hook with normalized config
 */
export interface ResolvedHook<THandler> {
	priority: number;
	timeout: number;
	dependencies: string[];
	errorPolicy: "continue" | "abort";
	/** Whether this hook is exclusive (provider pattern) */
	exclusive: boolean;
	handler: THandler;
	pluginId: string;
}

// =============================================================================
// Request Metadata Types
// =============================================================================

/**
 * Geographic location information derived from the request.
 * Available when running on Cloudflare Workers (via the `cf` object).
 */
export interface GeoInfo {
	country: string | null;
	region: string | null;
	city: string | null;
}

/**
 * Normalized request metadata available to plugin route handlers.
 * Extracted from request headers and platform-specific properties.
 */
export interface RequestMeta {
	ip: string | null;
	userAgent: string | null;
	referer: string | null;
	geo: GeoInfo | null;
}

// =============================================================================
// Route Types
// =============================================================================

/**
 * Route handler context extends plugin context with request-specific data
 */
export interface RouteContext<TInput = unknown> extends PluginContext {
	/** Validated input from request body */
	input: TInput;
	/** Original request */
	request: Request;
	/** Normalized request metadata (IP, user agent, geo) */
	requestMeta: RequestMeta;
}

/**
 * Route definition
 */
export interface PluginRoute<TInput = unknown> {
	/** Zod schema for input validation */
	input?: z.ZodType<TInput>;
	/**
	 * Mark this route as publicly accessible (no authentication required).
	 * Public routes skip session/token auth and CSRF checks.
	 */
	public?: boolean;
	/** Route handler */
	handler: (ctx: RouteContext<TInput>) => Promise<unknown>;
}

// =============================================================================
// Plugin Definition
// =============================================================================

/**
 * Admin page definition
 */
export interface PluginAdminPage {
	path: string;
	label: string;
	icon?: string;
}

/**
 * Dashboard widget definition
 */
export interface PluginDashboardWidget {
	id: string;
	size?: "full" | "half" | "third";
	title?: string;
}

/**
 * Settings field types (for admin UI generation)
 */
export type SettingFieldType = "string" | "number" | "boolean" | "select" | "secret";

export interface BaseSettingField {
	type: SettingFieldType;
	label: string;
	description?: string;
}

export interface StringSettingField extends BaseSettingField {
	type: "string";
	default?: string;
	multiline?: boolean;
}

export interface NumberSettingField extends BaseSettingField {
	type: "number";
	default?: number;
	min?: number;
	max?: number;
}

export interface BooleanSettingField extends BaseSettingField {
	type: "boolean";
	default?: boolean;
}

export interface SelectSettingField extends BaseSettingField {
	type: "select";
	options: Array<{ value: string; label: string }>;
	default?: string;
}

export interface SecretSettingField extends BaseSettingField {
	type: "secret";
}

export type SettingField =
	| StringSettingField
	| NumberSettingField
	| BooleanSettingField
	| SelectSettingField
	| SecretSettingField;

/**
 * Block Kit element for block editing fields.
 * This is the `Element` discriminated union from `@emdash-cms/blocks`.
 * Plugin authors should use `@emdash-cms/blocks` builder functions to create these.
 */
export type PortableTextBlockField = Element;

/**
 * Configuration for a Portable Text block type contributed by a plugin
 */
export interface PortableTextBlockConfig {
	/** Block type name (must match the `_type` in Portable Text) */
	type: string;
	/** Human-readable label shown in slash commands and modals */
	label: string;
	/** Icon key (e.g., "video", "code", "link", "link-external") */
	icon?: string;
	/** Description shown in slash command menu */
	description?: string;
	/** Placeholder text for the URL input */
	placeholder?: string;
	/** Block Kit form fields for the editing UI. If declared, replaces the simple URL input. */
	fields?: PortableTextBlockField[];
}

/**
 * Configuration for a field widget type contributed by a plugin.
 * A field widget provides a custom editing UI for a schema field.
 * The field references the widget via `widget: "pluginId:widgetName"`.
 */
export interface FieldWidgetConfig {
	/** Widget name (without plugin ID prefix) */
	name: string;
	/** Human-readable label for the admin UI */
	label: string;
	/** Which field types this widget can edit (e.g., ["json", "string"]) */
	fieldTypes: FieldType[];
	/** Block Kit elements for sandboxed rendering. Omit for trusted plugins using React. */
	elements?: Element[];
}

/**
 * Admin configuration
 */
export interface PluginAdminConfig {
	/** Module specifier for admin UI exports (e.g., "@emdash-cms/plugin-audit-log/admin") */
	entry?: string;
	/** Settings schema for auto-generated UI */
	settingsSchema?: Record<string, SettingField>;
	/** Admin pages */
	pages?: PluginAdminPage[];
	/** Dashboard widgets */
	widgets?: PluginDashboardWidget[];
	/** Portable Text block types this plugin provides */
	portableTextBlocks?: PortableTextBlockConfig[];
	/** Field widget types this plugin provides */
	fieldWidgets?: FieldWidgetConfig[];
}

/**
 * Plugin definition - input to definePlugin()
 */
export interface PluginDefinition<TStorage extends PluginStorageConfig = PluginStorageConfig> {
	/** Unique plugin identifier */
	id: string;
	/** Plugin version (semver) */
	version: string;

	/** Declared capabilities */
	capabilities?: PluginCapability[];

	/** Allowed hosts for network:fetch (wildcards supported: *.example.com) */
	allowedHosts?: string[];

	/** Storage collections with indexes */
	storage?: TStorage;

	/** Hooks */
	hooks?: PluginHooks;

	/** API routes */
	routes?: Record<string, PluginRoute>;

	/** Admin UI configuration */
	admin?: PluginAdminConfig;
}

/**
 * Resolved plugin - after definePlugin() processing
 */
export interface ResolvedPlugin<TStorage extends PluginStorageConfig = PluginStorageConfig> {
	id: string;
	version: string;
	capabilities: PluginCapability[];
	allowedHosts: string[];
	storage: TStorage;
	hooks: ResolvedPluginHooks;
	routes: Record<string, PluginRoute>;
	admin: PluginAdminConfig;
}

/**
 * Resolved hooks with normalized config
 */
export interface ResolvedPluginHooks {
	"plugin:install"?: ResolvedHook<LifecycleHandler>;
	"plugin:activate"?: ResolvedHook<LifecycleHandler>;
	"plugin:deactivate"?: ResolvedHook<LifecycleHandler>;
	"plugin:uninstall"?: ResolvedHook<UninstallHandler>;
	"content:beforeSave"?: ResolvedHook<ContentBeforeSaveHandler>;
	"content:afterSave"?: ResolvedHook<ContentAfterSaveHandler>;
	"content:beforeDelete"?: ResolvedHook<ContentBeforeDeleteHandler>;
	"content:afterDelete"?: ResolvedHook<ContentAfterDeleteHandler>;
	"media:beforeUpload"?: ResolvedHook<MediaBeforeUploadHandler>;
	"media:afterUpload"?: ResolvedHook<MediaAfterUploadHandler>;
	cron?: ResolvedHook<CronHandler>;
	"email:beforeSend"?: ResolvedHook<EmailBeforeSendHandler>;
	"email:deliver"?: ResolvedHook<EmailDeliverHandler>;
	"email:afterSend"?: ResolvedHook<EmailAfterSendHandler>;
	"comment:beforeCreate"?: ResolvedHook<CommentBeforeCreateHandler>;
	"comment:moderate"?: ResolvedHook<CommentModerateHandler>;
	"comment:afterCreate"?: ResolvedHook<CommentAfterCreateHandler>;
	"comment:afterModerate"?: ResolvedHook<CommentAfterModerateHandler>;
	"page:metadata"?: ResolvedHook<PageMetadataHandler>;
	"page:fragments"?: ResolvedHook<PageFragmentHandler>;
}

// =============================================================================
// Standard Plugin Format (Unified Plugin Format)
// =============================================================================

/**
 * Standard plugin hook handler -- same as sandbox entry format.
 * Receives the event as the first argument and a PluginContext as the second.
 *
 * Plugin authors annotate their event parameters with specific types for IDE
 * support. At the type level, we accept any function with compatible arity.
 */
// eslint-disable-next-line typescript-eslint/no-explicit-any -- must accept handlers with specific event types
export type StandardHookHandler = (...args: any[]) => Promise<any>;

/**
 * Standard plugin hook entry -- either a bare handler or a config object.
 */
export type StandardHookEntry =
	| StandardHookHandler
	| {
			handler: StandardHookHandler;
			priority?: number;
			timeout?: number;
			dependencies?: string[];
			errorPolicy?: "continue" | "abort";
			exclusive?: boolean;
	  };

/**
 * Standard plugin route handler -- takes (routeCtx, pluginCtx) like sandbox entries.
 * The routeCtx contains input and request info; pluginCtx is the full plugin context.
 *
 * Uses `any` for routeCtx to allow plugins to access properties like
 * `routeCtx.request.url` without needing exact type matches across
 * trusted (Request object) and sandboxed (plain object) modes.
 */
// eslint-disable-next-line typescript-eslint/no-explicit-any -- see above
export type StandardRouteHandler = (routeCtx: any, ctx: PluginContext) => Promise<unknown>;

/**
 * Standard plugin route entry -- either a config object with handler, or just a handler.
 */
export interface StandardRouteEntry {
	handler: StandardRouteHandler;
	input?: unknown;
	public?: boolean;
}

/**
 * Standard plugin definition -- the sandbox entry format.
 * Used by standard plugins that work in both trusted and sandboxed modes.
 * No id/version/capabilities -- those come from the descriptor.
 *
 * This is the input to definePlugin() for standard-format plugins.
 *
 * The hooks and routes use permissive types (Record<string, any>) so that
 * plugin authors can annotate their handlers with specific event types
 * without type errors from strictFunctionTypes contravariance.
 */
export interface StandardPluginDefinition {
	// eslint-disable-next-line typescript-eslint/no-explicit-any -- must accept handlers with specific event/route types
	hooks?: Record<string, any>;
	// eslint-disable-next-line typescript-eslint/no-explicit-any -- must accept handlers with specific event/route types
	routes?: Record<string, any>;
}

/**
 * Check if a value is a StandardPluginDefinition (has hooks/routes but no id/version).
 */
export function isStandardPluginDefinition(value: unknown): value is StandardPluginDefinition {
	if (typeof value !== "object" || value === null) return false;
	// Standard format: has hooks or routes, but NOT id+version (which are on PluginDefinition)
	const hasPluginShape = "hooks" in value || "routes" in value;
	const hasNativeShape = "id" in value && "version" in value;
	return hasPluginShape && !hasNativeShape;
}

// =============================================================================
// Plugin Admin Exports
// =============================================================================

/**
 * What a plugin exports from its /admin entrypoint
 * Uses generic component type to avoid React dependency
 */
export interface PluginAdminExports {
	widgets?: Record<string, JSX.Element>;
	pages?: Record<string, JSX.Element>;
	fields?: Record<string, JSX.Element>;
}

// =============================================================================
// Sandbox Types
// =============================================================================

/**
 * Plugin manifest - the metadata portion of a plugin bundle
 * Used for sandboxed plugins loaded from marketplace
 */
export interface PluginManifest {
	id: string;
	version: string;
	capabilities: PluginCapability[];
	allowedHosts: string[];
	storage: PluginStorageConfig;
	/** Hook declarations — either plain name strings or structured objects */
	hooks: Array<ManifestHookEntry | HookName>;
	/** Route declarations — either plain name strings or structured objects */
	routes: Array<ManifestRouteEntry | string>;
	admin: PluginAdminConfig;
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/admin/hooks/exclusive/[hookName].ts
```ts
/**
 * Exclusive hook selection endpoint
 *
 * PUT /_emdash/api/admin/hooks/exclusive/:hookName
 *
 * Sets or clears the selected provider for an exclusive hook.
 * Body: { pluginId: string | null }
 * Requires settings:manage permission.
 */

import type { APIRoute } from "astro";
import { z } from "zod";

import { requirePerm } from "#api/authorize.js";
import { apiError, apiSuccess, handleError } from "#api/error.js";
import { isParseError, parseBody } from "#api/parse.js";
import { OptionsRepository } from "#db/repositories/options.js";

export const prerender = false;

/** Hook name format: namespace:action (e.g., "content:beforeSave") */
const HOOK_NAME_RE = /^[a-z]+:[a-zA-Z]+$/;

const setSelectionSchema = z.object({
	pluginId: z.string().min(1).nullable(),
});

export const PUT: APIRoute = async ({ params, request, locals }) => {
	const { emdash, user } = locals;

	if (!emdash?.db) {
		return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	}

	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;

	const hookName = params.hookName;
	if (!hookName) {
		return apiError("VALIDATION_ERROR", "Hook name is required", 400);
	}

	// Validate hook name format: must be namespace:action (e.g., "content:beforeSave")
	if (!HOOK_NAME_RE.test(hookName)) {
		return apiError("VALIDATION_ERROR", "Invalid hook name format", 400);
	}

	try {
		const pipeline = emdash.hooks;

		// Verify this is actually an exclusive hook
		if (!pipeline.isExclusiveHook(hookName)) {
			return apiError("NOT_FOUND", `Hook '${hookName}' is not a registered exclusive hook`, 404);
		}

		const body = await parseBody(request, setSelectionSchema);
		if (isParseError(body)) return body;

		const optionsRepo = new OptionsRepository(emdash.db);
		const optionKey = `emdash:exclusive_hook:${hookName}`;

		if (body.pluginId === null) {
			// Clear the selection
			await optionsRepo.delete(optionKey);
			pipeline.clearExclusiveSelection(hookName);
		} else {
			// Validate that the pluginId is an actual provider for this hook
			const providers = pipeline.getExclusiveHookProviders(hookName);
			const isValidProvider = providers.some(
				(p: { pluginId: string }) => p.pluginId === body.pluginId,
			);
			if (!isValidProvider) {
				return apiError(
					"VALIDATION_ERROR",
					`Plugin '${body.pluginId}' is not a provider for hook '${hookName}'`,
					400,
				);
			}

			await optionsRepo.set(optionKey, body.pluginId);
			pipeline.setExclusiveSelection(hookName, body.pluginId);
		}

		return apiSuccess({
			hookName,
			selectedPluginId: body.pluginId,
		});
	} catch (error) {
		return handleError(error, "Failed to set exclusive hook selection", "EXCLUSIVE_HOOK_SET_ERROR");
	}
};

```

File: /Users/masonjames/Projects/emdash/packages/core/src/cli/commands/publish.ts
```ts
/**
 * emdash plugin publish
 *
 * Publishes a plugin tarball to the EmDash Marketplace.
 *
 * Flow:
 * 1. Resolve tarball (from --tarball path, or build via `emdash plugin bundle`)
 * 2. Read manifest.json from tarball to show summary
 * 3. Authenticate (stored credential or GitHub device flow)
 * 4. Pre-publish validation (check plugin exists, version not published)
 * 5. Upload via multipart POST
 * 6. Display audit results
 */

import { readFile, stat } from "node:fs/promises";
import { resolve, basename } from "node:path";

import { defineCommand } from "citty";
import consola from "consola";
import { createGzipDecoder, unpackTar } from "modern-tar";
import pc from "picocolors";

import { pluginManifestSchema } from "../../plugins/manifest-schema.js";
import {
	getMarketplaceCredential,
	saveMarketplaceCredential,
	removeMarketplaceCredential,
} from "../credentials.js";

const DEFAULT_REGISTRY = "https://marketplace.emdashcms.com";

// ── GitHub Device Flow ──────────────────────────────────────────

interface DeviceCodeResponse {
	device_code: string;
	user_code: string;
	verification_uri: string;
	expires_in: number;
	interval: number;
}

interface GitHubTokenResponse {
	access_token?: string;
	token_type?: string;
	error?: string;
	error_description?: string;
	interval?: number;
}

interface MarketplaceAuthResponse {
	token: string;
	author: {
		id: string;
		name: string;
		avatarUrl: string;
	};
}

interface AuthDiscovery {
	github: {
		clientId: string;
		deviceAuthorizationEndpoint: string;
		tokenEndpoint: string;
	};
	marketplace: {
		deviceTokenEndpoint: string;
	};
}

/**
 * Authenticate with the marketplace via GitHub Device Flow.
 * Returns the marketplace JWT and author info.
 */
async function authenticateViaDeviceFlow(registryUrl: string): Promise<MarketplaceAuthResponse> {
	// Step 1: Fetch auth discovery to get GitHub client_id
	consola.start("Fetching auth configuration...");
	const discoveryRes = await fetch(new URL("/api/v1/auth/discovery", registryUrl));
	if (!discoveryRes.ok) {
		throw new Error(`Marketplace unreachable: ${discoveryRes.status} ${discoveryRes.statusText}`);
	}
	const discovery = (await discoveryRes.json()) as AuthDiscovery;

	// Step 2: Request device code from GitHub
	const deviceRes = await fetch(discovery.github.deviceAuthorizationEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			client_id: discovery.github.clientId,
			scope: "read:user user:email",
		}),
	});

	if (!deviceRes.ok) {
		throw new Error(`GitHub device flow failed: ${deviceRes.status}`);
	}

	const deviceCode = (await deviceRes.json()) as DeviceCodeResponse;

	// Step 3: Display instructions
	console.log();
	consola.info("Open your browser to:");
	console.log(`  ${pc.cyan(pc.bold(deviceCode.verification_uri))}`);
	console.log();
	consola.info(`Enter code: ${pc.yellow(pc.bold(deviceCode.user_code))}`);
	console.log();

	// Try to open browser
	try {
		const { execFile } = await import("node:child_process");
		if (process.platform === "darwin") {
			execFile("open", [deviceCode.verification_uri]);
		} else if (process.platform === "win32") {
			execFile("cmd", ["/c", "start", "", deviceCode.verification_uri]);
		} else {
			execFile("xdg-open", [deviceCode.verification_uri]);
		}
	} catch {
		// User can open manually
	}

	// Step 4: Poll GitHub for access token
	consola.start("Waiting for authorization...");
	const githubToken = await pollGitHubDeviceFlow(
		discovery.github.tokenEndpoint,
		discovery.github.clientId,
		deviceCode.device_code,
		deviceCode.interval,
		deviceCode.expires_in,
	);

	// Step 5: Exchange GitHub token for marketplace JWT
	consola.start("Authenticating with marketplace...");
	const deviceTokenUrl = new URL(discovery.marketplace.deviceTokenEndpoint, registryUrl);
	const authRes = await fetch(deviceTokenUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ access_token: githubToken }),
	});

	if (!authRes.ok) {
		const body = (await authRes.json().catch(() => ({}))) as { error?: string };
		throw new Error(`Marketplace auth failed: ${body.error ?? authRes.statusText}`);
	}

	return (await authRes.json()) as MarketplaceAuthResponse;
}

async function pollGitHubDeviceFlow(
	tokenEndpoint: string,
	clientId: string,
	deviceCode: string,
	interval: number,
	expiresIn: number,
): Promise<string> {
	const deadline = Date.now() + expiresIn * 1000;
	let currentInterval = interval;

	while (Date.now() < deadline) {
		await new Promise((r) => setTimeout(r, currentInterval * 1000));

		const res = await fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				client_id: clientId,
				device_code: deviceCode,
				grant_type: "urn:ietf:params:oauth:grant-type:device_code",
			}),
		});

		const body = (await res.json()) as GitHubTokenResponse;

		if (body.access_token) {
			return body.access_token;
		}

		if (body.error === "authorization_pending") continue;
		if (body.error === "slow_down") {
			currentInterval = body.interval ?? currentInterval + 5;
			continue;
		}
		if (body.error === "expired_token") {
			throw new Error("Device code expired. Please try again.");
		}
		if (body.error === "access_denied") {
			throw new Error("Authorization was denied.");
		}

		throw new Error(`GitHub token exchange failed: ${body.error ?? "unknown error"}`);
	}

	throw new Error("Device code expired (timeout). Please try again.");
}

// ── Tarball reading ─────────────────────────────────────────────

const manifestSummarySchema = pluginManifestSchema.pick({
	id: true,
	version: true,
	capabilities: true,
	allowedHosts: true,
});

type ManifestSummary = typeof manifestSummarySchema._zod.output;

/**
 * Read manifest.json from a tarball without fully extracting it.
 */
async function readManifestFromTarball(tarballPath: string): Promise<ManifestSummary> {
	const data = await readFile(tarballPath);
	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
			controller.close();
		},
	});

	const entries = await unpackTar(stream.pipeThrough(createGzipDecoder()), {
		filter: (header) => header.name === "manifest.json",
	});

	const manifest = entries.find((e) => e.header.name === "manifest.json");
	if (!manifest?.data) {
		throw new Error("Tarball does not contain manifest.json");
	}

	const content = new TextDecoder().decode(manifest.data);
	const parsed: unknown = JSON.parse(content);
	const result = manifestSummarySchema.safeParse(parsed);
	if (!result.success) {
		throw new Error(`Invalid manifest.json: ${result.error.message}`);
	}
	return result.data;
}

// ── Audit polling helpers ───────────────────────────────────────

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120_000; // 2 minutes

interface VersionStatusResponse {
	version: string;
	status: string;
	audit_verdict?: string | null;
	audit_id?: string | null;
	image_audit_verdict?: string | null;
}

/**
 * Poll the version endpoint until status leaves "pending" or timeout.
 * Returns the final version data, or null on timeout.
 */
async function pollVersionStatus(
	versionUrl: string,
	token: string,
): Promise<VersionStatusResponse | null> {
	const deadline = Date.now() + POLL_TIMEOUT_MS;

	while (Date.now() < deadline) {
		await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

		try {
			const res = await fetch(versionUrl, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!res.ok) continue;

			const data = (await res.json()) as VersionStatusResponse;
			if (data.status !== "pending") {
				return data;
			}
		} catch {
			// Network error — retry
		}
	}

	return null;
}

function displayAuditResults(version: VersionStatusResponse): void {
	const statusColor =
		version.status === "published" ? pc.green : version.status === "flagged" ? pc.yellow : pc.red;
	consola.info(`  Status: ${statusColor(version.status)}`);

	if (version.audit_verdict) {
		const verdictColor =
			version.audit_verdict === "pass"
				? pc.green
				: version.audit_verdict === "warn"
					? pc.yellow
					: pc.red;
		consola.info(`  Audit: ${verdictColor(version.audit_verdict)}`);
	}

	if (version.image_audit_verdict) {
		const verdictColor =
			version.image_audit_verdict === "pass"
				? pc.green
				: version.image_audit_verdict === "warn"
					? pc.yellow
					: pc.red;
		consola.info(`  Image audit: ${verdictColor(version.image_audit_verdict)}`);
	}
}

function displayInlineAuditResults(
	audit: {
		verdict: string;
		riskScore: number;
		summary: string;
		findings: { category: string; severity: string; description: string }[];
	},
	imageAudit: { verdict: string } | null,
): void {
	const verdictColor =
		audit.verdict === "pass" ? pc.green : audit.verdict === "warn" ? pc.yellow : pc.red;
	consola.info(`  Audit: ${verdictColor(audit.verdict)} (risk: ${audit.riskScore}/100)`);
	if (audit.findings.length > 0) {
		for (const finding of audit.findings) {
			const icon = finding.severity === "high" ? pc.red("!") : pc.yellow("~");
			consola.info(`    ${icon} [${finding.category}] ${finding.description}`);
		}
	}

	if (imageAudit) {
		const imgColor =
			imageAudit.verdict === "pass" ? pc.green : imageAudit.verdict === "warn" ? pc.yellow : pc.red;
		consola.info(`  Image audit: ${imgColor(imageAudit.verdict)}`);
	}
}

// ── Publish command ─────────────────────────────────────────────

export const publishCommand = defineCommand({
	meta: {
		name: "publish",
		description: "Publish a plugin to the EmDash Marketplace",
	},
	args: {
		tarball: {
			type: "string",
			description: "Path to plugin tarball (default: build first via `emdash plugin bundle`)",
		},
		dir: {
			type: "string",
			description: "Plugin directory (used with --build, default: current directory)",
			default: process.cwd(),
		},
		build: {
			type: "boolean",
			description: "Build the plugin before publishing",
			default: false,
		},
		registry: {
			type: "string",
			description: "Marketplace registry URL",
			default: DEFAULT_REGISTRY,
		},
		"no-wait": {
			type: "boolean",
			description: "Exit immediately after upload without waiting for audit (useful for CI)",
			default: false,
		},
	},
	async run({ args }) {
		const registryUrl = args.registry;

		// ── Step 1: Resolve tarball ──

		let tarballPath: string;

		if (args.tarball) {
			tarballPath = resolve(args.tarball);
		} else if (args.build) {
			// Build first, then find the output tarball
			consola.start("Building plugin...");
			const pluginDir = resolve(args.dir);
			try {
				const { runCommand } = await import("citty");
				const { bundleCommand } = await import("./bundle.js");
				await runCommand(bundleCommand, {
					rawArgs: ["--dir", pluginDir],
				});
			} catch {
				consola.error("Build failed");
				process.exit(1);
			}

			// Find the tarball in dist/
			const { readdir } = await import("node:fs/promises");
			const distDir = resolve(pluginDir, "dist");
			const files = await readdir(distDir);
			const tarball = files.find((f) => f.endsWith(".tar.gz"));
			if (!tarball) {
				consola.error("Build succeeded but no .tar.gz found in dist/");
				process.exit(1);
			}
			tarballPath = resolve(distDir, tarball);
		} else {
			// Look for an existing tarball in dist/
			const pluginDir = resolve(args.dir);
			const { readdir } = await import("node:fs/promises");
			try {
				const distDir = resolve(pluginDir, "dist");
				const files = await readdir(distDir);
				const tarball = files.find((f) => f.endsWith(".tar.gz"));
				if (tarball) {
					tarballPath = resolve(distDir, tarball);
				} else {
					consola.error("No tarball found. Run `emdash plugin bundle` first or use --build.");
					process.exit(1);
				}
			} catch {
				consola.error("No dist/ directory found. Run `emdash plugin bundle` first or use --build.");
				process.exit(1);
			}
		}

		const tarballStat = await stat(tarballPath);
		const sizeKB = (tarballStat.size / 1024).toFixed(1);
		consola.info(`Tarball: ${pc.dim(tarballPath)} (${sizeKB}KB)`);

		// ── Step 2: Read manifest from tarball ──

		const manifest = await readManifestFromTarball(tarballPath);
		console.log();
		consola.info(`Plugin: ${pc.bold(`${manifest.id}@${manifest.version}`)}`);
		if (manifest.capabilities.length > 0) {
			consola.info(`Capabilities: ${manifest.capabilities.join(", ")}`);
		}
		if (manifest.allowedHosts?.length) {
			consola.info(`Allowed hosts: ${manifest.allowedHosts.join(", ")}`);
		}
		console.log();

		// ── Step 3: Authenticate ──
		//
		// Priority: EMDASH_MARKETPLACE_TOKEN env var > stored credential > interactive device flow.
		// The env var enables CI pipelines (including seed token auth) without interactive login.

		let token: string;
		const envToken = process.env.EMDASH_MARKETPLACE_TOKEN;
		const stored = !envToken ? getMarketplaceCredential(registryUrl) : null;

		if (envToken) {
			token = envToken;
			consola.info("Using EMDASH_MARKETPLACE_TOKEN for authentication");
		} else if (stored) {
			token = stored.token;
			consola.info(`Authenticated as ${pc.bold(stored.author?.name ?? "unknown")}`);
		} else {
			consola.info("Not logged in to marketplace. Starting GitHub authentication...");
			const result = await authenticateViaDeviceFlow(registryUrl);
			token = result.token;

			// Save for next time
			saveMarketplaceCredential(registryUrl, {
				token: result.token,
				expiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(), // 30 days
				author: { id: result.author.id, name: result.author.name },
			});

			consola.success(`Authenticated as ${pc.bold(result.author.name)}`);
		}

		// ── Step 4: Pre-publish validation ──

		consola.start("Checking marketplace...");

		// Check if plugin exists
		const pluginRes = await fetch(new URL(`/api/v1/plugins/${manifest.id}`, registryUrl));

		if (pluginRes.status === 404 && !envToken) {
			// Plugin doesn't exist — register it first.
			// When using env token (seed), the server auto-registers on publish.
			consola.info(`Plugin ${pc.bold(manifest.id)} not found in marketplace. Registering...`);

			const createRes = await fetch(new URL("/api/v1/plugins", registryUrl), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id: manifest.id,
					name: manifest.id, // Use ID as name initially
					capabilities: manifest.capabilities,
				}),
			});

			if (!createRes.ok) {
				const body = (await createRes.json().catch(() => ({}))) as { error?: string };
				if (createRes.status === 401) {
					// Token expired — clear and retry
					removeMarketplaceCredential(registryUrl);
					consola.error(
						"Authentication expired. Please run `emdash plugin publish` again to re-authenticate.",
					);
					process.exit(1);
				}
				consola.error(`Failed to register plugin: ${body.error ?? createRes.statusText}`);
				process.exit(1);
			}

			consola.success(`Registered ${pc.bold(manifest.id)}`);
		} else if (pluginRes.status === 404 && envToken) {
			// Using env token — server handles auto-registration on publish
			consola.info(`Plugin ${pc.bold(manifest.id)} will be auto-registered on publish`);
		} else if (!pluginRes.ok) {
			consola.error(`Marketplace error: ${pluginRes.status}`);
			process.exit(1);
		}

		// ── Step 5: Upload ──

		consola.start(`Publishing ${manifest.id}@${manifest.version}...`);

		const tarballData = await readFile(tarballPath);
		const formData = new FormData();
		formData.append(
			"bundle",
			new Blob([tarballData], { type: "application/gzip" }),
			basename(tarballPath),
		);

		const uploadUrl = new URL(`/api/v1/plugins/${manifest.id}/versions`, registryUrl);
		const uploadRes = await fetch(uploadUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (!uploadRes.ok && uploadRes.status !== 202) {
			const body = (await uploadRes.json().catch(() => ({}))) as {
				error?: string;
				latestVersion?: string;
				audit?: { verdict: string; summary: string; findings: unknown[] };
			};

			if (uploadRes.status === 401) {
				if (envToken) {
					consola.error("EMDASH_MARKETPLACE_TOKEN was rejected by the marketplace.");
				} else {
					removeMarketplaceCredential(registryUrl);
					consola.error("Authentication expired. Please run `emdash plugin publish` again.");
				}
				process.exit(1);
			}

			if (uploadRes.status === 409) {
				if (body.latestVersion) {
					consola.error(`Version ${manifest.version} must be greater than ${body.latestVersion}`);
				} else {
					consola.error(body.error ?? "Version conflict");
				}
				process.exit(1);
			}

			if (uploadRes.status === 422 && body.audit) {
				// Failed security audit
				consola.error("Plugin failed security audit:");
				consola.error(`  Verdict: ${pc.red(body.audit.verdict)}`);
				consola.error(`  Summary: ${body.audit.summary}`);
				process.exit(1);
			}

			consola.error(`Publish failed: ${body.error ?? uploadRes.statusText}`);
			process.exit(1);
		}

		// ── Step 6: Handle response ──

		const result = (await uploadRes.json()) as {
			version: string;
			bundleSize: number;
			checksum: string;
			publishedAt: string;
			status?: string;
			workflowId?: string;
			audit?: {
				verdict: string;
				riskScore: number;
				summary: string;
				findings: { category: string; severity: string; description: string }[];
			};
			imageAudit?: {
				verdict: string;
			} | null;
		};

		console.log();
		consola.success(`Uploaded ${pc.bold(`${manifest.id}@${result.version}`)}`);
		consola.info(`  Checksum: ${pc.dim(result.checksum)}`);
		consola.info(`  Size: ${(result.bundleSize / 1024).toFixed(1)}KB`);

		// Async audit flow (202 Accepted)
		if (uploadRes.status === 202) {
			consola.info(`  Status: ${pc.yellow("pending")} (audit running in background)`);

			if (args["no-wait"]) {
				consola.info("Skipping audit wait (--no-wait). Check status later.");
				console.log();
				return;
			}

			// Poll version endpoint for audit completion
			consola.start("Waiting for security audit to complete...");
			const versionUrl = new URL(
				`/api/v1/plugins/${manifest.id}/versions/${manifest.version}`,
				registryUrl,
			);
			const finalStatus = await pollVersionStatus(versionUrl.toString(), token);

			if (finalStatus) {
				displayAuditResults(finalStatus);
			} else {
				consola.warn("Audit did not complete within timeout. Check status later with:");
				consola.info(`  ${pc.dim(`curl ${versionUrl.toString()}`)}`);
			}
		} else {
			// Synchronous response (201 or legacy)
			if (result.audit) {
				displayInlineAuditResults(result.audit, result.imageAudit ?? null);
			}
			consola.info(`  Status: ${pc.green(result.status ?? "published")}`);
		}

		console.log();
	},
});

// ── Marketplace auth subcommands ────────────────────────────────

export const marketplaceLoginCommand = defineCommand({
	meta: {
		name: "login",
		description: "Log in to the EmDash Marketplace via GitHub",
	},
	args: {
		registry: {
			type: "string",
			description: "Marketplace registry URL",
			default: DEFAULT_REGISTRY,
		},
	},
	async run({ args }) {
		const registryUrl = args.registry;

		const existing = getMarketplaceCredential(registryUrl);
		if (existing) {
			consola.info(`Already logged in as ${pc.bold(existing.author?.name ?? "unknown")}`);
			consola.info("Use `emdash plugin logout` to log out first.");
			return;
		}

		const result = await authenticateViaDeviceFlow(registryUrl);

		saveMarketplaceCredential(registryUrl, {
			token: result.token,
			expiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
			author: { id: result.author.id, name: result.author.name },
		});

		consola.success(`Logged in as ${pc.bold(result.author.name)}`);
	},
});

export const marketplaceLogoutCommand = defineCommand({
	meta: {
		name: "logout",
		description: "Log out of the EmDash Marketplace",
	},
	args: {
		registry: {
			type: "string",
			description: "Marketplace registry URL",
			default: DEFAULT_REGISTRY,
		},
	},
	async run({ args }) {
		const removed = removeMarketplaceCredential(args.registry);
		if (removed) {
			consola.success("Logged out of marketplace.");
		} else {
			consola.info("No marketplace credentials found.");
		}
	},
});

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/adapt-sandbox-entry.ts
```ts
/**
 * In-Process Adapter for Standard-Format Plugins
 *
 * Converts a standard plugin definition ({ hooks, routes }) into a
 * ResolvedPlugin compatible with HookPipeline. This allows standard-format
 * plugins to run in-process when placed in the `plugins: []` config array.
 *
 * The adapter wraps each hook and route handler so that the PluginContextFactory
 * provides the same capability-gated context as the native path.
 *
 */

import type { PluginDescriptor } from "../astro/integration/runtime.js";
import { PLUGIN_CAPABILITIES, HOOK_NAMES } from "./manifest-schema.js";
import type {
	StandardPluginDefinition,
	StandardHookEntry,
	StandardHookHandler,
	ResolvedPlugin,
	ResolvedPluginHooks,
	ResolvedHook,
	PluginRoute,
	PluginCapability,
	PluginStorageConfig,
	PluginAdminConfig,
} from "./types.js";

/**
 * Default hook configuration values
 */
const DEFAULT_PRIORITY = 100;
const DEFAULT_TIMEOUT = 5000;
const DEFAULT_ERROR_POLICY = "abort" as const;

/**
 * Check if a standard hook entry is a config object (has a `handler` property)
 */
function isHookConfig(
	entry: StandardHookEntry,
): entry is Exclude<StandardHookEntry, StandardHookHandler> {
	return typeof entry === "object" && entry !== null && "handler" in entry;
}

/**
 * Resolve a single standard hook entry to a ResolvedHook.
 *
 * Standard-format hooks use the sandbox entry convention:
 *   handler(event, ctx) -- two args
 *
 * The HookPipeline dispatch methods also call handlers with (event, ctx),
 * so the handler is compatible as-is. We just need to wrap it for type safety.
 */
function resolveStandardHook(
	entry: StandardHookEntry,
	pluginId: string,
): ResolvedHook<StandardHookHandler> {
	if (isHookConfig(entry)) {
		return {
			priority: entry.priority ?? DEFAULT_PRIORITY,
			timeout: entry.timeout ?? DEFAULT_TIMEOUT,
			dependencies: entry.dependencies ?? [],
			errorPolicy: entry.errorPolicy ?? DEFAULT_ERROR_POLICY,
			exclusive: entry.exclusive ?? false,
			handler: entry.handler,
			pluginId,
		};
	}

	// Bare function handler
	return {
		priority: DEFAULT_PRIORITY,
		timeout: DEFAULT_TIMEOUT,
		dependencies: [],
		errorPolicy: DEFAULT_ERROR_POLICY,
		exclusive: false,
		handler: entry,
		pluginId,
	};
}

const VALID_CAPABILITIES_SET = new Set<string>(PLUGIN_CAPABILITIES);

const VALID_HOOK_NAMES_SET = new Set<string>(HOOK_NAMES);

/**
 * Adapt a standard-format plugin definition into a ResolvedPlugin.
 *
 * This is the core of the unified plugin format. It takes the `{ hooks, routes }`
 * export from a standard plugin and produces a ResolvedPlugin that can enter the
 * HookPipeline alongside native plugins.
 *
 * @param definition - The standard plugin definition (from definePlugin() or raw export)
 * @param descriptor - The plugin descriptor with id, version, capabilities, etc.
 * @returns A ResolvedPlugin compatible with HookPipeline
 */
export function adaptSandboxEntry(
	definition: StandardPluginDefinition,
	descriptor: PluginDescriptor,
): ResolvedPlugin {
	const pluginId = descriptor.id;
	const version = descriptor.version;

	// Resolve hooks
	const resolvedHooks: ResolvedPluginHooks = {};
	if (definition.hooks) {
		for (const [hookName, entry] of Object.entries(definition.hooks)) {
			if (!VALID_HOOK_NAMES_SET.has(hookName)) {
				throw new Error(
					`Plugin "${pluginId}" declares unknown hook "${hookName}". ` +
						`Valid hooks: ${[...VALID_HOOK_NAMES_SET].join(", ")}`,
				);
			}
			// The resolved hook has the correct handler type for the hook name.
			// We store it as the generic type and let HookPipeline's typed dispatch
			// methods handle the type narrowing at call time.
			// eslint-disable-next-line typescript-eslint/no-unsafe-type-assertion -- bridging untyped map to typed interface
			(resolvedHooks as Record<string, unknown>)[hookName] = resolveStandardHook(entry, pluginId);
		}
	}

	// Resolve routes: standard format uses (routeCtx, pluginCtx) two-arg pattern.
	// Native format uses (ctx: RouteContext) single-arg pattern where RouteContext
	// extends PluginContext with { input, request, requestMeta }.
	// We wrap standard route handlers to merge the two args into one.
	const resolvedRoutes: Record<string, PluginRoute> = {};
	if (definition.routes) {
		for (const [routeName, routeEntry] of Object.entries(definition.routes)) {
			const standardHandler = routeEntry.handler;
			resolvedRoutes[routeName] = {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- StandardRouteEntry.input is intentionally loosely typed; callers validate at runtime
				input: routeEntry.input as PluginRoute["input"],
				public: routeEntry.public,
				handler: async (ctx) => {
					// Build the routeCtx shape that standard handlers expect
					const routeCtx = {
						input: ctx.input,
						request: ctx.request,
						requestMeta: ctx.requestMeta,
					};
					// Pass only the PluginContext portion (without input/request/requestMeta)
					// to match what sandboxed handlers receive.
					const { input: _, request: __, requestMeta: ___, ...pluginCtx } = ctx;
					return standardHandler(routeCtx, pluginCtx);
				},
			};
		}
	}

	// Build capabilities from descriptor.
	// Validate against the known set (same as defineNativePlugin).
	const rawCapabilities = descriptor.capabilities ?? [];
	for (const cap of rawCapabilities) {
		if (!VALID_CAPABILITIES_SET.has(cap)) {
			throw new Error(
				`Invalid capability "${cap}" in plugin "${pluginId}". ` +
					`Valid capabilities: ${[...VALID_CAPABILITIES_SET].join(", ")}`,
			);
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- validated against VALID_CAPABILITIES_SET above; descriptor uses string[] for flexibility
	const capabilities = [...rawCapabilities] as PluginCapability[];
	const allowedHosts = descriptor.allowedHosts ?? [];

	// Capability implications: broader capabilities imply narrower ones
	// (mirrors the normalization in define-plugin.ts for native format)
	if (capabilities.includes("write:content") && !capabilities.includes("read:content")) {
		capabilities.push("read:content");
	}
	if (capabilities.includes("write:media") && !capabilities.includes("read:media")) {
		capabilities.push("read:media");
	}
	if (capabilities.includes("network:fetch:any") && !capabilities.includes("network:fetch")) {
		capabilities.push("network:fetch");
	}

	// Build storage config from descriptor.
	// StorageCollectionDeclaration uses optional indexes, but PluginStorageConfig
	// requires them. Ensure every collection has an indexes array.
	const rawStorage = descriptor.storage ?? {};
	const storage: PluginStorageConfig = {};
	for (const [name, config] of Object.entries(rawStorage)) {
		storage[name] = {
			indexes: config.indexes ?? [],
			uniqueIndexes: config.uniqueIndexes,
		};
	}

	// Build admin config from descriptor
	const admin: PluginAdminConfig = {};
	if (descriptor.adminPages) {
		admin.pages = descriptor.adminPages;
	}
	if (descriptor.adminWidgets) {
		admin.widgets = descriptor.adminWidgets;
	}

	return {
		id: pluginId,
		version,
		capabilities,
		allowedHosts,
		storage,
		hooks: resolvedHooks,
		routes: resolvedRoutes,
		admin,
	};
}

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/installing.mdx
```mdx
---
title: Installing Plugins
description: Install plugins from the EmDash Marketplace or add them from code.
---

import { Aside, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

EmDash plugins can be installed in two ways: from the marketplace via the admin dashboard, or added directly in your Astro configuration. Marketplace plugins run in an isolated sandbox; config-based plugins run in-process.

## From the Marketplace

The admin dashboard includes a marketplace browser where you can search, install, and manage plugins.

### Prerequisites

To install marketplace plugins, your site needs:

1. **Sandbox runner configured** — Marketplace plugins run in isolated V8 workers, which requires the sandbox runtime:

   ```typescript title="astro.config.mjs"
   import { emdash } from "emdash/astro";

   export default defineConfig({
     integrations: [
       emdash({
         marketplace: "https://marketplace.emdashcms.com",
         sandboxRunner: true,
       }),
     ],
   });
   ```

2. **Admin access** — Only administrators can install or remove plugins.

### Browse and Install

<Steps>
1. Open the admin panel and navigate to **Plugins > Marketplace**
2. Browse or search for a plugin
3. Click the plugin card to see its detail page — README, screenshots, capabilities, and security audit results
4. Click **Install**
5. Review the capability consent dialog — this shows what the plugin will be able to access
6. Confirm the installation
</Steps>

The plugin will be downloaded, stored in your site's R2 bucket, and loaded into the sandbox runner. It's active immediately.

### Capability Consent

Before installation, you'll see a dialog listing what the plugin needs access to:

| Capability | What it means |
| ---------- | ------------- |
| `read:content` | Read your content |
| `write:content` | Create, update, and delete content |
| `read:media` | Access your media library |
| `write:media` | Upload and manage media |
| `network:fetch` | Make network requests to specific hosts |

<Aside type="caution">
  Only install plugins from authors you trust. The capability system limits what a sandboxed plugin can access, but a plugin with `write:content` can modify any content on your site.
</Aside>

### Security Audit

Every plugin version in the marketplace has been through an automated security audit. The audit verdict appears on the plugin card:

- **Pass** — No issues found
- **Warn** — Minor concerns flagged (review the findings)
- **Fail** — Significant security issues detected

You can view the full audit report on the plugin's detail page, including individual findings and their severity.

### Updates

When a newer version of an installed plugin is available:

1. Go to **Plugins** in the admin panel
2. Marketplace plugins show an **Update available** badge
3. Click **Update** to see the changelog and any capability changes
4. If the new version requires additional capabilities, you'll see a diff and need to approve
5. Confirm to update

<Aside type="note">
  Updates that add new capabilities require explicit approval. If a plugin that previously only read content now wants to make network requests, you'll see the new capability highlighted before confirming.
</Aside>

### Uninstalling

1. Go to **Plugins** in the admin panel
2. Click the marketplace plugin you want to remove
3. Click **Uninstall**
4. Choose whether to keep or delete the plugin's stored data
5. Confirm

The plugin's sandbox code is removed from your R2 bucket and it stops running immediately.

## From Configuration

For trusted plugins (your own code, or packages you install via npm), add them directly to your Astro config:

```typescript title="astro.config.mjs"
import { defineConfig } from "astro/config";
import { emdash } from "emdash/astro";
import seoPlugin from "@emdash-cms/plugin-seo";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [
        seoPlugin({ generateSitemap: true }),
      ],
    }),
  ],
});
```

Config-based plugins:

- Run in-process (not sandboxed)
- Have full access to Node.js APIs
- Are loaded at build time and on every server start
- Cannot be installed or removed from the admin UI

<Aside type="tip">
  Use config-based plugins for first-party code and plugins you maintain yourself. Use marketplace plugins for third-party extensions where sandbox isolation provides security benefits.
</Aside>

## Marketplace vs. Config: When to Use Which

| | Marketplace | Config |
| --- | --- | --- |
| **Execution** | Sandboxed V8 isolate | In-process |
| **Install method** | Admin UI | Code change + deploy |
| **Capabilities** | Enforced at runtime | Documentation only |
| **Node.js APIs** | Not available | Full access |
| **Best for** | Third-party plugins | First-party code |
| **Updates** | One-click in admin | Version bump + deploy |

```

File: /Users/masonjames/Projects/emdash/packages/core/src/astro/integration/index.ts
```ts
/**
 * EmDash Astro Integration
 *
 * This integration:
 * - Injects the admin shell route at /_emdash/admin/[...path].astro
 * - Sets up REST API endpoints under /_emdash/api/*
 * - Configures middleware to provide database and manifest
 *
 * NOTE: This file is for build-time only. Runtime utilities are in runtime.ts
 * to avoid bundling Node.js-only code into the production build.
 */

import type { AstroIntegration, AstroIntegrationLogger } from "astro";

import type { ResolvedPlugin } from "../../plugins/types.js";
import { local } from "../storage/adapters.js";
import { injectCoreRoutes, injectBuiltinAuthRoutes, injectMcpRoute } from "./routes.js";
import type { EmDashConfig, PluginDescriptor } from "./runtime.js";
import { createViteConfig } from "./vite-config.js";

// Re-export runtime types and functions
export type {
	EmDashConfig,
	PluginDescriptor,
	SandboxedPluginDescriptor,
	ResolvedPlugin,
} from "./runtime.js";
export { getStoredConfig } from "./runtime.js";

/** Default storage: Local filesystem in .emdash directory */
const DEFAULT_STORAGE = local({
	directory: "./.emdash/uploads",
	baseUrl: "/_emdash/api/media/file",
});

// Terminal formatting
const dim = (s: string) => `\x1b[2m${s}\x1b[22m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[22m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[39m`;

/** Print the EmDash startup banner */
function printBanner(_logger: AstroIntegrationLogger): void {
	const banner = `

  ${bold(cyan("— E M D A S H —"))}
   `;
	console.log(banner);
}

/** Print route injection summary */
function printRoutesSummary(_logger: AstroIntegrationLogger): void {
	console.log(`\n  ${dim("›")} Admin UI    ${cyan("/_emdash/admin")}`);
	console.log(`  ${dim("›")} API         ${cyan("/_emdash/api/*")}`);
	console.log("");
}

/**
 * Create the EmDash Astro integration
 */
export function emdash(config: EmDashConfig = {}): AstroIntegration {
	// Apply defaults
	const resolvedConfig: EmDashConfig = {
		...config,
		storage: config.storage ?? DEFAULT_STORAGE,
	};

	// Validate marketplace URL
	if (resolvedConfig.marketplace) {
		const url = resolvedConfig.marketplace;
		try {
			const parsed = new URL(url);
			const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
			if (parsed.protocol !== "https:" && !isLocalhost) {
				throw new Error(
					`Marketplace URL must use HTTPS (got ${parsed.protocol}). ` +
						`Only localhost URLs are allowed over HTTP.`,
				);
			}
		} catch (e) {
			if (e instanceof TypeError) {
				throw new Error(`Invalid marketplace URL: "${url}"`, { cause: e });
			}
			throw e;
		}
		if (!resolvedConfig.sandboxRunner) {
			throw new Error(
				"Marketplace requires `sandboxRunner` to be configured. " +
					"Marketplace plugins run in sandboxed V8 isolates.",
			);
		}
	}

	// Plugin descriptors from config
	const pluginDescriptors = resolvedConfig.plugins ?? [];
	const sandboxedDescriptors = resolvedConfig.sandboxed ?? [];

	// Validate all plugin descriptors
	for (const descriptor of [...pluginDescriptors, ...sandboxedDescriptors]) {
		// Standard-format plugins can't use features that require trusted mode
		if (descriptor.format === "standard") {
			if (descriptor.adminEntry) {
				throw new Error(
					`Plugin "${descriptor.id}" is standard format but declares adminEntry. ` +
						`Standard plugins use Block Kit for admin UI, not React components. ` +
						`Remove adminEntry or change format to "native".`,
				);
			}
			if (descriptor.componentsEntry) {
				throw new Error(
					`Plugin "${descriptor.id}" is standard format but declares componentsEntry. ` +
						`Portable Text block components require native format. ` +
						`Remove componentsEntry or change format to "native".`,
				);
			}
		}
	}

	// Validate: non-standard plugins cannot be placed in sandboxed: []
	for (const descriptor of sandboxedDescriptors) {
		if (descriptor.format !== "standard") {
			throw new Error(
				`Plugin "${descriptor.id}" uses the native format and cannot be placed in ` +
					`\`sandboxed: []\`. Native plugins can only run in \`plugins: []\`. ` +
					`To sandbox this plugin, convert it to the standard format.`,
			);
		}
	}

	// Resolved plugins (populated at build time by importing entrypoints)
	let _resolvedPlugins: ResolvedPlugin[] = [];

	// Serialize config for virtual module (database/storage/auth - plugins handled separately)
	// i18n is populated in astro:config:setup from astroConfig.i18n
	const serializableConfig: Record<string, unknown> = {
		database: resolvedConfig.database,
		storage: resolvedConfig.storage,
		auth: resolvedConfig.auth,
		marketplace: resolvedConfig.marketplace,
	};

	// Determine auth mode for route injection
	// Check if auth is an AuthDescriptor (has entrypoint) indicating external auth
	const useExternalAuth = !!(resolvedConfig.auth && "entrypoint" in resolvedConfig.auth);

	return {
		name: "emdash",
		hooks: {
			"astro:config:setup": ({
				injectRoute,
				addMiddleware,
				logger,
				updateConfig,
				config: astroConfig,
				command,
			}) => {
				printBanner(logger);
				// Extract i18n config from Astro config
				// Astro locales can be strings OR { path, codes } objects — normalize to paths
				if (astroConfig.i18n) {
					const routing = astroConfig.i18n.routing;
					serializableConfig.i18n = {
						defaultLocale: astroConfig.i18n.defaultLocale,
						locales: astroConfig.i18n.locales.map((l) => (typeof l === "string" ? l : l.path)),
						fallback: astroConfig.i18n.fallback,
						prefixDefaultLocale:
							typeof routing === "object" ? (routing.prefixDefaultLocale ?? false) : false,
					};
				}

				// Update Vite config with virtual modules and other settings
				updateConfig({
					vite: createViteConfig(
						{
							serializableConfig,
							resolvedConfig,
							pluginDescriptors,
							astroConfig,
						},
						command,
					),
				});

				// Inject all core routes
				injectCoreRoutes(injectRoute);

				// Only inject passkey/oauth/magic-link routes when NOT using external auth
				if (!useExternalAuth) {
					injectBuiltinAuthRoutes(injectRoute);
				}

				// Inject MCP endpoint when enabled
				if (resolvedConfig.mcp) {
					injectMcpRoute(injectRoute);
					logger.info("MCP server enabled at /_emdash/api/mcp");
				}

				// In playground mode, inject the playground middleware FIRST.
				// It sets up a per-session DO database in ALS before anything
				// else runs, so the runtime init middleware sees a real DB.
				if (resolvedConfig.playground) {
					addMiddleware({
						entrypoint: resolvedConfig.playground.middlewareEntrypoint,
						order: "pre",
					});
				}

				// Add middleware to provide database and manifest
				addMiddleware({
					entrypoint: "emdash/middleware",
					order: "pre",
				});

				// Add redirect middleware (runs after runtime init, before setup/auth)
				addMiddleware({
					entrypoint: "emdash/middleware/redirect",
					order: "pre",
				});

				// Skip setup and auth in playground mode -- the playground middleware
				// handles session creation and injects an anonymous admin user.
				if (!resolvedConfig.playground) {
					addMiddleware({
						entrypoint: "emdash/middleware/setup",
						order: "pre",
					});

					addMiddleware({
						entrypoint: "emdash/middleware/auth",
						order: "pre",
					});
				}

				// Add request context middleware (runs after auth, on ALL routes)
				// Sets up ALS-based context for query functions (edit mode, preview)
				addMiddleware({
					entrypoint: "emdash/middleware/request-context",
					order: "pre",
				});

				printRoutesSummary(logger);
			},
			"astro:server:setup": ({ server, logger }) => {
				// Generate types once the server is listening.
				// The endpoint returns the types content; we write the file here
				// (in Node) because workerd has no real filesystem access.
				server.httpServer?.once("listening", async () => {
					const { writeFile, readFile } = await import("node:fs/promises");
					const { resolve } = await import("node:path");

					const address = server.httpServer?.address();
					if (!address || typeof address === "string") return;

					const port = address.port;
					const typegenUrl = `http://localhost:${port}/_emdash/api/typegen`;
					const outputPath = resolve(process.cwd(), "emdash-env.d.ts");

					try {
						const response = await fetch(typegenUrl, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
						});

						if (!response.ok) {
							const body = await response.text().catch(() => "");
							logger.warn(`Typegen failed: ${response.status} ${body.slice(0, 200)}`);
							return;
						}

						const { data: result } = (await response.json()) as {
							data: {
								types: string;
								hash: string;
								collections: number;
							};
						};

						// Only write if content changed
						let needsWrite = true;
						try {
							const existing = await readFile(outputPath, "utf-8");
							if (existing === result.types) needsWrite = false;
						} catch {
							// File doesn't exist yet
						}

						if (needsWrite) {
							await writeFile(outputPath, result.types, "utf-8");
							logger.info(`Generated emdash-env.d.ts (${result.collections} collections)`);
						}
					} catch (error) {
						const msg = error instanceof Error ? error.message : String(error);
						logger.warn(`Typegen failed: ${msg}`);
					}
				});
			},
			"astro:build:done": ({ logger }) => {
				logger.info("Build complete");
			},
		},
	};
}

export default emdash;

```

File: /Users/masonjames/Projects/gravitysmtp/includes/connectors/config/class-connector-config.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Connectors\Config;

use Gravity_Forms\Gravity_SMTP\Apps\App_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Gravity_SMTP;
use Gravity_Forms\Gravity_Tools\Config;

class Connector_Config extends Config {

	protected $script_to_localize = 'gravitysmtp_scripts_admin';
	protected $name               = 'gravitysmtp_admin_config';
	protected $overwrite          = false;

	protected $fields;
	protected $logo;
	protected $full_logo;
	protected $title;
	protected $description;
	protected $short_name;
	protected $data;
	protected $i18n;

	public function set_data( $data ) {
		$this->fields      = $data['fields'];
		$this->short_name  = $data['name'];
		$this->logo        = $data['logo'];
		$this->full_logo   = $data['full_logo'];
		$this->title       = $data['title'];
		$this->description = $data['description'];
		$this->data        = $data['data'];
		$this->i18n        = $data['i18n'];
	}

	public function should_enqueue() {
		return is_admin();
	}

	/**
	 * Config data.
	 *
	 * @return array[]
	 */
	public function data() {
		$connector_data = array(
			'title'       => $this->title,
			'description' => $this->description,
			'id'          => $this->short_name,
			'logo'        => $this->logo,
			'full_logo'   => $this->full_logo,
			'settings'    => $this->fields,
			'data'        => $this->data,
			'i18n'        => $this->i18n,
		);

		$components = array(
			'settings' => array(
				'data' => array(
					'integrations' => array(
						$connector_data,
					),
				),
			),
			'tools'    => array(
				'data' => array(
					'integrations' => array(
						$connector_data,
					),
				),
			),
		);

		if ( $this->should_enqueue_setup_wizard() ) {
			$components['setup_wizard'] = array(
				'data' => array(
					'integrations' => array(
						$connector_data,
					),
				),
			);
		}

		return array(
			'components' => $components,
		);
	}

	private function should_enqueue_setup_wizard() {
		$should_enqueue = Gravity_SMTP::container()->get( App_Service_Provider::SHOULD_ENQUEUE_SETUP_WIZARD );
		return is_callable( $should_enqueue ) ? $should_enqueue() : $should_enqueue;
	}

}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/suppression/class-suppression-service-provider.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Suppression;

use Gravity_Forms\Gravity_SMTP\Models\Suppressed_Emails_Model;
use Gravity_Forms\Gravity_SMTP\Suppression\Config\Suppression_Settings_Config;
use Gravity_Forms\Gravity_SMTP\Suppression\Endpoints\Add_Suppressed_Emails_Endpoint;
use Gravity_Forms\Gravity_SMTP\Suppression\Endpoints\Get_Paginated_Items;
use Gravity_Forms\Gravity_SMTP\Suppression\Endpoints\Reactivate_Suppressed_Emails_Endpoint;
use Gravity_Forms\Gravity_Tools\Providers\Config_Service_Provider;
use Gravity_Forms\Gravity_Tools\Service_Container;

class Suppression_Service_Provider extends Config_Service_Provider {

	const SUPPRESSED_EMAILS_MODEL     = 'suppressed_emails_model';
	const SUPPRESSION_SETTINGS_CONFIG = 'suppression_settings_config';

	const GET_PAGINATED_ITEMS_ENDPOINT          = 'get_paginated_suppression_items_endpoint';
	const ADD_SUPPRESSED_EMAILS_ENDPOINT        = 'add_suppressed_emails_endpoint';
	const REACTIVATE_SUPPRESSED_EMAILS_ENDPOINT = 'reactivate_suppressed_emails_endpoint';

	protected $configs = array(
		self::SUPPRESSION_SETTINGS_CONFIG => Suppression_Settings_Config::class,
	);

	public function register( Service_Container $container ) {
		parent::register( $container );

		$this->container->add( self::SUPPRESSED_EMAILS_MODEL, function () {
			return new Suppressed_Emails_Model();
		} );

		$this->container->add( self::GET_PAGINATED_ITEMS_ENDPOINT, function () use ( $container ) {
			return new Get_Paginated_Items( $container->get( self::SUPPRESSED_EMAILS_MODEL ) );
		} );

		$this->container->add( self::ADD_SUPPRESSED_EMAILS_ENDPOINT, function () use ( $container ) {
			return new Add_Suppressed_Emails_Endpoint( $container->get( self::SUPPRESSED_EMAILS_MODEL ) );
		} );

		$this->container->add( self::REACTIVATE_SUPPRESSED_EMAILS_ENDPOINT, function () use ( $container ) {
			return new Reactivate_Suppressed_Emails_Endpoint( $container->get( self::SUPPRESSED_EMAILS_MODEL ) );
		} );
	}

	public function init( Service_Container $container ) {
		add_action( 'wp_ajax_' . Get_Paginated_Items::ACTION_NAME, function () use ( $container ) {
			$container->get( self::GET_PAGINATED_ITEMS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Add_Suppressed_Emails_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::ADD_SUPPRESSED_EMAILS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Reactivate_Suppressed_Emails_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::REACTIVATE_SUPPRESSED_EMAILS_ENDPOINT )->handle();
		} );
	}

}
```

File: /Users/masonjames/Projects/gravitysmtp/includes/email-management/config/class-managed-email-types-config.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Email_Management\Config;

use Gravity_Forms\Gravity_SMTP\Apps\App_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Save_Plugin_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Email_Management\Email_Management_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Gravity_SMTP;
use Gravity_Forms\Gravity_Tools\Config;
use Gravity_Forms\Gravity_Tools\License\License_Statuses;
use Gravity_Forms\Gravity_Tools\Updates\Updates_Service_Provider;
use Gravity_Forms\Gravity_Tools\Utils\Utils_Service_Provider;

class Managed_Email_Types_Config extends Config {

	protected $script_to_localize = 'gravitysmtp_scripts_admin';
	protected $name               = 'gravitysmtp_admin_config';

	public function should_enqueue() {
		$page = filter_input( INPUT_GET, 'page', FILTER_DEFAULT );

		return is_admin() && $page === 'gravitysmtp-settings';
	}

	public function data() {
		$container = Gravity_SMTP::container();
		$stopper = $container->get( Email_Management_Service_Provider::EMAIL_STOPPER );

		return array(
			'components' => array(
				'settings' => array(
					'data' => array(
						'managed_email_types' => $stopper->get_settings_info(),
					),
				),
			),
		);
	}

}

```

File: /Users/masonjames/Projects/emdash/packages/plugins/atproto/src/index.ts
```ts
/**
 * AT Protocol / standard.site Plugin for EmDash CMS
 *
 * Syndicates published content to the AT Protocol network using the
 * standard.site lexicons, with optional cross-posting to Bluesky.
 *
 * Features:
 * - Creates site.standard.publication record (one per site)
 * - Creates site.standard.document records on publish
 * - Optional Bluesky cross-post with link card
 * - Automatic <link rel="site.standard.document"> injection via page:metadata
 * - Sync status tracking in plugin storage
 *
 * Designed for sandboxed execution:
 * - All HTTP via ctx.http.fetch()
 * - Block Kit admin UI (no React components)
 * - Capabilities: read:content, network:fetch:any
 */

import type { PluginDescriptor } from "emdash";

// ── Descriptor ──────────────────────────────────────────────────

/**
 * Create the AT Protocol plugin descriptor.
 * Import this in your astro.config.mjs / live.config.ts.
 */
export function atprotoPlugin(): PluginDescriptor {
	return {
		id: "atproto",
		version: "0.1.0",
		format: "standard",
		entrypoint: "@emdash-cms/plugin-atproto/sandbox",
		capabilities: ["read:content", "network:fetch:any"],
		storage: {
			publications: { indexes: ["contentId", "platform", "publishedAt"] },
		},
		// Block Kit admin pages (no adminEntry needed -- sandboxed)
		adminPages: [{ path: "/status", label: "AT Protocol", icon: "globe" }],
		adminWidgets: [{ id: "sync-status", title: "AT Protocol", size: "third" }],
	};
}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/logging/config/class-logging-endpoints-config.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Logging\Config;

use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Delete_Debug_Logs_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Delete_Email_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Delete_Events_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Get_Email_Message_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Get_Paginated_Debug_Log_Items_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Get_Paginated_Items_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Log_Item_Endpoint;
use Gravity_Forms\Gravity_Tools\Config;

class Logging_Endpoints_Config extends Config {

	protected $script_to_localize = 'gravitysmtp_scripts_admin';
	protected $name               = 'gravitysmtp_admin_config';

	public function should_enqueue() {
		return is_admin();
	}

	public function data() {
		return array(
			'common' => array(
				'endpoints' => array(
					Delete_Email_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Delete_Email_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Delete_Email_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Delete_Events_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Delete_Events_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Delete_Events_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Get_Email_Message_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Get_Email_Message_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Get_Email_Message_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					'activity_log_page' => array(
						'action' => array(
							'value'   => Get_Paginated_Items_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Get_Paginated_Items_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					'debug_log_page' => array(
						'action' => array(
							'value'   => Get_Paginated_Debug_Log_Items_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Get_Paginated_Debug_Log_Items_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Delete_Debug_Logs_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Delete_Debug_Logs_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Delete_Debug_Logs_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Log_Item_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Log_Item_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Log_Item_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
				),
			),
		);
	}

}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/email-console.ts
```ts
/**
 * Dev Console Email Provider
 *
 * Built-in plugin that registers email:deliver as an exclusive hook.
 * Logs emails to console and stores them in memory (capped at 100).
 * Auto-activated when import.meta.env.DEV is true and no other provider is selected.
 *
 */

import type { EmailDeliverEvent, EmailMessage, PluginContext } from "./types.js";

/** Plugin ID for the dev console email provider */
export const DEV_CONSOLE_EMAIL_PLUGIN_ID = "emdash-console-email";

/** Maximum number of emails to keep in memory */
const MAX_STORED_EMAILS = 100;

/**
 * Stored email record (in-memory only)
 */
export interface StoredEmail {
	message: EmailMessage;
	source: string;
	sentAt: string;
}

/** In-memory store for dev emails */
const storedEmails: StoredEmail[] = [];

/**
 * Get all stored dev emails (most recent first).
 */
export function getDevEmails(): StoredEmail[] {
	return storedEmails.toReversed();
}

/**
 * Clear all stored dev emails.
 */
export function clearDevEmails(): void {
	storedEmails.length = 0;
}

/**
 * The email:deliver handler for the dev console provider.
 * Logs to console and stores in memory.
 */
export async function devConsoleEmailDeliver(
	event: EmailDeliverEvent,
	_ctx: PluginContext,
): Promise<void> {
	const { message, source } = event;

	console.log(
		`\n📧 [dev-email] Email sent\n` +
			`   From: ${source}\n` +
			`   To: ${message.to}\n` +
			`   Subject: ${message.subject}\n` +
			`   Text: ${message.text.slice(0, 200)}${message.text.length > 200 ? "..." : ""}\n`,
	);

	// Store the email
	storedEmails.push({
		message,
		source,
		sentAt: new Date().toISOString(),
	});

	// Cap at MAX_STORED_EMAILS
	while (storedEmails.length > MAX_STORED_EMAILS) {
		storedEmails.shift();
	}
}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/logging/class-logging-service-provider.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Logging;

use Gravity_Forms\Gravity_SMTP\Apps\App_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Apps\Config\Tools_Config;
use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Data_Store\Const_Data_Store;
use Gravity_Forms\Gravity_SMTP\Data_Store\Data_Store_Router;
use Gravity_Forms\Gravity_SMTP\Data_Store\Opts_Data_Store;
use Gravity_Forms\Gravity_SMTP\Data_Store\Plugin_Opts_Data_Store;
use Gravity_Forms\Gravity_SMTP\Handler\Mail_Handler;
use Gravity_Forms\Gravity_SMTP\Logging\Config\Logging_Endpoints_Config;
use Gravity_Forms\Gravity_SMTP\Logging\Debug\Debug_Log_Event_Handler;
use Gravity_Forms\Gravity_SMTP\Logging\Debug\Debug_Logger;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Delete_Debug_Logs_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Delete_Email_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Delete_Events_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Get_Email_Message_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Get_Paginated_Debug_Log_Items_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Get_Paginated_Items_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\Log_Item_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Endpoints\View_Log_Endpoint;
use Gravity_Forms\Gravity_SMTP\Logging\Log\Logger;
use Gravity_Forms\Gravity_SMTP\Logging\Log\WP_Mail_Logger;
use Gravity_Forms\Gravity_SMTP\Logging\Scheduling\Handler;
use Gravity_Forms\Gravity_SMTP\Utils\Attachments_Saver;
use Gravity_Forms\Gravity_Tools\Providers\Config_Service_Provider;
use Gravity_Forms\Gravity_Tools\Service_Container;
use Gravity_Forms\Gravity_Tools\Service_Provider;
use Gravity_Forms\Gravity_Tools\Utils\Utils_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Models\Debug_Log_Model;
use Gravity_Forms\Gravity_Tools\Logging\DB_Logging_Provider;
use Gravity_Forms\Gravity_Tools\Logging\Parsers\File_Log_Parser;

class Logging_Service_Provider extends Config_Service_Provider {

	const LOGGER                                 = 'logger';
	const WP_MAIL_LOGGER                         = 'wp_mail_logger';
	const GET_PAGINATED_ITEMS_ENDPOINT           = 'get_paginated_items_endpoint';
	const GET_PAGINATED_DEBUG_LOG_ITEMS_ENDPOINT = 'get_paginated_debug_log_items_endpoint';
	const DELETE_DEBUG_LOGS_ENDPOINT             = 'delete_debug_logs_endpoint';
	const DELETE_EMAIL_ENDPOINT                  = 'delete_email_endpoint';
	const DELETE_EVENTS_ENDPOINT                 = 'delete_events_endpoint';
	const GET_EMAIL_MESSAGE_ENDPOINT             = 'get_email_message_endpoint';
	const SCHEDULING_HANDLER                     = 'scheduling_handler';
	const LOG_ITEM_ENDPOINT                      = 'log_item_endpoint';
	const DEBUG_LOGGER                           = 'debug_logger_util';
	const VIEW_DEBUG_LOG_ENDPOINT                = 'view_debug_log_endpoint';
	const DEBUG_LOG_DIR                          = 'debug_log_dir';
	const DEBUG_LOG_FILEPATH                     = 'debug_log_filepath';
	const DEBUG_LOG_MODEL                        = 'debug_log_model';
	const DB_LOGGING_PROVIDER                    = 'db_logging_provider';
	const DEBUG_LOG_EVENT_HANDLER                = 'debug_log_event_handler';

	const LOGGING_ENDPOINTS_CONFIG = 'logging_endpoints_config';

	const RETENTION_ACTION_NAME = 'gravitysmtp_scheduler_handle_log_retention';

	const DEBUG_LOG_RETENTION_CRON_HOOK = 'gravitysmtp_scheduler_handle_debug_retention';

	protected $configs = array(
		self::LOGGING_ENDPOINTS_CONFIG => Logging_Endpoints_Config::class,
	);

	public function register( Service_Container $container ) {
		parent::register( $container );

		$this->container->add( Connector_Service_Provider::DATA_STORE_CONST, function () {
			return new Const_Data_Store();
		} );

		$this->container->add( Connector_Service_Provider::DATA_STORE_OPTS, function () {
			return new Opts_Data_Store();
		} );

		$this->container->add( Connector_Service_Provider::DATA_STORE_PLUGIN_OPTS, function () {
			return new Plugin_Opts_Data_Store();
		} );

		$this->container->add( Connector_Service_Provider::DATA_STORE_ROUTER, function () use ( $container ) {
			return new Data_Store_Router( $container->get( Connector_Service_Provider::DATA_STORE_CONST ), $container->get( Connector_Service_Provider::DATA_STORE_OPTS ), $container->get( Connector_Service_Provider::DATA_STORE_PLUGIN_OPTS ) );
		} );

		$this->container->add( self::LOGGER, function () use ( $container ) {
			return new Logger( $container->get( Connector_Service_Provider::LOG_DETAILS_MODEL ) );
		} );

		$this->container->add( self::WP_MAIL_LOGGER, function () use ( $container ) {
			return new WP_Mail_Logger( $container->get( self::LOGGER ), $container->get( Connector_Service_Provider::EVENT_MODEL ), $container->get( Utils_Service_Provider::SOURCE_PARSER ), $container->get( Utils_Service_Provider::HEADER_PARSER ) );
		} );

		$this->container->add( self::DEBUG_LOG_MODEL, function () use ( $container ) {
			return new Debug_Log_Model();
		} );

		$this->container->add( self::GET_PAGINATED_ITEMS_ENDPOINT, function () use ( $container ) {
			return new Get_Paginated_Items_Endpoint( $container->get( Connector_Service_Provider::EVENT_MODEL ), $container->get( Utils_Service_Provider::RECIPIENT_PARSER ) );
		} );

		$this->container->add( self::GET_PAGINATED_DEBUG_LOG_ITEMS_ENDPOINT, function () use ( $container ) {
			return new Get_Paginated_Debug_Log_Items_Endpoint( $container->get( self::DEBUG_LOG_MODEL ) );
		} );

		$this->container->add( self::DELETE_DEBUG_LOGS_ENDPOINT, function () use ( $container ) {
			return new Delete_Debug_Logs_Endpoint( $container->get( self::DEBUG_LOG_MODEL ) );
		} );

		$this->container->add( self::DELETE_EMAIL_ENDPOINT, function () use ( $container ) {
			return new Delete_Email_Endpoint( $container->get( Connector_Service_Provider::EVENT_MODEL ) );
		} );

		$this->container->add( self::DELETE_EVENTS_ENDPOINT, function () use ( $container ) {
			return new Delete_Events_Endpoint( $container->get( Connector_Service_Provider::EVENT_MODEL ) );
		} );

		$this->container->add( self::GET_EMAIL_MESSAGE_ENDPOINT, function () use ( $container ) {
			return new Get_Email_Message_Endpoint( $container->get( Connector_Service_Provider::EVENT_MODEL ) );
		} );

		$this->container->add( self::SCHEDULING_HANDLER, function () use ( $container ) {
			return new Handler( $container->get( Connector_Service_Provider::DATA_STORE_ROUTER ), $container->get( Connector_Service_Provider::EVENT_MODEL ), $container->get( Connector_Service_Provider::LOG_DETAILS_MODEL ) );
		} );

		$this->container->add( self::DB_LOGGING_PROVIDER, function () use ( $container ) {
			return new DB_Logging_Provider( $container->get( self::DEBUG_LOG_MODEL ) );
		} );

		$this->container->add( self::DEBUG_LOGGER, function () use ( $container ) {
			$data      = $container->get( Connector_Service_Provider::DATA_STORE_ROUTER );
			$log_level = $data->get_plugin_setting( Tools_Config::SETTING_DEBUG_LOG_LEVEL, DB_Logging_Provider::DEBUG );

			return new Debug_Logger( $container->get( self::DB_LOGGING_PROVIDER ), $log_level );
		} );

		$this->container->add( self::LOG_ITEM_ENDPOINT, function () use ( $container ) {
			return new Log_Item_Endpoint( $container->get( self::DEBUG_LOGGER ) );
		} );

		$this->container->add( self::VIEW_DEBUG_LOG_ENDPOINT, function () use ( $container ) {
			$debug_logger = $container->get( self::DEBUG_LOGGER );
			$debug_model  = $container->get( self::DEBUG_LOG_MODEL );

			return new View_Log_Endpoint( $container->get( Connector_Service_Provider::DATA_STORE_ROUTER ), $debug_logger, $debug_model );
		} );

		$this->container->add( self::DEBUG_LOG_EVENT_HANDLER, function () use ( $container ) {
			return new Debug_Log_Event_Handler( $container->get( self::DEBUG_LOGGER ), $container->get( Connector_Service_Provider::DATA_STORE_ROUTER ) );
		} );

		$this->container->add( Utils_Service_Provider::ATTACHMENTS_SAVER, function () use ( $container ) {
			return new Attachments_Saver( $container->get( Logging_Service_Provider::DEBUG_LOGGER ) );
		} );
	}

	public function init( Service_Container $container ) {
		add_action( 'wp_ajax_' . Get_Paginated_Items_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::GET_PAGINATED_ITEMS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Get_Paginated_Debug_Log_Items_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::GET_PAGINATED_DEBUG_LOG_ITEMS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Delete_Debug_Logs_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::DELETE_DEBUG_LOGS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Delete_Email_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::DELETE_EMAIL_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Delete_Events_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::DELETE_EVENTS_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Get_Email_Message_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::GET_EMAIL_MESSAGE_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . Log_Item_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::LOG_ITEM_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_' . View_Log_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::VIEW_DEBUG_LOG_ENDPOINT )->handle();
		} );

		add_action( 'wp_ajax_nopriv_' . View_Log_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::VIEW_DEBUG_LOG_ENDPOINT )->handle();
		} );

		add_action( self::RETENTION_ACTION_NAME, function () use ( $container ) {
			return $container->get( self::SCHEDULING_HANDLER )->run_log_retention();
		} );

		if ( ! Mail_Handler::is_minimally_configured() ) {
			add_filter( 'wp_mail', function ( $mail_info ) use ( $container ) {
				$container->get( self::WP_MAIL_LOGGER )->create_log( $mail_info );

				return $mail_info;
			} );

			add_action( 'wp_mail_failed', function ( $wp_error ) use ( $container ) {
				$container->get( self::WP_MAIL_LOGGER )->handle_failed( $wp_error );
			} );
		}

		if ( ! wp_next_scheduled( self::RETENTION_ACTION_NAME ) ) {
			wp_schedule_event( time(), 'daily', self::RETENTION_ACTION_NAME );
		}

		add_action( 'gravitysmtp_save_plugin_setting', function ( $setting, $value ) use ( $container ) {
			$container->get( self::DEBUG_LOG_EVENT_HANDLER )->on_setting_update( $setting, $value );
		}, 10, 2 );

		if ( ! wp_next_scheduled( self::DEBUG_LOG_RETENTION_CRON_HOOK ) ) {
			wp_schedule_event( time(), 'daily', self::DEBUG_LOG_RETENTION_CRON_HOOK );
		}

		add_action( self::DEBUG_LOG_RETENTION_CRON_HOOK, function () use ( $container ) {
			$container->get( self::DEBUG_LOG_EVENT_HANDLER )->on_retention_cron();
		} );
	}

}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/settings/email.ts
```ts
/**
 * Email Settings API endpoint
 *
 * GET  /_emdash/api/settings/email      — current provider, available providers, middleware
 * POST /_emdash/api/settings/email/test — send a test email through the full pipeline
 */

import { escapeHtml } from "@emdash-cms/auth";
import type { APIRoute } from "astro";
import { z } from "zod";

import { requirePerm } from "#api/authorize.js";
import { apiError, apiSuccess, handleError } from "#api/error.js";
import { isParseError, parseBody } from "#api/parse.js";
import { OptionsRepository } from "#db/repositories/options.js";

export const prerender = false;

const EMAIL_DELIVER_HOOK = "email:deliver";
const EMAIL_BEFORE_SEND_HOOK = "email:beforeSend";
const EMAIL_AFTER_SEND_HOOK = "email:afterSend";

/**
 * GET /_emdash/api/settings/email
 *
 * Returns the email configuration state:
 * - Current provider selection
 * - Available providers (plugins with email:deliver)
 * - Active middleware (email:beforeSend / email:afterSend plugins)
 * - Whether email is available
 */
export const GET: APIRoute = async ({ locals }) => {
	const { emdash, user } = locals;

	if (!emdash?.db) {
		return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	}

	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;

	try {
		const pipeline = emdash.hooks;
		const optionsRepo = new OptionsRepository(emdash.db);

		// Get email:deliver providers and current selection
		const providers = pipeline.getExclusiveHookProviders(EMAIL_DELIVER_HOOK);
		const selectedProviderId = await optionsRepo.get<string>(
			`emdash:exclusive_hook:${EMAIL_DELIVER_HOOK}`,
		);

		// Get middleware hooks (beforeSend / afterSend)
		const beforeSendPlugins = pipeline
			.getExclusiveHookProviders(EMAIL_BEFORE_SEND_HOOK)
			.map((p) => p.pluginId);
		const afterSendPlugins = pipeline
			.getExclusiveHookProviders(EMAIL_AFTER_SEND_HOOK)
			.map((p) => p.pluginId);

		// Note: beforeSend/afterSend are NOT exclusive hooks, but getExclusiveHookProviders
		// only finds exclusive ones. We need all hooks for those names.
		// For now, report what we can from the exclusive hook system.
		// Middleware is non-exclusive so we'd need a different query.
		// TODO: Add getHookProviders() for non-exclusive hooks to the pipeline.

		return apiSuccess({
			available: emdash.email?.isAvailable() ?? false,
			providers: providers.map((p) => ({
				pluginId: p.pluginId,
			})),
			selectedProviderId: selectedProviderId ?? null,
			middleware: {
				beforeSend: beforeSendPlugins,
				afterSend: afterSendPlugins,
			},
		});
	} catch (error) {
		return handleError(error, "Failed to get email settings", "EMAIL_SETTINGS_READ_ERROR");
	}
};

/**
 * POST /_emdash/api/settings/email/test
 *
 * Send a test email through the full pipeline.
 * Validates the pipeline is configured and the provider works.
 */
const testEmailBody = z.object({
	to: z.string().email(),
});

export const POST: APIRoute = async ({ request, locals }) => {
	const { emdash, user } = locals;

	if (!emdash?.db) {
		return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	}

	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;

	if (!emdash.email?.isAvailable()) {
		return apiError(
			"EMAIL_NOT_CONFIGURED",
			"No email provider is configured. Install and activate an email provider plugin.",
			503,
		);
	}

	try {
		const body = await parseBody(request, testEmailBody);
		if (isParseError(body)) return body;

		const optionsRepo = new OptionsRepository(emdash.db);
		const siteName = (await optionsRepo.get<string>("emdash:site_title")) ?? "EmDash";
		const safeName = escapeHtml(siteName);

		await emdash.email.send(
			{
				to: body.to,
				subject: `Test email from ${siteName}`,
				text: `This is a test email from ${siteName}.\n\nIf you received this, your email provider is working correctly.`,
				html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="font-size: 24px; margin-bottom: 20px;">Test Email</h1>
  <p>This is a test email from <strong>${safeName}</strong>.</p>
  <p>If you received this, your email provider is working correctly.</p>
  <p style="color: #666; font-size: 14px; margin-top: 30px;">
    Sent via the EmDash email pipeline.
  </p>
</body>
</html>`,
			},
			"admin",
		);

		return apiSuccess({
			success: true,
			message: `Test email sent to ${body.to}`,
		});
	} catch (error) {
		return handleError(error, "Failed to send test email", "EMAIL_TEST_ERROR");
	}
};

```

File: /Users/masonjames/Projects/gravitysmtp/includes/migration/class-migration-service-provider.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Migration;

use Gravity_Forms\Gravity_SMTP\Connectors\Config\Connector_Endpoints_Config;
use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Base;
use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Gravity_SMTP;
use Gravity_Forms\Gravity_Tools\Providers\Config_Service_Provider;
use Gravity_Forms\Gravity_Tools\Service_Container;
use Gravity_Forms\Gravity_SMTP\Apps\Migration\Endpoints\Migrate_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Migration\Config\Migration_Endpoints_Config;

class Migration_Service_Provider extends Config_Service_Provider {

	const MIGRATOR_COLLECTION = 'migrator_collection';
	const WP_SMTP_PRO_MIGRATOR = 'wp_smtp_pro_migrator';
	const MIGRATE_ENDPOINTS_CONFIG = 'migrate_endpoints_config';

	const MIGRATE_SETTINGS_ENDPOINT = 'migrate_settings_endpoint';

	protected $configs = array(
		self::MIGRATE_ENDPOINTS_CONFIG => Migration_Endpoints_Config::class,
	);

	public function register( Service_Container $container ) {
		parent::register( $container );

		$container->add( self::MIGRATOR_COLLECTION, function() {
			return new Migrator_Collection();
		});

		$container->add( self::MIGRATE_SETTINGS_ENDPOINT, function () use ( $container ) {
			return new Migrate_Settings_Endpoint( $container->get( Connector_Service_Provider::CONNECTOR_FACTORY ), $container->get( Connector_Service_Provider::DATA_STORE_OPTS ), __NAMESPACE__, $container->get( Connector_Service_Provider::REGISTERED_CONNECTORS ) );
		} );
	}

	public function init( \Gravity_Forms\Gravity_Tools\Service_Container $container ) {
		add_action( 'wp_ajax_' . Migrate_Settings_Endpoint::ACTION_NAME, function () use ( $container ) {
			$container->get( self::MIGRATE_SETTINGS_ENDPOINT )->handle();
		} );
	}

}
```

File: /Users/masonjames/Projects/gravitysmtp/includes/migration/config/class-migration-endpoints-config.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Migration\Config;

use Gravity_Forms\Gravity_SMTP\Apps\Migration\Endpoints\Migrate_Settings_Endpoint;
use Gravity_Forms\Gravity_Tools\Config;

class Migration_Endpoints_Config extends Config {

	protected $script_to_localize = 'gravitysmtp_scripts_admin';
	protected $name               = 'gravitysmtp_admin_config';

	public function should_enqueue() {
		return is_admin();
	}

	public function data() {
		return array(
			'common' => array(
				'endpoints' => array(
					Migrate_Settings_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Migrate_Settings_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Migrate_Settings_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
				)
			),
		);
	}

}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/tracking/class-tracking-service-provider.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Tracking;

use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Base;
use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Data_Store\Data_Store_Router;
use Gravity_Forms\Gravity_SMTP\Utils\Booliesh;
use Gravity_Forms\Gravity_Tools\Service_Container;
use Gravity_Forms\Gravity_Tools\Service_Provider;
use Gravity_Forms\Gravity_Tools\Utils\Utils_Service_Provider;

class Tracking_Service_Provider extends Service_Provider {

	const OPEN_PIXEL_HANDLER = 'open_pixel_handler';

	const SETTING_OPEN_TRACKING = 'open_tracking';

	public function register( Service_Container $container ) {
		$container->add( self::OPEN_PIXEL_HANDLER, function() use ( $container ) {
			$encrypter = $container->get( Utils_Service_Provider::BASIC_ENCRYPTED_HASH );
			$events = $container->get( Connector_Service_Provider::EVENT_MODEL );
			return new Open_Pixel_Handler( $encrypter, $events );
		} );
	}

	public function init( Service_Container $container ) {
		add_action( 'gravitysmtp_after_connector_init', function ( $email_id, Connector_Base $connector ) use ( $container ) {
			$data    = $container->get( Connector_Service_Provider::DATA_STORE_ROUTER );
			$enabled = $data->get_plugin_setting( self::SETTING_OPEN_TRACKING, false );

			if ( ! Booliesh::get( $enabled ) ) {
				return;
			}

			$atts    = $connector->get_atts();
			$is_html = ! empty( $atts['headers']['content-type'] ) && strpos( $atts['headers']['content-type'], 'text/html' ) !== false;

			if ( ! $is_html ) {
				return;
			}

			$message  = isset( $atts['message'] ) ? $atts['message'] : '';
			$modified = $container->get( self::OPEN_PIXEL_HANDLER )->add_pixel( $email_id, $message, $atts );

			if ( $modified === $message ) {
				return;
			}

			$connector->set_att( 'message', $modified );
		}, 10, 2 );

		add_action( 'template_redirect', function() use ( $container ) {
			if ( get_query_var( Open_Pixel_Handler::REWRITE_PARAM ) == false || get_query_var( Open_Pixel_Handler::REWRITE_PARAM ) == '' ) {
				return;
			}

			$container->get( self::OPEN_PIXEL_HANDLER )->handle_redirect();
		} );

		$container->get( self::OPEN_PIXEL_HANDLER )->add_rewrite_rules();
	}

}
```

File: /Users/masonjames/Projects/emdash/packages/core/src/astro/integration/runtime.ts
```ts
/**
 * Runtime utilities for EmDash
 *
 * This file contains functions that are used at runtime (in middleware, routes, etc.)
 * and must work in all environments including Cloudflare Workers.
 *
 * DO NOT import Node.js-only modules here (fs, path, module, etc.)
 */

import type { AuthDescriptor } from "../../auth/types.js";
import type { DatabaseDescriptor } from "../../db/adapters.js";
import type { MediaProviderDescriptor } from "../../media/types.js";
import type { ResolvedPlugin } from "../../plugins/types.js";
import type { StorageDescriptor } from "../storage/types.js";

export type { ResolvedPlugin };
export type { MediaProviderDescriptor };

/**
 * Admin page definition (copied from plugins/types to avoid circular deps)
 */
export interface PluginAdminPage {
	path: string;
	label: string;
	icon?: string;
}

/**
 * Dashboard widget definition (copied from plugins/types to avoid circular deps)
 */
export interface PluginDashboardWidget {
	id: string;
	size?: "full" | "half" | "third";
	title?: string;
}

/**
 * Plugin descriptor - returned by plugin factory functions
 *
 * Contains all static metadata needed for manifest and admin UI,
 * plus the entrypoint for runtime instantiation.
 *
 * @example
 * ```ts
 * export function myPlugin(options?: MyPluginOptions): PluginDescriptor {
 *   return {
 *     id: "my-plugin",
 *     version: "1.0.0",
 *     entrypoint: "@my-org/emdash-plugin-foo",
 *     options: options ?? {},
 *     adminEntry: "@my-org/emdash-plugin-foo/admin",
 *     adminPages: [{ path: "/settings", label: "Settings" }],
 *   };
 * }
 * ```
 */
/**
 * Storage collection declaration for sandboxed plugins
 */
export interface StorageCollectionDeclaration {
	indexes?: string[];
	uniqueIndexes?: string[];
}

export interface PluginDescriptor<TOptions = Record<string, unknown>> {
	/** Unique plugin identifier */
	id: string;
	/** Plugin version (semver) */
	version: string;
	/** Module specifier to import (e.g., "@emdash-cms/plugin-api-test") */
	entrypoint: string;
	/**
	 * Options to pass to createPlugin(). Native format only.
	 * Standard-format plugins configure themselves via KV settings
	 * and Block Kit admin pages -- not constructor options.
	 */
	options?: TOptions;
	/**
	 * Plugin format. Determines how the entrypoint is loaded:
	 * - `"standard"` -- exports `definePlugin({ hooks, routes })` as default.
	 *   Wrapped with `adaptSandboxEntry` for in-process execution. Can run in both
	 *   `plugins: []` (in-process) and `sandboxed: []` (isolate).
	 * - `"native"` -- exports `createPlugin(options)` returning a `ResolvedPlugin`.
	 *   Can only run in `plugins: []`. Cannot be sandboxed or published to marketplace.
	 *
	 * Defaults to `"native"` when unset.
	 *
	 */
	format?: "standard" | "native";
	/** Admin UI module specifier (e.g., "@emdash-cms/plugin-audit-log/admin") */
	adminEntry?: string;
	/** Module specifier for site-side Astro rendering components (must export `blockComponents`) */
	componentsEntry?: string;
	/** Admin pages for navigation */
	adminPages?: PluginAdminPage[];
	/** Dashboard widgets */
	adminWidgets?: PluginDashboardWidget[];

	// === Sandbox-specific fields (for sandboxed plugins) ===

	/**
	 * Capabilities the plugin requests.
	 * For standard-format plugins, capabilities are enforced in both trusted and
	 * sandboxed modes via the PluginContextFactory.
	 */
	capabilities?: string[];
	/**
	 * Allowed hosts for network:fetch capability
	 * Supports wildcards like "*.example.com"
	 */
	allowedHosts?: string[];
	/**
	 * Storage collections the plugin declares
	 * Sandboxed plugins can only access declared collections.
	 */
	storage?: Record<string, StorageCollectionDeclaration>;
}

/**
 * Sandboxed plugin descriptor - same format as PluginDescriptor
 *
 * These run in isolated V8 isolates via Worker Loader on Cloudflare.
 * The `entrypoint` is resolved to a file and bundled at build time.
 */
export type SandboxedPluginDescriptor<TOptions = Record<string, unknown>> =
	PluginDescriptor<TOptions>;

export interface EmDashConfig {
	/**
	 * Database configuration
	 *
	 * Use one of the adapter functions:
	 * - `sqlite({ url: "file:./data.db" })` - Local SQLite
	 * - `libsql({ url: "...", authToken: "..." })` - Turso/libSQL
	 * - `d1({ binding: "DB" })` - Cloudflare D1
	 *
	 * @example
	 * ```ts
	 * import { sqlite } from "emdash/db";
	 *
	 * emdash({
	 *   database: sqlite({ url: "file:./data.db" }),
	 * })
	 * ```
	 */
	database?: DatabaseDescriptor;
	/**
	 * Storage configuration (for media)
	 */
	storage?: StorageDescriptor;
	/**
	 * Trusted plugins to load (run in main isolate)
	 *
	 * @example
	 * ```ts
	 * import { auditLogPlugin } from "@emdash-cms/plugin-audit-log";
	 * import { webhookNotifierPlugin } from "@emdash-cms/plugin-webhook-notifier";
	 *
	 * emdash({
	 *   plugins: [
	 *     auditLogPlugin(),
	 *     webhookNotifierPlugin({ url: "https://example.com/webhook" }),
	 *   ],
	 * })
	 * ```
	 */
	plugins?: PluginDescriptor[];
	/**
	 * Sandboxed plugins to load (run in isolated V8 isolates)
	 *
	 * Only works on Cloudflare with Worker Loader enabled.
	 * Uses the same format as `plugins` - the difference is where they run.
	 *
	 * @example
	 * ```ts
	 * import { untrustedPlugin } from "some-third-party-plugin";
	 *
	 * emdash({
	 *   plugins: [trustedPlugin()],     // runs in host
	 *   sandboxed: [untrustedPlugin()], // runs in isolate
	 *   sandboxRunner: "@emdash-cms/sandbox-cloudflare",
	 * })
	 * ```
	 */
	sandboxed?: SandboxedPluginDescriptor[];
	/**
	 * Module that exports the sandbox runner factory.
	 * Required if using sandboxed plugins.
	 *
	 * @example
	 * ```ts
	 * emdash({
	 *   sandboxRunner: "@emdash-cms/sandbox-cloudflare",
	 * })
	 * ```
	 */
	sandboxRunner?: string;

	/**
	 * Authentication configuration
	 *
	 * Use an auth adapter function from a platform package:
	 * - `access({ teamDomain: "..." })` from `@emdash-cms/cloudflare`
	 *
	 * When an external auth provider is configured, passkey auth is disabled.
	 *
	 * @example
	 * ```ts
	 * import { access } from "@emdash-cms/cloudflare";
	 *
	 * emdash({
	 *   auth: access({
	 *     teamDomain: "myteam.cloudflareaccess.com",
	 *     audience: "abc123...",
	 *     roleMapping: {
	 *       "Admins": 50,
	 *       "Editors": 30,
	 *     },
	 *   }),
	 * })
	 * ```
	 */
	auth?: AuthDescriptor;

	/**
	 * Enable the MCP (Model Context Protocol) server endpoint.
	 *
	 * When enabled, exposes an MCP Streamable HTTP server at
	 * `/_emdash/api/mcp` that allows AI agents and tools to interact
	 * with the CMS using the standardized MCP protocol.
	 *
	 * Authentication is handled by the existing EmDash auth middleware —
	 * agents must authenticate with an API token or session cookie.
	 *
	 * @default false
	 *
	 * @example
	 * ```ts
	 * emdash({
	 *   mcp: true,
	 * })
	 * ```
	 */
	mcp?: boolean;

	/**
	 * Plugin marketplace URL
	 *
	 * When set, enables the marketplace features: browse, install, update,
	 * and uninstall plugins from a remote marketplace.
	 *
	 * Must be an HTTPS URL in production, or localhost/127.0.0.1 in dev.
	 * Requires `sandboxRunner` to be configured (marketplace plugins run sandboxed).
	 *
	 * @example
	 * ```ts
	 * emdash({
	 *   marketplace: "https://marketplace.emdashcms.com",
	 *   sandboxRunner: "@emdash-cms/sandbox-cloudflare",
	 * })
	 * ```
	 */
	marketplace?: string;

	/**
	 * Enable playground mode for ephemeral "try EmDash" sites.
	 *
	 * When set, the integration injects a playground middleware (order: "pre")
	 * that runs BEFORE the normal EmDash middleware chain. It creates an
	 * isolated Durable Object database per session, runs migrations, applies
	 * the seed, creates an anonymous admin user, and sets the DB in ALS.
	 * By the time the runtime middleware runs, the database is fully ready.
	 *
	 * Setup and auth middleware are skipped (the playground handles both).
	 *
	 * Requires `@emdash-cms/cloudflare` as a dependency and a DO binding
	 * in wrangler.jsonc.
	 *
	 * @example
	 * ```ts
	 * emdash({
	 *   database: playgroundDatabase({ binding: "PLAYGROUND_DB" }),
	 *   playground: {
	 *     middlewareEntrypoint: "@emdash-cms/cloudflare/db/playground-middleware",
	 *   },
	 * })
	 * ```
	 */
	playground?: {
		/** Module path for the playground middleware. */
		middlewareEntrypoint: string;
	};

	/**
	 * Media providers for browsing and uploading media
	 *
	 * The local media provider (using storage adapter) is available by default.
	 * Additional providers can be added for external services like Unsplash,
	 * Cloudinary, Mux, Cloudflare Images, etc.
	 *
	 * @example
	 * ```ts
	 * import { cloudflareImages, cloudflareStream } from "@emdash-cms/cloudflare";
	 * import { unsplash } from "@emdash-cms/provider-unsplash";
	 *
	 * emdash({
	 *   mediaProviders: [
	 *     cloudflareImages({ accountId: "..." }),
	 *     cloudflareStream({ accountId: "..." }),
	 *     unsplash({ accessKey: "..." }),
	 *   ],
	 * })
	 * ```
	 */
	mediaProviders?: MediaProviderDescriptor[];
}

/**
 * Get stored config from global
 * This is set by the virtual module at build time
 */
export function getStoredConfig(): EmDashConfig | null {
	return globalThis.__emdashConfig || null;
}

/**
 * Set stored config in global
 * Called by the integration at config time
 */
export function setStoredConfig(config: EmDashConfig): void {
	globalThis.__emdashConfig = config;
}

// Declare global type
declare global {
	// eslint-disable-next-line no-var
	var __emdashConfig: EmDashConfig | undefined;
}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/alerts/config/class-alerts-config.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Alerts\Config;

use Gravity_Forms\Gravity_SMTP\Alerts\Endpoints\Save_Alerts_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Apps\Endpoints\Get_Dashboard_Data_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Connector_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Save_Plugin_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Gravity_SMTP;
use Gravity_Forms\Gravity_SMTP\Tracking\Tracking_Service_Provider;
use Gravity_Forms\Gravity_SMTP\Utils\Booliesh;
use Gravity_Forms\Gravity_Tools\Config;

class Alerts_Config extends Config {

	const SETTING_SEND_ON_FAIL         = 'send_on_fail';
	const SETTING_ENABLE_SLACK_ALERTS  = 'enable_slack_alerts';
	const SETTING_ENABLE_TWILIO_ALERTS = 'enable_twilio_alerts';

	const SETTING_SLACK_ALERTS      = 'slack_alerts';
	const SETTING_SLACK_WEBHOOK_URL = 'slack_webhook_url';

	const SETTING_TWILIO_ALERTS            = 'twilio_alerts';
	const SETTING_TWILIO_ACCOUNT_ID        = 'twilio_account_id';
	const SETTING_TWILIO_ACCOUNT_NAME      = 'twilio_account_name';
	const SETTING_TWILIO_AUTH_TOKEN        = 'twilio_auth_token';
	const SETTING_TWILIO_FROM_PHONE_NUMBER = 'twilio_from_phone_number';
	const SETTING_TWILIO_TO_PHONE_NUMBER   = 'twilio_to_phone_number';

	protected $script_to_localize = 'gravitysmtp_scripts_admin';
	protected $name               = 'gravitysmtp_admin_config';
	protected $overwrite          = false;

	public function should_enqueue() {
		if ( ! is_admin() ) {
			return false;
		}

		$page = filter_input( INPUT_GET, 'page' );

		if ( ! is_string( $page ) ) {
			return false;
		}

		$page = htmlspecialchars( $page );

		if ( $page !== 'gravitysmtp-settings' ) {
			return false;
		}

		return true;
	}

	public function data() {
		return array(
			'components' => array(
				'settings' => array(
					'i18n' => $this->i18n_values(),
					'data' => $this->data_values(),
				),
			)
		);
	}

	protected function i18n_values() {
		return array(
			'alerts' => array(
				'top_heading'                        => esc_html__( 'Alerts', 'gravitysmtp' ),
				'top_content'                        => __( "Use these settings to configure alerts for failed email sending attempts. Set up notifications through Webhooks or SMS (via Twilio) to ensure you're informed when an email fails to send. Multiple integrations can be added and managed.", 'gravitysmtp' ),
				'alerts_box_heading'                 => esc_html__( 'Alerts Settings', 'gravitysmtp' ),
				'notify_heading'                     => esc_html__( 'When to Notify', 'gravitysmtp' ),
				'email_request_fails_label'          => esc_html__( 'Email send request fails', 'gravitysmtp' ),
				'email_request_fails_help_text'      => esc_html__( 'Enable this option send an alert when an email send attempt fails for any reason.', 'gravitysmtp' ),
				'alert_threshold_count_label'        => esc_html__( 'Failure Amount', 'gravitysmtp' ),
				'alert_threshold_count_help_text'    => esc_html__( 'The number of failures to trigger an alert.', 'gravitysmtp' ),
				'alert_threshold_interval_label'     => esc_html__( 'Alert Rate', 'gravitysmtp' ),
				'alert_threshold_interval_help_text' => esc_html__( 'Interval for sending alerts about failures (in minutes).', 'gravitysmtp' ),
				'slack_heading'                      => esc_html__( 'Webhooks', 'gravitysmtp' ),
				'slack_alerts_label'                 => esc_html__( 'Webhook Alerts', 'gravitysmtp' ),
				'slack_alerts_help_text'             => esc_html__( "Get notified via webhook or SMS (Twilio) when emails fail to send. Webhooks can be used with services like Slack, Zapier, and more.", 'gravitysmtp' ),
				'slack_webhook_add_button_label'     => esc_html__( 'Add Webhook', 'gravitysmtp' ),
				'slack_webhook_delete_button_label'  => esc_html__( 'Delete', 'gravitysmtp' ),
				'start_sending_test_alert'           => esc_html__( 'Sending a test alert from the alerts settings page.', 'gravitysmtp' ),
				'snackbar_test_alert_success'        => esc_html__( 'Alert successfully configured!', 'gravitysmtp' ),
				'snackbar_test_alert_error'          => esc_html__( 'Could not send alert. Check Debug Log for details.', 'gravitysmtp' ),
				'twilio_heading'                     => esc_html__( 'Twilio', 'gravitysmtp' ),
				'twilio_alerts_block_heading'        => esc_html__( 'Twilio Account: %s', 'gravitysmtp' ),
				'twilio_alerts_label'                => esc_html__( 'SMS via Twilio Alerts', 'gravitysmtp' ),
				'twilio_alerts_help_text'            => __( "Enter the Twilio account you'd like to use to send alerts when email sending fails.", 'gravitysmtp' ),
				'twilio_account_add_button_label'    => esc_html__( 'Add Another Account', 'gravitysmtp' ),
				'twilio_account_delete_button_label' => esc_html__( 'Delete', 'gravitysmtp' ),
				'save_settings_button_label'         => esc_html__( 'Save Settings', 'gravitysmtp' ),
				'drag_button_label'                  => esc_html__( 'Click to toggle drag and drop.', 'gravitysmtp' ),
				'begin_drag_notice'                  => __( 'Entering drag and drop for item %1$s.', 'gravitysmtp' ),
				'end_drag_notice'                    => __( 'Exiting drag and drop for item %1$s.', 'gravitysmtp' ),
				'end_drop_notice'                    => __( 'Item %1$s moved to position %2$s.', 'gravitysmtp' ),
				'move_item_notice'                   => __( 'Moving item %1$s to position %2$s.', 'gravitysmtp' ),
			)
		);
	}

	private function empty_twilio_item() {
		return array(
			'repeater_item_block_content_title' => esc_html__( 'Twilio Account:', 'gravitysmtp' ),
			'repeater_item_collapsed'           => false,
			'repeater_item_id'                  => 'repeater-twilio-alerts-0',
			'twilio_account_name'               => '',
			'twilio_account_id'                 => '',
			'twilio_auth_token'                 => '',
			'twilio_from_phone_number'          => '',
			'twilio_to_phone_number'            => '',
		);
	}

	private function empty_slack_item() {
		return array(
			'repeater_item_id'  => 'repeater-slack-alerts-0',
			'slack_webhook_url' => '',
		);
	}

	private function default_setting_values() {
		return array(
			Save_Alerts_Settings_Endpoint::PARAM_NOTIFY_WHEN_EMAIL_FAILS => false,
			Save_Alerts_Settings_Endpoint::PARAM_SLACK_ALERTS_ENABLED    => false,
			Save_Alerts_Settings_Endpoint::PARAM_SLACK_ALERTS            => array(),
			Save_Alerts_Settings_Endpoint::PARAM_TWILIO_ALERTS_ENABLED   => false,
			Save_Alerts_Settings_Endpoint::PARAM_TWILIO_ALERTS           => array(),
			Save_Alerts_Settings_Endpoint::PARAM_ALERT_THRESHOLD_COUNT    => 5,
			Save_Alerts_Settings_Endpoint::PARAM_ALERT_THRESHOLD_INTERVAL => 5,
		);
	}

	protected function data_values() {
		$container         = Gravity_SMTP::container();
		$plugin_data_store = $container->get( Connector_Service_Provider::DATA_STORE_ROUTER );
		// todo: not sure these defaults work correctly
		$alerts_settings   = $plugin_data_store->get_plugin_setting( Save_Alerts_Settings_Endpoint::PARAM_SETTINGS, $this->default_setting_values() );

		$notify_when_email_sending_fails_enabled = Booliesh::get( $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_NOTIFY_WHEN_EMAIL_FAILS ] );
		$slack_alerts_enabled                    = Booliesh::get( $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_SLACK_ALERTS_ENABLED ] );
		$twilio_alerts_enabled                   = Booliesh::get( $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_TWILIO_ALERTS_ENABLED ] );
		$alert_threshold_count				     = isset( $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_ALERT_THRESHOLD_COUNT ] ) ? $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_ALERT_THRESHOLD_COUNT ] : 5;
		$alert_threshold_interval				 = isset( $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_ALERT_THRESHOLD_INTERVAL ] ) ? $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_ALERT_THRESHOLD_INTERVAL ] : 5;

		$slack_alerts  = ! empty( $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_SLACK_ALERTS ] ) ? $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_SLACK_ALERTS ] : array( $this->empty_slack_item() );
		$twilio_alerts = ! empty( $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_TWILIO_ALERTS ] ) ? $alerts_settings[ Save_Alerts_Settings_Endpoint::PARAM_TWILIO_ALERTS ] : array( $this->empty_twilio_item() );

		// Fix boolean strings
		foreach ( $twilio_alerts as $key => $values ) {
			$values['repeater_item_collapsed'] = Booliesh::get( $values['repeater_item_collapsed'] );
			$twilio_alerts[ $key ]             = $values;
		}

		return array(
			'alerts_settings' => array(
				'notify_when_email_sending_fails_enabled' => $notify_when_email_sending_fails_enabled,
				'slack_alerts_enabled'                    => $slack_alerts_enabled,
				'twilio_alerts_enabled'                   => $twilio_alerts_enabled,
				'alert_threshold_count'                   => $alert_threshold_count,
				'alert_threshold_interval'                => $alert_threshold_interval,
				self::SETTING_SLACK_ALERTS                => array(
					'fields' => array(
						array(
							'component' => 'Input',
							'props'     => array(
								'labelAttributes' => array(
									'label'     => esc_html__( 'Webhook URL', 'gravitysmtp' ),
									'isVisible' => false,
								),
								'name'            => self::SETTING_SLACK_WEBHOOK_URL,
							),
						),
						array(
							'component' => 'Button',
							'props'     => array(
								'label'        => esc_html__( 'Test Webhook', 'gravitysmtp' ),
								'icon'         => 'play',
								'iconPosition' => 'leading',
								'iconPrefix'   => 'gravitysmtp-admin-icon',
								'size'         => 'size-height-m',
								'type'         => 'white',
							),
						)
					),
					'items'  => $slack_alerts,
					'path'   => 'gravitysmtp_admin_config.components.settings.data.alerts_settings.' . self::SETTING_SLACK_ALERTS . '.items',
				),
				self::SETTING_TWILIO_ALERTS               => array(
					'fields' => array(
						array(
							'component' => 'Input',
							'props'     => array(
								'labelAttributes' => array(
									'label'  => esc_html__( 'Account Name', 'gravitysmtp' ),
									'size'   => 'text-sm',
									'weight' => 'medium',
								),
								'name'            => self::SETTING_TWILIO_ACCOUNT_NAME,
							),
						),
						array(
							'component' => 'Input',
							'props'     => array(
								'labelAttributes' => array(
									'label'  => esc_html__( 'Twilio Account SID', 'gravitysmtp' ),
									'size'   => 'text-sm',
									'weight' => 'medium',
								),
								'name'            => self::SETTING_TWILIO_ACCOUNT_ID,
							),
						),
						array(
							'component' => 'Input',
							'props'     => array(
								'labelAttributes' => array(
									'label'  => esc_html__( 'Twilio Auth Token', 'gravitysmtp' ),
									'size'   => 'text-sm',
									'weight' => 'medium',
								),
								'name'            => self::SETTING_TWILIO_AUTH_TOKEN,
							),
						),
						array(
							'component' => 'Input',
							'props'     => array(
								'labelAttributes' => array(
									'label'  => esc_html__( 'From Phone Number', 'gravitysmtp' ),
									'size'   => 'text-sm',
									'weight' => 'medium',
								),
								'name'            => self::SETTING_TWILIO_FROM_PHONE_NUMBER,
							),
						),
						array(
							'component' => 'Input',
							'props'     => array(
								'labelAttributes' => array(
									'label'  => esc_html__( 'To Phone Number', 'gravitysmtp' ),
									'size'   => 'text-sm',
									'weight' => 'medium',
								),
								'name'            => self::SETTING_TWILIO_TO_PHONE_NUMBER,
							),
						),
						array(
							'component' => 'Button',
							'props'     => array(
								'customClasses' => [ 'gravitysmtp-alerts-settings__twilio-test-connection' ],
								'label'        => esc_html__( 'Test Connection', 'gravitysmtp' ),
								'icon'         => 'play',
								'iconPosition' => 'leading',
								'iconPrefix'   => 'gravitysmtp-admin-icon',
								'size'         => 'size-height-m',
								'type'         => 'white',
							),
						),
					),
					'items'  => $twilio_alerts,
					'path'   => 'gravitysmtp_admin_config.components.settings.data.alerts_settings.' . self::SETTING_TWILIO_ALERTS . '.items',
				),
			),
		);
	}
}

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/sandbox.mdx
```mdx
---
title: Plugin Sandbox
description: How EmDash isolates untrusted plugins on Cloudflare Workers vs Node.js deployments.
---

import { Aside, Card, CardGrid, Steps } from "@astrojs/starlight/components";

EmDash supports running plugins in two execution modes: **trusted** and **sandboxed**. This page explains how each mode works, what protections they provide, and the security implications for different deployment targets.

## Execution Modes

| | Trusted | Sandboxed |
|---|---|---|
| **Runs in** | Main process | Isolated V8 isolate (Dynamic Worker Loader) |
| **Capabilities** | Advisory (not enforced) | Enforced at runtime |
| **Resource limits** | None | CPU, memory, subrequests, wall-time |
| **Network access** | Unrestricted | Blocked; only via `ctx.http` with host allowlist |
| **Data access** | Full database access | Scoped to declared capabilities via RPC bridge |
| **Available on** | All platforms | Cloudflare Workers only |

## Trusted Mode

Trusted plugins run in the same process as your Astro site. They are loaded from npm packages or local files and configured in `astro.config.mjs`:

```typescript title="astro.config.mjs"
import myPlugin from "@emdash-cms/plugin-analytics";

export default defineConfig({
	integrations: [
		emdash({
			plugins: [myPlugin()],
		}),
	],
});
```

In trusted mode:

- **Capabilities are documentation, not enforcement.** A plugin declaring `["read:content"]` can still access anything in the process. The `capabilities` field tells administrators what the plugin _intends_ to use.
- **No resource limits.** CPU, memory, and network usage are unbounded. A misbehaving plugin can stall the entire request.
- **Full process access.** Plugins share the Node.js/Workers runtime with your Astro site. They can import any module, access environment variables, and read/write to the filesystem (on Node.js).

<Aside type="caution" title="Security implication">
	Only install trusted plugins from sources you trust — npm packages you've reviewed, or code you've written yourself. In trusted mode, a malicious plugin has the same access as your application code.
</Aside>

## Sandboxed Mode (Cloudflare Workers)

Sandboxed plugins run in isolated V8 isolates provided by Cloudflare's [Dynamic Worker Loader](https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/) API. Each plugin gets its own isolate with enforced limits.

To enable sandboxing, configure the sandbox runner in your Astro config:

```typescript title="astro.config.mjs"
export default defineConfig({
	integrations: [
		emdash({
			sandboxRunner: "@emdash-cms/cloudflare/sandbox",
			sandboxed: [
				{
					manifest: seoPluginManifest,
					code: seoPluginCode,
				},
			],
		}),
	],
});
```

### What the Sandbox Enforces

<Steps>

1. **Capability enforcement**

   If a plugin declares `capabilities: ["read:content"]`, it can only call `ctx.content.get()` and `ctx.content.list()`. Attempting `ctx.content.create()` throws a permission error. This is enforced by the RPC bridge — the plugin cannot bypass it because it has no direct database access.

2. **Resource limits**

   Every invocation (hook or route call) runs with:

   | Resource | Default | Enforced by |
   |---|---|---|
   | CPU time | 50ms | Worker Loader (V8 isolate) |
   | Subrequests | 10 per invocation | Worker Loader (V8 isolate) |
   | Wall-clock time | 30 seconds | EmDash runner (`Promise.race`) |
   | Memory | ~128MB | V8 platform ceiling (not configurable per-plugin) |

   Exceeding CPU or subrequest limits causes the Worker Loader to abort the isolate and throw an exception. Exceeding the wall-time limit causes EmDash to reject the invocation promise. Memory is bounded by the V8 platform ceiling but cannot be configured per-plugin.

   These are the built-in defaults. Custom limits can be configured by providing a custom `SandboxRunnerFactory` that passes different values via `SandboxOptions.limits`. Per-site configuration through the EmDash integration config is not yet implemented.

3. **Network isolation**

   Sandboxed plugins have `globalOutbound: null` — direct `fetch()` calls are blocked at the V8 level. Plugins must use `ctx.http.fetch()`, which proxies through the bridge. The bridge validates the target host against the plugin's `allowedHosts` list.

4. **Storage scoping**

   All storage operations (KV, collections) are scoped to the plugin's ID. A plugin cannot read another plugin's data. Content and media access goes through the bridge, which checks capabilities on every call.

5. **Feature restrictions**

   Some features are only available in trusted mode:

   - **API routes** — Custom REST endpoints (`routes`) are not available. Sandboxed plugins interact with users through Block Kit admin pages and hooks.
   - **Portable Text block types** — PT blocks require Astro components for site-side rendering (`componentsEntry`), loaded at build time from npm. Sandboxed plugins are installed at runtime and cannot ship components.
   - **Custom React admin pages** — Sandboxed plugins use Block Kit for admin UI instead of shipping React components.

   The `emdash plugin bundle` command warns if a plugin declares these features.

</Steps>

### Architecture

Sandboxed plugins communicate with EmDash through an RPC bridge:

```
┌─────────────────────┐     RPC      ┌──────────────────────┐
│  Plugin Isolate     │ ◄──────────► │  PluginBridge        │
│  (Worker Loader)    │   (binding)  │  (WorkerEntrypoint)  │
│                     │              │                      │
│  ctx.kv.get(k)      │──────────────│► kvGet(k)            │
│  ctx.content.list() │──────────────│► contentList()       │
│  ctx.http.fetch(u)  │──────────────│► httpFetch(u)        │
└─────────────────────┘              └──────────────────────┘
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │  D1 / R2     │
                                     └──────────────┘
```

The plugin's code runs in a V8 isolate. It receives a `ctx` object where every method is a proxy to the bridge. The bridge runs in the main EmDash worker and performs the actual database/storage operations after validating capabilities.

### Wrangler Configuration

Sandboxing requires Dynamic Worker Loader. Add to your `wrangler.jsonc`:

```jsonc
{
	"worker_loaders": [{ "binding": "LOADER" }],
	"r2_buckets": [{ "binding": "MEDIA", "bucket_name": "emdash-media" }],
	"d1_databases": [{ "binding": "DB", "database_name": "emdash" }]
}
```

## Node.js Deployments

<Aside type="danger" title="No isolation on Node.js">
	Node.js does not support plugin sandboxing. All plugins run in trusted mode regardless of configuration. There is no V8 isolate boundary, no resource limits, and no capability enforcement at the runtime level.
</Aside>

When deploying to Node.js (or any non-Cloudflare platform):

- The `NoopSandboxRunner` is used. It returns `isAvailable() === false`.
- Attempting to load sandboxed plugins throws `SandboxNotAvailableError`.
- All plugins must be registered as trusted plugins in the `plugins` array.
- Capability declarations are purely informational — they are not enforced.

### What This Means for Security

| Threat | Cloudflare (Sandboxed) | Node.js (Trusted only) |
|---|---|---|
| Plugin reads data it shouldn't | Blocked by bridge capability checks | **Not prevented** — plugin has full DB access |
| Plugin makes unauthorized network calls | Blocked by `globalOutbound: null` + host allowlist | **Not prevented** — plugin can call `fetch()` directly |
| Plugin exhausts CPU | Isolate aborted by Worker Loader | **Not prevented** — blocks the event loop |
| Plugin exhausts memory | Isolate terminated by Worker Loader | **Not prevented** — can crash the process |
| Plugin accesses environment variables | No access (isolated V8 context) | **Not prevented** — shares `process.env` |
| Plugin accesses filesystem | No filesystem in Workers | **Not prevented** — full `fs` access |

### Recommendations for Node.js Deployments

1. **Only install plugins from trusted sources.** Review the source code of any plugin before installing. Prefer plugins published by known maintainers.
2. **Use capability declarations as a review checklist.** Even though capabilities aren't enforced, they document the plugin's intended scope. A plugin declaring `["network:fetch"]` that doesn't need network access is suspicious.
3. **Monitor resource usage.** Use process-level monitoring (e.g., `--max-old-space-size`, health checks) to catch runaway plugins.
4. **Consider Cloudflare for untrusted plugins.** If you need to run plugins from unknown sources (e.g., a marketplace), deploy on Cloudflare Workers where sandboxing is available.

## Same API, Different Guarantees

A plugin's code is identical regardless of execution mode. The `definePlugin()` API, context shape, hooks, routes, and storage all work the same way. What changes is the **enforcement**:

```typescript
// This plugin works in both trusted and sandboxed mode
export default definePlugin({
	id: "analytics",
	version: "1.0.0",
	capabilities: ["read:content", "network:fetch"],
	allowedHosts: ["api.analytics.example.com"],
	hooks: {
		"content:afterSave": async (event, ctx) => {
			// In trusted mode: ctx.http is always present (capabilities not enforced)
			// In sandboxed mode: ctx.http is present because "network:fetch" is declared
			await ctx.http.fetch("https://api.analytics.example.com/track", {
				method: "POST",
				body: JSON.stringify({ contentId: event.content.id }),
			});
		},
	},
});
```

The goal is to let plugin authors develop locally in trusted mode (faster iteration, easier debugging) and deploy to sandboxed mode in production without code changes.

```

File: /Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/src/index.ts
```ts
/**
 * Marketplace Test Plugin for EmDash CMS
 *
 * A self-contained plugin designed for end-to-end testing of the marketplace
 * publish → audit → approval pipeline. Includes:
 * - Backend sandbox code (content:beforeSave hook)
 * - Icon and screenshot assets
 * - Full manifest with capabilities
 *
 * Usage:
 *   emdash plugin bundle --dir packages/plugins/marketplace-test
 *   emdash plugin publish dist/marketplace-test-0.1.0.tar.gz --registry <url>
 */

import type { PluginDescriptor } from "emdash";

/**
 * Plugin factory -- returns a descriptor for the integration.
 */
export function marketplaceTestPlugin(): PluginDescriptor {
	return {
		id: "marketplace-test",
		version: "0.1.0",
		format: "standard",
		entrypoint: "@emdash-cms/plugin-marketplace-test/sandbox",
		capabilities: ["read:content", "write:content"],
		allowedHosts: [],
		storage: {
			events: { indexes: ["timestamp", "type"] },
		},
	};
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/state.ts
```ts
/**
 * Plugin State Repository
 *
 * Database-backed storage for plugin activation state.
 * Used by the admin API to persist plugin enable/disable across restarts.
 */

import type { Kysely } from "kysely";

import type { Database } from "../database/types.js";

export type PluginStatus = "active" | "inactive";
export type PluginSource = "config" | "marketplace";

function toPluginStatus(value: string): PluginStatus {
	if (value === "active") return "active";
	return "inactive";
}

function toPluginSource(value: string | undefined | null): PluginSource {
	if (value === "marketplace") return "marketplace";
	return "config";
}

export interface PluginState {
	pluginId: string;
	status: PluginStatus;
	version: string;
	installedAt: Date;
	activatedAt: Date | null;
	deactivatedAt: Date | null;
	source: PluginSource;
	marketplaceVersion: string | null;
	displayName: string | null;
	description: string | null;
}

/**
 * Repository for plugin state in the database
 */
export class PluginStateRepository {
	constructor(private db: Kysely<Database>) {}

	/**
	 * Get state for a specific plugin
	 */
	async get(pluginId: string): Promise<PluginState | null> {
		const row = await this.db
			.selectFrom("_plugin_state")
			.selectAll()
			.where("plugin_id", "=", pluginId)
			.executeTakeFirst();

		if (!row) return null;

		return {
			pluginId: row.plugin_id,
			status: toPluginStatus(row.status),
			version: row.version,
			installedAt: new Date(row.installed_at),
			activatedAt: row.activated_at ? new Date(row.activated_at) : null,
			deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
			source: toPluginSource(row.source),
			marketplaceVersion: row.marketplace_version ?? null,
			displayName: row.display_name ?? null,
			description: row.description ?? null,
		};
	}

	/**
	 * Get all plugin states
	 */
	async getAll(): Promise<PluginState[]> {
		const rows = await this.db.selectFrom("_plugin_state").selectAll().execute();

		return rows.map((row) => ({
			pluginId: row.plugin_id,
			status: toPluginStatus(row.status),
			version: row.version,
			installedAt: new Date(row.installed_at),
			activatedAt: row.activated_at ? new Date(row.activated_at) : null,
			deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
			source: toPluginSource(row.source),
			marketplaceVersion: row.marketplace_version ?? null,
			displayName: row.display_name ?? null,
			description: row.description ?? null,
		}));
	}

	/**
	 * Get all marketplace-installed plugin states
	 */
	async getMarketplacePlugins(): Promise<PluginState[]> {
		const rows = await this.db
			.selectFrom("_plugin_state")
			.selectAll()
			.where("source", "=", "marketplace")
			.execute();

		return rows.map((row) => ({
			pluginId: row.plugin_id,
			status: toPluginStatus(row.status),
			version: row.version,
			installedAt: new Date(row.installed_at),
			activatedAt: row.activated_at ? new Date(row.activated_at) : null,
			deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
			source: toPluginSource(row.source),
			marketplaceVersion: row.marketplace_version ?? null,
			displayName: row.display_name ?? null,
			description: row.description ?? null,
		}));
	}

	/**
	 * Create or update plugin state
	 */
	async upsert(
		pluginId: string,
		version: string,
		status: PluginStatus,
		opts?: {
			source?: PluginSource;
			marketplaceVersion?: string;
			displayName?: string;
			description?: string;
		},
	): Promise<PluginState> {
		const now = new Date().toISOString();
		const existing = await this.get(pluginId);

		if (existing) {
			// Update existing state
			const updates: Record<string, string | null> = {
				status,
				version,
			};

			if (status === "active" && existing.status !== "active") {
				updates.activated_at = now;
			} else if (status === "inactive" && existing.status !== "inactive") {
				updates.deactivated_at = now;
			}

			if (opts?.source) updates.source = opts.source;
			if (opts?.marketplaceVersion !== undefined) {
				updates.marketplace_version = opts.marketplaceVersion;
			}
			if (opts?.displayName !== undefined) {
				updates.display_name = opts.displayName;
			}
			if (opts?.description !== undefined) {
				updates.description = opts.description;
			}

			await this.db
				.updateTable("_plugin_state")
				.set(updates)
				.where("plugin_id", "=", pluginId)
				.execute();
		} else {
			// Create new state
			await this.db
				.insertInto("_plugin_state")
				.values({
					plugin_id: pluginId,
					status,
					version,
					installed_at: now,
					activated_at: status === "active" ? now : null,
					deactivated_at: null,
					data: null,
					source: opts?.source ?? "config",
					marketplace_version: opts?.marketplaceVersion ?? null,
					display_name: opts?.displayName ?? null,
					description: opts?.description ?? null,
				})
				.execute();
		}

		return (await this.get(pluginId))!;
	}

	/**
	 * Enable a plugin
	 */
	async enable(pluginId: string, version: string): Promise<PluginState> {
		return this.upsert(pluginId, version, "active");
	}

	/**
	 * Disable a plugin
	 */
	async disable(pluginId: string, version: string): Promise<PluginState> {
		return this.upsert(pluginId, version, "inactive");
	}

	/**
	 * Delete plugin state
	 */
	async delete(pluginId: string): Promise<boolean> {
		const result = await this.db
			.deleteFrom("_plugin_state")
			.where("plugin_id", "=", pluginId)
			.executeTakeFirst();

		return (result.numDeletedRows ?? 0) > 0;
	}
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/manifest-schema.ts
```ts
/**
 * Zod schema for PluginManifest validation
 *
 * Used to validate manifest.json from plugin bundles at every parse site:
 * - Client-side download (marketplace.ts extractBundle)
 * - R2 load (api/handlers/marketplace.ts loadBundleFromR2)
 * - CLI publish preview (cli/commands/publish.ts readManifestFromTarball)
 * - Marketplace ingest extends this with publishing-specific fields
 */

import { z } from "zod";

// ── Enum values (must stay in sync with types.ts) ───────────────

export const PLUGIN_CAPABILITIES = [
	"network:fetch",
	"network:fetch:any",
	"read:content",
	"write:content",
	"read:media",
	"write:media",
	"read:users",
	"email:send",
	"email:provide",
	"email:intercept",
	"page:inject",
] as const;

/** Must stay in sync with FieldType in schema/types.ts */
const FIELD_TYPES = [
	"string",
	"text",
	"number",
	"integer",
	"boolean",
	"datetime",
	"select",
	"multiSelect",
	"portableText",
	"image",
	"file",
	"reference",
	"json",
	"slug",
] as const;

export const HOOK_NAMES = [
	"plugin:install",
	"plugin:activate",
	"plugin:deactivate",
	"plugin:uninstall",
	"content:beforeSave",
	"content:afterSave",
	"content:beforeDelete",
	"content:afterDelete",
	"media:beforeUpload",
	"media:afterUpload",
	"cron",
	"email:beforeSend",
	"email:deliver",
	"email:afterSend",
	"comment:beforeCreate",
	"comment:moderate",
	"comment:afterCreate",
	"comment:afterModerate",
	"page:metadata",
	"page:fragments",
] as const;

/**
 * Structured hook entry for manifest — name plus optional metadata.
 * During a transition period, both plain strings and objects are accepted.
 */
const manifestHookEntrySchema = z.object({
	name: z.enum(HOOK_NAMES),
	exclusive: z.boolean().optional(),
	priority: z.number().int().optional(),
	timeout: z.number().int().positive().optional(),
});

/**
 * Structured route entry for manifest — name plus optional metadata.
 * Both plain strings and objects are accepted; strings are normalized
 * to `{ name }` objects via `normalizeManifestRoute()`.
 */
/** Route names must be safe path segments — alphanumeric, hyphens, underscores, forward slashes */
const routeNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_\-/]*$/;

const manifestRouteEntrySchema = z.object({
	name: z.string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
	public: z.boolean().optional(),
});

// ── Sub-schemas ─────────────────────────────────────────────────

/** Index field names must be valid identifiers to prevent SQL injection via JSON path expressions */
const indexFieldName = z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/);

const storageCollectionSchema = z.object({
	indexes: z.array(z.union([indexFieldName, z.array(indexFieldName)])),
	uniqueIndexes: z.array(z.union([indexFieldName, z.array(indexFieldName)])).optional(),
});

const baseSettingFields = {
	label: z.string(),
	description: z.string().optional(),
};

const settingFieldSchema = z.discriminatedUnion("type", [
	z.object({
		...baseSettingFields,
		type: z.literal("string"),
		default: z.string().optional(),
		multiline: z.boolean().optional(),
	}),
	z.object({
		...baseSettingFields,
		type: z.literal("number"),
		default: z.number().optional(),
		min: z.number().optional(),
		max: z.number().optional(),
	}),
	z.object({ ...baseSettingFields, type: z.literal("boolean"), default: z.boolean().optional() }),
	z.object({
		...baseSettingFields,
		type: z.literal("select"),
		options: z.array(z.object({ value: z.string(), label: z.string() })),
		default: z.string().optional(),
	}),
	z.object({ ...baseSettingFields, type: z.literal("secret") }),
]);

const adminPageSchema = z.object({
	path: z.string(),
	label: z.string(),
	icon: z.string().optional(),
});

const dashboardWidgetSchema = z.object({
	id: z.string(),
	size: z.enum(["full", "half", "third"]).optional(),
	title: z.string().optional(),
});

const pluginAdminConfigSchema = z.object({
	entry: z.string().optional(),
	settingsSchema: z.record(z.string(), settingFieldSchema).optional(),
	pages: z.array(adminPageSchema).optional(),
	widgets: z.array(dashboardWidgetSchema).optional(),
	fieldWidgets: z
		.array(
			z.object({
				name: z.string().min(1),
				label: z.string().min(1),
				fieldTypes: z.array(z.enum(FIELD_TYPES)),
				elements: z
					.array(
						z
							.object({
								type: z.string(),
								action_id: z.string(),
								label: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
			}),
		)
		.optional(),
});

// ── Main schema ─────────────────────────────────────────────────

/**
 * Zod schema matching the PluginManifest interface from types.ts.
 *
 * Every JSON.parse of a manifest.json should validate through this.
 */
export const pluginManifestSchema = z.object({
	id: z.string().min(1),
	version: z.string().min(1),
	capabilities: z.array(z.enum(PLUGIN_CAPABILITIES)),
	allowedHosts: z.array(z.string()),
	storage: z.record(z.string(), storageCollectionSchema),
	/**
	 * Hook declarations — accepts both plain name strings (legacy) and
	 * structured objects with exclusive/priority/timeout metadata.
	 * Plain strings are normalized to `{ name }` objects after parsing.
	 */
	hooks: z.array(z.union([z.enum(HOOK_NAMES), manifestHookEntrySchema])),
	/**
	 * Route declarations — accepts both plain name strings and
	 * structured objects with public metadata.
	 * Plain strings are normalized to `{ name }` objects after parsing.
	 */
	routes: z.array(
		z.union([
			z.string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
			manifestRouteEntrySchema,
		]),
	),
	admin: pluginAdminConfigSchema,
});

export type ValidatedPluginManifest = z.infer<typeof pluginManifestSchema>;

/**
 * Normalize a manifest hook entry — plain strings become `{ name }` objects.
 */
export function normalizeManifestHook(
	entry: string | { name: string; exclusive?: boolean; priority?: number; timeout?: number },
): { name: string; exclusive?: boolean; priority?: number; timeout?: number } {
	if (typeof entry === "string") {
		return { name: entry };
	}
	return entry;
}

/**
 * Normalize a manifest route entry — plain strings become `{ name }` objects.
 */
export function normalizeManifestRoute(entry: string | { name: string; public?: boolean }): {
	name: string;
	public?: boolean;
} {
	if (typeof entry === "string") {
		return { name: entry };
	}
	return entry;
}

```

File: /Users/masonjames/Projects/emdash/packages/plugins/atproto/src/sandbox-entry.ts
```ts
/**
 * Sandbox Entry Point -- AT Protocol
 *
 * Canonical plugin implementation using the standard format.
 * The bundler (tsdown) inlines all local imports from atproto.ts,
 * bluesky.ts, and standard-site.ts into a single self-contained file.
 */

import { definePlugin } from "emdash";
import type { PluginContext } from "emdash";

import {
	ensureSession,
	createRecord,
	putRecord,
	deleteRecord,
	rkeyFromUri,
	uploadBlob,
	requireHttp,
} from "./atproto.js";
import { buildBskyPost } from "./bluesky.js";
import { buildPublication, buildDocument } from "./standard-site.js";

// ── Types ───────────────────────────────────────────────────────

interface SyndicationRecord {
	collection: string;
	contentId: string;
	atUri: string;
	atCid: string;
	bskyPostUri?: string;
	bskyPostCid?: string;
	publishedAt: string;
	lastSyncedAt: string;
	status: "synced" | "error" | "pending";
	errorMessage?: string;
	retryCount?: number;
}

// ── Helpers ─────────────────────────────────────────────────────

async function isCollectionAllowed(ctx: PluginContext, collection: string): Promise<boolean> {
	const setting = await ctx.kv.get<string>("settings:collections");
	if (!setting || setting.trim() === "") return true;
	const allowed = setting.split(",").map((s) => s.trim().toLowerCase());
	return allowed.includes(collection.toLowerCase());
}

async function syndicateContent(
	ctx: PluginContext,
	collection: string,
	contentId: string,
	content: Record<string, unknown>,
): Promise<void> {
	const storageKey = `${collection}:${contentId}`;
	const existing = (await ctx.storage.records!.get(storageKey)) as SyndicationRecord | null;

	if (existing && existing.status === "synced") {
		const syncOnUpdate = (await ctx.kv.get<boolean>("settings:syncOnUpdate")) ?? true;
		if (!syncOnUpdate) return;
	}

	const siteUrl = await ctx.kv.get<string>("settings:siteUrl");
	if (!siteUrl) throw new Error("Site URL not configured");

	const publicationUri = await ctx.kv.get<string>("state:publicationUri");
	if (!publicationUri)
		throw new Error("Publication record not created yet. Use Sync Publication first.");

	const { accessJwt, did, pdsHost } = await ensureSession(ctx);

	// Upload cover image if present
	let coverImageBlob;
	const rawCoverImage = content.cover_image as string | undefined;
	if (rawCoverImage) {
		let imageUrl = rawCoverImage;
		if (imageUrl.startsWith("/")) imageUrl = `${siteUrl}${imageUrl}`;

		if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
			try {
				const http = requireHttp(ctx);
				const imageRes = await http.fetch(imageUrl);
				if (imageRes.ok) {
					const bytes = await imageRes.arrayBuffer();
					if (bytes.byteLength <= 1_000_000) {
						const mimeType = imageRes.headers.get("content-type") || "image/jpeg";
						coverImageBlob = await uploadBlob(ctx, pdsHost, accessJwt, bytes, mimeType);
					}
				}
			} catch (error) {
				ctx.log.warn("Failed to upload cover image, skipping", error);
			}
		}
	}

	let bskyPostRef: { uri: string; cid: string } | undefined;

	if (existing && existing.atUri) {
		const rkey = rkeyFromUri(existing.atUri);
		const doc = buildDocument({
			publicationUri,
			content,
			coverImageBlob,
			bskyPostRef:
				existing.bskyPostUri && existing.bskyPostCid
					? { uri: existing.bskyPostUri, cid: existing.bskyPostCid }
					: undefined,
		});

		const result = await putRecord(
			ctx,
			pdsHost,
			accessJwt,
			did,
			"site.standard.document",
			rkey,
			doc,
		);

		await ctx.storage.records!.put(storageKey, {
			collection: existing.collection,
			contentId: existing.contentId,
			atUri: result.uri,
			atCid: result.cid,
			bskyPostUri: existing.bskyPostUri,
			bskyPostCid: existing.bskyPostCid,
			publishedAt: existing.publishedAt,
			lastSyncedAt: new Date().toISOString(),
			status: "synced",
			retryCount: 0,
		} satisfies SyndicationRecord);

		ctx.log.info(`Updated AT Protocol document for ${collection}/${contentId}`);
	} else {
		const doc = buildDocument({ publicationUri, content, coverImageBlob });
		const result = await createRecord(ctx, pdsHost, accessJwt, did, "site.standard.document", doc);

		const enableCrosspost = (await ctx.kv.get<boolean>("settings:enableBskyCrosspost")) ?? true;
		if (enableCrosspost) {
			try {
				const template =
					(await ctx.kv.get<string>("settings:crosspostTemplate")) || "{title}\n\n{url}";
				const langsStr = (await ctx.kv.get<string>("settings:langs")) || "en";
				const langs = langsStr
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean)
					.slice(0, 3);
				const post = buildBskyPost({
					template,
					content,
					siteUrl,
					thumbBlob: coverImageBlob,
					langs,
				});

				const postResult = await createRecord(
					ctx,
					pdsHost,
					accessJwt,
					did,
					"app.bsky.feed.post",
					post,
				);
				bskyPostRef = { uri: postResult.uri, cid: postResult.cid };

				const rkey = rkeyFromUri(result.uri);
				const updatedDoc = buildDocument({ publicationUri, content, coverImageBlob, bskyPostRef });
				await putRecord(ctx, pdsHost, accessJwt, did, "site.standard.document", rkey, updatedDoc);

				ctx.log.info(`Cross-posted ${collection}/${contentId} to Bluesky`);
			} catch (error) {
				ctx.log.warn("Failed to cross-post to Bluesky, document still synced", error);
			}
		}

		await ctx.storage.records!.put(storageKey, {
			collection,
			contentId,
			atUri: result.uri,
			atCid: result.cid,
			bskyPostUri: bskyPostRef?.uri,
			bskyPostCid: bskyPostRef?.cid,
			publishedAt: (content.published_at as string) || new Date().toISOString(),
			lastSyncedAt: new Date().toISOString(),
			status: "synced",
		} satisfies SyndicationRecord);

		ctx.log.info(`Created AT Protocol document for ${collection}/${contentId}`);
	}
}

// ── Plugin definition ───────────────────────────────────────────

export default definePlugin({
	hooks: {
		"plugin:install": async (_event: unknown, ctx: PluginContext) => {
			ctx.log.info("AT Protocol plugin installed");
		},

		"content:afterSave": {
			handler: async (
				event: { content: Record<string, unknown>; collection: string; isNew: boolean },
				ctx: PluginContext,
			) => {
				const { content, collection } = event;
				const contentId = typeof content.id === "string" ? content.id : String(content.id);
				const status = content.status as string | undefined;

				if (status !== "published") return;
				if (!(await isCollectionAllowed(ctx, collection))) return;

				try {
					await syndicateContent(ctx, collection, contentId, content);
				} catch (error) {
					ctx.log.error(`Failed to syndicate ${collection}/${contentId}`, error);

					const storageKey = `${collection}:${contentId}`;
					const existing = await ctx.storage.records!.get(storageKey);
					const record = (existing as SyndicationRecord | null) || {
						collection,
						contentId,
						atUri: "",
						atCid: "",
						publishedAt: new Date().toISOString(),
					};

					await ctx.storage.records!.put(storageKey, {
						...record,
						status: "error",
						lastSyncedAt: new Date().toISOString(),
						errorMessage: error instanceof Error ? error.message : String(error),
						retryCount: ((record as SyndicationRecord).retryCount || 0) + 1,
					});
				}
			},
		},

		"content:afterDelete": {
			handler: async (event: { id: string; collection: string }, ctx: PluginContext) => {
				const { id, collection } = event;
				const deleteOnUnpublish = (await ctx.kv.get<boolean>("settings:deleteOnUnpublish")) ?? true;
				if (!deleteOnUnpublish) return;

				const storageKey = `${collection}:${id}`;
				const existing = (await ctx.storage.records!.get(storageKey)) as SyndicationRecord | null;
				if (!existing || !existing.atUri) return;

				try {
					const { accessJwt, did, pdsHost } = await ensureSession(ctx);
					const rkey = rkeyFromUri(existing.atUri);
					await deleteRecord(ctx, pdsHost, accessJwt, did, "site.standard.document", rkey);

					if (existing.bskyPostUri) {
						const postRkey = rkeyFromUri(existing.bskyPostUri);
						await deleteRecord(ctx, pdsHost, accessJwt, did, "app.bsky.feed.post", postRkey);
					}

					await ctx.storage.records!.delete(storageKey);
					ctx.log.info(`Deleted AT Protocol records for ${collection}/${id}`);
				} catch (error) {
					ctx.log.error(`Failed to delete AT Protocol records for ${collection}/${id}`, error);
				}
			},
		},

		"page:metadata": async (
			event: { page: { content?: { collection: string; id: string } } },
			ctx: PluginContext,
		) => {
			const pageContent = event.page.content;
			if (!pageContent) return null;

			const storageKey = `${pageContent.collection}:${pageContent.id}`;
			const record = (await ctx.storage.records!.get(storageKey)) as SyndicationRecord | null;

			if (!record || !record.atUri || record.status !== "synced") return null;

			return {
				kind: "link" as const,
				rel: "site.standard.document",
				href: record.atUri,
				key: "atproto-document",
			};
		},
	},

	routes: {
		status: {
			handler: async (_routeCtx: unknown, ctx: PluginContext) => {
				try {
					const handle = await ctx.kv.get<string>("settings:handle");
					const did = await ctx.kv.get<string>("state:did");
					const pubUri = await ctx.kv.get<string>("state:publicationUri");
					const synced = await ctx.storage.records!.count({
						status: "synced",
					});
					const errors = await ctx.storage.records!.count({
						status: "error",
					});
					const pending = await ctx.storage.records!.count({
						status: "pending",
					});

					return {
						configured: !!handle,
						connected: !!did,
						handle: handle || null,
						did: did || null,
						publicationUri: pubUri || null,
						stats: { synced, errors, pending },
					};
				} catch (error) {
					ctx.log.error("Failed to get status", error);
					return {
						configured: false,
						connected: false,
						handle: null,
						did: null,
						publicationUri: null,
						stats: { synced: 0, errors: 0, pending: 0 },
					};
				}
			},
		},

		"test-connection": {
			handler: async (_routeCtx: unknown, ctx: PluginContext) => {
				try {
					const session = await ensureSession(ctx);
					return {
						success: true,
						did: session.did,
						pdsHost: session.pdsHost,
					};
				} catch (error) {
					return {
						success: false,
						error: error instanceof Error ? error.message : String(error),
					};
				}
			},
		},

		"sync-publication": {
			handler: async (_routeCtx: unknown, ctx: PluginContext) => {
				try {
					const siteUrl = await ctx.kv.get<string>("settings:siteUrl");
					const siteName = await ctx.kv.get<string>("settings:siteName");
					if (!siteUrl || !siteName)
						return {
							success: false,
							error: "Site URL and name are required",
						};

					const { accessJwt, did, pdsHost } = await ensureSession(ctx);
					const publication = buildPublication(siteUrl, siteName);
					const existingUri = await ctx.kv.get<string>("state:publicationUri");

					let result;
					if (existingUri) {
						const rkey = rkeyFromUri(existingUri);
						result = await putRecord(
							ctx,
							pdsHost,
							accessJwt,
							did,
							"site.standard.publication",
							rkey,
							publication,
						);
					} else {
						result = await createRecord(
							ctx,
							pdsHost,
							accessJwt,
							did,
							"site.standard.publication",
							publication,
						);
					}

					await ctx.kv.set("state:publicationUri", result.uri);
					await ctx.kv.set("state:publicationCid", result.cid);
					return {
						success: true,
						uri: result.uri,
						cid: result.cid,
					};
				} catch (error) {
					return {
						success: false,
						error: error instanceof Error ? error.message : String(error),
					};
				}
			},
		},

		"recent-syncs": {
			handler: async (_routeCtx: unknown, ctx: PluginContext) => {
				try {
					const result = await ctx.storage.records!.query({
						orderBy: { lastSyncedAt: "desc" },
						limit: 20,
					});
					return {
						items: result.items.map((item: { id: string; data: unknown }) => ({
							id: item.id,
							...(item.data as SyndicationRecord),
						})),
					};
				} catch (error) {
					ctx.log.error("Failed to get recent syncs", error);
					return { items: [] };
				}
			},
		},

		verification: {
			handler: async (_routeCtx: unknown, ctx: PluginContext) => {
				const pubUri = await ctx.kv.get<string>("state:publicationUri");
				const siteUrl = await ctx.kv.get<string>("settings:siteUrl");
				return {
					publicationUri: pubUri || null,
					siteUrl: siteUrl || null,
					wellKnownPath: "/.well-known/site.standard.publication",
					wellKnownContent: pubUri || "(not configured yet)",
				};
			},
		},

		admin: {
			handler: async (routeCtx: any, ctx: PluginContext) => {
				const interaction = routeCtx.input as {
					type: string;
					page?: string;
					action_id?: string;
					values?: Record<string, unknown>;
				};

				if (interaction.type === "page_load" && interaction.page === "widget:sync-status") {
					return buildSyncWidget(ctx);
				}
				if (interaction.type === "page_load" && interaction.page === "/status") {
					return buildStatusPage(ctx);
				}
				if (interaction.type === "form_submit" && interaction.action_id === "save_settings") {
					return saveSettings(ctx, interaction.values ?? {});
				}
				if (interaction.type === "block_action" && interaction.action_id === "test_connection") {
					return testConnection(ctx);
				}
				return { blocks: [] };
			},
		},
	},
});

// ── Block Kit admin helpers ─────────────────────────────────────

async function buildSyncWidget(ctx: PluginContext) {
	try {
		const handle = await ctx.kv.get<string>("settings:handle");
		const did = await ctx.kv.get<string>("state:did");
		const synced = await ctx.storage.records!.count({ status: "synced" });
		const errors = await ctx.storage.records!.count({ status: "error" });

		if (!handle) {
			return {
				blocks: [
					{ type: "context", text: "Not configured -- set your handle in AT Protocol settings." },
				],
			};
		}

		return {
			blocks: [
				{
					type: "fields",
					fields: [
						{ label: "Handle", value: `@${handle}` },
						{ label: "Status", value: did ? "Connected" : "Not connected" },
						{ label: "Synced", value: String(synced) },
						{ label: "Errors", value: String(errors) },
					],
				},
			],
		};
	} catch (error) {
		ctx.log.error("Failed to build sync widget", error);
		return { blocks: [{ type: "context", text: "Failed to load status" }] };
	}
}

async function buildStatusPage(ctx: PluginContext) {
	try {
		const handle = await ctx.kv.get<string>("settings:handle");
		const appPassword = await ctx.kv.get<string>("settings:appPassword");
		const pdsHost = await ctx.kv.get<string>("settings:pdsHost");
		const siteUrl = await ctx.kv.get<string>("settings:siteUrl");
		const enableCrosspost = await ctx.kv.get<boolean>("settings:enableCrosspost");
		const did = await ctx.kv.get<string>("state:did");
		const pubUri = await ctx.kv.get<string>("state:publicationUri");

		const blocks: unknown[] = [
			{ type: "header", text: "AT Protocol" },
			{
				type: "section",
				text: "Syndicate content to the AT Protocol network (Bluesky, standard.site).",
			},
			{ type: "divider" },
		];

		if (did) {
			blocks.push({
				type: "banner",
				style: "success",
				text: `Connected as ${handle} (${did})`,
			});
		} else if (handle) {
			blocks.push({
				type: "banner",
				style: "warning",
				text: "Handle configured but not yet connected. Save settings and test the connection.",
			});
		}

		blocks.push({
			type: "form",
			block_id: "atproto-settings",
			fields: [
				{
					type: "text_input",
					action_id: "handle",
					label: "AT Protocol Handle",
					initial_value: handle ?? "",
				},
				{ type: "secret_input", action_id: "appPassword", label: "App Password" },
				{
					type: "text_input",
					action_id: "pdsHost",
					label: "PDS Host",
					initial_value: pdsHost ?? "https://bsky.social",
				},
				{
					type: "text_input",
					action_id: "siteUrl",
					label: "Site URL",
					initial_value: siteUrl ?? "",
				},
				{
					type: "toggle",
					action_id: "enableCrosspost",
					label: "Cross-post to Bluesky",
					initial_value: enableCrosspost ?? false,
				},
			],
			submit: { label: "Save Settings", action_id: "save_settings" },
		});

		blocks.push({
			type: "actions",
			elements: [
				{
					type: "button",
					text: "Test Connection",
					action_id: "test_connection",
					style: handle && appPassword ? "primary" : undefined,
				},
			],
		});

		if (did) {
			const result = await ctx.storage.records!.query({
				orderBy: { lastSyncedAt: "desc" },
				limit: 10,
			});
			const items = result.items.map((item: { id: string; data: unknown }) => ({
				id: item.id,
				...(item.data as SyndicationRecord),
			}));

			if (items.length > 0) {
				blocks.push(
					{ type: "divider" },
					{ type: "header", text: "Recent Syncs" },
					{
						type: "table",
						columns: [
							{ key: "collection", label: "Collection", format: "text" },
							{ key: "contentId", label: "Content", format: "code" },
							{ key: "status", label: "Status", format: "badge" },
							{ key: "lastSyncedAt", label: "Synced", format: "relative_time" },
						],
						rows: items.map((r) => ({
							collection: r.collection,
							contentId: r.contentId,
							status: r.status,
							lastSyncedAt: r.lastSyncedAt,
						})),
						emptyText: "No syncs yet",
					},
				);
			}

			if (pubUri) {
				blocks.push(
					{ type: "divider" },
					{ type: "header", text: "Verification" },
					{
						type: "fields",
						fields: [
							{ label: "Publication URI", value: pubUri },
							{ label: "Well-known path", value: "/.well-known/site.standard.publication" },
						],
					},
					{
						type: "context",
						text: "Add this path to your site to verify ownership on the AT Protocol network.",
					},
				);
			}
		}

		return { blocks };
	} catch (error) {
		ctx.log.error("Failed to build status page", error);
		return { blocks: [{ type: "banner", style: "error", text: "Failed to load settings" }] };
	}
}

async function saveSettings(ctx: PluginContext, values: Record<string, unknown>) {
	try {
		if (typeof values.handle === "string") await ctx.kv.set("settings:handle", values.handle);
		if (typeof values.appPassword === "string" && values.appPassword)
			await ctx.kv.set("settings:appPassword", values.appPassword);
		if (typeof values.pdsHost === "string") await ctx.kv.set("settings:pdsHost", values.pdsHost);
		if (typeof values.siteUrl === "string") await ctx.kv.set("settings:siteUrl", values.siteUrl);
		if (typeof values.enableCrosspost === "boolean")
			await ctx.kv.set("settings:enableCrosspost", values.enableCrosspost);

		const page = await buildStatusPage(ctx);
		return { ...page, toast: { message: "Settings saved", type: "success" } };
	} catch (error) {
		ctx.log.error("Failed to save settings", error);
		return {
			blocks: [{ type: "banner", style: "error", text: "Failed to save settings" }],
			toast: { message: "Failed to save settings", type: "error" },
		};
	}
}

async function testConnection(ctx: PluginContext) {
	try {
		const session = await ensureSession(ctx);
		const page = await buildStatusPage(ctx);
		return {
			...page,
			toast: { message: `Connected to ${session.pdsHost} as ${session.did}`, type: "success" },
		};
	} catch (error) {
		const page = await buildStatusPage(ctx);
		return {
			...page,
			toast: {
				message: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				type: "error",
			},
		};
	}
}

```

File: /Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/src/sandbox-entry.ts
```ts
/**
 * Sandbox Entry Point
 *
 * Canonical plugin implementation using the standard format.
 * Runs in both trusted (in-process) and sandboxed (isolate) modes.
 */

import { definePlugin } from "emdash";
import type { PluginContext } from "emdash";

interface HookEvent {
	content?: Record<string, unknown>;
	collection?: string;
	isNew?: boolean;
}

export default definePlugin({
	hooks: {
		"content:beforeSave": {
			handler: async (event: HookEvent, ctx: PluginContext) => {
				ctx.log.info("[marketplace-test] beforeSave fired", {
					collection: event.collection,
					isNew: event.isNew,
				});

				// Record execution in storage
				await ctx.storage.events.put(`hook-${Date.now()}`, {
					timestamp: new Date().toISOString(),
					type: "content:beforeSave",
					collection: event.collection,
					isNew: event.isNew,
				});

				return event.content;
			},
		},
	},

	routes: {
		ping: {
			handler: async (_ctx: { input: unknown; request: unknown }, pluginCtx: PluginContext) => ({
				pong: true,
				pluginId: pluginCtx.plugin.id,
				timestamp: Date.now(),
			}),
		},

		events: {
			handler: async (_ctx: { input: unknown; request: unknown }, pluginCtx: PluginContext) => {
				const result = await pluginCtx.storage.events.query({ limit: 10 });
				return { count: result.items.length, items: result.items };
			},
		},
	},
});

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/api-routes.mdx
```mdx
---
title: Plugin API Routes
description: Expose REST endpoints from your plugin for admin UI and external integrations.
---

import { Aside, Tabs, TabItem } from "@astrojs/starlight/components";

Plugins can expose API routes for their admin UI components or external integrations. Routes receive the full plugin context and can access storage, KV, content, and media.

<Aside type="note">
	API routes are a **trusted-plugin-only** feature. Sandboxed plugins cannot define custom REST
	endpoints. Use Block Kit admin pages and hooks instead.
</Aside>

## Defining Routes

Define routes in the `routes` object:

```typescript
import { definePlugin } from "emdash";
import { z } from "astro/zod";

export default definePlugin({
	id: "forms",
	version: "1.0.0",

	storage: {
		submissions: {
			indexes: ["formId", "status", "createdAt"],
		},
	},

	routes: {
		// Simple route
		status: {
			handler: async (ctx) => {
				return { ok: true, plugin: ctx.plugin.id };
			},
		},

		// Route with input validation
		submissions: {
			input: z.object({
				formId: z.string().optional(),
				limit: z.number().default(50),
				cursor: z.string().optional(),
			}),
			handler: async (ctx) => {
				const { formId, limit, cursor } = ctx.input;

				const result = await ctx.storage.submissions!.query({
					where: formId ? { formId } : undefined,
					orderBy: { createdAt: "desc" },
					limit,
					cursor,
				});

				return {
					items: result.items,
					cursor: result.cursor,
					hasMore: result.hasMore,
				};
			},
		},
	},
});
```

## Route URLs

Routes mount at `/_emdash/api/plugins/<plugin-id>/<route-name>`:

| Plugin ID | Route Name      | URL                                        |
| --------- | --------------- | ------------------------------------------ |
| `forms`   | `status`        | `/_emdash/api/plugins/forms/status`      |
| `forms`   | `submissions`   | `/_emdash/api/plugins/forms/submissions` |
| `seo`     | `settings/save` | `/_emdash/api/plugins/seo/settings/save` |

Route names can include slashes for nested paths.

## Route Handler

The handler receives a `RouteContext` with the plugin context plus request-specific data:

```typescript
interface RouteContext extends PluginContext {
	input: TInput; // Validated input (from body or query params)
	request: Request; // Original Request object
}
```

### Return Values

Return any JSON-serializable value:

```typescript
// Object
return { success: true, data: items };

// Array
return items;

// Primitive
return 42;
```

<Aside type="note">
	Routes always return JSON. The response has `Content-Type: application/json`.
</Aside>

### Errors

Throw to return an error response:

```typescript
handler: async (ctx) => {
	const item = await ctx.storage.items!.get(ctx.input.id);

	if (!item) {
		throw new Error("Item not found");
		// Returns: { "error": "Item not found" } with 500 status
	}

	return item;
};
```

For custom status codes, throw a `Response`:

```typescript
handler: async (ctx) => {
	const item = await ctx.storage.items!.get(ctx.input.id);

	if (!item) {
		throw new Response(JSON.stringify({ error: "Not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return item;
};
```

## Input Validation

Use Zod schemas to validate and parse input:

```typescript
import { z } from "astro/zod";

routes: {
  create: {
    input: z.object({
      title: z.string().min(1).max(200),
      email: z.string().email(),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      tags: z.array(z.string()).optional()
    }),
    handler: async (ctx) => {
      // ctx.input is typed and validated
      const { title, email, priority, tags } = ctx.input;

      await ctx.storage.items!.put(`item_${Date.now()}`, {
        title,
        email,
        priority,
        tags: tags ?? [],
        createdAt: new Date().toISOString()
      });

      return { success: true };
    }
  }
}
```

Invalid input returns a 400 error with validation details.

### Input Sources

Input is parsed from:

1. **POST/PUT/PATCH** — Request body (JSON)
2. **GET/DELETE** — URL query parameters

```typescript
// POST /plugins/forms/create
// Body: { "title": "Hello", "email": "user@example.com" }

// GET /plugins/forms/list?limit=20&status=pending
```

## HTTP Methods

Routes respond to all HTTP methods. Check `ctx.request.method` to handle them differently:

```typescript
routes: {
  item: {
    input: z.object({
      id: z.string()
    }),
    handler: async (ctx) => {
      const { id } = ctx.input;

      switch (ctx.request.method) {
        case "GET":
          return await ctx.storage.items!.get(id);

        case "DELETE":
          await ctx.storage.items!.delete(id);
          return { deleted: true };

        default:
          throw new Response("Method not allowed", { status: 405 });
      }
    }
  }
}
```

## Accessing the Request

The full `Request` object is available for advanced use cases:

```typescript
handler: async (ctx) => {
	const { request } = ctx;

	// Headers
	const auth = request.headers.get("Authorization");

	// URL parameters
	const url = new URL(request.url);
	const page = url.searchParams.get("page");

	// Method
	if (request.method !== "POST") {
		throw new Response("POST required", { status: 405 });
	}

	// Body (if not using input schema)
	const body = await request.json();
};
```

## Common Patterns

### Settings Routes

Expose and update plugin settings:

```typescript
routes: {
  settings: {
    handler: async (ctx) => {
      const settings = await ctx.kv.list("settings:");
      const result: Record<string, unknown> = {};

      for (const entry of settings) {
        result[entry.key.replace("settings:", "")] = entry.value;
      }

      return result;
    }
  },

  "settings/save": {
    input: z.object({
      enabled: z.boolean().optional(),
      apiKey: z.string().optional(),
      maxItems: z.number().optional()
    }),
    handler: async (ctx) => {
      const input = ctx.input;

      for (const [key, value] of Object.entries(input)) {
        if (value !== undefined) {
          await ctx.kv.set(`settings:${key}`, value);
        }
      }

      return { success: true };
    }
  }
}
```

### Paginated List

Return paginated results with cursor-based navigation:

```typescript
routes: {
  list: {
    input: z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
      status: z.string().optional()
    }),
    handler: async (ctx) => {
      const { limit, cursor, status } = ctx.input;

      const result = await ctx.storage.items!.query({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        limit,
        cursor
      });

      return {
        items: result.items.map(item => ({
          id: item.id,
          ...item.data
        })),
        cursor: result.cursor,
        hasMore: result.hasMore
      };
    }
  }
}
```

### External API Proxy

Proxy requests to external services (requires `network:fetch` capability):

```typescript
definePlugin({
	id: "weather",
	version: "1.0.0",

	capabilities: ["network:fetch"],
	allowedHosts: ["api.weather.example.com"],

	routes: {
		forecast: {
			input: z.object({
				city: z.string(),
			}),
			handler: async (ctx) => {
				const apiKey = await ctx.kv.get<string>("settings:apiKey");

				if (!apiKey) {
					throw new Error("API key not configured");
				}

				const response = await ctx.http!.fetch(
					`https://api.weather.example.com/forecast?city=${ctx.input.city}`,
					{
						headers: { "X-API-Key": apiKey },
					},
				);

				if (!response.ok) {
					throw new Error(`Weather API error: ${response.status}`);
				}

				return response.json();
			},
		},
	},
});
```

### Action Endpoint

Trigger a one-off action:

```typescript
routes: {
	sync: {
		handler: async (ctx) => {
			ctx.log.info("Starting sync...");

			const startTime = Date.now();
			let synced = 0;

			// Do work...
			const items = await fetchExternalItems(ctx);
			for (const item of items) {
				await ctx.storage.items!.put(item.id, item);
				synced++;
			}

			const duration = Date.now() - startTime;
			ctx.log.info("Sync complete", { synced, duration });

			return {
				success: true,
				synced,
				duration,
			};
		};
	}
}
```

## Calling Routes from Admin UI

Use the `usePluginAPI()` hook in admin components:

```typescript
import { usePluginAPI } from "@emdash-cms/admin";

function SettingsPage() {
	const api = usePluginAPI();

	const handleSave = async (settings) => {
		await api.post("settings/save", settings);
	};

	const loadSettings = async () => {
		return api.get("settings");
	};
}
```

The hook automatically prefixes the plugin ID to route URLs.

## Calling Routes Externally

Routes are accessible at their full URL:

```bash
# GET request
curl https://your-site.com/_emdash/api/plugins/forms/submissions?limit=10

# POST request
curl -X POST https://your-site.com/_emdash/api/plugins/forms/create \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello", "email": "user@example.com"}'
```

<Aside type="caution">
	Plugin routes don't have built-in authentication. For public endpoints, implement your own auth
	checks. For admin-only routes, the admin session middleware provides protection.
</Aside>

## Route Context Reference

```typescript
interface RouteContext<TInput = unknown> extends PluginContext {
	/** Validated input from request body or query params */
	input: TInput;

	/** Original request object */
	request: Request;

	/** Plugin metadata */
	plugin: { id: string; version: string };

	/** Plugin storage collections */
	storage: Record<string, StorageCollection>;

	/** Key-value store */
	kv: KVAccess;

	/** Content access (if capability declared) */
	content?: ContentAccess;

	/** Media access (if capability declared) */
	media?: MediaAccess;

	/** HTTP client (if capability declared) */
	http?: HttpAccess;

	/** Structured logger */
	log: LogAccess;
}
```

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/creating-plugins.mdx
```mdx
---
title: Creating Plugins
description: Build an EmDash plugin with hooks, storage, settings, and admin UI.
---

import { Aside, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

This guide walks through building a complete EmDash plugin. You'll learn how to structure the code, define hooks and storage, and export admin UI components.

## Plugin Structure

Every plugin has two parts that **run in different contexts**:

1. **Plugin descriptor** (`PluginDescriptor`) — returned by the factory function, tells EmDash how to load the plugin. **Runs at build time in Vite** (imported in `astro.config.mjs`). Must be side-effect-free and cannot use runtime APIs.
2. **Plugin definition** (`definePlugin()`) — contains the runtime logic (hooks, routes, storage). **Runs at request time on the deployed server.** Has access to the full plugin context (`ctx`).

These must be in **separate entrypoints** because they execute in completely different environments:

```
my-plugin/
├── src/
│   ├── descriptor.ts     # Plugin descriptor (runs in Vite at build time)
│   ├── index.ts           # Plugin definition with definePlugin() (runs at deploy time)
│   ├── admin.tsx          # Admin UI exports (React components) — optional
│   └── astro/             # Optional: Astro components for site-side rendering
│       └── index.ts       # Must export `blockComponents`
├── package.json
└── tsconfig.json
```

## Creating the Plugin

### Descriptor (build time)

The descriptor tells EmDash where to find the plugin and what admin UI it provides. This file is imported in `astro.config.mjs` and runs in Vite.

```typescript title="src/descriptor.ts"
import type { PluginDescriptor } from "emdash";

// Options your plugin accepts at registration time
export interface MyPluginOptions {
	enabled?: boolean;
	maxItems?: number;
}

export function myPlugin(options: MyPluginOptions = {}): PluginDescriptor {
	return {
		id: "my-plugin",
		version: "1.0.0",
		entrypoint: "@my-org/plugin-example",
		options,
		adminEntry: "@my-org/plugin-example/admin",
		componentsEntry: "@my-org/plugin-example/astro",
		adminPages: [{ path: "/settings", label: "Settings", icon: "settings" }],
		adminWidgets: [{ id: "status", title: "Status", size: "half" }],
	};
}
```

### Definition (runtime)

The definition contains the runtime logic — hooks, routes, storage, and admin configuration. This file is loaded at request time on the deployed server.

```typescript title="src/index.ts"
import { definePlugin } from "emdash";
import type { MyPluginOptions } from "./descriptor.js";

export function createPlugin(options: MyPluginOptions = {}) {
	const maxItems = options.maxItems ?? 100;

	return definePlugin({
		id: "my-plugin",
		version: "1.0.0",

		// Declare required capabilities
		capabilities: ["read:content"],

		// Plugin storage (document collections)
		storage: {
			items: {
				indexes: ["status", "createdAt", ["status", "createdAt"]],
			},
		},

		// Admin UI configuration
		admin: {
			entry: "@my-org/plugin-example/admin",
			settingsSchema: {
				maxItems: {
					type: "number",
					label: "Maximum Items",
					description: "Limit stored items",
					default: maxItems,
					min: 1,
					max: 1000,
				},
				enabled: {
					type: "boolean",
					label: "Enabled",
					default: options.enabled ?? true,
				},
			},
			pages: [{ path: "/settings", label: "Settings", icon: "settings" }],
			widgets: [{ id: "status", title: "Status", size: "half" }],
		},

		// Hook handlers
		hooks: {
			"plugin:install": async (_event, ctx) => {
				ctx.log.info("Plugin installed");
			},

			"content:afterSave": async (event, ctx) => {
				const enabled = await ctx.kv.get<boolean>("settings:enabled");
				if (enabled === false) return;

				ctx.log.info("Content saved", {
					collection: event.collection,
					id: event.content.id,
				});
			},
		},

		// API routes (trusted only — not available in sandboxed plugins)
		routes: {
			status: {
				handler: async (ctx) => {
					const count = await ctx.storage.items!.count();
					return { count, maxItems };
				},
			},
		},
	});
}

export default createPlugin;
```

## Plugin ID Rules

The `id` field must follow these rules:

- Lowercase alphanumeric characters and hyphens only
- Either simple (`my-plugin`) or scoped (`@my-org/my-plugin`)
- Unique across all installed plugins

```typescript
// Valid IDs
"seo";
"audit-log";
"@emdash-cms/plugin-forms";

// Invalid IDs
"MyPlugin"; // No uppercase
"my_plugin"; // No underscores
"my.plugin"; // No dots
```

## Version Format

Use semantic versioning:

```typescript
version: "1.0.0"; // Valid
version: "1.2.3-beta"; // Valid (prerelease)
version: "1.0"; // Invalid (missing patch)
```

## Package Exports

Configure `package.json` exports so EmDash can load each entrypoint. The descriptor and definition are separate exports because they run in different environments:

```json title="package.json"
{
	"name": "@my-org/plugin-example",
	"version": "1.0.0",
	"type": "module",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js"
		},
		"./descriptor": {
			"types": "./dist/descriptor.d.ts",
			"import": "./dist/descriptor.js"
		},
		"./admin": {
			"types": "./dist/admin.d.ts",
			"import": "./dist/admin.js"
		},
		"./astro": {
			"types": "./dist/astro/index.d.ts",
			"import": "./dist/astro/index.js"
		}
	},
	"files": ["dist"],
	"peerDependencies": {
		"emdash": "^0.1.0",
		"react": "^18.0.0"
	}
}
```

| Export | Context | Purpose |
|--------|---------|---------|
| `"."` | Server (runtime) | `createPlugin()` / `definePlugin()` — loaded by `entrypoint` at request time |
| `"./descriptor"` | Vite (build time) | `PluginDescriptor` factory — imported in `astro.config.mjs` |
| `"./admin"` | Browser | React components for admin pages/widgets |
| `"./astro"` | Server (SSR) | Astro components for site-side block rendering |

Only include `./admin` and `./astro` exports if the plugin uses them.

<Aside type="tip">
	Keep `emdash` and `react` as peer dependencies. This prevents version conflicts when the plugin
	is installed in a site.
</Aside>

## Complete Example: Audit Log Plugin

This example demonstrates storage, lifecycle hooks, content hooks, and API routes:

```typescript title="src/index.ts"
import { definePlugin } from "emdash";

interface AuditEntry {
	timestamp: string;
	action: "create" | "update" | "delete";
	collection: string;
	resourceId: string;
	userId?: string;
}

export function createPlugin() {
	return definePlugin({
		id: "audit-log",
		version: "0.1.0",

		storage: {
			entries: {
				indexes: [
					"timestamp",
					"action",
					"collection",
					["collection", "timestamp"],
					["action", "timestamp"],
				],
			},
		},

		admin: {
			settingsSchema: {
				retentionDays: {
					type: "number",
					label: "Retention (days)",
					description: "Days to keep entries. 0 = forever.",
					default: 90,
					min: 0,
					max: 365,
				},
			},
			pages: [{ path: "/history", label: "Audit History", icon: "history" }],
			widgets: [{ id: "recent-activity", title: "Recent Activity", size: "half" }],
		},

		hooks: {
			"plugin:install": async (_event, ctx) => {
				ctx.log.info("Audit log plugin installed");
			},

			"content:afterSave": {
				priority: 200, // Run after other plugins
				timeout: 2000,
				handler: async (event, ctx) => {
					const { content, collection, isNew } = event;

					const entry: AuditEntry = {
						timestamp: new Date().toISOString(),
						action: isNew ? "create" : "update",
						collection,
						resourceId: content.id as string,
					};

					const entryId = `${Date.now()}-${content.id}`;
					await ctx.storage.entries!.put(entryId, entry);

					ctx.log.info(`Logged ${entry.action} on ${collection}/${content.id}`);
				},
			},

			"content:afterDelete": {
				priority: 200,
				timeout: 1000,
				handler: async (event, ctx) => {
					const { id, collection } = event;

					const entry: AuditEntry = {
						timestamp: new Date().toISOString(),
						action: "delete",
						collection,
						resourceId: id,
					};

					const entryId = `${Date.now()}-${id}`;
					await ctx.storage.entries!.put(entryId, entry);

					ctx.log.info(`Logged delete on ${collection}/${id}`);
				},
			},
		},

		routes: {
			recent: {
				handler: async (ctx) => {
					const result = await ctx.storage.entries!.query({
						orderBy: { timestamp: "desc" },
						limit: 10,
					});

					return {
						entries: result.items.map((item) => ({
							id: item.id,
							...(item.data as AuditEntry),
						})),
					};
				},
			},

			history: {
				handler: async (ctx) => {
					const url = new URL(ctx.request.url);
					const limit = parseInt(url.searchParams.get("limit") || "50", 10);
					const cursor = url.searchParams.get("cursor") || undefined;

					const result = await ctx.storage.entries!.query({
						orderBy: { timestamp: "desc" },
						limit,
						cursor,
					});

					return {
						entries: result.items.map((item) => ({
							id: item.id,
							...(item.data as AuditEntry),
						})),
						cursor: result.cursor,
						hasMore: result.hasMore,
					};
				},
			},
		},
	});
}

export default createPlugin;
```

## Testing Plugins

Test plugins by creating a minimal Astro site with the plugin registered:

1. Create a test site with EmDash installed.

2. Register your plugin in `astro.config.mjs`:

   ```typescript
   import myPlugin from "../path/to/my-plugin/src";

   export default defineConfig({
   	integrations: [
   		emdash({
   			plugins: [myPlugin()],
   		}),
   	],
   });
   ```

3. Run the dev server and trigger hooks by creating/updating content.

4. Check the console for `ctx.log` output and verify storage via API routes.

For unit tests, mock the `PluginContext` interface and call hook handlers directly.

## Portable Text Block Types

Plugins can add custom block types to the Portable Text editor. These appear in the editor's slash command menu and can be inserted into any `portableText` field.

### Declaring block types

In `createPlugin()`, declare blocks under `admin.portableTextBlocks`:

```typescript title="src/index.ts"
admin: {
	portableTextBlocks: [
		{
			type: "youtube",
			label: "YouTube Video",
			icon: "video",           // Named icon: video, code, link, link-external
			placeholder: "Paste YouTube URL...",
			fields: [                // Block Kit fields for the editing UI
				{ type: "text_input", action_id: "id", label: "YouTube URL" },
				{ type: "text_input", action_id: "title", label: "Title" },
				{ type: "text_input", action_id: "poster", label: "Poster Image URL" },
			],
		},
	],
}
```

Each block type defines:

- **`type`** — Block type name (used in Portable Text `_type`)
- **`label`** — Display name in the slash command menu
- **`icon`** — Icon key (`video`, `code`, `link`, `link-external`). Falls back to a generic cube.
- **`placeholder`** — Input placeholder text
- **`fields`** — Block Kit form fields for editing. If omitted, a simple URL input is shown.

### Site-side rendering

To render your block types on the site, export Astro components from a `componentsEntry`:

```typescript title="src/astro/index.ts"
import YouTube from "./YouTube.astro";
import CodePen from "./CodePen.astro";

// This export name is required — the virtual module imports it
export const blockComponents = {
	youtube: YouTube,
	codepen: CodePen,
};
```

Set `componentsEntry` in your plugin descriptor:

```typescript
export function myPlugin(options = {}): PluginDescriptor {
	return {
		id: "my-plugin",
		entrypoint: "@my-org/my-plugin",
		componentsEntry: "@my-org/my-plugin/astro",
		// ...
	};
}
```

Plugin block components are automatically merged into `<PortableText>` — site authors don't need to import anything. User-provided components take precedence over plugin defaults.

<Aside type="tip">
	The embeds plugin (`@emdash-cms/plugin-embeds`) is a complete example of this pattern. It provides
	YouTube, Vimeo, Tweet, Bluesky, Mastodon, Gist, and Link Preview block types with both admin
	editing fields and site-side Astro rendering components.
</Aside>

### Package exports

Add the `./astro` export to `package.json`:

```json title="package.json"
{
	"exports": {
		".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
		"./admin": { "types": "./dist/admin.d.ts", "import": "./dist/admin.js" },
		"./astro": { "types": "./dist/astro/index.d.ts", "import": "./dist/astro/index.js" }
	}
}
```

## Next Steps

- [Hooks Reference](/plugins/hooks/) — All available hooks with signatures
- [Storage API](/plugins/storage/) — Document collections and queries
- [Settings](/plugins/settings/) — Settings schema and KV store
- [Admin UI](/plugins/admin-ui/) — Pages and widgets
- [API Routes](/plugins/api-routes/) — REST endpoints

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/define-plugin.ts
```ts
/**
 * definePlugin() Helper
 *
 * Creates a properly typed and normalized plugin definition.
 * Supports two formats:
 *
 * 1. **Native format** -- full PluginDefinition with id, version, capabilities, etc.
 *    Returns a ResolvedPlugin.
 *
 * 2. **Standard format** -- just { hooks, routes }. No id/version/capabilities.
 *    Returns the same object (identity function for type inference).
 *    Metadata comes from the descriptor at config time.
 *
 */

import type {
	PluginDefinition,
	ResolvedPlugin,
	PluginHooks,
	ResolvedPluginHooks,
	ResolvedHook,
	HookConfig,
	PluginStorageConfig,
	StandardPluginDefinition,
} from "./types.js";

// Plugin ID validation patterns
const SIMPLE_ID = /^[a-z0-9-]+$/;
const SCOPED_ID = /^@[a-z0-9-]+\/[a-z0-9-]+$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+/;

/**
 * Define an EmDash plugin.
 *
 * **Standard format** -- the canonical format for plugins that work in both
 * trusted and sandboxed modes. No id/version -- those come from the descriptor.
 *
 * @example
 * ```typescript
 * import { definePlugin } from "emdash";
 *
 * export default definePlugin({
 *   hooks: {
 *     "content:afterSave": {
 *       handler: async (event, ctx) => {
 *         await ctx.kv.set("lastSave", Date.now());
 *       },
 *     },
 *   },
 *   routes: {
 *     status: {
 *       handler: async (routeCtx, ctx) => ({ ok: true }),
 *     },
 *   },
 * });
 * ```
 *
 * **Native format** -- for plugins that need React admin, direct DB access,
 * or other capabilities not available in the sandbox.
 *
 * @example
 * ```typescript
 * import { definePlugin } from "emdash";
 *
 * export default definePlugin({
 *   id: "my-plugin",
 *   version: "1.0.0",
 *   capabilities: ["read:content"],
 *   hooks: {
 *     "content:beforeSave": async (event, ctx) => {
 *       ctx.log.info("Saving content", { collection: event.collection });
 *       return event.content;
 *     }
 *   },
 *   routes: {
 *     "sync": {
 *       handler: async (ctx) => {
 *         return { status: "ok" };
 *       }
 *     }
 *   }
 * });
 * ```
 */
// Native overload first -- PluginDefinition (with id+version) is more specific
export function definePlugin<TStorage extends PluginStorageConfig>(
	definition: PluginDefinition<TStorage>,
): ResolvedPlugin<TStorage>;
// Standard overload second -- catches { hooks, routes } without id/version
export function definePlugin(definition: StandardPluginDefinition): StandardPluginDefinition;
export function definePlugin<TStorage extends PluginStorageConfig>(
	definition: PluginDefinition<TStorage> | StandardPluginDefinition,
): ResolvedPlugin<TStorage> | StandardPluginDefinition {
	// Standard format: has hooks/routes but no id/version
	if (!("id" in definition) || !("version" in definition)) {
		// Validate that the standard format has at least hooks or routes
		if (!("hooks" in definition) && !("routes" in definition)) {
			throw new Error(
				"Standard plugin format requires at least `hooks` or `routes`. " +
					"For native format, provide `id` and `version`.",
			);
		}
		// Identity function -- return as-is for type inference.
		// The adapter (adaptSandboxEntry) will convert this to a ResolvedPlugin at build time.
		return definition;
	}

	return defineNativePlugin(definition);
}

/**
 * Internal: define a native-format plugin with full validation and normalization.
 */
function defineNativePlugin<TStorage extends PluginStorageConfig>(
	definition: PluginDefinition<TStorage>,
): ResolvedPlugin<TStorage> {
	const {
		id,
		version,
		capabilities = [],
		allowedHosts = [],
		hooks = {},
		routes = {},
		admin = {},
	} = definition;

	// Default to empty object if no storage declared.
	// The empty object satisfies PluginStorageConfig (Record<string, ...>).
	// The cast is structurally safe because an empty record has no keys to conflict.
	const storage = (definition.storage ?? {}) as TStorage;

	// Validate id format: either simple (my-plugin) or scoped (@scope/my-plugin)
	// Simple: lowercase alphanumeric with dashes
	// Scoped: @scope/name where both parts are lowercase alphanumeric with dashes
	if (!SIMPLE_ID.test(id) && !SCOPED_ID.test(id)) {
		throw new Error(
			`Invalid plugin id "${id}". Must be lowercase alphanumeric with dashes (e.g., "my-plugin" or "@scope/my-plugin").`,
		);
	}

	// Validate version format (basic semver)
	if (!SEMVER_PATTERN.test(version)) {
		throw new Error(`Invalid plugin version "${version}". Must be semver format (e.g., "1.0.0").`);
	}

	// Validate capabilities
	const validCapabilities = new Set([
		"network:fetch",
		"network:fetch:any",
		"read:content",
		"write:content",
		"read:media",
		"write:media",
		"read:users",
		"email:send",
		"email:provide",
		"email:intercept",
		"page:inject",
	]);
	for (const cap of capabilities) {
		if (!validCapabilities.has(cap)) {
			throw new Error(`Invalid capability "${cap}" in plugin "${id}".`);
		}
	}

	// Capability implications: broader capabilities imply narrower ones
	const normalizedCapabilities = [...capabilities];
	if (capabilities.includes("write:content") && !capabilities.includes("read:content")) {
		normalizedCapabilities.push("read:content");
	}
	if (capabilities.includes("write:media") && !capabilities.includes("read:media")) {
		normalizedCapabilities.push("read:media");
	}
	if (capabilities.includes("network:fetch:any") && !capabilities.includes("network:fetch")) {
		normalizedCapabilities.push("network:fetch");
	}

	// Normalize hooks
	const resolvedHooks = resolveHooks(hooks, id);

	return {
		id,
		version,
		capabilities: normalizedCapabilities,
		allowedHosts,
		storage,
		hooks: resolvedHooks,
		routes,
		admin,
	};
}

/**
 * Resolve hooks to normalized format with defaults.
 *
 * PluginHooks and ResolvedPluginHooks share the same keys — each input value is
 * `HookConfig<H> | H` and the output is `ResolvedHook<H>`.  TS can't narrow
 * the handler type through a dynamic key, so we assert at the loop boundary.
 */
function resolveHooks(hooks: PluginHooks, pluginId: string): ResolvedPluginHooks {
	const resolved: ResolvedPluginHooks = {};

	for (const key of Object.keys(hooks) as Array<keyof PluginHooks>) {
		const hook = hooks[key];
		if (hook) {
			(resolved as Record<string, unknown>)[key] = resolveHook(hook, pluginId);
		}
	}

	return resolved;
}

/**
 * Check if a hook value is a config object (has a `handler` property)
 */
function isHookConfig<THandler>(
	hook: HookConfig<THandler> | THandler,
): hook is HookConfig<THandler> {
	return typeof hook === "object" && hook !== null && "handler" in hook;
}

/**
 * Resolve a single hook to normalized format
 */
function resolveHook<THandler>(
	hook: HookConfig<THandler> | THandler,
	pluginId: string,
): ResolvedHook<THandler> {
	// If it's a config object with handler property
	if (isHookConfig(hook)) {
		if (hook.exclusive !== undefined && typeof hook.exclusive !== "boolean") {
			throw new Error(
				`Invalid "exclusive" value in hook config for plugin "${pluginId}". Must be boolean.`,
			);
		}
		return {
			priority: hook.priority ?? 100,
			timeout: hook.timeout ?? 5000,
			dependencies: hook.dependencies ?? [],
			errorPolicy: hook.errorPolicy ?? "abort",
			exclusive: hook.exclusive ?? false,
			handler: hook.handler,
			pluginId,
		};
	}

	// It's just a handler function
	return {
		priority: 100,
		timeout: 5000,
		dependencies: [],
		errorPolicy: "abort",
		exclusive: false,
		handler: hook,
		pluginId,
	};
}

export default definePlugin;

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/storage.mdx
```mdx
---
title: Plugin Storage
description: Persist plugin data in document collections with indexed queries.
---

import { Aside, Tabs, TabItem } from "@astrojs/starlight/components";

Plugins can store their own data in document collections without writing database migrations. Declare collections and indexes in your plugin definition, and EmDash handles the schema automatically.

## Declaring Storage

Define storage collections in `definePlugin()`:

```typescript
import { definePlugin } from "emdash";

export default definePlugin({
	id: "forms",
	version: "1.0.0",

	storage: {
		submissions: {
			indexes: [
				"formId", // Single-field index
				"status",
				"createdAt",
				["formId", "createdAt"], // Composite index
				["status", "createdAt"],
			],
		},
		forms: {
			indexes: ["slug"],
		},
	},

	// ...
});
```

Each key in `storage` is a collection name. The `indexes` array lists fields that can be queried efficiently.

<Aside type="note">
	Storage is scoped to the plugin. A `submissions` collection in the `forms` plugin is completely
	separate from `submissions` in another plugin.
</Aside>

## Storage Collection API

Access collections via `ctx.storage` in hooks and routes:

```typescript
"content:afterSave": async (event, ctx) => {
  const { submissions } = ctx.storage;

  // CRUD operations
  await submissions.put("sub_123", { formId: "contact", email: "user@example.com" });
  const item = await submissions.get("sub_123");
  const exists = await submissions.exists("sub_123");
  await submissions.delete("sub_123");
}
```

### Full API Reference

```typescript
interface StorageCollection<T = unknown> {
	// Basic CRUD
	get(id: string): Promise<T | null>;
	put(id: string, data: T): Promise<void>;
	delete(id: string): Promise<boolean>;
	exists(id: string): Promise<boolean>;

	// Batch operations
	getMany(ids: string[]): Promise<Map<string, T>>;
	putMany(items: Array<{ id: string; data: T }>): Promise<void>;
	deleteMany(ids: string[]): Promise<number>;

	// Query (indexed fields only)
	query(options?: QueryOptions): Promise<PaginatedResult<{ id: string; data: T }>>;
	count(where?: WhereClause): Promise<number>;
}
```

## Querying Data

Use `query()` to retrieve documents matching criteria. Queries return paginated results.

```typescript
const result = await ctx.storage.submissions.query({
	where: {
		formId: "contact",
		status: "pending",
	},
	orderBy: { createdAt: "desc" },
	limit: 20,
});

// result.items - Array of { id, data }
// result.cursor - Pagination cursor (if more results)
// result.hasMore - Boolean indicating more pages
```

### Query Options

```typescript
interface QueryOptions {
	where?: WhereClause;
	orderBy?: Record<string, "asc" | "desc">;
	limit?: number; // Default 50, max 1000
	cursor?: string; // For pagination
}
```

### Where Clause Operators

Filter by indexed fields using these operators:

<Tabs>
  <TabItem label="Exact Match">
```typescript
where: {
  status: "pending",        // Exact string match
  count: 5,                 // Exact number match
  archived: false           // Exact boolean match
}
```
  </TabItem>
  <TabItem label="Range">
```typescript
where: {
  createdAt: { gte: "2024-01-01" },     // Greater than or equal
  score: { gt: 50, lte: 100 }           // Between (exclusive/inclusive)
}

// Available: gt, gte, lt, lte

````
  </TabItem>
  <TabItem label="In">
```typescript
where: {
  status: { in: ["pending", "approved"] }
}
````

  </TabItem>
  <TabItem label="Starts With">
```typescript
where: {
  slug: { startsWith: "blog-" }
}
```
  </TabItem>
</Tabs>

### Ordering

Order results by indexed fields:

```typescript
orderBy: {
	createdAt: "desc";
} // Newest first
orderBy: {
	score: "asc";
} // Lowest first
```

<Aside type="caution">
	You can only query and order by indexed fields. Queries on non-indexed fields throw an error. This
	prevents accidental full-table scans.
</Aside>

## Pagination

Results are paginated. Use `cursor` to fetch additional pages:

```typescript
async function getAllSubmissions(ctx: PluginContext) {
	const allItems = [];
	let cursor: string | undefined;

	do {
		const result = await ctx.storage.submissions!.query({
			orderBy: { createdAt: "desc" },
			limit: 100,
			cursor,
		});

		allItems.push(...result.items);
		cursor = result.cursor;
	} while (cursor);

	return allItems;
}
```

### PaginatedResult

```typescript
interface PaginatedResult<T> {
	items: T[];
	cursor?: string; // Pass to next query for more results
	hasMore: boolean; // True if more pages exist
}
```

## Counting Documents

Count documents matching criteria:

```typescript
// Count all
const total = await ctx.storage.submissions!.count();

// Count with filter
const pending = await ctx.storage.submissions!.count({
	status: "pending",
});
```

## Batch Operations

For bulk operations, use batch methods:

```typescript
// Get multiple by ID
const items = await ctx.storage.submissions!.getMany(["sub_1", "sub_2", "sub_3"]);
// Returns Map<string, T>

// Put multiple
await ctx.storage.submissions!.putMany([
	{ id: "sub_1", data: { formId: "contact", status: "new" } },
	{ id: "sub_2", data: { formId: "contact", status: "new" } },
]);

// Delete multiple
const deletedCount = await ctx.storage.submissions!.deleteMany(["sub_1", "sub_2"]);
```

## Index Design

Choose indexes based on your query patterns:

| Query Pattern                            | Index Needed                         |
| ---------------------------------------- | ------------------------------------ |
| Filter by `formId`                       | `"formId"`                           |
| Filter by `formId`, order by `createdAt` | `["formId", "createdAt"]`            |
| Order by `createdAt` only                | `"createdAt"`                        |
| Filter by `status` and `formId`          | `"status"` and `"formId"` (separate) |

Composite indexes support queries that filter on the first field and optionally order by the second:

```typescript
// With index ["formId", "createdAt"]:

// This works:
query({ where: { formId: "contact" }, orderBy: { createdAt: "desc" } });

// This also works (filter only):
query({ where: { formId: "contact" } });

// This does NOT use the composite index (wrong field order):
query({ where: { createdAt: { gte: "2024-01-01" } } });
```

## Type Safety

Type your storage collections for better IntelliSense:

```typescript
interface Submission {
	formId: string;
	email: string;
	data: Record<string, unknown>;
	status: "pending" | "approved" | "spam";
	createdAt: string;
}

definePlugin({
	id: "forms",
	version: "1.0.0",

	storage: {
		submissions: {
			indexes: ["formId", "status", "createdAt"],
		},
	},

	hooks: {
		"content:afterSave": async (event, ctx) => {
			// Cast to typed collection
			const submissions = ctx.storage.submissions as StorageCollection<Submission>;

			const submission: Submission = {
				formId: "contact",
				email: "user@example.com",
				data: { message: "Hello" },
				status: "pending",
				createdAt: new Date().toISOString(),
			};

			await submissions.put(`sub_${Date.now()}`, submission);
		},
	},
});
```

## Storage vs Content vs KV

Use the right storage mechanism for your use case:

| Use Case                                           | Storage                               |
| -------------------------------------------------- | ------------------------------------- |
| Plugin operational data (logs, submissions, cache) | `ctx.storage`                         |
| User-configurable settings                         | `ctx.kv` with `settings:` prefix      |
| Internal plugin state                              | `ctx.kv` with `state:` prefix         |
| Content editable in admin UI                       | Site collections (not plugin storage) |

<Aside type="tip">
	Plugin storage is for data the plugin owns and manages internally. If content editors need to view
	or edit the data in the admin UI, create a site collection instead.
</Aside>

## Implementation Details

Under the hood, plugin storage uses a single database table:

```sql
CREATE TABLE _plugin_storage (
  plugin_id TEXT NOT NULL,
  collection TEXT NOT NULL,
  id TEXT NOT NULL,
  data JSON NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  PRIMARY KEY (plugin_id, collection, id)
);
```

EmDash creates expression indexes for declared fields:

```sql
CREATE INDEX idx_forms_submissions_formId
  ON _plugin_storage(json_extract(data, '$.formId'))
  WHERE plugin_id = 'forms' AND collection = 'submissions';
```

This design provides:

- **No migrations** — Schema lives in plugin code
- **Portability** — Works on D1, libSQL, SQLite
- **Isolation** — Plugins can only access their own data
- **Safety** — No SQL injection, validated queries

## Adding Indexes

When you add indexes in a plugin update, EmDash creates them automatically on next startup. This is safe—indexes can be added without data migration.

When you remove indexes, EmDash drops them. Queries on non-indexed fields will fail with a validation error.

```

File: /Users/masonjames/Projects/gravitysmtp/CLAUDE.md
```md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gravity SMTP is a commercial WordPress plugin by Rocketgenius (Gravity Forms) that intercepts WordPress `wp_mail()` calls and routes emails through configurable SMTP/API-based providers. It provides email logging, open/click tracking, suppression lists, failure alerts, conditional routing, and a React-based admin dashboard.

**Version**: 2.1.5
**License**: GPL-3.0+
**PHP**: 7.0+
**Only Composer dependency**: `gravityforms/gravity-tools` (service container framework)

## Important: This is a Distribution Repo

This repository contains the **built distribution artifact**, not the development source:
- No `composer.json` at root — autoload is via vendored `vendor/autoload.php`
- No `package.json` or JS source — React frontend ships only as minified bundles in `assets/js/dist/`
- No CI/CD config, Makefile, or build scripts
- Frontend changes cannot be made from this repo

## Linting

```bash
# PHPCS with WordPress Coding Standards (phpcs.xml at repo root)
phpcs --standard=phpcs.xml includes/

# Lint a specific file
phpcs --standard=phpcs.xml includes/handler/class-mail-handler.php
```

Note: Several WordPress security rules are suppressed in `phpcs.xml` (InputNotValidated, NonceVerification, PreparedSQL, EscapeOutput). Be aware of this when writing new code — manually ensure input validation, nonce checks, prepared SQL, and output escaping.

## Architecture

### Bootstrap Flow

`gravitysmtp.php` → loads Composer autoloader → hooks `Gravity_SMTP::pre_init` on `plugins_loaded` (priority 0) and `Gravity_SMTP::load_plugin` on `init`.

`Gravity_SMTP` (in `includes/class-gravity-smtp.php`) extends the gravity-tools `Service_Container`, registers ~20 service providers, and creates custom DB tables on activation.

### Service Provider Pattern

All functionality is organized as service providers registered in `Gravity_SMTP::service_providers()`. Each provider extends `Config_Service_Provider` from gravity-tools. Key providers:

| Provider | Purpose |
|----------|---------|
| `Connector_Service_Provider` | Registers all 18 email connectors + factory |
| `Handler_Service_Provider` | `Mail_Handler` — intercepts `wp_mail()` |
| `Logging_Service_Provider` | Email event log, debug log, retention scheduling |
| `Routing_Service_Provider` | Conditional email routing (primary/backup connectors) |
| `Suppression_Service_Provider` | Email suppression list |
| `Tracking_Service_Provider` | Open/click tracking |
| `Alerts_Service_Provider` | Slack/Twilio failure alerts |
| `App_Service_Provider` | Admin UI config (dashboard, logs, settings pages) |
| `Migration_Service_Provider` | Import settings from other SMTP plugins |

### Email Send Flow

1. `Mail_Handler::mail()` overrides `wp_mail()` via `pluggable` functions
2. Applies WP filters (`wp_mail`, `pre_wp_mail`, `gravitysmtp_connector_for_sending`)
3. `Connector_Factory` creates the active connector instance
4. Connector calls `init()` (parse recipients/headers) then `send()` (dispatch via provider API)
5. Send result logged to `gravitysmtp_events` / `gravitysmtp_event_logs` tables
6. On failure, routing system can retry with backup connector; alerts can fire

### Key Abstractions

- **Connector_Base** (`includes/connectors/class-connector-base.php`): Abstract base for all 18 email provider integrations. Each connector implements `send()` using `wp_safe_remote_post()` for HTTP APIs or PHPMailer for SMTP.
- **Data_Store_Router** (`includes/datastore/class-data-store-router.php`): Routes settings reads/writes between PHP constants, WP options, and plugin-specific storage.
- **Event_Model** (`includes/models/class-event-model.php`): DB query layer for email events (702 LOC).
- **Config classes** (`includes/apps/config/`): Define admin UI schemas and AJAX endpoint configurations. The largest is `class-email-log-config.php` (2,914 LOC).

### Database Tables (5 custom, prefixed with `wp_`)

- `gravitysmtp_events` — email send events
- `gravitysmtp_event_logs` — per-event action log entries
- `gravitysmtp_debug_log` — debug logging
- `gravitysmtp_event_tracking` — open/click tracking
- `gravitysmtp_suppressed_emails` — suppression list (has FULLTEXT index)

### Connectors (18)

Amazon SES, Brevo, Elastic Email, Emailit, Generic SMTP, Google (OAuth), Mailchimp/Mandrill, MailerSend, Mailgun, Mailjet, Microsoft 365 (OAuth), PHP Mail, Postmark, Resend, SendGrid, SMTP2GO, SparkPost, Zoho (OAuth).

All live in `includes/connectors/types/`. OAuth connectors (Google, Microsoft, Zoho) have additional flow classes in `includes/connectors/oauth/`.

### Admin UI

The admin interface is a React SPA loaded on WP admin pages. All data operations use `wp_ajax_*` handlers (27 AJAX endpoints). Endpoint configurations define nonce keys, capabilities, and request params in the config classes under `includes/apps/config/`.

### Namespace

All PHP classes use the `Gravity_Forms\Gravity_SMTP\*` namespace. The autoloader is Composer-generated (classmap strategy in `vendor/composer/`).

## Coding Conventions

- WordPress Coding Standards (tabs for indentation, snake_case for functions/variables)
- Class files follow `class-{name}.php` naming
- Service providers follow `class-{feature}-service-provider.php` naming
- All connectors extend `Connector_Base` and implement `send()`, `get_description()`, `connector_data()`
- AJAX endpoints are defined declaratively in config class `get_endpoints()` methods
- Feature flags gate new functionality via `Feature_Flags_Service_Provider`

## Constants

Defined in `gravitysmtp.php`:
- `GF_GRAVITY_SMTP_VERSION` — current plugin version
- `GF_GRAVITY_SMTP_PLUGIN_PATH` — absolute filesystem path
- `GF_GRAVITY_SMTP_PLUGIN_URL` — URL path for assets
- `GF_GRAVITY_SMTP_PLUGIN_BASENAME` — plugin basename for hooks

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/overview.mdx
```mdx
---
title: Plugin System Overview
description: Extend EmDash with plugins that add hooks, storage, settings, and admin UI.
---

import { Aside, Card, CardGrid } from "@astrojs/starlight/components";

EmDash's plugin system lets you extend the CMS without modifying core code. Plugins can hook into content lifecycle events, store their own data, expose settings to administrators, and add custom UI to the admin panel.

## Design Philosophy

EmDash plugins are **configuration transformers**, not separate applications. They run in the same process as your Astro site and interact through well-defined interfaces.

**Key principles:**

- **Declarative** — Hooks, storage, and routes are declared at definition time, not registered dynamically
- **Type-safe** — Full TypeScript support with typed context objects
- **Sandboxing-ready** — APIs designed for isolated execution on Cloudflare Workers
- **Capability-based** — Plugins declare what they need; the runtime enforces access

<Aside type="note">
	EmDash plugins are not Astro integrations. They're passed to the EmDash integration in your
	Astro config. A plugin that needs both can ship as an Astro integration that also registers
	EmDash hooks.
</Aside>

## What Plugins Can Do

<CardGrid>
	<Card title="Hook into events" icon="rocket">
		Run code before or after content saves, media uploads, and plugin lifecycle events.
	</Card>
	<Card title="Store data" icon="document">
		Persist plugin-specific data in indexed collections without writing database migrations.
	</Card>
	<Card title="Expose settings" icon="setting">
		Declare a settings schema and get an auto-generated admin UI for configuration.
	</Card>
	<Card title="Add admin pages" icon="laptop">
		Create custom admin pages and dashboard widgets with React components.
	</Card>
	<Card title="Create API routes" icon="external">
		Expose endpoints for your plugin's admin UI or external integrations.
	</Card>
	<Card title="Make HTTP requests" icon="external">
		Call external APIs with declared host restrictions for security.
	</Card>
</CardGrid>

## Plugin Architecture

Every plugin is created with `definePlugin()`:

```typescript
import { definePlugin } from "emdash";

export default definePlugin({
	id: "my-plugin",
	version: "1.0.0",

	// What APIs the plugin needs access to
	capabilities: ["read:content", "network:fetch"],

	// Hosts the plugin can make HTTP requests to
	allowedHosts: ["api.example.com"],

	// Persistent storage collections
	storage: {
		entries: {
			indexes: ["userId", "createdAt"],
		},
	},

	// Event handlers
	hooks: {
		"content:afterSave": async (event, ctx) => {
			ctx.log.info("Content saved", { id: event.content.id });
		},
	},

	// REST API endpoints
	routes: {
		status: {
			handler: async (ctx) => ({ ok: true }),
		},
	},

	// Admin UI configuration
	admin: {
		settingsSchema: {
			apiKey: { type: "secret", label: "API Key" },
		},
		pages: [{ path: "/dashboard", label: "Dashboard" }],
		widgets: [{ id: "status", size: "half" }],
	},
});
```

## Plugin Context

Every hook and route handler receives a `PluginContext` object with access to:

| Property      | Description                            | Availability                           |
| ------------- | -------------------------------------- | -------------------------------------- |
| `ctx.storage` | Plugin's document collections          | Always (if declared)                   |
| `ctx.kv`      | Key-value store for settings and state | Always                                 |
| `ctx.content` | Read/write site content                | With `read:content` or `write:content` |
| `ctx.media`   | Read/write media files                 | With `read:media` or `write:media`     |
| `ctx.http`    | HTTP client for external requests      | With `network:fetch`                   |
| `ctx.log`     | Structured logger                      | Always                                 |
| `ctx.plugin`  | Plugin metadata (id, version)          | Always                                 |

The context shape is identical across all hooks and routes. Capability-gated properties are only present when the plugin declares the required capability.

## Capabilities

Capabilities determine what APIs are available in the plugin context:

| Capability      | Grants Access To                                                       |
| --------------- | ---------------------------------------------------------------------- |
| `read:content`  | `ctx.content.get()`, `ctx.content.list()`                              |
| `write:content` | `ctx.content.create()`, `ctx.content.update()`, `ctx.content.delete()` |
| `read:media`    | `ctx.media.get()`, `ctx.media.list()`                                  |
| `write:media`   | `ctx.media.getUploadUrl()`, `ctx.media.delete()`                       |
| `network:fetch` | `ctx.http.fetch()`                                                     |

<Aside type="tip">
	`write:content` implies `read:content`. Same for media. Declare only what you need.
</Aside>

## Registration

Register plugins in your Astro configuration:

```typescript title="astro.config.mjs"
import { defineConfig } from "astro/config";
import { emdash } from "emdash/astro";
import seoPlugin from "@emdash-cms/plugin-seo";
import auditLogPlugin from "@emdash-cms/plugin-audit-log";

export default defineConfig({
	integrations: [
		emdash({
			plugins: [seoPlugin({ generateSitemap: true }), auditLogPlugin({ retentionDays: 90 })],
		}),
	],
});
```

Plugins are resolved at build time. Order matters for hooks with the same priority—earlier plugins in the array run first.

## Execution Modes

EmDash supports two plugin execution modes:

| Mode          | Description                             | Platform        |
| ------------- | --------------------------------------- | --------------- |
| **Trusted**   | Plugins run in-process with full access | Any             |
| **Sandboxed** | Plugins run in isolated V8 workers      | Cloudflare only |

In trusted mode (the default), capabilities are documentation—plugins can access anything. In sandboxed mode, capabilities are enforced at the runtime level.

<Aside type="note">
	Sandboxed execution requires Cloudflare Workers with Dynamic Worker Loader. Other platforms use
	trusted mode only. See [Plugin Sandbox](/plugins/sandbox/) for a full comparison of the security
	guarantees on each platform.
</Aside>

## Next Steps

<CardGrid>
	<Card title="Create a Plugin" icon="add-document">
		[Build your first plugin](/plugins/creating-plugins/) with storage, hooks, and admin UI.
	</Card>
	<Card title="Available Hooks" icon="rocket">
		[Browse all hooks](/plugins/hooks/) for content, media, and plugin lifecycle.
	</Card>
	<Card title="Plugin Storage" icon="document">
		[Learn about storage](/plugins/storage/) and how to query plugin data.
	</Card>
	<Card title="Admin UI" icon="laptop">
		[Add admin pages](/plugins/admin-ui/) and dashboard widgets.
	</Card>
	<Card title="Sandbox Security" icon="warning">
		[Understand sandbox isolation](/plugins/sandbox/) across Cloudflare and Node.js deployments.
	</Card>
</CardGrid>

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/hooks.ts
```ts
/**
 * Plugin Hooks System v2
 *
 * Uses the unified PluginContext for all hooks.
 * Manages lifecycle hooks with:
 * - Deterministic ordering via priority + dependencies
 * - Timeout enforcement
 * - Error isolation
 * - Observability
 *
 */

import { PluginContextFactory, type PluginContextFactoryOptions } from "./context.js";
import type {
	ResolvedPlugin,
	ResolvedHook,
	PluginContext,
	ContentHookEvent,
	ContentDeleteEvent,
	MediaUploadEvent,
	MediaAfterUploadEvent,
	LifecycleEvent,
	UninstallEvent,
	CronEvent,
	EmailBeforeSendEvent,
	EmailBeforeSendHandler,
	EmailDeliverHandler,
	EmailAfterSendHandler,
	ContentBeforeSaveHandler,
	ContentAfterSaveHandler,
	ContentBeforeDeleteHandler,
	ContentAfterDeleteHandler,
	MediaBeforeUploadHandler,
	MediaAfterUploadHandler,
	LifecycleHandler,
	UninstallHandler,
	CronHandler,
	EmailMessage,
	CommentBeforeCreateEvent,
	CommentBeforeCreateHandler,
	CommentModerateHandler,
	CommentAfterCreateEvent,
	CommentAfterCreateHandler,
	CommentAfterModerateEvent,
	CommentAfterModerateHandler,
	PageMetadataEvent,
	PageMetadataHandler,
	PageMetadataContribution,
	PageFragmentEvent,
	PageFragmentHandler,
	PageFragmentContribution,
} from "./types.js";

// Hook name type for v2
type HookNameV2 =
	| "plugin:install"
	| "plugin:activate"
	| "plugin:deactivate"
	| "plugin:uninstall"
	| "content:beforeSave"
	| "content:afterSave"
	| "content:beforeDelete"
	| "content:afterDelete"
	| "media:beforeUpload"
	| "media:afterUpload"
	| "cron"
	| "email:beforeSend"
	| "email:deliver"
	| "email:afterSend"
	| "comment:beforeCreate"
	| "comment:moderate"
	| "comment:afterCreate"
	| "comment:afterModerate"
	| "page:metadata"
	| "page:fragments";

/**
 * Map from hook name to handler type — used for type-safe hook retrieval
 */
interface HookHandlerMap {
	"plugin:install": LifecycleHandler;
	"plugin:activate": LifecycleHandler;
	"plugin:deactivate": LifecycleHandler;
	"plugin:uninstall": UninstallHandler;
	"content:beforeSave": ContentBeforeSaveHandler;
	"content:afterSave": ContentAfterSaveHandler;
	"content:beforeDelete": ContentBeforeDeleteHandler;
	"content:afterDelete": ContentAfterDeleteHandler;
	"media:beforeUpload": MediaBeforeUploadHandler;
	"media:afterUpload": MediaAfterUploadHandler;
	cron: CronHandler;
	"email:beforeSend": EmailBeforeSendHandler;
	"email:deliver": EmailDeliverHandler;
	"email:afterSend": EmailAfterSendHandler;
	"comment:beforeCreate": CommentBeforeCreateHandler;
	"comment:moderate": CommentModerateHandler;
	"comment:afterCreate": CommentAfterCreateHandler;
	"comment:afterModerate": CommentAfterModerateHandler;
	"page:metadata": PageMetadataHandler;
	"page:fragments": PageFragmentHandler;
}

/**
 * Hook execution result
 */
export interface HookResult<T> {
	success: boolean;
	value?: T;
	error?: Error;
	pluginId: string;
	duration: number;
}

/**
 * Hook pipeline for executing hooks in order
 */
export class HookPipeline {
	private hooks: Map<HookNameV2, Array<ResolvedHook<unknown>>> = new Map();
	private pluginMap: Map<string, ResolvedPlugin> = new Map();
	private contextFactory: PluginContextFactory | null = null;
	/** Stored so setContextFactory can merge incrementally. */
	private contextFactoryOptions: Partial<PluginContextFactoryOptions> = {};

	/** Hook names where at least one handler declared exclusive: true */
	private exclusiveHookNames: Set<string> = new Set();

	/**
	 * Selected provider plugin ID for each exclusive hook.
	 * Set by the PluginManager after resolution.
	 */
	private exclusiveSelections: Map<string, string> = new Map();

	constructor(plugins: ResolvedPlugin[], factoryOptions?: PluginContextFactoryOptions) {
		if (factoryOptions) {
			this.contextFactory = new PluginContextFactory(factoryOptions);
			this.contextFactoryOptions = { ...factoryOptions };
		}

		for (const plugin of plugins) {
			this.pluginMap.set(plugin.id, plugin);
		}
		this.registerPlugins(plugins);
	}

	/**
	 * Set or update the context factory options.
	 *
	 * When called on a pipeline that already has a factory, the new options
	 * are merged on top of the existing ones so that callers don't need to
	 * repeat every field (e.g. adding `cronReschedule` without losing
	 * `storage` / `getUploadUrl`).
	 */
	setContextFactory(options: Partial<PluginContextFactoryOptions>): void {
		const merged = { ...this.contextFactoryOptions, ...options };
		// The first call must include `db`; subsequent calls merge incrementally.
		this.contextFactory = new PluginContextFactory(merged as PluginContextFactoryOptions);
		this.contextFactoryOptions = merged;
	}

	/**
	 * Get context for a plugin
	 */
	private getContext(pluginId: string): PluginContext {
		const plugin = this.pluginMap.get(pluginId);
		if (!plugin) {
			throw new Error(`Plugin "${pluginId}" not found`);
		}
		if (!this.contextFactory) {
			throw new Error("Context factory not initialized - call setContextFactory first");
		}
		return this.contextFactory.createContext(plugin);
	}

	/**
	 * Get typed hooks for a specific hook name.
	 * The internal map stores ResolvedHook<unknown>, but we know each name
	 * maps to a specific handler type via HookHandlerMap.
	 *
	 * Exclusive hooks that have a selected provider are filtered out — they
	 * should only run via invokeExclusiveHook(), not in the regular pipeline.
	 */
	private getTypedHooks<N extends HookNameV2>(name: N): Array<ResolvedHook<HookHandlerMap[N]>> {
		// The map stores hooks as ResolvedHook<unknown>. Each hook name corresponds
		// to a specific handler type. The cast here is the single point where we
		// bridge the untyped map to the typed API — callers never need to cast.
		const all = (this.hooks.get(name) ?? []) as Array<ResolvedHook<HookHandlerMap[N]>>;

		// If this hook has an exclusive selection, filter out all exclusive handlers
		// so they don't run in the regular pipeline
		if (this.exclusiveSelections.has(name)) {
			return all.filter((h) => !h.exclusive);
		}

		return all;
	}

	/**
	 * Register all hooks from plugins.
	 *
	 * Registers each hook name individually to preserve type safety. The
	 * internal map stores ResolvedHook<unknown> since it's keyed by string,
	 * but getTypedHooks() restores the correct handler type on retrieval.
	 */
	private registerPlugins(plugins: ResolvedPlugin[]): void {
		for (const plugin of plugins) {
			this.registerPluginHook(plugin, "plugin:install");
			this.registerPluginHook(plugin, "plugin:activate");
			this.registerPluginHook(plugin, "plugin:deactivate");
			this.registerPluginHook(plugin, "plugin:uninstall");
			this.registerPluginHook(plugin, "content:beforeSave");
			this.registerPluginHook(plugin, "content:afterSave");
			this.registerPluginHook(plugin, "content:beforeDelete");
			this.registerPluginHook(plugin, "content:afterDelete");
			this.registerPluginHook(plugin, "media:beforeUpload");
			this.registerPluginHook(plugin, "media:afterUpload");
			this.registerPluginHook(plugin, "cron");
			this.registerPluginHook(plugin, "email:beforeSend");
			this.registerPluginHook(plugin, "email:deliver");
			this.registerPluginHook(plugin, "email:afterSend");
			this.registerPluginHook(plugin, "comment:beforeCreate");
			this.registerPluginHook(plugin, "comment:moderate");
			this.registerPluginHook(plugin, "comment:afterCreate");
			this.registerPluginHook(plugin, "comment:afterModerate");
			this.registerPluginHook(plugin, "page:metadata");
			this.registerPluginHook(plugin, "page:fragments");
		}

		// Sort hooks by priority and dependencies
		for (const [hookName, hooks] of this.hooks) {
			this.hooks.set(hookName, this.sortHooks(hooks));
		}
	}

	/**
	 * Maps hook names to the capability required to register them.
	 *
	 * Hooks not listed here have no capability requirement (e.g. lifecycle
	 * hooks, cron). Any plugin declaring a listed hook without the required
	 * capability will have that hook silently skipped at registration time.
	 */
	private static readonly HOOK_REQUIRED_CAPABILITY: ReadonlyMap<string, string> = new Map([
		// Email
		["email:beforeSend", "email:intercept"],
		["email:afterSend", "email:intercept"],
		["email:deliver", "email:provide"],
		// Content — beforeSave can mutate content, so requires write:content.
		// afterSave is read-only notification, so read:content suffices.
		["content:beforeSave", "write:content"],
		["content:afterSave", "read:content"],
		["content:beforeDelete", "read:content"],
		["content:afterDelete", "read:content"],
		// Media
		["media:beforeUpload", "write:media"],
		["media:afterUpload", "read:media"],
		// Comments — hooks expose author email, IP hash, user agent
		["comment:beforeCreate", "read:users"],
		["comment:moderate", "read:users"],
		["comment:afterCreate", "read:users"],
		["comment:afterModerate", "read:users"],
		// Page fragments — can inject arbitrary scripts into every public page
		["page:fragments", "page:inject"],
	]);

	/**
	 * Register a single plugin's hook by name
	 */
	private registerPluginHook(plugin: ResolvedPlugin, name: HookNameV2): void {
		const hook = plugin.hooks[name];
		if (!hook) return;

		// Hooks that expose sensitive data or inject into pages require specific
		// capabilities. Plugins without the required capability have the hook
		// silently skipped to prevent unauthorized data access or page injection.
		const requiredCapability = HookPipeline.HOOK_REQUIRED_CAPABILITY.get(name);
		if (requiredCapability && !plugin.capabilities.includes(requiredCapability as never)) {
			console.warn(
				`[hooks] Plugin "${plugin.id}" declares ${name} hook without ${requiredCapability} capability — skipping`,
			);
			return;
		}

		// Track exclusive hooks
		if (hook.exclusive) {
			this.exclusiveHookNames.add(name);
		}

		// ResolvedHook<SpecificHandler> is assignable to ResolvedHook<unknown>
		// because the handler property is covariant
		this.registerHook(name, hook);
	}

	/**
	 * Register a single hook
	 */
	private registerHook(name: HookNameV2, hook: ResolvedHook<unknown>): void {
		const existing = this.hooks.get(name) || [];
		existing.push(hook);
		this.hooks.set(name, existing);
	}

	/**
	 * Sort hooks by priority and dependencies
	 */
	private sortHooks(hooks: Array<ResolvedHook<unknown>>): Array<ResolvedHook<unknown>> {
		const sorted: Array<ResolvedHook<unknown>> = [];
		const remaining = [...hooks];

		// Simple topological sort with priority as tiebreaker
		while (remaining.length > 0) {
			// Find hooks whose dependencies are satisfied
			const ready = remaining.filter((hook) =>
				hook.dependencies.every((dep) => sorted.some((s) => s.pluginId === dep)),
			);

			if (ready.length === 0) {
				// Circular dependency or missing dependency - just add by priority
				remaining.sort((a, b) => a.priority - b.priority);
				sorted.push(...remaining);
				break;
			}

			// Sort ready hooks by priority and add the first one
			ready.sort((a, b) => a.priority - b.priority);
			const next = ready[0];
			sorted.push(next);
			remaining.splice(remaining.indexOf(next), 1);
		}

		return sorted;
	}

	/**
	 * Execute a hook with timeout
	 */
	private async executeWithTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
		return Promise.race([
			fn(),
			new Promise<T>((_, reject) =>
				setTimeout(() => reject(new Error(`Hook timeout after ${timeout}ms`)), timeout),
			),
		]);
	}

	// =========================================================================
	// Lifecycle Hooks
	// =========================================================================

	/**
	 * Run plugin:install hooks
	 */
	async runPluginInstall(pluginId: string): Promise<HookResult<void>[]> {
		return this.runLifecycleHook("plugin:install", pluginId);
	}

	/**
	 * Run plugin:activate hooks
	 */
	async runPluginActivate(pluginId: string): Promise<HookResult<void>[]> {
		return this.runLifecycleHook("plugin:activate", pluginId);
	}

	/**
	 * Run plugin:deactivate hooks
	 */
	async runPluginDeactivate(pluginId: string): Promise<HookResult<void>[]> {
		return this.runLifecycleHook("plugin:deactivate", pluginId);
	}

	/**
	 * Run plugin:uninstall hooks
	 */
	async runPluginUninstall(pluginId: string, deleteData: boolean): Promise<HookResult<void>[]> {
		const hooks = this.getTypedHooks("plugin:uninstall");
		const results: HookResult<void>[] = [];

		// Only run the hook for the specific plugin being uninstalled
		const hook = hooks.find((h) => h.pluginId === pluginId);
		if (!hook) return results;

		const { handler } = hook;
		const event: UninstallEvent = { deleteData };
		const ctx = this.getContext(pluginId);
		const start = Date.now();

		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			results.push({
				success: true,
				pluginId: hook.pluginId,
				duration: Date.now() - start,
			});
		} catch (error) {
			results.push({
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId: hook.pluginId,
				duration: Date.now() - start,
			});
		}

		return results;
	}

	private async runLifecycleHook(
		hookName: "plugin:install" | "plugin:activate" | "plugin:deactivate",
		pluginId: string,
	): Promise<HookResult<void>[]> {
		const hooks = this.getTypedHooks(hookName);
		const results: HookResult<void>[] = [];

		// Only run the hook for the specific plugin
		const hook = hooks.find((h) => h.pluginId === pluginId);
		if (!hook) return results;

		const { handler } = hook;
		const event: LifecycleEvent = {};
		const ctx = this.getContext(pluginId);
		const start = Date.now();

		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			results.push({
				success: true,
				pluginId: hook.pluginId,
				duration: Date.now() - start,
			});
		} catch (error) {
			results.push({
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId: hook.pluginId,
				duration: Date.now() - start,
			});
		}

		return results;
	}

	// =========================================================================
	// Content Hooks
	// =========================================================================

	/**
	 * Run content:beforeSave hooks
	 * Returns modified content from the pipeline
	 */
	async runContentBeforeSave(
		content: Record<string, unknown>,
		collection: string,
		isNew: boolean,
	): Promise<{
		content: Record<string, unknown>;
		results: HookResult<Record<string, unknown>>[];
	}> {
		const hooks = this.getTypedHooks("content:beforeSave");
		const results: HookResult<Record<string, unknown>>[] = [];
		let currentContent = content;

		for (const hook of hooks) {
			const { handler } = hook;
			const event: ContentHookEvent = {
				content: currentContent,
				collection,
				isNew,
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				// Handler can return modified content or void (keep current)
				if (result !== undefined) {
					currentContent = result;
				}
				results.push({
					success: true,
					value: currentContent,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return { content: currentContent, results };
	}

	/**
	 * Run content:afterSave hooks
	 */
	async runContentAfterSave(
		content: Record<string, unknown>,
		collection: string,
		isNew: boolean,
	): Promise<HookResult<void>[]> {
		const hooks = this.getTypedHooks("content:afterSave");
		const results: HookResult<void>[] = [];

		for (const hook of hooks) {
			const { handler } = hook;
			const event: ContentHookEvent = { content, collection, isNew };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return results;
	}

	/**
	 * Run content:beforeDelete hooks
	 * Returns whether deletion is allowed
	 */
	async runContentBeforeDelete(
		id: string,
		collection: string,
	): Promise<{ allowed: boolean; results: HookResult<boolean>[] }> {
		const hooks = this.getTypedHooks("content:beforeDelete");
		const results: HookResult<boolean>[] = [];
		let allowed = true;

		for (const hook of hooks) {
			const { handler } = hook;
			const event: ContentDeleteEvent = { id, collection };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				// Handler returns false to block, true or void to allow
				if (result === false) {
					allowed = false;
				}
				results.push({
					success: true,
					value: result !== false,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return { allowed, results };
	}

	/**
	 * Run content:afterDelete hooks
	 */
	async runContentAfterDelete(id: string, collection: string): Promise<HookResult<void>[]> {
		const hooks = this.getTypedHooks("content:afterDelete");
		const results: HookResult<void>[] = [];

		for (const hook of hooks) {
			const { handler } = hook;
			const event: ContentDeleteEvent = { id, collection };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return results;
	}

	// =========================================================================
	// Media Hooks
	// =========================================================================

	/**
	 * Run media:beforeUpload hooks
	 */
	async runMediaBeforeUpload(file: { name: string; type: string; size: number }): Promise<{
		file: { name: string; type: string; size: number };
		results: HookResult<{ name: string; type: string; size: number }>[];
	}> {
		const hooks = this.getTypedHooks("media:beforeUpload");
		const results: HookResult<{
			name: string;
			type: string;
			size: number;
		}>[] = [];
		let currentFile = file;

		for (const hook of hooks) {
			const { handler } = hook;
			const event: MediaUploadEvent = { file: currentFile };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				// Handler can return modified file info or void
				if (result !== undefined) {
					currentFile = result;
				}
				results.push({
					success: true,
					value: currentFile,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return { file: currentFile, results };
	}

	/**
	 * Run media:afterUpload hooks
	 */
	async runMediaAfterUpload(media: {
		id: string;
		filename: string;
		mimeType: string;
		size: number | null;
		url: string;
		createdAt: string;
	}): Promise<HookResult<void>[]> {
		const hooks = this.getTypedHooks("media:afterUpload");
		const results: HookResult<void>[] = [];

		for (const hook of hooks) {
			const { handler } = hook;
			const event: MediaAfterUploadEvent = { media };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return results;
	}

	// =========================================================================
	// Cron Hook (per-plugin dispatch)
	// =========================================================================

	/**
	 * Invoke the cron hook for a specific plugin.
	 *
	 * Unlike other hooks which broadcast to all plugins, the cron hook is
	 * dispatched only to the target plugin — the one that owns the task.
	 */
	async invokeCronHook(pluginId: string, event: CronEvent): Promise<HookResult<void>> {
		const hooks = this.getTypedHooks("cron");
		const hook = hooks.find((h) => h.pluginId === pluginId);

		if (!hook) {
			return {
				success: false,
				error: new Error(`Plugin "${pluginId}" has no cron hook registered`),
				pluginId,
				duration: 0,
			};
		}

		const { handler } = hook;
		const ctx = this.getContext(pluginId);
		const start = Date.now();

		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			return {
				success: true,
				pluginId,
				duration: Date.now() - start,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId,
				duration: Date.now() - start,
			};
		}
	}

	// =========================================================================
	// Email Hooks
	// =========================================================================

	/**
	 * Run email:beforeSend hooks (middleware pipeline).
	 *
	 * Each handler receives the message and returns a modified message or
	 * `false` to cancel delivery. The pipeline chains message transformations —
	 * each handler receives the output of the previous one.
	 */
	async runEmailBeforeSend(
		message: EmailMessage,
		source: string,
	): Promise<{ message: EmailMessage | false; results: HookResult<EmailMessage | false>[] }> {
		const hooks = this.getTypedHooks("email:beforeSend");
		const results: HookResult<EmailMessage | false>[] = [];
		let currentMessage: EmailMessage = message;

		for (const hook of hooks) {
			const { handler } = hook;
			// Shallow-clone message to prevent handlers from mutating
			// the shared reference and leaking changes to subsequent stages
			const event: EmailBeforeSendEvent = { message: { ...currentMessage }, source };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);

				if (result === false) {
					// Cancelled
					results.push({
						success: true,
						value: false,
						pluginId: hook.pluginId,
						duration: Date.now() - start,
					});
					return { message: false, results };
				}

				// Handler returned a modified message
				if (result && typeof result === "object") {
					currentMessage = result;
				}

				results.push({
					success: true,
					value: currentMessage,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return { message: currentMessage, results };
	}

	/**
	 * Run email:afterSend hooks (fire-and-forget).
	 *
	 * Errors are logged but don't propagate — they don't affect the caller.
	 */
	async runEmailAfterSend(message: EmailMessage, source: string): Promise<HookResult<void>[]> {
		const hooks = this.getTypedHooks("email:afterSend");
		const results: HookResult<void>[] = [];

		for (const hook of hooks) {
			const { handler } = hook;
			const event = { message, source };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			} catch (error) {
				// Fire-and-forget: log but don't propagate
				console.error(
					`[email:afterSend] Plugin "${hook.pluginId}" error:`,
					error instanceof Error ? error.message : error,
				);
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start,
				});
			}
		}

		return results;
	}

	// =========================================================================
	// Comment Hooks
	// =========================================================================

	/**
	 * Run comment:beforeCreate hooks (middleware pipeline).
	 *
	 * Each handler receives the event and returns a modified event or
	 * `false` to reject the comment. The pipeline chains transformations —
	 * each handler receives the output of the previous one.
	 */
	async runCommentBeforeCreate(
		event: CommentBeforeCreateEvent,
	): Promise<CommentBeforeCreateEvent | false> {
		const hooks = this.getTypedHooks("comment:beforeCreate");
		let currentEvent = event;

		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();

			try {
				const result = await this.executeWithTimeout(
					() => handler({ ...currentEvent }, ctx),
					hook.timeout,
				);

				if (result === false) {
					return false;
				}

				if (result && typeof result === "object") {
					currentEvent = result;
				}
			} catch (error) {
				console.error(
					`[comment:beforeCreate] Plugin "${hook.pluginId}" error (${Date.now() - start}ms):`,
					error instanceof Error ? error.message : error,
				);

				if (hook.errorPolicy === "abort") {
					throw error;
				}
			}
		}

		return currentEvent;
	}

	/**
	 * Run comment:afterCreate hooks (fire-and-forget).
	 *
	 * Errors are logged but don't propagate — they don't affect the caller.
	 */
	async runCommentAfterCreate(event: CommentAfterCreateEvent): Promise<void> {
		const hooks = this.getTypedHooks("comment:afterCreate");

		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);

			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			} catch (error) {
				console.error(
					`[comment:afterCreate] Plugin "${hook.pluginId}" error:`,
					error instanceof Error ? error.message : error,
				);
			}
		}
	}

	/**
	 * Run comment:afterModerate hooks (fire-and-forget).
	 *
	 * Errors are logged but don't propagate — they don't affect the caller.
	 */
	async runCommentAfterModerate(event: CommentAfterModerateEvent): Promise<void> {
		const hooks = this.getTypedHooks("comment:afterModerate");

		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);

			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			} catch (error) {
				console.error(
					`[comment:afterModerate] Plugin "${hook.pluginId}" error:`,
					error instanceof Error ? error.message : error,
				);
			}
		}
	}

	// =========================================================================
	// Public Page Hooks
	// =========================================================================

	/**
	 * Run page:metadata hooks. Each handler returns contributions that are
	 * merged by the metadata collector. Errors are logged but don't propagate.
	 */
	async runPageMetadata(
		event: PageMetadataEvent,
	): Promise<Array<{ pluginId: string; contributions: PageMetadataContribution[] }>> {
		const hooks = this.getTypedHooks("page:metadata");
		const results: Array<{ pluginId: string; contributions: PageMetadataContribution[] }> = [];

		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);

			try {
				const result = await this.executeWithTimeout(
					() => Promise.resolve(handler(event, ctx)),
					hook.timeout,
				);

				if (result != null) {
					const contributions = Array.isArray(result) ? result : [result];
					results.push({ pluginId: hook.pluginId, contributions });
				}
			} catch (error) {
				console.error(
					`[page:metadata] Plugin "${hook.pluginId}" error:`,
					error instanceof Error ? error.message : error,
				);
			}
		}

		return results;
	}

	/**
	 * Run page:fragments hooks. Only trusted plugins should be registered
	 * for this hook. Errors are logged but don't propagate.
	 */
	async runPageFragments(
		event: PageFragmentEvent,
	): Promise<Array<{ pluginId: string; contributions: PageFragmentContribution[] }>> {
		const hooks = this.getTypedHooks("page:fragments");
		const results: Array<{ pluginId: string; contributions: PageFragmentContribution[] }> = [];

		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);

			try {
				const result = await this.executeWithTimeout(
					() => Promise.resolve(handler(event, ctx)),
					hook.timeout,
				);

				if (result != null) {
					const contributions = Array.isArray(result) ? result : [result];
					results.push({ pluginId: hook.pluginId, contributions });
				}
			} catch (error) {
				console.error(
					`[page:fragments] Plugin "${hook.pluginId}" error:`,
					error instanceof Error ? error.message : error,
				);
			}
		}

		return results;
	}

	// =========================================================================
	// Utilities
	// =========================================================================

	/**
	 * Check if any hooks are registered for a given name
	 */
	hasHooks(name: HookNameV2): boolean {
		const hooks = this.hooks.get(name);
		return hooks !== undefined && hooks.length > 0;
	}

	/**
	 * Get hook count for debugging
	 */
	getHookCount(name: HookNameV2): number {
		return this.hooks.get(name)?.length || 0;
	}

	/**
	 * Get all registered hook names
	 */
	getRegisteredHooks(): HookNameV2[] {
		return [...this.hooks.keys()];
	}

	// =========================================================================
	// Exclusive Hook Support
	// =========================================================================

	/**
	 * Returns hook names where at least one handler declared exclusive: true
	 */
	getRegisteredExclusiveHooks(): string[] {
		return [...this.exclusiveHookNames];
	}

	/**
	 * Check if a hook is exclusive
	 */
	isExclusiveHook(name: string): boolean {
		return this.exclusiveHookNames.has(name);
	}

	/**
	 * Set the selected provider for an exclusive hook.
	 * Called by PluginManager after resolution.
	 */
	setExclusiveSelection(hookName: string, pluginId: string): void {
		this.exclusiveSelections.set(hookName, pluginId);
	}

	/**
	 * Clear the selected provider for an exclusive hook.
	 */
	clearExclusiveSelection(hookName: string): void {
		this.exclusiveSelections.delete(hookName);
	}

	/**
	 * Get the selected provider for an exclusive hook (if any).
	 */
	getExclusiveSelection(hookName: string): string | undefined {
		return this.exclusiveSelections.get(hookName);
	}

	/**
	 * Get all plugins that registered a handler for a given exclusive hook.
	 */
	getExclusiveHookProviders(hookName: string): Array<{ pluginId: string }> {
		const hooks = this.hooks.get(hookName as HookNameV2) ?? [];
		return hooks.filter((h) => h.exclusive).map((h) => ({ pluginId: h.pluginId }));
	}

	/**
	 * Invoke an exclusive hook — dispatch only to the selected provider.
	 * Returns null if no provider is selected or if the selected hook
	 * is not found in the pipeline.
	 *
	 * This is a generic dispatch used by the email pipeline and other
	 * exclusive hook consumers. The handler type is unknown — callers
	 * must know the expected signature.
	 *
	 * Errors are isolated: a failing handler returns an error result
	 * instead of propagating the exception to the caller.
	 */
	async invokeExclusiveHook(
		hookName: string,
		event: unknown,
	): Promise<{ result: unknown; pluginId: string; error?: Error; duration: number } | null> {
		const selectedPluginId = this.exclusiveSelections.get(hookName);
		if (!selectedPluginId) return null;

		const hooks = this.hooks.get(hookName as HookNameV2) ?? [];
		const hook = hooks.find((h) => h.pluginId === selectedPluginId && h.exclusive);
		if (!hook) return null;

		const start = Date.now();
		try {
			const ctx = this.getContext(selectedPluginId);
			const handler = hook.handler as (event: unknown, ctx: PluginContext) => Promise<unknown>;
			const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			return { result, pluginId: selectedPluginId, duration: Date.now() - start };
		} catch (error) {
			return {
				result: undefined,
				pluginId: selectedPluginId,
				error: error instanceof Error ? error : new Error(String(error)),
				duration: Date.now() - start,
			};
		}
	}
}

/**
 * Create a hook pipeline from plugins
 */
export function createHookPipeline(
	plugins: ResolvedPlugin[],
	factoryOptions?: PluginContextFactoryOptions,
): HookPipeline {
	return new HookPipeline(plugins, factoryOptions);
}

// ── Shared exclusive hook resolution ─────────────────────────────────────────

/**
 * Options for exclusive hook resolution.
 */
export interface ExclusiveHookResolutionOptions {
	pipeline: HookPipeline;
	/**
	 * Check whether a plugin ID is currently active.
	 * Used to filter providers — only active providers participate in selection.
	 */
	isActive: (pluginId: string) => boolean;
	/** Read an option value from persistent storage. */
	getOption: (key: string) => Promise<string | null>;
	/** Write an option value to persistent storage. */
	setOption: (key: string, value: string) => Promise<void>;
	/** Delete an option from persistent storage. */
	deleteOption: (key: string) => Promise<void>;
	/**
	 * Map of pluginId → hook names the plugin prefers to handle.
	 * Used as a tiebreaker when no DB selection exists and multiple providers are active.
	 */
	preferredHints?: Map<string, string[]>;
}

/** Options table key prefix for exclusive hook selections */
const EXCLUSIVE_HOOK_KEY_PREFIX = "emdash:exclusive_hook:";

/**
 * Resolve exclusive hook selections.
 *
 * Shared algorithm used by both PluginManager and EmDashRuntime:
 * 1. If a DB selection exists and that plugin is active → keep it.
 * 2. If DB selection is stale (plugin inactive/gone) → clear it.
 * 3. If no selection and only one active provider → auto-select it.
 * 4. If preferred hints match an active provider → first match wins.
 * 5. If multiple providers and no hint → leave unselected (admin must choose).
 */
export async function resolveExclusiveHooks(opts: ExclusiveHookResolutionOptions): Promise<void> {
	const { pipeline, isActive, getOption, setOption, deleteOption, preferredHints } = opts;
	const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();

	for (const hookName of exclusiveHookNames) {
		const providers = pipeline.getExclusiveHookProviders(hookName);
		const activeProviderIds = new Set(
			providers.map((p) => p.pluginId).filter((id) => isActive(id)),
		);

		const key = `${EXCLUSIVE_HOOK_KEY_PREFIX}${hookName}`;
		let currentSelection: string | null = null;
		try {
			currentSelection = await getOption(key);
		} catch {
			// Options table may not be ready
			continue;
		}

		// If selection exists and the plugin is still active → keep it
		if (currentSelection && activeProviderIds.has(currentSelection)) {
			pipeline.setExclusiveSelection(hookName, currentSelection);
			continue;
		}

		// Selection is stale or missing — clear it
		if (currentSelection) {
			try {
				await deleteOption(key);
			} catch {
				// Non-fatal
			}
		}

		// Auto-select if only one active provider
		if (activeProviderIds.size === 1) {
			const [onlyProvider] = activeProviderIds;
			try {
				await setOption(key, onlyProvider);
			} catch {
				// Non-fatal
			}
			pipeline.setExclusiveSelection(hookName, onlyProvider);
			continue;
		}

		// Check preferred hints
		if (preferredHints) {
			let found = false;
			for (const [pluginId, hooks] of preferredHints) {
				if (hooks.includes(hookName) && activeProviderIds.has(pluginId)) {
					try {
						await setOption(key, pluginId);
					} catch {
						// Non-fatal
					}
					pipeline.setExclusiveSelection(hookName, pluginId);
					found = true;
					break;
				}
			}
			if (found) continue;
		}

		// Multiple providers, no hint — leave unselected
		pipeline.clearExclusiveSelection(hookName);
	}
}

```

File: /Users/masonjames/Projects/gravitysmtp/includes/connectors/config/class-connector-endpoints-config.php
```php
<?php

namespace Gravity_Forms\Gravity_SMTP\Connectors\Config;

use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Get_Single_Email_Data_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Cleanup_Data_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Migrate_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Save_Connector_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Save_Plugin_Settings_Endpoint;
use Gravity_Forms\Gravity_SMTP\Connectors\Endpoints\Send_Test_Endpoint;
use Gravity_Forms\Gravity_Tools\Config;

class Connector_Endpoints_Config extends Config {

	protected $script_to_localize = 'gravitysmtp_scripts_admin';
	protected $name               = 'gravitysmtp_admin_config';

	public function should_enqueue() {
		return is_admin();
	}

	public function data() {
		return array(
			'common' => array(
				'endpoints' => array(
					Send_Test_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Send_Test_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Send_Test_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Save_Connector_Settings_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Save_Connector_Settings_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Save_Connector_Settings_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Save_Plugin_Settings_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Save_Plugin_Settings_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Save_Plugin_Settings_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Get_Single_Email_Data_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Get_Single_Email_Data_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Get_Single_Email_Data_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
					Cleanup_Data_Endpoint::ACTION_NAME => array(
						'action' => array(
							'value'   => Cleanup_Data_Endpoint::ACTION_NAME,
							'default' => 'mock_endpoint',
						),
						'nonce'  => array(
							'value'   => wp_create_nonce( Cleanup_Data_Endpoint::ACTION_NAME ),
							'default' => 'nonce',
						),
					),
				)
			),
		);
	}

}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/context.ts
```ts
/**
 * Plugin Context v2
 *
 * Creates the unified context object provided to plugins in all hooks and routes.
 *
 */

import type { Kysely } from "kysely";
import { ulid } from "ulidx";

import { ContentRepository } from "../database/repositories/content.js";
import { MediaRepository } from "../database/repositories/media.js";
import { OptionsRepository } from "../database/repositories/options.js";
import { PluginStorageRepository } from "../database/repositories/plugin-storage.js";
import { UserRepository } from "../database/repositories/user.js";
import type { Database } from "../database/types.js";
import { validateExternalUrl, SsrfError, stripCredentialHeaders } from "../import/ssrf.js";
import type { Storage } from "../storage/types.js";
import { CronAccessImpl } from "./cron.js";
import type { EmailPipeline } from "./email.js";
import type {
	ResolvedPlugin,
	PluginContext,
	PluginStorageConfig,
	StorageCollection,
	KVAccess,
	CronAccess,
	EmailAccess,
	ContentAccess,
	ContentAccessWithWrite,
	MediaAccess,
	MediaAccessWithWrite,
	HttpAccess,
	LogAccess,
	SiteInfo,
	UserAccess,
	UserInfo,
	ContentItem,
	MediaItem,
	PaginatedResult,
	QueryOptions,
	ContentListOptions,
	MediaListOptions,
} from "./types.js";

// =============================================================================
// KV Access
// =============================================================================

/**
 * Create KV accessor for a plugin
 * All keys are automatically prefixed with the plugin ID
 */
export function createKVAccess(optionsRepo: OptionsRepository, pluginId: string): KVAccess {
	const prefix = `plugin:${pluginId}:`;

	return {
		async get<T>(key: string): Promise<T | null> {
			return optionsRepo.get<T>(`${prefix}${key}`);
		},

		async set(key: string, value: unknown): Promise<void> {
			await optionsRepo.set(`${prefix}${key}`, value);
		},

		async delete(key: string): Promise<boolean> {
			return optionsRepo.delete(`${prefix}${key}`);
		},

		async list(keyPrefix?: string): Promise<Array<{ key: string; value: unknown }>> {
			const fullPrefix = `${prefix}${keyPrefix ?? ""}`;
			const entriesMap = await optionsRepo.getByPrefix(fullPrefix);
			const result: Array<{ key: string; value: unknown }> = [];
			for (const [fullKey, value] of entriesMap) {
				result.push({
					key: fullKey.slice(prefix.length),
					value,
				});
			}
			return result;
		},
	};
}

// =============================================================================
// Storage Access
// =============================================================================

/**
 * Create storage collection accessor for a plugin
 * Wraps PluginStorageRepository with the v2 interface (no async iterators)
 */
function createStorageCollection<T>(
	db: Kysely<Database>,
	pluginId: string,
	collectionName: string,
	indexes: Array<string | string[]>,
): StorageCollection<T> {
	const repo = new PluginStorageRepository<T>(db, pluginId, collectionName, indexes);

	return {
		get: (id) => repo.get(id),
		put: (id, data) => repo.put(id, data),
		delete: (id) => repo.delete(id),
		exists: (id) => repo.exists(id),
		getMany: (ids) => repo.getMany(ids),
		putMany: (items) => repo.putMany(items),
		deleteMany: (ids) => repo.deleteMany(ids),
		count: (where) => repo.count(where),

		// Query returns PaginatedResult instead of the old format
		async query(options?: QueryOptions): Promise<PaginatedResult<{ id: string; data: T }>> {
			const result = await repo.query({
				where: options?.where,
				orderBy: options?.orderBy,
				limit: options?.limit,
				cursor: options?.cursor,
			});

			return {
				items: result.items,
				cursor: result.cursor,
				hasMore: result.hasMore,
			};
		},
	};
}

/**
 * Create storage accessor with all declared collections
 */
export function createStorageAccess<T extends PluginStorageConfig>(
	db: Kysely<Database>,
	pluginId: string,
	storageConfig: T,
): Record<string, StorageCollection> {
	const storage: Record<string, StorageCollection> = {};

	for (const [collectionName, config] of Object.entries(storageConfig)) {
		const allIndexes = [...config.indexes, ...(config.uniqueIndexes ?? [])];
		storage[collectionName] = createStorageCollection(db, pluginId, collectionName, allIndexes);
	}

	return storage;
}

// =============================================================================
// Content Access
// =============================================================================

/**
 * Create read-only content access
 */
export function createContentAccess(db: Kysely<Database>): ContentAccess {
	const contentRepo = new ContentRepository(db);

	return {
		async get(collection: string, id: string): Promise<ContentItem | null> {
			const item = await contentRepo.findById(collection, id);
			if (!item) return null;

			return {
				id: item.id,
				type: item.type,
				data: item.data,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			};
		},

		async list(
			collection: string,
			options?: ContentListOptions,
		): Promise<PaginatedResult<ContentItem>> {
			// Convert orderBy format if provided
			let orderBy: { field: string; direction: "asc" | "desc" } | undefined;
			if (options?.orderBy) {
				const entries = Object.entries(options.orderBy);
				const first = entries[0];
				if (first) {
					orderBy = { field: first[0], direction: first[1] };
				}
			}

			const result = await contentRepo.findMany(collection, {
				limit: options?.limit ?? 50,
				cursor: options?.cursor,
				orderBy,
			});

			return {
				items: result.items.map((item) => ({
					id: item.id,
					type: item.type,
					data: item.data,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
				})),
				cursor: result.nextCursor,
				hasMore: !!result.nextCursor,
			};
		},
	};
}

/**
 * Create full content access with write operations
 */
export function createContentAccessWithWrite(db: Kysely<Database>): ContentAccessWithWrite {
	const contentRepo = new ContentRepository(db);
	const readAccess = createContentAccess(db);

	return {
		...readAccess,

		async create(collection: string, data: Record<string, unknown>): Promise<ContentItem> {
			const item = await contentRepo.create({
				type: collection,
				data,
			});

			return {
				id: item.id,
				type: item.type,
				data: item.data,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			};
		},

		async update(
			collection: string,
			id: string,
			data: Record<string, unknown>,
		): Promise<ContentItem> {
			const item = await contentRepo.update(collection, id, { data });

			return {
				id: item.id,
				type: item.type,
				data: item.data,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			};
		},

		async delete(collection: string, id: string): Promise<boolean> {
			return contentRepo.delete(collection, id);
		},
	};
}

// =============================================================================
// Media Access
// =============================================================================

/**
 * Create read-only media access
 */
export function createMediaAccess(db: Kysely<Database>): MediaAccess {
	const mediaRepo = new MediaRepository(db);

	return {
		async get(id: string): Promise<MediaItem | null> {
			const item = await mediaRepo.findById(id);
			if (!item) return null;

			return {
				id: item.id,
				filename: item.filename,
				mimeType: item.mimeType,
				size: item.size,
				// Construct URL from storage key (or use a sensible default path)
				url: `/media/${item.id}/${item.filename}`,
				createdAt: item.createdAt,
			};
		},

		async list(options?: MediaListOptions): Promise<PaginatedResult<MediaItem>> {
			const result = await mediaRepo.findMany({
				limit: options?.limit ?? 50,
				cursor: options?.cursor,
				mimeType: options?.mimeType,
			});

			return {
				items: result.items.map((item) => ({
					id: item.id,
					filename: item.filename,
					mimeType: item.mimeType,
					size: item.size,
					url: `/media/${item.id}/${item.filename}`,
					createdAt: item.createdAt,
				})),
				cursor: result.nextCursor,
				hasMore: !!result.nextCursor,
			};
		},
	};
}

/**
 * Create full media access with write operations.
 * If storage is not provided, upload() will throw at call time.
 */
export function createMediaAccessWithWrite(
	db: Kysely<Database>,
	getUploadUrlFn: (
		filename: string,
		contentType: string,
	) => Promise<{ uploadUrl: string; mediaId: string }>,
	storage?: Storage,
): MediaAccessWithWrite {
	const mediaRepo = new MediaRepository(db);
	const readAccess = createMediaAccess(db);

	return {
		...readAccess,

		getUploadUrl: getUploadUrlFn,

		async upload(
			filename: string,
			contentType: string,
			bytes: ArrayBuffer,
		): Promise<{ mediaId: string; storageKey: string; url: string }> {
			if (!storage) {
				throw new Error(
					"Media upload() requires a storage backend. Configure storage in PluginContextFactoryOptions.",
				);
			}

			const mediaId = ulid();
			// Extract extension from basename (ignore path separators)
			const basename = filename.split("/").pop() ?? filename;
			const dotIdx = basename.lastIndexOf(".");
			const ext = dotIdx > 0 ? basename.slice(dotIdx).toLowerCase() : "";
			const storageKey = `${mediaId}${ext}`;

			// Upload to storage first
			await storage.upload({
				key: storageKey,
				body: new Uint8Array(bytes),
				contentType,
			});

			// Create DB record — clean up storage on failure
			try {
				await mediaRepo.create({
					filename: basename,
					mimeType: contentType,
					size: bytes.byteLength,
					storageKey,
					status: "ready",
				});
			} catch (error) {
				try {
					await storage.delete(storageKey);
				} catch {
					// Best-effort cleanup
				}
				throw error;
			}

			return {
				mediaId,
				storageKey,
				url: `/_emdash/api/media/file/${storageKey}`,
			};
		},

		async delete(id: string): Promise<boolean> {
			return mediaRepo.delete(id);
		},
	};
}

// =============================================================================
// HTTP Access
// =============================================================================

/** Maximum number of redirects to follow in plugin HTTP access */
const MAX_PLUGIN_REDIRECTS = 5;

function isHostAllowed(host: string, allowedHosts: string[]): boolean {
	return allowedHosts.some((pattern) => {
		if (pattern.startsWith("*.")) {
			const suffix = pattern.slice(1); // ".example.com"
			return host.endsWith(suffix) || host === pattern.slice(2);
		}
		return host === pattern;
	});
}

/**
 * Create HTTP access with host validation.
 *
 * Uses redirect: "manual" to re-validate each redirect target against
 * the allowedHosts list, preventing redirects to unauthorized hosts.
 */
export function createHttpAccess(pluginId: string, allowedHosts: string[]): HttpAccess {
	return {
		async fetch(url: string, init?: RequestInit): Promise<Response> {
			// Deny by default — plugins must declare allowed hosts
			if (allowedHosts.length === 0) {
				throw new Error(
					`Plugin "${pluginId}" has no allowed hosts configured. ` +
						`Add hosts to the plugin's allowedHosts array to enable HTTP requests.`,
				);
			}

			let currentUrl = url;
			let currentInit = init;

			for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
				const hostname = new URL(currentUrl).hostname;
				if (!isHostAllowed(hostname, allowedHosts)) {
					throw new Error(
						`Plugin "${pluginId}" is not allowed to fetch from host "${hostname}". ` +
							`Allowed hosts: ${allowedHosts.join(", ")}`,
					);
				}

				const response = await globalThis.fetch(currentUrl, {
					...currentInit,
					redirect: "manual",
				});

				// Not a redirect -- return directly
				if (response.status < 300 || response.status >= 400) {
					return response;
				}

				// Extract redirect target
				const location = response.headers.get("Location");
				if (!location) {
					return response;
				}

				// Resolve relative redirects; strip credentials on cross-origin hops
				const previousOrigin = new URL(currentUrl).origin;
				currentUrl = new URL(location, currentUrl).href;
				const nextOrigin = new URL(currentUrl).origin;

				if (previousOrigin !== nextOrigin && currentInit) {
					currentInit = stripCredentialHeaders(currentInit);
				}
			}

			throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
		},
	};
}

/**
 * Create unrestricted HTTP access (for plugins with network:fetch:any capability).
 * No host validation, but applies SSRF protection on redirect targets to
 * prevent plugins from being tricked into reaching internal services.
 */
export function createUnrestrictedHttpAccess(pluginId: string): HttpAccess {
	return {
		async fetch(url: string, init?: RequestInit): Promise<Response> {
			let currentUrl = url;
			let currentInit = init;

			for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
				// Validate each URL against SSRF rules (private IPs, metadata endpoints)
				try {
					validateExternalUrl(currentUrl);
				} catch (e) {
					const msg = e instanceof SsrfError ? e.message : "SSRF validation failed";
					throw new Error(
						`Plugin "${pluginId}": blocked fetch to "${new URL(currentUrl).hostname}": ${msg}`,
						{ cause: e },
					);
				}

				const response = await globalThis.fetch(currentUrl, {
					...currentInit,
					redirect: "manual",
				});

				// Not a redirect -- return directly
				if (response.status < 300 || response.status >= 400) {
					return response;
				}

				// Extract redirect target
				const location = response.headers.get("Location");
				if (!location) {
					return response;
				}

				// Resolve relative redirects; strip credentials on cross-origin hops
				const previousOrigin = new URL(currentUrl).origin;
				currentUrl = new URL(location, currentUrl).href;
				const nextOrigin = new URL(currentUrl).origin;

				if (previousOrigin !== nextOrigin && currentInit) {
					currentInit = stripCredentialHeaders(currentInit);
				}
			}

			throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
		},
	};
}

/**
 * Create blocked HTTP access (for plugins without network:fetch capability)
 */
export function createBlockedHttpAccess(pluginId: string): HttpAccess {
	return {
		async fetch(): Promise<never> {
			throw new Error(
				`Plugin "${pluginId}" does not have the "network:fetch" capability. ` +
					`Add "network:fetch" to the plugin's capabilities to enable HTTP requests.`,
			);
		},
	};
}

// =============================================================================
// Log Access
// =============================================================================

/**
 * Create logger for a plugin
 */
export function createLogAccess(pluginId: string): LogAccess {
	const prefix = `[plugin:${pluginId}]`;

	return {
		debug(message: string, data?: unknown): void {
			if (data !== undefined) {
				console.debug(prefix, message, data);
			} else {
				console.debug(prefix, message);
			}
		},

		info(message: string, data?: unknown): void {
			if (data !== undefined) {
				console.info(prefix, message, data);
			} else {
				console.info(prefix, message);
			}
		},

		warn(message: string, data?: unknown): void {
			if (data !== undefined) {
				console.warn(prefix, message, data);
			} else {
				console.warn(prefix, message);
			}
		},

		error(message: string, data?: unknown): void {
			if (data !== undefined) {
				console.error(prefix, message, data);
			} else {
				console.error(prefix, message);
			}
		},
	};
}

// =============================================================================
// Site Info
// =============================================================================

const TRAILING_SLASH_RE = /\/$/;

/**
 * Options for creating site info
 */
export interface SiteInfoOptions {
	/** Site name from options table */
	siteName?: string;
	/** Site URL from options table or Astro config */
	siteUrl?: string;
	/** Site locale from options table */
	locale?: string;
}

/**
 * Create site info from config and settings.
 *
 * Resolution order for URL:
 * 1. options table (emdash:site_url)
 * 2. Astro `site` config
 * 3. fallback to empty string
 */
export function createSiteInfo(options: SiteInfoOptions): SiteInfo {
	return {
		name: options.siteName ?? "",
		url: (options.siteUrl ?? "").replace(TRAILING_SLASH_RE, ""), // strip trailing slash
		locale: options.locale ?? "en",
	};
}

/**
 * Create a URL helper that generates absolute URLs from relative paths.
 * Validates that path starts with "/" and rejects protocol-relative paths ("//").
 */
export function createUrlHelper(siteUrl: string): (path: string) => string {
	const base = siteUrl.replace(TRAILING_SLASH_RE, ""); // strip trailing slash

	return (path: string): string => {
		if (!path.startsWith("/")) {
			throw new Error(`URL path must start with "/", got: "${path}"`);
		}
		if (path.startsWith("//")) {
			throw new Error(`URL path must not be protocol-relative, got: "${path}"`);
		}
		return `${base}${path}`;
	};
}

// =============================================================================
// User Access
// =============================================================================

/**
 * Convert a UserRepository user to the plugin-facing UserInfo shape.
 * Strips sensitive fields (avatarUrl, emailVerified, data).
 */
function toUserInfo(user: {
	id: string;
	email: string;
	name: string | null;
	role: number;
	createdAt: string;
}): UserInfo {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt,
	};
}

/**
 * Create read-only user access for plugins.
 * Excludes sensitive fields (password hashes, sessions, passkeys, avatar URL, data).
 */
export function createUserAccess(db: Kysely<Database>): UserAccess {
	const userRepo = new UserRepository(db);

	return {
		async get(id: string): Promise<UserInfo | null> {
			const user = await userRepo.findById(id);
			if (!user) return null;
			return toUserInfo(user);
		},

		async getByEmail(email: string): Promise<UserInfo | null> {
			const user = await userRepo.findByEmail(email);
			if (!user) return null;
			return toUserInfo(user);
		},

		async list(opts?: {
			role?: number;
			limit?: number;
			cursor?: string;
		}): Promise<{ items: UserInfo[]; nextCursor?: string }> {
			const result = await userRepo.findMany({
				role: opts?.role as 10 | 20 | 30 | 40 | 50 | undefined,
				cursor: opts?.cursor,
				limit: opts?.limit,
			});

			return {
				items: result.items.map(toUserInfo),
				nextCursor: result.nextCursor,
			};
		},
	};
}

// =============================================================================
// Plugin Context Factory
// =============================================================================

export interface PluginContextFactoryOptions {
	db: Kysely<Database>;
	/**
	 * Storage backend for direct media uploads.
	 * If not provided, upload() will throw.
	 */
	storage?: Storage;
	/**
	 * Function to generate upload URLs for media.
	 * If not provided, media write operations will throw.
	 */
	getUploadUrl?: (
		filename: string,
		contentType: string,
	) => Promise<{ uploadUrl: string; mediaId: string }>;
	/**
	 * Site information for ctx.site and ctx.url().
	 * If not provided, site info will have empty defaults.
	 */
	siteInfo?: SiteInfoOptions;
	/**
	 * Callback to notify the cron scheduler that the next due time may have changed.
	 * If not provided, ctx.cron will not be available.
	 */
	cronReschedule?: () => void;
	/**
	 * Email pipeline instance for ctx.email.
	 * If not provided (or no provider configured), ctx.email will be undefined.
	 */
	emailPipeline?: EmailPipeline;
}

/**
 * Factory for creating plugin contexts
 */
export class PluginContextFactory {
	private optionsRepo: OptionsRepository;
	private db: Kysely<Database>;
	private storage?: Storage;
	private getUploadUrl?: (
		filename: string,
		contentType: string,
	) => Promise<{ uploadUrl: string; mediaId: string }>;
	private site: SiteInfo;
	private urlHelper: (path: string) => string;
	private cronReschedule?: () => void;
	private emailPipeline?: EmailPipeline;

	constructor(options: PluginContextFactoryOptions) {
		this.db = options.db;
		this.optionsRepo = new OptionsRepository(options.db);
		this.storage = options.storage;
		this.getUploadUrl = options.getUploadUrl;
		this.site = createSiteInfo(options.siteInfo ?? {});
		this.urlHelper = createUrlHelper(this.site.url);
		this.cronReschedule = options.cronReschedule;
		this.emailPipeline = options.emailPipeline;
	}

	/**
	 * Create the unified plugin context
	 */
	createContext(plugin: ResolvedPlugin): PluginContext {
		const capabilities = new Set(plugin.capabilities);

		// Always available
		const kv = createKVAccess(this.optionsRepo, plugin.id);
		const log = createLogAccess(plugin.id);
		const storage = createStorageAccess(this.db, plugin.id, plugin.storage);

		// Capability-gated: content
		let content: ContentAccess | ContentAccessWithWrite | undefined;
		if (capabilities.has("write:content")) {
			content = createContentAccessWithWrite(this.db);
		} else if (capabilities.has("read:content")) {
			content = createContentAccess(this.db);
		}

		// Capability-gated: media
		let media: MediaAccess | MediaAccessWithWrite | undefined;
		if (capabilities.has("write:media") && this.getUploadUrl) {
			media = createMediaAccessWithWrite(this.db, this.getUploadUrl, this.storage);
		} else if (capabilities.has("read:media")) {
			media = createMediaAccess(this.db);
		}

		// Capability-gated: http
		let http: HttpAccess | undefined;
		if (capabilities.has("network:fetch:any")) {
			http = createUnrestrictedHttpAccess(plugin.id);
		} else if (capabilities.has("network:fetch")) {
			http = createHttpAccess(plugin.id, plugin.allowedHosts);
		}

		// Capability-gated: users
		let users: UserAccess | undefined;
		if (capabilities.has("read:users")) {
			users = createUserAccess(this.db);
		}

		// Cron access ��� always available (scoped to plugin), but only if
		// the runtime provided a reschedule callback (i.e. cron is wired up).
		let cron: CronAccess | undefined;
		if (this.cronReschedule) {
			cron = new CronAccessImpl(this.db, plugin.id, this.cronReschedule);
		}

		// Email access — requires email:send capability AND a configured provider
		let email: EmailAccess | undefined;
		if (capabilities.has("email:send") && this.emailPipeline?.isAvailable()) {
			const pipeline = this.emailPipeline;
			const pluginId = plugin.id;
			email = {
				send: (message) => pipeline.send(message, pluginId),
			};
		}

		return {
			plugin: {
				id: plugin.id,
				version: plugin.version,
			},
			storage,
			kv,
			content,
			media,
			http,
			log,
			site: this.site,
			url: this.urlHelper,
			users,
			cron,
			email,
		};
	}
}

/**
 * Create a plugin context for a resolved plugin
 */
export function createPluginContext(
	options: PluginContextFactoryOptions,
	plugin: ResolvedPlugin,
): PluginContext {
	const factory = new PluginContextFactory(options);
	return factory.createContext(plugin);
}

```
</file_contents>
<meta prompt 1 = "[Architect]">
You are producing an implementation-ready technical plan. The implementer will work from your plan without asking clarifying questions, so every design decision must be resolved, every touched component must be identified, and every behavioral change must be specified precisely.

Your job:
1. Analyze the requested change against the provided code — identify the relevant architecture, constraints, data flow, and extension points.
2. Decide whether this is best solved by a targeted change or a broader refactor, and justify that decision.
3. Produce a plan detailed enough that an engineer can implement it file-by-file without making design decisions of their own.

Hard constraints:
- Do not write production code, patches, diffs, or copy-paste-ready implementations.
- Stay in analysis and architecture mode only.
- Use illustrative snippets, interface shapes, sample signatures, state/data shapes, or pseudocode when they communicate the design more precisely than prose. Keep them partial — enough to remove ambiguity, not enough to copy-paste.
- Scale your response to the complexity of the request. Small, localized changes need short plans; only expand sections for changes that genuinely require the detail.

─── ANALYSIS ───

Current-state analysis (always include):
- Map the existing responsibilities, type relationships, ownership, data flow, and mutation points relevant to the request.
- Identify existing code that should be reused or extended — never duplicate what already exists without justification.
- Note hard constraints: API contracts, protocol conformances, state ownership rules, thread/actor isolation, persistence schemas, UI update mechanisms.
- When multiple subsystems interact, trace the call chain end-to-end and identify each transformation boundary.

─── DESIGN ───

Design standards — address only the standards relevant to the change; skip sections that don't apply:

1. New and modified components/types: For each, specify:
   - The name, kind (for example: class, interface, enum, record, service, module, controller), and why that kind fits the codebase and language.
   - The fields/properties/state it owns, including data shape, mutability, and ownership/lifecycle semantics.
   - Key callable interfaces or signatures, including inputs, outputs, and whether execution is synchronous/asynchronous or can fail.
   - Contracts it implements, extends, composes with, or depends on.
   - For closed sets of variants (for example enums, tagged unions, discriminated unions): all cases/variants and any attached data.
   - Where the component lives (file path) and who creates/owns its instances.

2. State and data flow: For each state change the plan introduces or modifies:
   - What triggers the change (user action, callback, notification, timer, stream event).
   - The exact path the data travels: source → transformations → destination.
   - Thread/actor/queue context at each step.
   - How downstream consumers observe the change (published property, delegate, notification, binding, callback).
   - What happens if the change arrives out of order, is duplicated, or is dropped.

3. API and interface changes: For each modified public/internal interface:
   - The before and after signatures (or new signature if additive).
   - Every call site that must be updated, grouped by file.
   - Backward-compatibility strategy if the interface is used by external consumers or persisted data.

4. Persistence and serialization: When the plan touches stored data:
   - Schema changes with exact field names, types, and defaults.
   - Migration strategy: how existing data is read, transformed, and re-persisted.
   - What happens when new code reads old data and when old code reads new data (if rollback is possible).

5. Concurrency and lifecycle:
   - Specify the execution model and safety boundaries for each new/modified component: thread affinity, event-loop/runtime constraints, isolation boundaries, queue/worker discipline, or thread-safety expectations as applicable.
   - Identify potential races, leaked references/resources, or lifecycle mismatches introduced by the change.
   - When operations are asynchronous, specify cancellation/abort behavior and what state remains after interruption.

6. Error handling and edge cases:
   - For each operation that can fail, specify what failures are possible and how they propagate.
   - Describe degraded-mode behavior: what the user sees, what state is preserved, what recovery is available.
   - Identify boundary conditions: empty collections, missing/null/optional values, first-run states, interrupted operations.

7. Algorithmic and logic-heavy work (include whenever the change involves non-trivial control flow, state machines, data transformations, or performance-sensitive paths):
   - Describe the algorithm step-by-step: inputs, outputs, invariants, and data structures.
   - Cover edge cases, failure modes, and performance characteristics (time/space complexity if relevant).
   - Explain why this approach over the most plausible alternatives.

8. Avoid unnecessary complexity:
   - Do not add layers, abstractions, or indirection without a concrete benefit identified in the plan.
   - Do not create parallel code paths — unify where possible.
   - Reuse existing patterns unless those patterns are themselves the problem.

─── OUTPUT ───

Structure your response as:

1. **Summary** — One paragraph: what changes, why, and the high-level approach.

2. **Current-state analysis** — How the relevant code works today. Trace the data/control flow end-to-end. Identify what is reusable and what is blocking.

3. **Design** — The core of the plan. Apply every applicable standard from above. Organize by logical component or subsystem, not by standard number. Each component section should cover types, state flow, interfaces, persistence, concurrency, and error handling as relevant to that component.

4. **File-by-file impact** — For every file that changes, list:
   - What changes (added/modified/removed types, methods, properties).
   - Why (which design decision drives this change).
   - Dependencies on other changes in this plan (ordering constraints).

5. **Risks and migration** — Include only when the change introduces breaking changes, data migration, or rollback concerns. Omit for additive or non-breaking work.

6. **Implementation order** — A numbered sequence of steps. Each step should be independently compilable and testable where possible. Call out steps that must be atomic (landed together).

Response discipline:
- Be specific to the provided code — reference actual type names, file paths, method names, and property names.
- Make every assumption explicit.
- Flag unknowns that must be validated during implementation, with a suggested validation approach.
- When a design decision has a non-obvious rationale, explain it in one sentence.
- Do not pad with generic advice. Every sentence should convey information the implementer needs.

Please proceed with your analysis based on the following <user instructions>
</meta prompt 1>
<user_instructions>
<taskname="Emdash SMTP PRD"/>
<task>Plan and specify a production-ready `emdash-smtp` plugin for EmDash (repo/package target: `masonjames/emdash-smtp`, npm scope like `@masonjames`). Do not implement code. Produce an execution-ready plan and documentation spec that another engineer can follow to build, package, document, and publish the plugin with production quality UX and Gravity SMTP feature/provider parity. Treat auth/publish credentials as user-supplied runtime steps; do not embed secrets.</task>

<architecture>
EmDash plugin system and publishing:
- Plugin docs and conventions are defined in `emdash/docs/src/content/docs/plugins/*.mdx`.
- Runtime plugin model is centered on `definePlugin`, manifest schema/types, hook registration, settings routes, admin UI routes, and sandbox support.
- Publish flow is implemented by CLI commands `emdash plugin bundle` and `emdash plugin publish` with validation, bundling, and marketplace publishing semantics.

Email-specific integration path in EmDash:
- Email delivery uses plugin hooks (notably exclusive hook behavior), provider selection/settings APIs, and runtime hook resolution.
- Core files show how exclusive hooks are managed and how selected handlers are resolved at runtime.

Reference plugin patterns:
- `packages/plugins/marketplace-test` shows a minimal standard/sandboxed plugin shape and package metadata.
- `packages/plugins/atproto` and `emdash-restrict-with-stripe` show more complete plugin descriptor/runtime/admin route composition patterns.

Gravity SMTP parity reference:
- Provider inventory and connector architecture are defined by Gravity SMTP connector service/config/factory classes.
- Operational surfaces include alerts, logging/debug, suppression, tracking, migration, and managed email controls.
</architecture>

<selected_context>
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/overview.mdx: Official plugin concepts, native vs standard plugin format context.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/creating-plugins.mdx: Canonical plugin scaffolding and structure expectations.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/installing.mdx: Installation flow and `astro.config.mjs` integration requirements.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/publishing.mdx: Packaging + marketplace publishing guidance (`emdash plugin publish`).
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/hooks.mdx: Hook contracts and registration model.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/settings.mdx: Plugin settings registration/API patterns.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/storage.mdx: Plugin storage APIs and persistence conventions.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/api-routes.mdx: API route extension patterns for plugins.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/admin-ui.mdx: Admin UI integration patterns.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/sandbox.mdx: Sandboxed/standard plugin constraints and entrypoints.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/block-kit.mdx: Block Kit/UI extension patterns relevant to polished UX planning.

/Users/masonjames/Projects/emdash/packages/core/src/plugins/types.ts: Core plugin, hook, settings, descriptor, and runtime types.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manifest-schema.ts: Manifest validation schema used in bundling/publishing.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/define-plugin.ts: Authoring helper for plugin runtime declaration.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manager.ts: Plugin registration/lifecycle management.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/hooks.ts: Hook registry/execution behavior, including exclusive hook mechanics.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/email.ts: Email hook/provider integration points.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/email-console.ts: Dev email provider behavior and diagnostics context.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/context.ts: Runtime context passed into plugin handlers.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/routes.ts: Plugin route registration and integration.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/state.ts: Plugin state and registration internals.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/adapt-sandbox-entry.ts: Sandbox entry adaptation and capability mapping.

/Users/masonjames/Projects/emdash/packages/core/src/astro/integration/index.ts: Astro integration entry for plugin system.
/Users/masonjames/Projects/emdash/packages/core/src/astro/integration/runtime.ts: Runtime bootstrapping and plugin load path.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/settings/email.ts: Email settings API route surface.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/admin/hooks/exclusive/index.ts: Exclusive hook listing/inspection API.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/admin/hooks/exclusive/[hookName].ts: Exclusive hook selection/update API.
/Users/masonjames/Projects/emdash/packages/core/src/emdash-runtime.ts: Full runtime wiring for plugins, hooks, settings, and marketplace loading.

/Users/masonjames/Projects/emdash/packages/core/src/cli/commands/bundle.ts: Plugin bundling implementation and artifact structure.
/Users/masonjames/Projects/emdash/packages/core/src/cli/commands/publish.ts: Publish workflow, validation, auth, version checks, registry interactions.

/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/src/index.ts: Standard plugin descriptor example.
/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/src/sandbox-entry.ts: Sandboxed backend/admin entry example.
/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/package.json: Plugin package metadata conventions.
/Users/masonjames/Projects/emdash/packages/plugins/marketplace-test/README.md: Minimal plugin usage and local testing notes.
/Users/masonjames/Projects/emdash/packages/plugins/atproto/src/index.ts: Production plugin descriptor pattern.
/Users/masonjames/Projects/emdash/packages/plugins/atproto/src/sandbox-entry.ts: Production-grade sandbox route/admin pattern.

/Users/masonjames/Projects/emdash-restrict-with-stripe/src/index.ts: Plugin descriptor for standalone repo plugin.
/Users/masonjames/Projects/emdash-restrict-with-stripe/src/plugin.ts: Runtime/plugin definition pattern in a separate plugin repo.
/Users/masonjames/Projects/emdash-restrict-with-stripe/README.md: Installation/configuration docs style for plugin consumers.

/Users/masonjames/Projects/gravitysmtp/includes/connectors/class-connector-service-provider.php: Authoritative provider list and connector registration order.
/Users/masonjames/Projects/gravitysmtp/includes/connectors/class-connector-factory.php: Connector instantiation strategy.
/Users/masonjames/Projects/gravitysmtp/includes/connectors/config/class-connector-config.php: Connector settings config pattern.
/Users/masonjames/Projects/gravitysmtp/includes/connectors/config/class-connector-endpoints-config.php: Connector endpoint exposure pattern.
/Users/masonjames/Projects/gravitysmtp/includes/alerts/config/class-alerts-config.php: Alerts UX/config surface.
/Users/masonjames/Projects/gravitysmtp/includes/email-management/class-email-management-service-provider.php: Managed email feature surface.
/Users/masonjames/Projects/gravitysmtp/includes/email-management/config/class-managed-email-types-config.php: Managed email types config.
/Users/masonjames/Projects/gravitysmtp/includes/logging/class-logging-service-provider.php: Logging/debug capability surface.
/Users/masonjames/Projects/gravitysmtp/includes/logging/config/class-logging-endpoints-config.php: Logging API endpoints surface.
/Users/masonjames/Projects/gravitysmtp/includes/suppression/class-suppression-service-provider.php: Suppression list feature surface.
/Users/masonjames/Projects/gravitysmtp/includes/suppression/config/class-suppression-settings-config.php: Suppression settings model.
/Users/masonjames/Projects/gravitysmtp/includes/tracking/class-tracking-service-provider.php: Tracking/open events feature surface.
/Users/masonjames/Projects/gravitysmtp/includes/migration/class-migration-service-provider.php: Migration framework surface.
/Users/masonjames/Projects/gravitysmtp/includes/migration/config/class-migration-endpoints-config.php: Migration endpoint surface.
/Users/masonjames/Projects/gravitysmtp/CLAUDE.md: High-level architecture and UX/features summary.
</selected_context>

<relationships>
- `astro.config.mjs` plugin installation -> EmDash Astro integration runtime -> plugin manifest + backend/admin entry loading.
- `definePlugin` + `types.ts` + `manifest-schema.ts` -> governs valid plugin capabilities and publishability.
- Exclusive hook APIs (`/api/admin/hooks/exclusive/*`) -> select active implementation for hooks like email delivery.
- `emdash plugin bundle` -> manifest extraction + admin/backend bundling -> tarball artifact.
- `emdash plugin publish` -> auth/version/audit checks -> marketplace publication.
- Gravity SMTP connector service provider -> defines provider coverage baseline to mirror in emdash-smtp planning.
- emdash-restrict-with-stripe and atproto/marketplace-test -> concrete repo/package and runtime patterns to emulate for production plugin UX and structure.
</relationships>

<provider_parity_baseline>
Target parity providers from Gravity SMTP connector registration:
- Amazon SES
- Brevo
- Elastic Email
- Emailit
- Generic SMTP
- Google/Gmail
- Mailchimp
- MailerSend
- Mailgun
- Mailjet
- Microsoft
- PHP Mail
- Postmark
- Resend
- SendGrid
- SMTP2GO
- SparkPost
- Zoho
</provider_parity_baseline>

<deliverables>
Produce markdown planning docs (no implementation) for `emdash-smtp`:
- PRD (`docs/prd.md`): goals, non-goals, personas, UX principles, feature matrix, provider parity matrix, acceptance criteria, release gates.
- Technical architecture spec (`docs/architecture.md`): package layout, plugin format decision (native vs standard + rationale), runtime boundaries, hook strategy, settings/admin/API/storage model, security and sandboxing.
- Provider implementation plan (`docs/providers.md`): per-provider auth method, required secrets, scopes/permissions, API/send strategy, fallback/retry behavior, testing plan.
- UX/product spec (`docs/ux.md`): IA, setup wizard, provider onboarding flows, diagnostics/logging UX, backup routing UX, suppression/tracking UX, migration UX, delight details.
- Publishing/release runbook (`docs/release.md`): repo bootstrap, package metadata, npm scope publish workflow with user credentials, semantic versioning, changelog strategy, `emdash plugin publish` workflow.
- Integration guide (`README.md` + `docs/install.md`): install from npm scope, `astro.config.mjs` configuration examples, environment variable contract, local validation and smoke test steps.
- Execution plan (`docs/implementation-plan.md`): phased milestones, dependencies, risk register, test matrix, definition of done.
</deliverables>

<constraints>
- Do not include any raw npm/auth tokens in docs or prompts.
- Treat publishing auth as explicit operator steps (npm login/token setup by user, EmDash publish auth by user).
- Keep plan production-ready: reliability, observability, migration strategy, and UX polish are required.
- Ensure plan is actionable for creating new repository/package `masonjames/emdash-smtp` and publishing under Mason James-controlled npm scope.
</constraints>

<ambiguities>
- Exact parity interpretation: Gravity SMTP includes broad operational surfaces (alerts, suppression, tracking, migration, managed email controls). Confirm whether parity means all surfaces in v1 or staged parity with explicit phase gates.
- Plugin format choice: EmDash supports native and standard formats; marketplace publication expectations favor standard packaging. Confirm final distribution strategy (single format vs dual support).
- Provider depth: Some providers may support multiple auth variants/modes; confirm minimum acceptable per-provider scope for v1 parity.
</ambiguities>
</user_instructions>
