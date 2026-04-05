<user_instructions>
<taskname="WP plugin shortlist"/>
<task>Develop a prioritized plan for porting 10 low-complexity, high-fit WordPress.org plugins into EmDash CMS. Focus on what is already supported in EmDash’s plugin/runtime model, what capabilities are safest/easiest, and which WordPress plugin categories map cleanly with minimal architectural friction.</task>

<architecture>
- EmDash plugin runtime centers on `definePlugin()` + `PluginDescriptor` with capability-gated context (`ctx.kv`, `ctx.storage`, `ctx.content`, `ctx.media`, `ctx.http`, `ctx.users`, `ctx.cron`, `ctx.email`).
- Core execution is orchestrated by `PluginManager` + `HookPipeline` + `PluginRouteRegistry`; hooks are typed and ordered with priority/dependencies/timeouts/error policies.
- Marketplace-installed plugins require sandbox runner + storage; install/update flow validates manifest/checksum/capability and route-visibility escalation.
- Security and trust boundary differ by mode: trusted config plugins vs Cloudflare sandboxed marketplace plugins.
- Existing first-party plugins show a complexity spectrum: very simple descriptor/widget plugins (`color`) up to multi-route/storage/admin plugins (`forms`).
- Migration docs provide explicit WordPress→EmDash mappings (actions/filters, options, custom tables, shortcodes, admin pages, REST routes).
</architecture>

<selected_context>
/Users/masonjames/Projects/emdash/skills/wordpress-plugin-to-emdash/SKILL.md: WordPress→EmDash mapping tables and porting patterns used internally.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/plugin-porting.mdx: Detailed WP plugin concept translation and examples.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/porting-plugins.mdx: Portability assessment (good vs poor candidates), process, capability guidance.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/from-wordpress.mdx: Migration mappings and status/field/taxonomy conversion constraints.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/content-import.mdx: Import architecture and source capabilities (WXR, wordpress-com, probe).
/Users/masonjames/Projects/emdash/docs/src/content/docs/coming-from/wordpress.mdx: WP mental model mapping to EmDash APIs/UI.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/overview.mdx: Plugin philosophy, execution modes, capability model.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/creating-plugins.mdx: Descriptor vs runtime definition, package exports, portable text blocks.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/hooks.mdx: Hook signatures/configuration and available hook surface.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/storage.mdx: Plugin storage collections, indexes, query constraints.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/settings.mdx: `settingsSchema` + KV conventions and secret handling.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/api-routes.mdx: Route model, validation, admin integration patterns.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/admin-ui.mdx: Admin pages/widgets + when auto-generated settings are enough.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/sandbox.mdx: Trusted vs sandbox security model and platform limits.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/installing.mdx: Marketplace prerequisites and consent/update semantics.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/publishing.mdx: Bundle format, validation, audit expectations.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/block-kit.mdx: Block Kit model for sandbox-safe admin UX.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/types.ts: Canonical plugin interfaces/capabilities/hooks/routes/admin/storage types.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/define-plugin.ts: Native/standard plugin format behavior and validation.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/adapt-sandbox-entry.ts: Standard-format adaptation and capability implication logic.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/context.ts: Capability-gated context construction and HTTP/media/user access rules.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/hooks.ts: Runtime hook registration, required-capability checks, exclusive-hook resolution.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/routes.ts: Route invocation, input validation, error/status handling.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manager.ts: Plugin lifecycle orchestration and active-plugin dispatch behavior.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manifest-schema.ts: Manifest constraints (capabilities, hooks, routes, settings/field widget schema).
/Users/masonjames/Projects/emdash/packages/core/src/plugins/sandbox/types.ts: Sandbox runner interfaces and limits model.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/plugins/[pluginId]/[...path].ts: Public/private plugin route auth + CSRF enforcement behavior.
/Users/masonjames/Projects/emdash/packages/core/src/api/handlers/marketplace.ts: Install/update/uninstall checks (sandbox required, audit checks, capability/route escalation).
/Users/masonjames/Projects/emdash/packages/core/src/api/handlers/plugins.ts: Plugin list/detail model exposed to admin.
/Users/masonjames/Projects/emdash/packages/marketplace/src/workflows/audit.ts: Marketplace code/image audit workflow.
/Users/masonjames/Projects/emdash/packages/marketplace/src/audit/types.ts: Audit verdict/findings schema.
/Users/masonjames/Projects/emdash/packages/marketplace/src/routes/public.ts: Public marketplace metadata surface.
/Users/masonjames/Projects/emdash/packages/plugins/color/src/index.ts: Minimal field-widget plugin example (very low complexity).
/Users/masonjames/Projects/emdash/packages/plugins/embeds/src/index.ts: Portable Text block plugin example with no server capabilities.
/Users/masonjames/Projects/emdash/packages/plugins/forms/src/index.ts: Advanced plugin example (public routes, storage, cron, admin, settings).
/Users/masonjames/Projects/emdash/packages/plugins/forms/src/storage.ts: Storage/index declaration pattern.
/Users/masonjames/Projects/emdash/packages/plugins/forms/src/handlers/forms.ts: Route handler + plugin storage CRUD idioms.
/Users/masonjames/Projects/emdash/packages/plugins/webhook-notifier/src/index.ts: Network-heavy standard plugin descriptor pattern.
/Users/masonjames/Projects/emdash/packages/plugins/audit-log/src/index.ts: Read-content + storage/admin descriptor pattern.
/Users/masonjames/Projects/emdash/packages/plugins/atproto/src/index.ts: Descriptor-only integration plugin pattern.
</selected_context>

<relationships>
- `definePlugin` + `types.ts` define contract -> `manager.ts` registers/activates -> `hooks.ts` executes hook pipelines -> `context.ts` enforces capability-shaped `ctx`.
- `routes.ts` runtime route handler metadata feeds auth gating in `[...path].ts` (`public` skips auth; private enforces permissions/scope/CSRF).
- `manifest-schema.ts` validates bundle manifest used by `api/handlers/marketplace.ts` during install/update/uninstall.
- Marketplace flow: marketplace client download -> manifest/checksum validation -> store bundle in R2 -> plugin state update -> sandbox execution requirement.
- WordPress porting docs map WP concepts (`add_action`, `wp_options`, custom tables, shortcodes, admin pages, REST routes) to EmDash hooks/KV/storage/portable text/admin/routes.
- Example plugin spectrum can anchor effort estimates: `color` (tiny UI extension), `embeds` (content block extension), `forms` (full-stack plugin complexity).
</relationships>

<ambiguities>
- Docs include some examples that appear older than current runtime contracts (e.g., references to `content:afterRender` and route capability notes differ from current `types.ts`/`hooks.ts`/`[...path].ts`). Prefer core source files as source-of-truth when conflicts appear.
- `plugins/api-routes.mdx` states trusted-only routes, while runtime route handling and docs elsewhere present public/private plugin route behavior; treat execution-mode caveats as important when ranking candidates.
- Marketplace audit policy wording in docs can differ from handler enforcement details (`warn`/`fail` handling). Use `api/handlers/marketplace.ts` + marketplace workflow as authoritative.
</ambiguities>
</user_instructions>
<file_map>
/Users/masonjames/Projects/emdash-restrict-with-stripe
└── src
    └── handlers

/Users/masonjames/Projects/emdash
├── docs
│   ├── src
│   │   ├── content
│   │   │   └── docs
│   │   │       ├── coming-from
│   │   │       │   └── wordpress.mdx *
│   │   │       ├── migration
│   │   │       │   ├── content-import.mdx *
│   │   │       │   ├── from-wordpress.mdx *
│   │   │       │   ├── plugin-porting.mdx *
│   │   │       │   └── porting-plugins.mdx *
│   │   │       ├── plugins
│   │   │       │   ├── admin-ui.mdx *
│   │   │       │   ├── api-routes.mdx *
│   │   │       │   ├── creating-plugins.mdx *
│   │   │       │   ├── hooks.mdx *
│   │   │       │   ├── installing.mdx *
│   │   │       │   ├── overview.mdx *
│   │   │       │   ├── publishing.mdx *
│   │   │       │   ├── sandbox.mdx *
│   │   │       │   ├── settings.mdx *
│   │   │       │   └── storage.mdx *
│   │   │       ├── concepts
│   │   │       ├── contributing
│   │   │       ├── deployment
│   │   │       ├── guides
│   │   │       ├── reference
│   │   │       └── themes
│   │   ├── assets
│   │   │   └── screenshots
│   │   └── styles
│   └── public
├── packages
│   ├── core
│   │   ├── src
│   │   │   ├── api
│   │   │   │   ├── handlers
│   │   │   │   │   ├── marketplace.ts * +
│   │   │   │   │   └── plugins.ts * +
│   │   │   │   ├── openapi
│   │   │   │   └── schemas
│   │   │   ├── astro
│   │   │   │   ├── routes
│   │   │   │   │   └── api
│   │   │   │   │       ├── plugins
│   │   │   │   │       │   └── [pluginId]
│   │   │   │   │       │       └── [...path].ts * +
│   │   │   │   │       ├── admin
│   │   │   │   │       │   ├── allowed-domains
│   │   │   │   │       │   ├── api-tokens
│   │   │   │   │       │   ├── bylines
│   │   │   │   │       │   │   └── [id]
│   │   │   │   │       │   ├── comments
│   │   │   │   │       │   │   └── [id]
│   │   │   │   │       │   ├── hooks
│   │   │   │   │       │   │   └── exclusive
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
│   │   │   │   │       ├── settings
│   │   │   │   │       ├── setup
│   │   │   │   │       ├── taxonomies
│   │   │   │   │       │   └── [name]
│   │   │   │   │       │       └── terms
│   │   │   │   │       ├── themes
│   │   │   │   │       ├── well-known
│   │   │   │   │       └── widget-areas
│   │   │   │   │           └── [name]
│   │   │   │   │               └── widgets
│   │   │   │   ├── integration
│   │   │   │   ├── middleware
│   │   │   │   └── storage
│   │   │   ├── plugins
│   │   │   │   ├── sandbox
│   │   │   │   │   └── types.ts * +
│   │   │   │   ├── scheduler
│   │   │   │   ├── adapt-sandbox-entry.ts * +
│   │   │   │   ├── context.ts * +
│   │   │   │   ├── define-plugin.ts * +
│   │   │   │   ├── hooks.ts * +
│   │   │   │   ├── manager.ts * +
│   │   │   │   ├── manifest-schema.ts * +
│   │   │   │   ├── routes.ts * +
│   │   │   │   └── types.ts * +
│   │   │   ├── auth
│   │   │   ├── bylines
│   │   │   ├── cli
│   │   │   │   ├── commands
│   │   │   │   │   └── import
│   │   │   │   └── wxr
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
│   │   │   └── widgets
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
│   ├── marketplace
│   │   ├── src
│   │   │   ├── audit
│   │   │   │   └── types.ts * +
│   │   │   ├── routes
│   │   │   │   └── public.ts * +
│   │   │   ├── workflows
│   │   │   │   └── audit.ts * +
│   │   │   └── db
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
│   ├── plugins
│   │   ├── atproto
│   │   │   ├── src
│   │   │   │   └── index.ts * +
│   │   │   └── tests
│   │   ├── audit-log
│   │   │   └── src
│   │   │       └── index.ts * +
│   │   ├── color
│   │   │   └── src
│   │   │       └── index.ts * +
│   │   ├── embeds
│   │   │   └── src
│   │   │       ├── astro
│   │   │       └── index.ts * +
│   │   ├── forms
│   │   │   └── src
│   │   │       ├── handlers
│   │   │       │   └── forms.ts * +
│   │   │       ├── astro
│   │   │       ├── client
│   │   │       ├── styles
│   │   │       ├── index.ts * +
│   │   │       └── storage.ts * +
│   │   ├── webhook-notifier
│   │   │   └── src
│   │   │       └── index.ts * +
│   │   ├── ai-moderation
│   │   │   ├── src
│   │   │   └── tests
│   │   ├── api-test
│   │   │   └── src
│   │   ├── marketplace-test
│   │   │   ├── dist
│   │   │   ├── screenshots
│   │   │   └── src
│   │   └── sandboxed-test
│   │       ├── dist
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
│   └── x402
│       ├── dist
│       ├── src
│       └── tests
├── skills
│   ├── wordpress-plugin-to-emdash
│   │   └── SKILL.md *
│   ├── adversarial-reviewer
│   ├── agent-browser
│   ├── building-emdash-site
│   │   └── references
│   ├── creating-plugins
│   │   └── references
│   ├── emdash-cli
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
├── scripts
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


(* denotes selected files)
(+ denotes code-map available)
Config: directory-only view; selected files shown.

File: /Users/masonjames/Projects/emdash/packages/admin/dist/index.d.ts
Imports:
  - import { Button, Sidebar as KumoSidebar } from "@cloudflare/kumo";
  - import * as _tanstack_react_query0 from "@tanstack/react-query";
  - import { QueryClient } from "@tanstack/react-query";
  - import * as _tanstack_react_router0 from "@tanstack/react-router";
  - import { Link, useNavigate, useParams } from "@tanstack/react-router";
  - import * as React from "react";
  - import { ComponentProps } from "react";
  - import * as react_jsx_runtime0 from "react/jsx-runtime";
  - import { ClassValue } from "clsx";
  - import { Node } from "@tiptap/core";
  - import { Editor } from "@tiptap/react";
  - import * as _emdash_cms_blocks0 from "@emdash-cms/blocks";
  - import { Element } from "@emdash-cms/blocks";
  - import * as _tanstack_router_core0 from "@tanstack/router-core";
  - import * as _tanstack_history0 from "@tanstack/history";
---

Interfaces:
  - PluginAdminModule
    Properties:
      - widgets?: Record<string, React.ComponentType>
      - pages?: Record<string, React.ComponentType>
      - fields?: Record<string, React.ComponentType>
  - PluginAdminProviderProps
    Properties:
      - children: React.ReactNode
      - pluginAdmins: PluginAdmins
  - AdminAppProps
    Properties:
      - pluginAdmins?: PluginAdmins
  - RouterContext
    Properties:
      - queryClient: QueryClient
  - ShellProps
    Properties:
      - children: React.ReactNode
      - manifest: {
  - SidebarNavProps
    Properties:
      - manifest: {
  - CurrentUser
    Properties:
      - id: string
      - email: string
      - name?: string
      - role: number
      - avatarUrl?: string
      - isFirstLogin?: boolean
  - FindManyResult
    Properties:
      - items: T[]
      - nextCursor?: string
  - AdminManifest
    Properties:
      - version: string
      - hash: string
      - collections: Record<string, {
      - plugins: Record<string, {
      - authMode: string
      - signupEnabled?: boolean
      - i18n?: {
      - marketplace?: string
  - BylineSummary
    Properties:
      - id: string
      - slug: string
      - displayName: string
      - bio: string | null
      - avatarMediaId: string | null
      - websiteUrl: string | null
      - userId: string | null
      - isGuest: boolean
      - createdAt: string
      - updatedAt: string
  - BylineInput
    Properties:
      - slug: string
      - displayName: string
      - bio?: string | null
      - avatarMediaId?: string | null
      - websiteUrl?: string | null
      - userId?: string | null
      - isGuest?: boolean
  - BylineCreditInput
    Properties:
      - bylineId: string
      - roleLabel?: string | null
  - ContentSeo
    Properties:
      - title: string | null
      - description: string | null
      - image: string | null
      - canonical: string | null
      - noIndex: boolean
  - ContentItem
    Properties:
      - id: string
      - type: string
      - slug: string | null
      - status: string
      - locale: string
      - translationGroup: string | null
      - data: Record<string, unknown>
      - authorId: string | null
      - primaryBylineId: string | null
      - byline?: BylineSummary | null
      - bylines?: Array<{
      - createdAt: string
      - updatedAt: string
      - publishedAt: string | null
      - scheduledAt: string | null
      - liveRevisionId: string | null
      - draftRevisionId: string | null
      - seo?: ContentSeo
  - CreateContentInput
    Properties:
      - type: string
      - slug?: string
      - data: Record<string, unknown>
      - status?: string
      - bylines?: BylineCreditInput[]
      - locale?: string
      - translationOf?: string
  - TranslationSummary
    Properties:
      - id: string
      - locale: string
      - slug: string | null
      - status: string
      - updatedAt: string
  - TranslationsResponse
    Properties:
      - translationGroup: string
      - translations: TranslationSummary[]
  - ContentSeoInput
    Properties:
      - title?: string | null
      - description?: string | null
      - image?: string | null
      - canonical?: string | null
      - noIndex?: boolean
  - UpdateContentInput
    Properties:
      - data?: Record<string, unknown>
      - slug?: string
      - status?: string
      - authorId?: string | null
      - bylines?: BylineCreditInput[]
      - skipRevision?: boolean
      - seo?: ContentSeoInput
  - TrashedContentItem
    Properties:
      - deletedAt: string
  - PreviewUrlResponse
    Properties:
      - url: string
      - expiresAt: number
  - Revision
    Properties:
      - id: string
      - collection: string
      - entryId: string
      - data: Record<string, unknown>
      - authorId: string | null
      - createdAt: string
  - RevisionListResponse
    Properties:
      - items: Revision[]
      - total: number
  - MediaItem
    Properties:
      - id: string
      - filename: string
      - mimeType: string
      - url: string
      - storageKey?: string
      - size: number
      - width?: number
      - height?: number
      - alt?: string
      - caption?: string
      - createdAt: string
      - provider?: string
      - meta?: Record<string, unknown>
  - MediaProviderCapabilities
    Properties:
      - browse: boolean
      - search: boolean
      - upload: boolean
      - delete: boolean
  - MediaProviderInfo
    Properties:
      - id: string
      - name: string
      - icon?: string
      - capabilities: MediaProviderCapabilities
  - MediaProviderItem
    Properties:
      - id: string
      - filename: string
      - mimeType: string
      - size?: number
      - width?: number
      - height?: number
      - alt?: string
      - previewUrl?: string
      - meta?: Record<string, unknown>
  - SchemaCollection
    Properties:
      - id: string
      - slug: string
      - label: string
      - labelSingular?: string
      - description?: string
      - icon?: string
      - supports: string[]
      - source?: string
      - urlPattern?: string
      - hasSeo: boolean
      - commentsEnabled: boolean
      - commentsModeration: "all" | "first_time" | "none"
      - commentsClosedAfterDays: number
      - commentsAutoApproveUsers: boolean
      - createdAt: string
      - updatedAt: string
  - SchemaField
    Properties:
      - id: string
      - collectionId: string
      - slug: string
      - label: string
      - type: FieldType
      - columnType: string
      - required: boolean
      - unique: boolean
      - searchable: boolean
      - defaultValue?: unknown
      - validation?: {
      - widget?: string
      - options?: Record<string, unknown>
      - sortOrder: number
      - createdAt: string
  - SchemaCollectionWithFields
    Properties:
      - fields: SchemaField[]
  - CreateCollectionInput
    Properties:
      - slug: string
      - label: string
      - labelSingular?: string
      - description?: string
      - icon?: string
      - supports?: string[]
      - urlPattern?: string
      - hasSeo?: boolean
  - UpdateCollectionInput
    Properties:
      - label?: string
      - labelSingular?: string
      - description?: string
      - icon?: string
      - supports?: string[]
      - urlPattern?: string
      - hasSeo?: boolean
      - commentsEnabled?: boolean
      - commentsModeration?: "all" | "first_time" | "none"
      - commentsClosedAfterDays?: number
      - commentsAutoApproveUsers?: boolean
  - CreateFieldInput
    Properties:
      - slug: string
      - label: string
      - type: FieldType
      - required?: boolean
      - unique?: boolean
      - searchable?: boolean
      - defaultValue?: unknown
      - validation?: {
      - widget?: string
      - options?: Record<string, unknown>
  - UpdateFieldInput
    Properties:
      - label?: string
      - required?: boolean
      - unique?: boolean
      - searchable?: boolean
      - defaultValue?: unknown
      - validation?: {
      - widget?: string
      - options?: Record<string, unknown>
      - sortOrder?: number
  - OrphanedTable
    Properties:
      - slug: string
      - tableName: string
      - rowCount: number
  - PluginInfo
    Properties:
      - id: string
      - name: string
      - version: string
      - package?: string
      - enabled: boolean
      - status: "installed" | "active" | "inactive"
      - capabilities: string[]
      - hasAdminPages: boolean
      - hasDashboardWidgets: boolean
      - hasHooks: boolean
      - installedAt?: string
      - activatedAt?: string
      - deactivatedAt?: string
      - source?: "config" | "marketplace"
      - marketplaceVersion?: string
      - description?: string
      - iconUrl?: string
  - SiteSettings
    Properties:
      - title: string
      - tagline?: string
      - logo?: {
      - favicon?: {
      - url?: string
      - postsPerPage: number
      - dateFormat: string
      - timezone: string
      - social?: {
      - seo?: {
  - UserListItem
    Properties:
      - id: string
      - email: string
      - name: string | null
      - avatarUrl: string | null
      - role: number
      - emailVerified: boolean
      - disabled: boolean
      - createdAt: string
      - updatedAt: string
      - lastLogin: string | null
      - credentialCount: number
      - oauthProviders: string[]
  - UserDetail
    Properties:
      - credentials: Array<{
      - oauthAccounts: Array<{
  - UpdateUserInput
    Properties:
      - name?: string
      - email?: string
      - role?: number
  - InviteResult
    Properties:
      - success: true
      - message: string
      - inviteUrl?: string
  - PasskeyInfo
    Properties:
      - id: string
      - name: string | null
      - deviceType: "singleDevice" | "multiDevice"
      - backedUp: boolean
      - createdAt: string
      - lastUsedAt: string
  - AllowedDomain
    Properties:
      - domain: string
      - defaultRole: number
      - roleName: string
      - enabled: boolean
      - createdAt: string
  - CreateAllowedDomainInput
    Properties:
      - domain: string
      - defaultRole: number
  - UpdateAllowedDomainInput
    Properties:
      - enabled?: boolean
      - defaultRole?: number
  - SignupVerifyResult
    Properties:
      - email: string
      - role: number
      - roleName: string
  - Menu
    Properties:
      - id: string
      - name: string
      - label: string
      - created_at: string
      - updated_at: string
      - itemCount?: number
  - MenuItem
    Properties:
      - id: string
      - menu_id: string
      - parent_id: string | null
      - sort_order: number
      - type: string
      - reference_collection: string | null
      - reference_id: string | null
      - custom_url: string | null
      - label: string
      - title_attr: string | null
      - target: string | null
      - css_classes: string | null
      - created_at: string
  - MenuWithItems
    Properties:
      - items: MenuItem[]
  - CreateMenuInput
    Properties:
      - name: string
      - label: string
  - UpdateMenuInput
    Properties:
      - label?: string
  - CreateMenuItemInput
    Properties:
      - type: string
      - label: string
      - referenceCollection?: string
      - referenceId?: string
      - customUrl?: string
      - target?: string
      - titleAttr?: string
      - cssClasses?: string
      - parentId?: string
      - sortOrder?: number
  - UpdateMenuItemInput
    Properties:
      - label?: string
      - customUrl?: string
      - target?: string
      - titleAttr?: string
      - cssClasses?: string
      - parentId?: string | null
      - sortOrder?: number
  - ReorderMenuItemsInput
    Properties:
      - items: Array<{
  - WidgetArea
    Properties:
      - id: string
      - name: string
      - label: string
      - description?: string
      - widgets?: Widget[]
      - widgetCount?: number
  - Widget
    Properties:
      - id: string
      - type: "content" | "menu" | "component"
      - title?: string
      - content?: unknown[]
      - menuName?: string
      - componentId?: string
      - componentProps?: Record<string, unknown>
      - sort_order?: number
  - WidgetComponent
    Properties:
      - id: string
      - label: string
      - description?: string
      - props: Record<string, {
  - CreateWidgetAreaInput
    Properties:
      - name: string
      - label: string
      - description?: string
  - CreateWidgetInput
    Properties:
      - type: "content" | "menu" | "component"
      - title?: string
      - content?: unknown[]
      - menuName?: string
      - componentId?: string
      - componentProps?: Record<string, unknown>
  - UpdateWidgetInput
    Properties:
      - type?: "content" | "menu" | "component"
      - title?: string
      - content?: unknown[]
      - menuName?: string
      - componentId?: string
      - componentProps?: Record<string, unknown>
  - Section
    Properties:
      - id: string
      - slug: string
      - title: string
      - description?: string
      - keywords: string[]
      - content: unknown[]
      - previewUrl?: string
      - source: SectionSource
      - themeId?: string
      - createdAt: string
      - updatedAt: string
  - CreateSectionInput
    Properties:
      - slug: string
      - title: string
      - description?: string
      - keywords?: string[]
      - content: unknown[]
      - previewMediaId?: string
  - UpdateSectionInput
    Properties:
      - slug?: string
      - title?: string
      - description?: string
      - keywords?: string[]
      - content?: unknown[]
      - previewMediaId?: string | null
  - GetSectionsOptions
    Properties:
      - source?: SectionSource
      - search?: string
      - limit?: number
      - cursor?: string
  - SectionsResult
    Properties:
      - items: Section[]
      - nextCursor?: string
  - TaxonomyTerm
    Properties:
      - id: string
      - name: string
      - slug: string
      - label: string
      - parentId?: string
      - description?: string
      - children: TaxonomyTerm[]
      - count?: number
  - TaxonomyDef
    Properties:
      - id: string
      - name: string
      - label: string
      - labelSingular?: string
      - hierarchical: boolean
      - collections: string[]
  - CreateTaxonomyInput
    Properties:
      - name: string
      - label: string
      - hierarchical?: boolean
      - collections?: string[]
  - CreateTermInput
    Properties:
      - slug: string
      - label: string
      - parentId?: string
      - description?: string
  - UpdateTermInput
    Properties:
      - slug?: string
      - label?: string
      - parentId?: string
      - description?: string
  - ImportFieldDef
    Properties:
      - slug: string
      - label: string
      - type: string
      - required: boolean
  - CollectionSchemaStatus
    Properties:
      - exists: boolean
      - fieldStatus: Record<string, {
      - canImport: boolean
      - reason?: string
  - PostTypeAnalysis
    Properties:
      - name: string
      - count: number
      - suggestedCollection: string
      - requiredFields: ImportFieldDef[]
      - schemaStatus: CollectionSchemaStatus
  - AttachmentInfo
    Properties:
      - id?: number
      - title?: string
      - url?: string
      - filename?: string
      - mimeType?: string
  - NavMenu
    Properties:
      - name: string
      - slug: string
      - count: number
  - CustomTaxonomy
    Properties:
      - name: string
      - slug: string
      - count: number
      - hierarchical: boolean
  - WpAuthorInfo
    Properties:
      - id?: number
      - login?: string
      - email?: string
      - displayName?: string
      - postCount: number
  - WxrAnalysis
    Properties:
      - site: {
      - postTypes: PostTypeAnalysis[]
      - attachments: {
      - categories: number
      - tags: number
      - authors: WpAuthorInfo[]
      - customFields: Array<{
      - navMenus?: NavMenu[]
      - customTaxonomies?: CustomTaxonomy[]
  - PrepareRequest
    Properties:
      - postTypes: Array<{
  - PrepareResult
    Properties:
      - success: boolean
      - collectionsCreated: string[]
      - fieldsCreated: Array<{
      - errors: Array<{
  - AuthorMapping
    Properties:
      - wpLogin: string
      - wpDisplayName: string
      - wpEmail?: string
      - emdashUserId: string | null
      - postCount: number
  - ImportConfig
    Properties:
      - postTypeMappings: Record<string, {
      - skipExisting: boolean
      - authorMappings?: Record<string, string | null>
  - ImportResult
    Properties:
      - success: boolean
      - imported: number
      - skipped: number
      - errors: Array<{
      - byCollection: Record<string, number>
  - MediaImportResult
    Properties:
      - imported: Array<{
      - failed: Array<{
      - urlMap: Record<string, string>
  - MediaImportProgress
    Properties:
      - type: "progress"
      - current: number
      - total: number
      - filename?: string
      - status: "downloading" | "uploading" | "done" | "skipped" | "failed"
      - error?: string
  - RewriteUrlsResult
    Properties:
      - updated: number
      - byCollection: Record<string, number>
      - urlsRewritten: number
      - errors: Array<{
  - SourceCapabilities
    Properties:
      - publicContent: boolean
      - privateContent: boolean
      - customPostTypes: boolean
      - allMeta: boolean
      - mediaStream: boolean
  - SourceAuth
    Properties:
      - type: "oauth" | "token" | "password" | "none"
      - provider?: string
      - oauthUrl?: string
      - instructions?: string
  - SourceProbeResult
    Properties:
      - sourceId: string
      - confidence: "definite" | "likely" | "possible"
      - detected: {
      - capabilities: SourceCapabilities
      - auth?: SourceAuth
      - suggestedAction: SuggestedAction
      - preview?: {
  - ProbeResult
    Properties:
      - url: string
      - isWordPress: boolean
      - bestMatch: SourceProbeResult | null
      - allMatches: SourceProbeResult[]
  - WpPluginAnalysis
    Properties:
      - sourceId: string
      - site: {
      - postTypes: PostTypeAnalysis[]
      - attachments: {
      - categories: number
      - tags: number
      - authors: WpAuthorInfo[]
      - navMenus?: NavMenu[]
      - customTaxonomies?: CustomTaxonomy[]
  - ApiTokenInfo
    Properties:
      - id: string
      - name: string
      - prefix: string
      - scopes: string[]
      - userId: string
      - expiresAt: string | null
      - lastUsedAt: string | null
      - createdAt: string
  - ApiTokenCreateResult
    Properties:
      - token: string
      - info: ApiTokenInfo
  - CreateApiTokenInput
    Properties:
      - name: string
      - scopes: string[]
      - expiresAt?: string
  - AdminComment
    Properties:
      - id: string
      - collection: string
      - contentId: string
      - parentId: string | null
      - authorName: string
      - authorEmail: string
      - authorUserId: string | null
      - body: string
      - status: CommentStatus
      - ipHash: string | null
      - userAgent: string | null
      - moderationMetadata: Record<string, unknown> | null
      - createdAt: string
      - updatedAt: string
  - CollectionStats
    Properties:
      - slug: string
      - label: string
      - total: number
      - published: number
      - draft: number
  - RecentItem
    Properties:
      - id: string
      - collection: string
      - collectionLabel: string
      - title: string
      - slug: string | null
      - status: string
      - updatedAt: string
      - authorId: string | null
  - DashboardStats
    Properties:
      - collections: CollectionStats[]
      - mediaCount: number
      - userCount: number
      - recentItems: RecentItem[]
  - SearchEnableResult
    Properties:
      - success: boolean
      - collection: string
      - enabled: boolean
      - indexed?: number
  - MarketplaceAuthor
    Properties:
      - name: string
      - verified: boolean
  - MarketplaceAuditSummary
    Properties:
      - verdict: "pass" | "warn" | "fail"
      - riskScore: number
  - MarketplaceImageAuditSummary
    Properties:
      - verdict: "pass" | "warn" | "fail"
  - MarketplaceVersion
    Properties:
      - version: string
      - minEmDashVersion?: string
      - bundleSize: number
      - changelog?: string
      - readme?: string
      - screenshotUrls?: string[]
      - audit?: MarketplaceAuditSummary
      - imageAudit?: MarketplaceImageAuditSummary
      - publishedAt: string
  - MarketplacePluginSummary
    Properties:
      - id: string
      - name: string
      - description?: string
      - author: MarketplaceAuthor
      - capabilities: string[]
      - keywords?: string[]
      - installCount: number
      - iconUrl?: string
      - latestVersion?: {
      - createdAt: string
      - updatedAt: string
  - MarketplacePluginDetail
    Properties:
      - license?: string
      - repositoryUrl?: string
      - homepageUrl?: string
      - latestVersion?: MarketplaceVersion
  - MarketplaceSearchResult
    Properties:
      - items: MarketplacePluginSummary[]
      - nextCursor?: string
  - MarketplaceSearchOpts
    Properties:
      - q?: string
      - capability?: string
      - sort?: "installs" | "updated" | "created" | "name"
      - cursor?: string
      - limit?: number
  - PluginUpdateInfo
    Properties:
      - pluginId: string
      - installed: string
      - latest: string
      - hasCapabilityChanges: boolean
  - InstallPluginOpts
    Properties:
      - version?: string
  - UpdatePluginOpts
    Properties:
      - confirmCapabilities?: boolean
  - UninstallPluginOpts
    Properties:
      - deleteData?: boolean
  - EmailProvider
    Properties:
      - pluginId: string
  - EmailSettings
    Properties:
      - available: boolean
      - providers: EmailProvider[]
      - selectedProviderId: string | null
      - middleware: {
  - ThemeAuthor
    Properties:
      - name: string
      - verified: boolean
      - avatarUrl: string | null
  - ThemeAuthorDetail
    Properties:
      - id: string
  - ThemeSummary
    Properties:
      - id: string
      - name: string
      - description: string | null
      - author: ThemeAuthor
      - keywords: string[]
      - previewUrl: string
      - demoUrl: string | null
      - hasThumbnail: boolean
      - thumbnailUrl: string | null
      - createdAt: string
      - updatedAt: string
  - ThemeDetail
    Properties:
      - author: ThemeAuthorDetail
      - repositoryUrl: string | null
      - homepageUrl: string | null
      - license: string | null
      - screenshotCount: number
      - screenshotUrls: string[]
  - ThemeSearchResult
    Properties:
      - items: ThemeSummary[]
      - nextCursor?: string
  - ThemeSearchOpts
    Properties:
      - q?: string
      - keyword?: string
      - sort?: "name" | "created" | "updated"
      - cursor?: string
      - limit?: number
  - Redirect
    Properties:
      - id: string
      - source: string
      - destination: string
      - type: number
      - isPattern: boolean
      - enabled: boolean
      - hits: number
      - lastHitAt: string | null
      - groupName: string | null
      - auto: boolean
      - createdAt: string
      - updatedAt: string
  - NotFoundSummary
    Properties:
      - path: string
      - count: number
      - lastSeen: string
      - topReferrer: string | null
  - CreateRedirectInput
    Properties:
      - source: string
      - destination: string
      - type?: number
      - enabled?: boolean
      - groupName?: string | null
  - UpdateRedirectInput
    Properties:
      - source?: string
      - destination?: string
      - type?: number
      - enabled?: boolean
      - groupName?: string | null
  - RedirectListOptions
    Properties:
      - cursor?: string
      - limit?: number
      - search?: string
      - group?: string
      - enabled?: boolean
      - auto?: boolean
  - RedirectListResult
    Properties:
      - items: Redirect[]
      - nextCursor?: string
  - DashboardProps
    Properties:
      - manifest: AdminManifest
  - ContentListProps
    Properties:
      - collection: string
      - collectionLabel: string
      - items: ContentItem[]
      - trashedItems?: TrashedContentItem[]
      - isLoading?: boolean
      - isTrashedLoading?: boolean
      - onDelete?: (id: string) => void
      - onDuplicate?: (id: string) => void
      - onRestore?: (id: string) => void
      - onPermanentDelete?: (id: string) => void
      - onLoadMore?: () => void
      - onLoadMoreTrashed?: () => void
      - hasMore?: boolean
      - hasMoreTrashed?: boolean
      - trashedCount?: number
      - i18n?: {
      - activeLocale?: string
      - onLocaleChange?: (locale: string) => void
  - PluginBlockDef
    Properties:
      - type: string
      - pluginId: string
      - label: string
      - icon?: string
      - description?: string
      - placeholder?: string
      - fields?: Element[]
  - PortableTextSpan
    Properties:
      - _type: "span"
      - _key: string
      - text: string
      - marks?: string[]
  - PortableTextMarkDef
    Methods:
      - L2208: [key: string]: unknown
    Properties:
      - _type: string
      - _key: string
  - PortableTextTextBlock
    Properties:
      - _type: "block"
      - _key: string
      - style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote"
      - listItem?: "bullet" | "number"
      - level?: number
      - children: PortableTextSpan[]
      - markDefs?: PortableTextMarkDef[]
  - PortableTextImageBlock
    Properties:
      - _type: "image"
      - _key: string
      - asset: {
      - alt?: string
      - caption?: string
      - width?: number
      - height?: number
      - displayWidth?: number
      - displayHeight?: number
  - PortableTextCodeBlock
    Properties:
      - _type: "code"
      - _key: string
      - code: string
      - language?: string
  - BlockSidebarPanel
    Properties:
      - type: string
      - attrs: Record<string, unknown>
      - onUpdate: (attrs: Record<string, unknown>) => void
      - onReplace: (attrs: Record<string, unknown>) => void
      - onDelete: () => void
      - onClose: () => void
  - PortableTextEditorProps
    Properties:
      - value?: PortableTextBlock[]
      - onChange?: (value: PortableTextBlock[]) => void
      - placeholder?: string
      - className?: string
      - editable?: boolean
      - pluginBlocks?: PluginBlockDef[]
      - focusMode?: FocusMode
      - onFocusModeChange?: (mode: FocusMode) => void
      - onEditorReady?: (editor: Editor) => void
      - minimal?: boolean
      - onBlockSidebarOpen?: (panel: BlockSidebarPanel) => void
      - onBlockSidebarClose?: () => void
  - FieldDescriptor
    Properties:
      - kind: string
      - label?: string
      - required?: boolean
      - options?: Array<{
      - widget?: string
  - CurrentUserInfo
    Properties:
      - id: string
      - role: number
  - ContentEditorProps
    Properties:
      - collection: string
      - collectionLabel: string
      - item?: ContentItem | null
      - fields: Record<string, FieldDescriptor>
      - isNew?: boolean
      - isSaving?: boolean
      - onSave?: (payload: {
      - onAutosave?: (payload: {
      - isAutosaving?: boolean
      - lastAutosaveAt?: Date | null
      - onPublish?: () => void
      - onUnpublish?: () => void
      - onDiscardDraft?: () => void
      - onSchedule?: (scheduledAt: string) => void
      - onUnschedule?: () => void
      - isScheduling?: boolean
      - supportsDrafts?: boolean
      - supportsRevisions?: boolean
      - currentUser?: CurrentUserInfo
      - users?: UserListItem[]
      - onAuthorChange?: (authorId: string | null) => void
      - availableBylines?: BylineSummary[]
      - selectedBylines?: BylineCreditInput[]
      - onBylinesChange?: (bylines: BylineCreditInput[]) => void
      - onQuickCreateByline?: (input: {
      - onQuickEditByline?: (bylineId: string, input: {
      - onDelete?: () => void
      - isDeleting?: boolean
      - i18n?: {
      - translations?: TranslationSummary[]
      - onTranslate?: (locale: string) => void
      - pluginBlocks?: PluginBlockDef[]
      - hasSeo?: boolean
      - onSeoChange?: (seo: ContentSeoInput) => void
      - manifest?: AdminManifest | null
  - MediaLibraryProps
    Properties:
      - items?: MediaItem[]
      - isLoading?: boolean
      - onUpload?: (file: File) => Promise<void> | void
      - onSelect?: (item: MediaItem) => void
      - onDelete?: (id: string) => void
      - onItemUpdated?: () => void
  - MediaPickerModalProps
    Properties:
      - open: boolean
      - onOpenChange: (open: boolean) => void
      - onSelect: (item: MediaItem) => void
      - mimeTypeFilter?: string
      - title?: string
  - SaveButtonProps
    Properties:
      - isDirty: boolean
      - isSaving: boolean
  - PasskeyRegistrationProps
    Properties:
      - optionsEndpoint: string
      - verifyEndpoint: string
      - onSuccess: (response: unknown) => void
      - onError?: (error: Error) => void
      - buttonText?: string
      - showNameInput?: boolean
      - additionalData?: Record<string, unknown>
  - PasskeyLoginProps
    Properties:
      - optionsEndpoint: string
      - verifyEndpoint: string
      - onSuccess: (response: unknown) => void
      - onError?: (error: Error) => void
      - showEmailInput?: boolean
      - buttonText?: string
  - LoginPageProps
    Properties:
      - redirectUrl?: string

Type-aliases:
  - PluginAdmins
  - FieldType
  - SectionSource
  - FieldCompatibility
  - SuggestedAction
  - CommentStatus
  - CommentCounts
  - BulkAction
  - PortableTextBlock
  - FocusMode

Exports:
  - export { API_BASE, API_TOKEN_SCOPES, AdminApp, AdminApp as App, type AdminComment, type AdminManifest, type AllowedDomain, type ApiTokenCreateResult, type ApiTokenInfo, type AttachmentInfo, type AuthorMapping, type BulkAction, type BylineCreditInput, type BylineInput, type BylineSummary, CAPABILITY_LABELS, type CollectionSchemaStatus, type CollectionStats, type CommentCounts, type CommentStatus, ContentEditor, type ContentEditorProps, type ContentItem, ContentList, type ContentListProps, type ContentSeo, type ContentSeoInput, type CreateAllowedDomainInput, type CreateApiTokenInput, type CreateCollectionInput, type CreateContentInput, type CreateFieldInput, type CreateMenuInput, type CreateMenuItemInput, type CreateRedirectInput, type CreateSectionInput, type CreateTaxonomyInput, type CreateTermInput, type CreateWidgetAreaInput, type CreateWidgetInput, type CurrentUser, type CustomTaxonomy, Dashboard, type DashboardProps, type DashboardStats, type EmailProvider, type EmailSettings, type FieldCompatibility, type FieldDescriptor, type FieldType, type FindManyResult, type GetSectionsOptions, Header, type ImportConfig, type ImportFieldDef, type ImportResult, type InstallPluginOpts, Link, LoginPage, type MarketplaceAuditSummary, type MarketplaceAuthor, type MarketplaceImageAuditSummary, type MarketplacePluginDetail, type MarketplacePluginSummary, type MarketplaceSearchOpts, type MarketplaceSearchResult, type MarketplaceVersion, type MediaImportProgress, type MediaImportResult, type MediaItem, MediaLibrary, type MediaLibraryProps, MediaPickerModal, type MediaPickerModalProps, type MediaProviderCapabilities, type MediaProviderInfo, type MediaProviderItem, type Menu, type MenuItem, type MenuWithItems, type NavMenu, type NotFoundSummary, type OrphanedTable, type PasskeyInfo, PasskeyLogin, type PasskeyLoginProps, PasskeyRegistration, type PasskeyRegistrationProps, type PluginAdminModule, PluginAdminProvider, type PluginAdmins, type PluginInfo, type PluginUpdateInfo, PortableTextEditor, type PortableTextEditorProps, type PostTypeAnalysis, type PrepareRequest, type PrepareResult, type PreviewUrlResponse, type ProbeResult, type RecentItem, type Redirect, type RedirectListOptions, type RedirectListResult, type ReorderMenuItemsInput, type Revision, type RevisionListResponse, type RewriteUrlsResult, SaveButton, type SaveButtonProps, type SchemaCollection, type SchemaCollectionWithFields, type SchemaField, type SearchEnableResult, type Section, type SectionSource, type SectionsResult, Settings, SetupWizard, Shell, type ShellProps, KumoSidebar as Sidebar, SidebarNav, type SidebarNavProps, type SignupVerifyResult, type SiteSettings, type SourceAuth, type SourceCapabilities, type SourceProbeResult, type SuggestedAction, type TaxonomyDef, type TaxonomyTerm, type ThemeAuthor, type ThemeAuthorDetail, type ThemeDetail, type ThemeSearchOpts, type ThemeSearchResult, type ThemeSummary, type TranslationSummary, type TranslationsResponse, type TrashedContentItem, type UninstallPluginOpts, type UpdateAllowedDomainInput, type UpdateCollectionInput, type UpdateContentInput, type UpdateFieldInput, type UpdateMenuInput, type UpdateMenuItemInput, type UpdatePluginOpts, type UpdateRedirectInput, type UpdateSectionInput, type UpdateTermInput, type UpdateUserInput, type UpdateWidgetInput, type UserDetail, type UserListItem, type Widget, type WidgetArea, type WidgetComponent, type WpAuthorInfo, type WpPluginAnalysis, type WxrAnalysis, analyzeWpPluginSite, analyzeWxr, apiFetch, bulkCommentAction, checkPluginUpdates, cn, compareRevisions, completeSignup, createAdminRouter, createAllowedDomain, createApiToken, createByline, createCollection, createContent, createField, createMenu, createMenuItem, createRedirect, createSection, createTaxonomy, createTerm, createWidget, createWidgetArea, deleteAllowedDomain, deleteByline, deleteCollection, deleteComment, deleteContent, deleteField, deleteFromProvider, deleteMedia, deleteMenu, deleteMenuItem, deletePasskey, deleteRedirect, deleteSection, deleteTerm, deleteWidget, deleteWidgetArea, describeCapability, disablePlugin, disableUser, discardDraft, duplicateContent, enablePlugin, enableUser, executeWpPluginImport, executeWxrImport, fetch404Summary, fetchAllowedDomains, fetchApiTokens, fetchByline, fetchBylines, fetchCollection, fetchCollections, fetchComment, fetchCommentCounts, fetchComments, fetchContent, fetchContentList, fetchDashboardStats, fetchEmailSettings, fetchFields, fetchManifest, fetchMarketplacePlugin, fetchMediaList, fetchMediaProviders, fetchMenu, fetchMenus, fetchOrphanedTables, fetchPasskeys, fetchPlugin, fetchPlugins, fetchProviderMedia, fetchRedirects, fetchRevision, fetchRevisions, fetchSection, fetchSections, fetchSettings, fetchTaxonomyDef, fetchTaxonomyDefs, fetchTerms, fetchTheme, fetchTranslations, fetchTrashedContent, fetchUser, fetchUsers, fetchWidgetArea, fetchWidgetAreas, fetchWidgetComponents, generatePreviewUrl, getDraftStatus, getPreviewUrl, hasAllowedDomains, importWxrMedia, installMarketplacePlugin, inviteUser, parseApiResponse, permanentDeleteContent, prepareWxrImport, probeImportUrl, publishContent, registerOrphanedTable, renamePasskey, reorderFields, reorderMenuItems, reorderWidgets, requestSignup, restoreContent, restoreRevision, revokeApiToken, rewriteContentUrls, scheduleContent, searchMarketplace, searchThemes, sendRecoveryLink, sendTestEmail, setSearchEnabled, throwResponseError, uninstallMarketplacePlugin, unpublishContent, unscheduleContent, updateAllowedDomain, updateByline, updateCollection, updateCommentStatus, updateContent, updateField, updateMarketplacePlugin, updateMedia, updateMenu, updateMenuItem, updateRedirect, updateSection, updateSettings, updateTerm, updateUser, updateWidget, uploadMedia, uploadToProvider, useCurrentUser, useNavigate, useParams, usePluginAdmins, usePluginField, usePluginHasPages, usePluginHasWidgets, usePluginPage, usePluginWidget, verifySignupToken };
---


File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/marketplace.ts
Imports:
  - import { createGzipDecoder, unpackTar } from "modern-tar";
  - import { pluginManifestSchema } from "./manifest-schema.js";
  - import type { PluginManifest } from "./types.js";
---
Classes:
  - MarketplaceError
    Methods:
      - L186: constructor(
  - MarketplaceUnavailableError
    Methods:
      - L197: constructor(cause?: unknown)
  - MarketplaceClientImpl
    Methods:
      - L208: constructor(baseUrl: string)
      - L213: async search(query?: string, opts?: MarketplaceSearchOpts): Promise<MarketplaceSearchResult>
      - L228: async getPlugin(id: string): Promise<MarketplacePluginDetail>
      - L233: async getVersions(id: string): Promise<MarketplaceVersionSummary[]>
      - L239: async downloadBundle(id: string, version: string): Promise<PluginBundle>
      - L272: async reportInstall(id: string, version: string): Promise<void>
      - L288: async searchThemes(
      - L304: async getTheme(id: string): Promise<MarketplaceThemeDetail>
      - L309: private async fetchJson<T>(url: string): Promise<T>
    Properties:
      - private readonly baseUrl: string

Interfaces:
  - MarketplacePluginSummary
    Properties:
      - id: string
      - name: string
      - description: string | null
      - author: {
      - capabilities: string[]
      - keywords: string[]
      - installCount: number
      - hasIcon: boolean
      - iconUrl: string
      - latestVersion?: {
      - createdAt: string
      - updatedAt: string
  - MarketplaceVersionSummary
    Properties:
      - version: string
      - minEmDashVersion: string | null
      - bundleSize: number
      - checksum: string
      - changelog: string | null
      - capabilities: string[]
      - status: string
      - auditVerdict: string | null
      - imageAuditVerdict: string | null
      - publishedAt: string
  - MarketplacePluginDetail
    Properties:
      - repositoryUrl: string | null
      - homepageUrl: string | null
      - license: string | null
      - latestVersion?: {
  - MarketplaceSearchOpts
    Properties:
      - category?: string
      - capability?: string
      - sort?: "installs" | "updated" | "created" | "name"
      - cursor?: string
      - limit?: number
  - MarketplaceSearchResult
    Properties:
      - items: MarketplacePluginSummary[]
      - nextCursor?: string
  - MarketplaceThemeSummary
    Properties:
      - id: string
      - name: string
      - description: string | null
      - author: {
      - keywords: string[]
      - previewUrl: string
      - demoUrl: string | null
      - hasThumbnail: boolean
      - thumbnailUrl: string | null
      - createdAt: string
      - updatedAt: string
  - MarketplaceThemeDetail
    Properties:
      - author: {
      - repositoryUrl: string | null
      - homepageUrl: string | null
      - license: string | null
      - screenshotCount: number
      - screenshotUrls: string[]
  - MarketplaceThemeSearchOpts
    Properties:
      - keyword?: string
      - sort?: "name" | "created" | "updated"
      - cursor?: string
      - limit?: number
  - MarketplaceThemeSearchResult
    Properties:
      - items: MarketplaceThemeSummary[]
      - nextCursor?: string
  - PluginBundle
    Properties:
      - manifest: PluginManifest
      - backendCode: string
      - adminCode?: string
      - checksum: string
  - MarketplaceClient
    Methods:
      - L159: search(query?: string, opts?: MarketplaceSearchOpts): Promise<MarketplaceSearchResult>
      - L162: getPlugin(id: string): Promise<MarketplacePluginDetail>
      - L165: getVersions(id: string): Promise<MarketplaceVersionSummary[]>
      - L168: downloadBundle(id: string, version: string): Promise<PluginBundle>
      - L171: reportInstall(id: string, version: string): Promise<void>
      - L174: searchThemes(
      - L180: getTheme(id: string): Promise<MarketplaceThemeDetail>

Functions:
  - L347: async function extractBundle(tarballBytes: Uint8Array): Promise<PluginBundle>
  - L437: async function generateSiteHash(): Promise<string>
  - L458: export function createMarketplaceClient(baseUrl: string): MarketplaceClient

Global vars:
  - TRAILING_SLASHES
  - LEADING_DOT_SLASH

Exports:
  - export interface MarketplacePluginSummary {
  - export interface MarketplaceVersionSummary {
  - export interface MarketplacePluginDetail extends MarketplacePluginSummary {
  - export interface MarketplaceSearchOpts {
  - export interface MarketplaceSearchResult {
  - export interface MarketplaceThemeSummary {
  - export interface MarketplaceThemeDetail extends MarketplaceThemeSummary {
  - export interface MarketplaceThemeSearchOpts {
  - export interface MarketplaceThemeSearchResult {
  - export interface PluginBundle {
  - export interface MarketplaceClient {
  - export class MarketplaceError extends Error {
  - export class MarketplaceUnavailableError extends MarketplaceError {
  - export function createMarketplaceClient(baseUrl: string): MarketplaceClient {
---


File: /Users/masonjames/Projects/emdash/packages/core/src/client/index.ts
Imports:
  - import mime from "mime/lite";
  - import type { PortableTextBlock, FieldSchema } from "./portable-text.js";
  - import { convertDataForRead, convertDataForWrite } from "./portable-text.js";
  - import type { Interceptor } from "./transport.js";
  - import {
	createTransport,
	csrfInterceptor,
	devBypassInterceptor,
	refreshInterceptor,
	tokenInterceptor,
} from "./transport.js";
---
Classes:
  - EmDashApiError
    Methods:
      - L239: constructor(
  - EmDashClientError
    Methods:
      - L251: constructor(message: string)
  - EmDashClient
    Methods:
      - L268: constructor(options: EmDashClientOptions)
      - L308: async collections(): Promise<Collection[]>
      - L314: async collection(slug: string): Promise<CollectionWithFields>
      - L331: async createCollection(input: {
      - L344: async deleteCollection(slug: string): Promise<void>
      - L349: async createField(
      - L375: async deleteField(collection: string, fieldSlug: string): Promise<void>
      - L384: async manifest(): Promise<Manifest>
      - L389: async schemaExport(): Promise<SchemaExport>
      - L394: async schemaTypes(): Promise<string>
      - L405: async list(
      - L430: async *listAll(
      - L454: async get(
      - L489: async create(
      - L516: async update(
      - L553: async delete(collection: string, id: string): Promise<void>
      - L561: async publish(collection: string, id: string): Promise<void>
      - L569: async unpublish(collection: string, id: string): Promise<void>
      - L577: async schedule(collection: string, id: string, options: { at: string }): Promise<void>
      - L586: async restore(collection: string, id: string): Promise<void>
      - L594: async compare(
      - L610: async discardDraft(collection: string, id: string): Promise<void>
      - L621: async translations(
      - L645: async mediaList(options?: {
      - L660: async mediaGet(id: string): Promise<MediaItem>
      - L666: async mediaUpload(
      - L698: async mediaDelete(id: string): Promise<void>
      - L707: async search(
      - L725: async taxonomies(): Promise<Taxonomy[]>
      - L731: async terms(
      - L747: async createTerm(
      - L759: async menus(): Promise<Menu[]>
      - L765: async menu(name: string): Promise<MenuWithItems>
      - L774: private async request<T>(method: string, path: string, body?: unknown): Promise<T>
      - L782: private async requestRaw(method: string, path: string, body?: unknown): Promise<Response>
      - L804: private async assertOk(response: Response): Promise<void>
      - L829: private async getFieldSchemas(collection: string): Promise<FieldSchema[]>
    Properties:
      - private readonly baseUrl: string
      - private readonly transport: { fetch: (request: Request) => Promise<Response> }
      - private fieldSchemaCache

Interfaces:
  - EmDashClientOptions
    Properties:
      - baseUrl: string
      - token?: string
      - refreshToken?: string
      - onTokenRefresh?: (accessToken: string, expiresIn: number) => void
      - devBypass?: boolean
      - interceptors?: Interceptor[]
  - ApiError
    Properties:
      - code: string
      - message: string
      - details?: Record<string, unknown>
  - ClientResponse
    Properties:
      - success: true
      - data: T
  - ListResult
    Properties:
      - items: T[]
      - nextCursor?: string
  - ContentItem
    Properties:
      - id: string
      - type: string
      - slug: string | null
      - status: string
      - data: Record<string, unknown>
      - authorId: string | null
      - createdAt: string
      - updatedAt: string
      - publishedAt: string | null
      - scheduledAt: string | null
      - liveRevisionId: string | null
      - draftRevisionId: string | null
      - locale: string | null
      - translationGroup: string | null
      - _rev?: string
  - Collection
    Properties:
      - slug: string
      - label: string
      - labelSingular: string
      - description?: string
      - icon?: string
      - supports: string[]
  - CollectionWithFields
    Properties:
      - fields: Field[]
  - Field
    Properties:
      - slug: string
      - label: string
      - type: string
      - required: boolean
      - unique: boolean
      - defaultValue?: unknown
      - validation?: unknown
      - widget?: string
      - options?: unknown
      - sortOrder?: number
  - MediaItem
    Properties:
      - id: string
      - filename: string
      - key: string
      - mimeType: string
      - size: number
      - width?: number
      - height?: number
      - alt?: string
      - caption?: string
      - createdAt: string
      - updatedAt: string
  - SearchResult
    Properties:
      - id: string
      - collection: string
      - title: string
      - excerpt?: string
      - score: number
  - Taxonomy
    Properties:
      - name: string
      - label: string
      - hierarchical: boolean
  - Term
    Properties:
      - id: string
      - slug: string
      - label: string
      - parentId?: string | null
      - description?: string
      - count?: number
  - Menu
    Properties:
      - name: string
      - label: string
  - MenuWithItems
    Properties:
      - items: MenuItem[]
  - MenuItem
    Properties:
      - id: string
      - type: string
      - label: string
      - customUrl?: string
      - referenceCollection?: string
      - referenceId?: string
      - target?: string
      - parentId?: string | null
      - sortOrder: number
  - SchemaExport
    Properties:
      - collections: Array<{
      - version: string
  - Manifest
    Properties:
      - version: string
      - hash: string
      - collections: Record<

Functions:
  - L40: function mimeFromFilename(filename: string): string

Global vars:
  - TRAILING_SLASH_PATTERN

Exports:
  - export interface EmDashClientOptions {
  - export interface ApiError {
  - export interface ClientResponse<T> {
  - export interface ListResult<T> {
  - export interface ContentItem {
  - export interface Collection {
  - export interface CollectionWithFields extends Collection {
  - export interface Field {
  - export interface MediaItem {
  - export interface SearchResult {
  - export interface Taxonomy {
  - export interface Term {
  - export interface Menu {
  - export interface MenuWithItems extends Menu {
  - export interface MenuItem {
  - export interface SchemaExport {
  - export interface Manifest {
  - export class EmDashApiError extends Error {
  - export class EmDashClientError extends Error {
  - export class EmDashClient {
  - export type { Interceptor } from "./transport.js";
  - export {
  - } from "./transport.js";
  - export { portableTextToMarkdown, markdownToPortableText } from "./portable-text.js";
  - export type { PortableTextBlock } from "./portable-text.js";
---


File: /Users/masonjames/Projects/emdash/packages/core/src/storage/types.ts
Imports:
---
Classes:
  - EmDashStorageError
    Methods:
      - L196: constructor(

Interfaces:
  - S3StorageConfig
    Properties:
      - endpoint: string
      - bucket: string
      - accessKeyId: string
      - secretAccessKey: string
      - region?: string
      - publicUrl?: string
  - LocalStorageConfig
    Properties:
      - directory: string
      - baseUrl: string
  - StorageDescriptor
    Properties:
      - entrypoint: string
      - config: Record<string, unknown>
  - UploadResult
    Properties:
      - key: string
      - url: string
      - size: number
  - DownloadResult
    Properties:
      - body: ReadableStream<Uint8Array>
      - contentType: string
      - size: number
  - SignedUploadUrl
    Properties:
      - url: string
      - method: "PUT"
      - headers: Record<string, string>
      - expiresAt: string
  - SignedUploadOptions
    Properties:
      - key: string
      - contentType: string
      - size?: number
      - expiresIn?: number
  - ListResult
    Properties:
      - files: FileInfo[]
      - nextCursor?: string
  - FileInfo
    Properties:
      - key: string
      - size: number
      - lastModified: Date
      - etag?: string
  - ListOptions
    Properties:
      - prefix?: string
      - limit?: number
      - cursor?: string
  - Storage
    Methods:
      - L153: upload(options: {
      - L162: download(key: string): Promise<DownloadResult>
      - L168: delete(key: string): Promise<void>
      - L173: exists(key: string): Promise<boolean>
      - L178: list(options?: ListOptions): Promise<ListResult>
      - L184: getSignedUploadUrl(options: SignedUploadOptions): Promise<SignedUploadUrl>
      - L189: getPublicUrl(key: string): string

Type-aliases:
  - CreateStorageFn

Exports:
  - export interface S3StorageConfig {
  - export interface LocalStorageConfig {
  - export interface StorageDescriptor {
  - export type CreateStorageFn = (config: Record<string, unknown>) => Storage;
  - export interface UploadResult {
  - export interface DownloadResult {
  - export interface SignedUploadUrl {
  - export interface SignedUploadOptions {
  - export interface ListResult {
  - export interface FileInfo {
  - export interface ListOptions {
  - export interface Storage {
  - export class EmDashStorageError extends Error {
---


File: /Users/masonjames/Projects/emdash/packages/marketplace/worker-configuration.d.ts
Imports:
---

Interfaces:
  - Console
    Methods:
      - L116: clear(): void
      - L122: count(label?: string): void
      - L128: countReset(label?: string): void
      - L134: debug(...data: any[]): void
      - L140: dir(item?: any, options?: any): void
      - L146: dirxml(...data: any[]): void
      - L152: error(...data: any[]): void
      - L158: group(...data: any[]): void
      - L164: groupCollapsed(...data: any[]): void
      - L170: groupEnd(): void
      - L176: info(...data: any[]): void
      - L182: log(...data: any[]): void
      - L188: table(tabularData?: any, properties?: string[]): void
      - L194: time(label?: string): void
      - L200: timeEnd(label?: string): void
      - L206: timeLog(label?: string, ...data: any[]): void
      - L207: timeStamp(label?: string): void
      - L213: trace(...data: any[]): void
      - L219: warn(...data: any[]): void
  - ServiceWorkerGlobalScope
    Methods:
      - L311: btoa(data: string): string
      - L312: atob(data: string): string
      - L313: setTimeout(callback: (...args: any[]) => void, msDelay?: number): number
      - L314: setTimeout<Args extends any[]>(
      - L319: clearTimeout(timeoutId: number | null): void
      - L320: setInterval(callback: (...args: any[]) => void, msDelay?: number): number
      - L321: setInterval<Args extends any[]>(
      - L326: clearInterval(timeoutId: number | null): void
      - L327: queueMicrotask(task: Function): void
      - L328: structuredClone<T>(value: T, options?: StructuredSerializeOptions): T
      - L329: reportError(error: any): void
      - L330: fetch(input: RequestInfo | URL, init?: RequestInit<RequestInitCfProperties>): Promise<Response>
    Properties:
      - DOMException: typeof DOMException
      - WorkerGlobalScope: typeof WorkerGlobalScope
      - self: ServiceWorkerGlobalScope
      - crypto: Crypto
      - caches: CacheStorage
      - scheduler: Scheduler
      - performance: Performance
      - Cloudflare: Cloudflare
      - readonly origin: string
      - Event: typeof Event
      - ExtendableEvent: typeof ExtendableEvent
      - CustomEvent: typeof CustomEvent
      - PromiseRejectionEvent: typeof PromiseRejectionEvent
      - FetchEvent: typeof FetchEvent
      - TailEvent: typeof TailEvent
      - TraceEvent: typeof TailEvent
      - ScheduledEvent: typeof ScheduledEvent
      - MessageEvent: typeof MessageEvent
      - CloseEvent: typeof CloseEvent
      - ReadableStreamDefaultReader: typeof ReadableStreamDefaultReader
      - ReadableStreamBYOBReader: typeof ReadableStreamBYOBReader
      - ReadableStream: typeof ReadableStream
      - WritableStream: typeof WritableStream
      - WritableStreamDefaultWriter: typeof WritableStreamDefaultWriter
      - TransformStream: typeof TransformStream
      - ByteLengthQueuingStrategy: typeof ByteLengthQueuingStrategy
      - CountQueuingStrategy: typeof CountQueuingStrategy
      - ErrorEvent: typeof ErrorEvent
      - MessageChannel: typeof MessageChannel
      - MessagePort: typeof MessagePort
      - EventSource: typeof EventSource
      - ReadableStreamBYOBRequest: typeof ReadableStreamBYOBRequest
      - ReadableStreamDefaultController: typeof ReadableStreamDefaultController
      - ReadableByteStreamController: typeof ReadableByteStreamController
      - WritableStreamDefaultController: typeof WritableStreamDefaultController
      - TransformStreamDefaultController: typeof TransformStreamDefaultController
      - CompressionStream: typeof CompressionStream
      - DecompressionStream: typeof DecompressionStream
      - TextEncoderStream: typeof TextEncoderStream
      - TextDecoderStream: typeof TextDecoderStream
      - Headers: typeof Headers
      - Body: typeof Body
      - Request: typeof Request
      - Response: typeof Response
      - WebSocket: typeof WebSocket
      - WebSocketPair: typeof WebSocketPair
      - WebSocketRequestResponsePair: typeof WebSocketRequestResponsePair
      - AbortController: typeof AbortController
      - AbortSignal: typeof AbortSignal
      - TextDecoder: typeof TextDecoder
      - TextEncoder: typeof TextEncoder
      - navigator: Navigator
      - Navigator: typeof Navigator
      - URL: typeof URL
      - URLSearchParams: typeof URLSearchParams
      - URLPattern: typeof URLPattern
      - Blob: typeof Blob
      - File: typeof File
      - FormData: typeof FormData
      - Crypto: typeof Crypto
      - SubtleCrypto: typeof SubtleCrypto
      - CryptoKey: typeof CryptoKey
      - CacheStorage: typeof CacheStorage
      - Cache: typeof Cache
      - FixedLengthStream: typeof FixedLengthStream
      - IdentityTransformStream: typeof IdentityTransformStream
      - HTMLRewriter: typeof HTMLRewriter
  - ExecutionContext
    Methods:
      - L479: waitUntil(promise: Promise<any>): void
      - L480: passThroughOnException(): void
    Properties:
      - readonly exports: Cloudflare.Exports
      - readonly props: Props
  - ExportedHandler
    Properties:
      - fetch?: ExportedHandlerFetchHandler<Env, CfHostMetadata>
      - tail?: ExportedHandlerTailHandler<Env>
      - trace?: ExportedHandlerTraceHandler<Env>
      - tailStream?: ExportedHandlerTailStreamHandler<Env>
      - scheduled?: ExportedHandlerScheduledHandler<Env>
      - test?: ExportedHandlerTestHandler<Env>
      - email?: EmailExportedHandler<Env>
      - queue?: ExportedHandlerQueueHandler<Env, QueueHandlerMessage>
  - StructuredSerializeOptions
    Properties:
      - transfer?: any[]
  - AlarmInvocationInfo
    Properties:
      - readonly isRetry: boolean
      - readonly retryCount: number
  - Cloudflare
    Properties:
      - readonly compatibilityFlags: Record<string, boolean>
  - DurableObject
    Methods:
      - L547: fetch(request: Request): Response | Promise<Response>
      - L548: alarm?(alarmInfo?: AlarmInvocationInfo): void | Promise<void>
      - L549: webSocketMessage?(ws: WebSocket, message: string | ArrayBuffer): void | Promise<void>
      - L550: webSocketClose?(
      - L556: webSocketError?(ws: WebSocket, error: unknown): void | Promise<void>
  - DurableObjectId
    Methods:
      - L566: toString(): string
      - L567: equals(other: DurableObjectId): boolean
    Properties:
      - readonly name?: string
  - DurableObjectNamespaceNewUniqueIdOptions
    Properties:
      - jurisdiction?: DurableObjectJurisdiction
  - DurableObjectNamespaceGetDurableObjectOptions
    Properties:
      - locationHint?: DurableObjectLocationHint
      - routingMode?: DurableObjectRoutingMode
  - DurableObjectState
    Methods:
      - L607: waitUntil(promise: Promise<any>): void
      - L613: blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T>
      - L614: acceptWebSocket(ws: WebSocket, tags?: string[]): void
      - L615: getWebSockets(tag?: string): WebSocket[]
      - L616: setWebSocketAutoResponse(maybeReqResp?: WebSocketRequestResponsePair): void
      - L617: getWebSocketAutoResponse(): WebSocketRequestResponsePair | null
      - L618: getWebSocketAutoResponseTimestamp(ws: WebSocket): Date | null
      - L619: setHibernatableWebSocketEventTimeout(timeoutMs?: number): void
      - L620: getHibernatableWebSocketEventTimeout(): number | null
      - L621: getTags(ws: WebSocket): string[]
      - L622: abort(reason?: string): void
    Properties:
      - readonly exports: Cloudflare.Exports
      - readonly props: Props
      - readonly id: DurableObjectId
      - readonly storage: DurableObjectStorage
      - container?: Container
  - DurableObjectTransaction
    Methods:
      - L625: get<T = unknown>(key: string, options?: DurableObjectGetOptions): Promise<T | undefined>
      - L626: get<T = unknown>(keys: string[], options?: DurableObjectGetOptions): Promise<Map<string, T>>
      - L627: list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>
      - L628: put<T>(key: string, value: T, options?: DurableObjectPutOptions): Promise<void>
      - L629: put<T>(entries: Record<string, T>, options?: DurableObjectPutOptions): Promise<void>
      - L630: delete(key: string, options?: DurableObjectPutOptions): Promise<boolean>
      - L631: delete(keys: string[], options?: DurableObjectPutOptions): Promise<number>
      - L632: rollback(): void
      - L633: getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null>
      - L634: setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void>
      - L635: deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void>
  - DurableObjectStorage
    Methods:
      - L638: get<T = unknown>(key: string, options?: DurableObjectGetOptions): Promise<T | undefined>
      - L639: get<T = unknown>(keys: string[], options?: DurableObjectGetOptions): Promise<Map<string, T>>
      - L640: list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>
      - L641: put<T>(key: string, value: T, options?: DurableObjectPutOptions): Promise<void>
      - L642: put<T>(entries: Record<string, T>, options?: DurableObjectPutOptions): Promise<void>
      - L643: delete(key: string, options?: DurableObjectPutOptions): Promise<boolean>
      - L644: delete(keys: string[], options?: DurableObjectPutOptions): Promise<number>
      - L645: deleteAll(options?: DurableObjectPutOptions): Promise<void>
      - L646: transaction<T>(closure: (txn: DurableObjectTransaction) => Promise<T>): Promise<T>
      - L647: getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null>
      - L648: setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void>
      - L649: deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void>
      - L650: sync(): Promise<void>
      - L653: transactionSync<T>(closure: () => T): T
      - L654: getCurrentBookmark(): Promise<string>
      - L655: getBookmarkForTime(timestamp: number | Date): Promise<string>
      - L656: onNextSessionRestoreBookmark(bookmark: string): Promise<string>
    Properties:
      - sql: SqlStorage
      - kv: SyncKvStorage
  - DurableObjectListOptions
    Properties:
      - start?: string
      - startAfter?: string
      - end?: string
      - prefix?: string
      - reverse?: boolean
      - limit?: number
      - allowConcurrency?: boolean
      - noCache?: boolean
  - DurableObjectGetOptions
    Properties:
      - allowConcurrency?: boolean
      - noCache?: boolean
  - DurableObjectGetAlarmOptions
    Properties:
      - allowConcurrency?: boolean
  - DurableObjectPutOptions
    Properties:
      - allowConcurrency?: boolean
      - allowUnconfirmed?: boolean
      - noCache?: boolean
  - DurableObjectSetAlarmOptions
    Properties:
      - allowConcurrency?: boolean
      - allowUnconfirmed?: boolean
  - AnalyticsEngineDataset
    Methods:
      - L690: writeDataPoint(event?: AnalyticsEngineDataPoint): void
  - AnalyticsEngineDataPoint
    Properties:
      - indexes?: ((ArrayBuffer | string) | null)[]
      - doubles?: number[]
      - blobs?: ((ArrayBuffer | string) | null)[]
  - EventInit
    Properties:
      - bubbles?: boolean
      - cancelable?: boolean
      - composed?: boolean
  - EventListenerObject
    Methods:
      - L828: handleEvent(event: EventType): void
  - EventTargetEventListenerOptions
    Properties:
      - capture?: boolean
  - EventTargetAddEventListenerOptions
    Properties:
      - capture?: boolean
      - passive?: boolean
      - once?: boolean
      - signal?: AbortSignal
  - EventTargetHandlerObject
    Properties:
      - handleEvent: (event: Event) => any | undefined
  - Scheduler
    Methods:
      - L947: wait(delay: number, maybeOptions?: SchedulerWaitOptions): Promise<void>
  - SchedulerWaitOptions
    Properties:
      - signal?: AbortSignal
  - CustomEventCustomEventInit
    Properties:
      - bubbles?: boolean
      - cancelable?: boolean
      - composed?: boolean
      - detail?: any
  - BlobOptions
    Properties:
      - type?: string
  - FileOptions
    Properties:
      - type?: string
      - lastModified?: number
  - CacheQueryOptions
    Properties:
      - ignoreMethod?: boolean
  - CryptoKeyPair
    Properties:
      - publicKey: CryptoKey
      - privateKey: CryptoKey
  - JsonWebKey
    Properties:
      - kty: string
      - use?: string
      - key_ops?: string[]
      - alg?: string
      - ext?: boolean
      - crv?: string
      - x?: string
      - y?: string
      - d?: string
      - n?: string
      - e?: string
      - p?: string
      - q?: string
      - dp?: string
      - dq?: string
      - qi?: string
      - oth?: RsaOtherPrimesInfo[]
      - k?: string
  - RsaOtherPrimesInfo
    Properties:
      - r?: string
      - d?: string
      - t?: string
  - SubtleCryptoDeriveKeyAlgorithm
    Properties:
      - name: string
      - salt?: ArrayBuffer | ArrayBufferView
      - iterations?: number
      - hash?: string | SubtleCryptoHashAlgorithm
      - $public?: CryptoKey
      - info?: ArrayBuffer | ArrayBufferView
  - SubtleCryptoEncryptAlgorithm
    Properties:
      - name: string
      - iv?: ArrayBuffer | ArrayBufferView
      - additionalData?: ArrayBuffer | ArrayBufferView
      - tagLength?: number
      - counter?: ArrayBuffer | ArrayBufferView
      - length?: number
      - label?: ArrayBuffer | ArrayBufferView
  - SubtleCryptoGenerateKeyAlgorithm
    Properties:
      - name: string
      - hash?: string | SubtleCryptoHashAlgorithm
      - modulusLength?: number
      - publicExponent?: ArrayBuffer | ArrayBufferView
      - length?: number
      - namedCurve?: string
  - SubtleCryptoHashAlgorithm
    Properties:
      - name: string
  - SubtleCryptoImportKeyAlgorithm
    Properties:
      - name: string
      - hash?: string | SubtleCryptoHashAlgorithm
      - length?: number
      - namedCurve?: string
      - compressed?: boolean
  - SubtleCryptoSignAlgorithm
    Properties:
      - name: string
      - hash?: string | SubtleCryptoHashAlgorithm
      - dataLength?: number
      - saltLength?: number
  - CryptoKeyKeyAlgorithm
    Properties:
      - name: string
  - CryptoKeyAesKeyAlgorithm
    Properties:
      - name: string
      - length: number
  - CryptoKeyHmacKeyAlgorithm
    Properties:
      - name: string
      - hash: CryptoKeyKeyAlgorithm
      - length: number
  - CryptoKeyRsaKeyAlgorithm
    Properties:
      - name: string
      - modulusLength: number
      - publicExponent: ArrayBuffer | ArrayBufferView
      - hash?: CryptoKeyKeyAlgorithm
  - CryptoKeyEllipticKeyAlgorithm
    Properties:
      - name: string
      - namedCurve: string
  - CryptoKeyArbitraryKeyAlgorithm
    Properties:
      - name: string
      - hash?: CryptoKeyKeyAlgorithm
      - namedCurve?: string
      - length?: number
  - TextDecoderConstructorOptions
    Properties:
      - fatal: boolean
      - ignoreBOM: boolean
  - TextDecoderDecodeOptions
    Properties:
      - stream: boolean
  - TextEncoderEncodeIntoResult
    Properties:
      - read: number
      - written: number
  - ErrorEventErrorEventInit
    Properties:
      - message?: string
      - filename?: string
      - lineno?: number
      - colno?: number
      - error?: any
  - MessageEventInit
    Properties:
      - data: ArrayBuffer | string
  - ContentOptions
    Properties:
      - html?: boolean
  - HTMLRewriterElementContentHandlers
    Methods:
      - L1655: element?(element: Element): void | Promise<void>
      - L1656: comments?(comment: Comment): void | Promise<void>
      - L1657: text?(element: Text): void | Promise<void>
  - HTMLRewriterDocumentContentHandlers
    Methods:
      - L1660: doctype?(doctype: Doctype): void | Promise<void>
      - L1661: comments?(comment: Comment): void | Promise<void>
      - L1662: text?(text: Text): void | Promise<void>
      - L1663: end?(end: DocumentEnd): void | Promise<void>
  - Doctype
    Properties:
      - readonly name: string | null
      - readonly publicId: string | null
      - readonly systemId: string | null
  - Element
    Methods:
      - L1675: getAttribute(name: string): string | null
      - L1676: hasAttribute(name: string): boolean
      - L1677: setAttribute(name: string, value: string): Element
      - L1678: removeAttribute(name: string): Element
      - L1679: before(content: string | ReadableStream | Response, options?: ContentOptions): Element
      - L1680: after(content: string | ReadableStream | Response, options?: ContentOptions): Element
      - L1681: prepend(content: string | ReadableStream | Response, options?: ContentOptions): Element
      - L1682: append(content: string | ReadableStream | Response, options?: ContentOptions): Element
      - L1683: replace(content: string | ReadableStream | Response, options?: ContentOptions): Element
      - L1684: remove(): Element
      - L1685: removeAndKeepContent(): Element
      - L1686: setInnerContent(content: string | ReadableStream | Response, options?: ContentOptions): Element
      - L1687: onEndTag(handler: (tag: EndTag) => void | Promise<void>): void
    Properties:
      - tagName: string
      - readonly attributes: IterableIterator<string[]>
      - readonly removed: boolean
      - readonly namespaceURI: string
  - EndTag
    Methods:
      - L1691: before(content: string | ReadableStream | Response, options?: ContentOptions): EndTag
      - L1692: after(content: string | ReadableStream | Response, options?: ContentOptions): EndTag
      - L1693: remove(): EndTag
    Properties:
      - name: string
  - Comment
    Methods:
      - L1698: before(content: string, options?: ContentOptions): Comment
      - L1699: after(content: string, options?: ContentOptions): Comment
      - L1700: replace(content: string, options?: ContentOptions): Comment
      - L1701: remove(): Comment
    Properties:
      - text: string
      - readonly removed: boolean
  - Text
    Methods:
      - L1707: before(content: string | ReadableStream | Response, options?: ContentOptions): Text
      - L1708: after(content: string | ReadableStream | Response, options?: ContentOptions): Text
      - L1709: replace(content: string | ReadableStream | Response, options?: ContentOptions): Text
      - L1710: remove(): Text
    Properties:
      - readonly text: string
      - readonly lastInTextNode: boolean
      - readonly removed: boolean
  - DocumentEnd
    Methods:
      - L1713: append(content: string, options?: ContentOptions): DocumentEnd
  - Response
    Methods:
      - L1843: clone(): Response
    Properties:
      - status: number
      - statusText: string
      - headers: Headers
      - ok: boolean
      - redirected: boolean
      - url: string
      - webSocket: WebSocket | null
      - cf: any | undefined
      - type: "default" | "error"
  - ResponseInit
    Properties:
      - status?: number
      - statusText?: string
      - headers?: HeadersInit
      - cf?: any
      - webSocket?: WebSocket | null
      - encodeBody?: "automatic" | "manual"
  - Request
    Methods:
      - L1923: clone(): Request<CfHostMetadata, Cf>
    Properties:
      - method: string
      - url: string
      - headers: Headers
      - redirect: string
      - fetcher: Fetcher | null
      - signal: AbortSignal
      - cf?: Cf
      - integrity: string
      - keepalive: boolean
      - cache?: "no-store" | "no-cache"
  - RequestInit
    Properties:
      - method?: string
      - headers?: HeadersInit
      - body?: BodyInit | null
      - redirect?: string
      - fetcher?: Fetcher | null
      - cf?: Cf
      - cache?: "no-store" | "no-cache"
      - integrity?: string
      - signal?: AbortSignal | null
      - encodeResponseBody?: "automatic" | "manual"
  - KVNamespaceListKey
    Properties:
      - name: Key
      - expiration?: number
      - metadata?: Metadata
  - KVNamespace
    Methods:
      - L2034: get(key: Key, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null>
      - L2035: get(key: Key, type: "text"): Promise<string | null>
      - L2036: get<ExpectedValue = unknown>(key: Key, type: "json"): Promise<ExpectedValue | null>
      - L2037: get(key: Key, type: "arrayBuffer"): Promise<ArrayBuffer | null>
      - L2038: get(key: Key, type: "stream"): Promise<ReadableStream | null>
      - L2039: get(key: Key, options?: KVNamespaceGetOptions<"text">): Promise<string | null>
      - L2040: get<ExpectedValue = unknown>(
      - L2044: get(key: Key, options?: KVNamespaceGetOptions<"arrayBuffer">): Promise<ArrayBuffer | null>
      - L2045: get(key: Key, options?: KVNamespaceGetOptions<"stream">): Promise<ReadableStream | null>
      - L2046: get(key: Array<Key>, type: "text"): Promise<Map<string, string | null>>
      - L2051: get(
      - L2063: list<Metadata = unknown>(
      - L2066: put(
      - L2071: getWithMetadata<Metadata = unknown>(
      - L2079: getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
      - L2127: delete(key: Key): Promise<void>
  - KVNamespaceListOptions
    Properties:
      - limit?: number
      - prefix?: string | null
      - cursor?: string | null
  - KVNamespaceGetOptions
    Properties:
      - type: Type
      - cacheTtl?: number
  - KVNamespacePutOptions
    Properties:
      - expiration?: number
      - expirationTtl?: number
      - metadata?: any | null
  - KVNamespaceGetWithMetadataResult
    Properties:
      - value: Value | null
      - metadata: Metadata | null
      - cacheStatus: string | null
  - Queue
    Methods:
      - L2150: send(message: Body, options?: QueueSendOptions): Promise<void>
      - L2151: sendBatch(
  - QueueSendOptions
    Properties:
      - contentType?: QueueContentType
      - delaySeconds?: number
  - QueueSendBatchOptions
    Properties:
      - delaySeconds?: number
  - MessageSendRequest
    Properties:
      - body: Body
      - contentType?: QueueContentType
      - delaySeconds?: number
  - QueueRetryOptions
    Properties:
      - delaySeconds?: number
  - Message
    Methods:
      - L2176: retry(options?: QueueRetryOptions): void
      - L2177: ack(): void
    Properties:
      - readonly id: string
      - readonly timestamp: Date
      - readonly body: Body
      - readonly attempts: number
  - QueueEvent
    Methods:
      - L2182: retryAll(options?: QueueRetryOptions): void
      - L2183: ackAll(): void
    Properties:
      - readonly messages: readonly Message<Body>[]
      - readonly queue: string
  - MessageBatch
    Methods:
      - L2188: retryAll(options?: QueueRetryOptions): void
      - L2189: ackAll(): void
    Properties:
      - readonly messages: readonly Message<Body>[]
      - readonly queue: string
  - R2Error
    Properties:
      - readonly name: string
      - readonly code: number
      - readonly message: string
      - readonly action: string
      - readonly stack: any
  - R2ListOptions
    Properties:
      - limit?: number
      - prefix?: string
      - cursor?: string
      - delimiter?: string
      - startAfter?: string
      - include?: ("httpMetadata" | "customMetadata")[]
  - R2MultipartUpload
    Methods:
      - L2235: uploadPart(
      - L2240: abort(): Promise<void>
      - L2241: complete(uploadedParts: R2UploadedPart[]): Promise<R2Object>
    Properties:
      - readonly key: string
      - readonly uploadId: string
  - R2UploadedPart
    Properties:
      - partNumber: number
      - etag: string
  - R2ObjectBody
    Methods:
      - L2263: get body(): ReadableStream
      - L2264: get bodyUsed(): boolean
      - L2265: arrayBuffer(): Promise<ArrayBuffer>
      - L2266: bytes(): Promise<Uint8Array>
      - L2267: text(): Promise<string>
      - L2268: json<T>(): Promise<T>
      - L2269: blob(): Promise<Blob>
  - R2Conditional
    Properties:
      - etagMatches?: string
      - etagDoesNotMatch?: string
      - uploadedBefore?: Date
      - uploadedAfter?: Date
      - secondsGranularity?: boolean
  - R2GetOptions
    Properties:
      - onlyIf?: R2Conditional | Headers
      - range?: R2Range | Headers
      - ssecKey?: ArrayBuffer | string
  - R2PutOptions
    Properties:
      - onlyIf?: R2Conditional | Headers
      - httpMetadata?: R2HTTPMetadata | Headers
      - customMetadata?: Record<string, string>
      - md5?: (ArrayBuffer | ArrayBufferView) | string
      - sha1?: (ArrayBuffer | ArrayBufferView) | string
      - sha256?: (ArrayBuffer | ArrayBufferView) | string
      - sha384?: (ArrayBuffer | ArrayBufferView) | string
      - sha512?: (ArrayBuffer | ArrayBufferView) | string
      - storageClass?: string
      - ssecKey?: ArrayBuffer | string
  - R2MultipartOptions
    Properties:
      - httpMetadata?: R2HTTPMetadata | Headers
      - customMetadata?: Record<string, string>
      - storageClass?: string
      - ssecKey?: ArrayBuffer | string
  - R2Checksums
    Methods:
      - L2319: toJSON(): R2StringChecksums
    Properties:
      - readonly md5?: ArrayBuffer
      - readonly sha1?: ArrayBuffer
      - readonly sha256?: ArrayBuffer
      - readonly sha384?: ArrayBuffer
      - readonly sha512?: ArrayBuffer
  - R2StringChecksums
    Properties:
      - md5?: string
      - sha1?: string
      - sha256?: string
      - sha384?: string
      - sha512?: string
  - R2HTTPMetadata
    Properties:
      - contentType?: string
      - contentLanguage?: string
      - contentDisposition?: string
      - contentEncoding?: string
      - cacheControl?: string
      - cacheExpiry?: Date
  - R2UploadPartOptions
    Properties:
      - ssecKey?: ArrayBuffer | string
  - ScheduledController
    Methods:
      - L2359: noRetry(): void
    Properties:
      - readonly scheduledTime: number
      - readonly cron: string
  - QueuingStrategy
    Properties:
      - highWaterMark?: number | bigint
      - size?: (chunk: T) => number | bigint
  - UnderlyingSink
    Properties:
      - type?: string
      - start?: (controller: WritableStreamDefaultController) => void | Promise<void>
      - write?: (chunk: W, controller: WritableStreamDefaultController) => void | Promise<void>
      - abort?: (reason: any) => void | Promise<void>
      - close?: () => void | Promise<void>
  - UnderlyingByteSource
    Properties:
      - type: "bytes"
      - autoAllocateChunkSize?: number
      - start?: (controller: ReadableByteStreamController) => void | Promise<void>
      - pull?: (controller: ReadableByteStreamController) => void | Promise<void>
      - cancel?: (reason: any) => void | Promise<void>
  - UnderlyingSource
    Properties:
      - type?: "" | undefined
      - start?: (controller: ReadableStreamDefaultController<R>) => void | Promise<void>
      - pull?: (controller: ReadableStreamDefaultController<R>) => void | Promise<void>
      - cancel?: (reason: any) => void | Promise<void>
      - expectedLength?: number | bigint
  - Transformer
    Properties:
      - readableType?: string
      - writableType?: string
      - start?: (controller: TransformStreamDefaultController<O>) => void | Promise<void>
      - transform?: (chunk: I, controller: TransformStreamDefaultController<O>) => void | Promise<void>
      - flush?: (controller: TransformStreamDefaultController<O>) => void | Promise<void>
      - cancel?: (reason: any) => void | Promise<void>
      - expectedLength?: number
  - StreamPipeOptions
    Properties:
      - preventAbort?: boolean
      - preventCancel?: boolean
      - preventClose?: boolean
      - signal?: AbortSignal
  - ReadableStream
    Methods:
      - L2438: get locked(): boolean
      - L2444: cancel(reason?: any): Promise<void>
      - L2450: getReader(): ReadableStreamDefaultReader<R>
      - L2456: getReader(options: ReadableStreamGetReaderOptions): ReadableStreamBYOBReader
      - L2462: pipeThrough<T>(
      - L2471: pipeTo(destination: WritableStream<R>, options?: StreamPipeOptions): Promise<void>
      - L2477: tee(): [ReadableStream<R>, ReadableStream<R>]
      - L2478: values(options?: ReadableStreamValuesOptions): AsyncIterableIterator<R>
  - ReadableStreamBYOBReaderReadableStreamBYOBReaderReadOptions
    Properties:
      - min?: number
  - ReadableStreamGetReaderOptions
    Properties:
      - mode: "byob"
  - ReadableWritablePair
    Properties:
      - readable: ReadableStream<R>
      - writable: WritableStream<W>
  - IdentityTransformStreamQueuingStrategy
    Properties:
      - highWaterMark?: number | bigint
  - ReadableStreamValuesOptions
    Properties:
      - preventCancel?: boolean
  - TextDecoderStreamTextDecoderStreamInit
    Properties:
      - fatal?: boolean
      - ignoreBOM?: boolean
  - QueuingStrategyInit
    Properties:
      - highWaterMark: number
  - ScriptVersion
    Properties:
      - id?: string
      - tag?: string
      - message?: string
  - TraceItem
    Properties:
      - readonly event:
      - readonly eventTimestamp: number | null
      - readonly logs: TraceLog[]
      - readonly exceptions: TraceException[]
      - readonly diagnosticsChannelEvents: TraceDiagnosticChannelEvent[]
      - readonly scriptName: string | null
      - readonly entrypoint?: string
      - readonly scriptVersion?: ScriptVersion
      - readonly dispatchNamespace?: string
      - readonly scriptTags?: string[]
      - readonly durableObjectId?: string
      - readonly outcome: string
      - readonly executionModel: string
      - readonly truncated: boolean
      - readonly cpuTime: number
      - readonly wallTime: number
  - TraceItemAlarmEventInfo
    Properties:
      - readonly scheduledTime: Date
  - TraceItemScheduledEventInfo
    Properties:
      - readonly scheduledTime: number
      - readonly cron: string
  - TraceItemQueueEventInfo
    Properties:
      - readonly queue: string
      - readonly batchSize: number
  - TraceItemEmailEventInfo
    Properties:
      - readonly mailFrom: string
      - readonly rcptTo: string
      - readonly rawSize: number
  - TraceItemTailEventInfo
    Properties:
      - readonly consumedEvents: TraceItemTailEventInfoTailItem[]
  - TraceItemTailEventInfoTailItem
    Properties:
      - readonly scriptName: string | null
  - TraceItemFetchEventInfo
    Properties:
      - readonly response?: TraceItemFetchEventInfoResponse
      - readonly request: TraceItemFetchEventInfoRequest
  - TraceItemFetchEventInfoRequest
    Methods:
      - L2987: getUnredacted(): TraceItemFetchEventInfoRequest
    Properties:
      - readonly cf?: any
      - readonly headers: Record<string, string>
      - readonly method: string
      - readonly url: string
  - TraceItemFetchEventInfoResponse
    Properties:
      - readonly status: number
  - TraceItemJsRpcEventInfo
    Properties:
      - readonly rpcMethod: string
  - TraceItemHibernatableWebSocketEventInfo
    Properties:
      - readonly getWebSocketEvent:
  - TraceItemHibernatableWebSocketEventInfoMessage
    Properties:
      - readonly webSocketEventType: string
  - TraceItemHibernatableWebSocketEventInfoClose
    Properties:
      - readonly webSocketEventType: string
      - readonly code: number
      - readonly wasClean: boolean
  - TraceItemHibernatableWebSocketEventInfoError
    Properties:
      - readonly webSocketEventType: string
  - TraceLog
    Properties:
      - readonly timestamp: number
      - readonly level: string
      - readonly message: any
  - TraceException
    Properties:
      - readonly timestamp: number
      - readonly message: string
      - readonly name: string
      - readonly stack?: string
  - TraceDiagnosticChannelEvent
    Properties:
      - readonly timestamp: number
      - readonly channel: string
      - readonly message: any
  - TraceMetrics
    Properties:
      - readonly cpuTime: number
      - readonly wallTime: number
  - UnsafeTraceMetrics
    Methods:
      - L3033: fromTrace(item: TraceItem): TraceMetrics
  - URLPatternInit
    Properties:
      - protocol?: string
      - username?: string
      - password?: string
      - hostname?: string
      - port?: string
      - pathname?: string
      - search?: string
      - hash?: string
      - baseURL?: string
  - URLPatternComponentResult
    Properties:
      - input: string
      - groups: Record<string, string>
  - URLPatternResult
    Properties:
      - inputs: (string | URLPatternInit)[]
      - protocol: URLPatternComponentResult
      - username: URLPatternComponentResult
      - password: URLPatternComponentResult
      - hostname: URLPatternComponentResult
      - port: URLPatternComponentResult
      - pathname: URLPatternComponentResult
      - search: URLPatternComponentResult
      - hash: URLPatternComponentResult
  - URLPatternOptions
    Properties:
      - ignoreCase?: boolean
  - CloseEventInit
    Properties:
      - code?: number
      - reason?: string
      - wasClean?: boolean
  - WebSocket
    Methods:
      - L3383: accept(): void
      - L3389: send(message: (ArrayBuffer | ArrayBufferView) | string): void
      - L3395: close(code?: number, reason?: string): void
      - L3396: serializeAttachment(attachment: any): void
      - L3397: deserializeAttachment(): any | null
    Properties:
      - readyState: number
      - url: string | null
      - protocol: string | null
      - extensions: string | null
  - SqlStorage
    Methods:
      - L3430: exec<T extends Record<string, SqlStorageValue>>(
      - L3434: get databaseSize(): number
    Properties:
      - Cursor: typeof SqlStorageCursor
      - Statement: typeof SqlStorageStatement
  - Socket
    Methods:
      - L3459: get readable(): ReadableStream
      - L3460: get writable(): WritableStream
      - L3461: get closed(): Promise<void>
      - L3462: get opened(): Promise<SocketInfo>
      - L3463: get upgraded(): boolean
      - L3464: get secureTransport(): "on" | "off" | "starttls"
      - L3465: close(): Promise<void>
      - L3466: startTls(options?: TlsOptions): Socket
  - SocketOptions
    Properties:
      - secureTransport?: string
      - allowHalfOpen: boolean
      - highWaterMark?: number | bigint
  - SocketAddress
    Properties:
      - hostname: string
      - port: number
  - TlsOptions
    Properties:
      - expectedServerHostname?: string
  - SocketInfo
    Properties:
      - remoteAddress?: string
      - localAddress?: string
  - EventSourceEventSourceInit
    Properties:
      - withCredentials?: boolean
      - fetcher?: Fetcher
  - Container
    Methods:
      - L3537: get running(): boolean
      - L3538: start(options?: ContainerStartupOptions): void
      - L3539: monitor(): Promise<void>
      - L3540: destroy(error?: any): Promise<void>
      - L3541: signal(signo: number): void
      - L3542: getTcpPort(port: number): Fetcher
      - L3543: setInactivityTimeout(durationMs: number | bigint): Promise<void>
  - ContainerStartupOptions
    Properties:
      - entrypoint?: string[]
      - enableInternet: boolean
      - env?: Record<string, string>
      - hardTimeout?: number | bigint
  - MessagePortPostMessageOptions
    Properties:
      - transfer?: any[]
  - SyncKvStorage
    Methods:
      - L3624: get<T = unknown>(key: string): T | undefined
      - L3625: list<T = unknown>(options?: SyncKvListOptions): Iterable<[string, T]>
      - L3626: put<T>(key: string, value: T): void
      - L3627: delete(key: string): boolean
  - SyncKvListOptions
    Properties:
      - start?: string
      - startAfter?: string
      - end?: string
      - prefix?: string
      - reverse?: boolean
      - limit?: number
  - WorkerStub
    Methods:
      - L3638: getEntrypoint<T extends Rpc.WorkerEntrypointBranded | undefined>(
  - WorkerStubEntrypointOptions
    Properties:
      - props?: any
  - WorkerLoader
    Methods:
      - L3647: get(
  - WorkerLoaderModule
    Properties:
      - js?: string
      - cjs?: string
      - text?: string
      - data?: ArrayBuffer
      - json?: any
      - py?: string
      - wasm?: ArrayBuffer
  - WorkerLoaderWorkerCode
    Properties:
      - compatibilityDate: string
      - compatibilityFlags?: string[]
      - allowExperimental?: boolean
      - mainModule: string
      - modules: Record<string, WorkerLoaderModule | string>
      - env?: any
      - globalOutbound?: Fetcher | null
      - tails?: Fetcher[]
      - streamingTails?: Fetcher[]
  - ResponseFunctionToolCallItem
    Properties:
      - id: string
  - Ai_Cf_Baai_Bge_Base_En_V1_5_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Openai_Whisper_Output
    Properties:
      - text: string
      - word_count?: number
      - words?: {
      - vtt?: string
  - Ai_Cf_Meta_M2M100_1_2B_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Baai_Bge_Small_En_V1_5_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Baai_Bge_Large_En_V1_5_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Unum_Uform_Gen2_Qwen_500M_Output
    Properties:
      - description?: string
  - Ai_Cf_Openai_Whisper_Tiny_En_Output
    Properties:
      - text: string
      - word_count?: number
      - words?: {
      - vtt?: string
  - Ai_Cf_Openai_Whisper_Large_V3_Turbo_Input
    Properties:
      - audio: string
      - task?: string
      - language?: string
      - vad_filter?: boolean
      - initial_prompt?: string
      - prefix?: string
  - Ai_Cf_Openai_Whisper_Large_V3_Turbo_Output
    Properties:
      - transcription_info?: {
      - text: string
      - word_count?: number
      - segments?: {
      - vtt?: string
  - Ai_Cf_Baai_Bge_M3_Input_QueryAnd_Contexts
    Properties:
      - query?: string
      - contexts: {
      - truncate_inputs?: boolean
  - Ai_Cf_Baai_Bge_M3_Input_Embedding
    Properties:
      - text: string | string[]
      - truncate_inputs?: boolean
  - Ai_Cf_Baai_Bge_M3_Input_QueryAnd_Contexts_1
    Properties:
      - query?: string
      - contexts: {
      - truncate_inputs?: boolean
  - Ai_Cf_Baai_Bge_M3_Input_Embedding_1
    Properties:
      - text: string | string[]
      - truncate_inputs?: boolean
  - Ai_Cf_Baai_Bge_M3_Ouput_Query
    Properties:
      - response?: {
  - Ai_Cf_Baai_Bge_M3_Output_EmbeddingFor_Contexts
    Properties:
      - response?: number[][]
      - shape?: number[]
      - pooling?: "mean" | "cls"
  - Ai_Cf_Baai_Bge_M3_Ouput_Embedding
    Properties:
      - shape?: number[]
      - data?: number[][]
      - pooling?: "mean" | "cls"
  - Ai_Cf_Baai_Bge_M3_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Black_Forest_Labs_Flux_1_Schnell_Input
    Properties:
      - prompt: string
      - steps?: number
  - Ai_Cf_Black_Forest_Labs_Flux_1_Schnell_Output
    Properties:
      - image?: string
  - Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Prompt
    Properties:
      - prompt: string
      - image?: number[] | (string & NonNullable<unknown>)
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
      - lora?: string
  - Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Messages
    Properties:
      - messages: {
      - image?: number[] | (string & NonNullable<unknown>)
      - functions?: {
      - tools?: (
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Prompt
    Properties:
      - prompt: string
      - lora?: string
      - response_format?: Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode_1
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode_1
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Async_Batch
    Properties:
      - requests?: {
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_JSON_Mode_2
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Meta_Llama_Guard_3_8B_Input
    Properties:
      - messages: {
      - max_tokens?: number
      - temperature?: number
      - response_format?: {
  - Ai_Cf_Meta_Llama_Guard_3_8B_Output
    Properties:
      - response?:
      - usage?: {
  - Ai_Cf_Baai_Bge_Reranker_Base_Input
    Properties:
      - top_k?: number
      - contexts: {
  - Ai_Cf_Baai_Bge_Reranker_Base_Output
    Properties:
      - response?: {
  - Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Prompt
    Properties:
      - prompt: string
      - lora?: string
      - response_format?: Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode_1
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_JSON_Mode_1
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Qwen_Qwq_32B_Prompt
    Properties:
      - prompt: string
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwq_32B_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Prompt
    Properties:
      - prompt: string
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Google_Gemma_3_12B_It_Prompt
    Properties:
      - prompt: string
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Google_Gemma_3_12B_It_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Prompt
    Properties:
      - prompt: string
      - guided_json?: object
      - response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Async_Batch
    Properties:
      - requests: (
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Prompt_Inner
    Properties:
      - prompt: string
      - guided_json?: object
      - response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Messages_Inner
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_JSON_Mode
      - guided_json?: object
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Prompt
    Properties:
      - prompt: string
      - lora?: string
      - response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_1
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_1
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Async_Batch
    Properties:
      - requests: (Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Prompt_1 | Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Messages_1)[]
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Prompt_1
    Properties:
      - prompt: string
      - lora?: string
      - response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_2
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_2
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Messages_1
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_3
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_JSON_Mode_3
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Chat_Completion_Response
    Properties:
      - id?: string
      - object?: "chat.completion"
      - created?: number
      - model?: string
      - choices?: {
      - usage?: {
      - prompt_logprobs?: {} | null
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Text_Completion_Response
    Properties:
      - id?: string
      - object?: "text_completion"
      - created?: number
      - model?: string
      - choices?: {
      - usage?: {
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Deepgram_Nova_3_Input
    Properties:
      - audio: {
      - custom_topic_mode?: "extended" | "strict"
      - custom_topic?: string
      - custom_intent_mode?: "extended" | "strict"
      - custom_intent?: string
      - detect_entities?: boolean
      - detect_language?: boolean
      - diarize?: boolean
      - dictation?: boolean
      - encoding?: "linear16" | "flac" | "mulaw" | "amr-nb" | "amr-wb" | "opus" | "speex" | "g729"
      - extra?: string
      - filler_words?: boolean
      - keyterm?: string
      - keywords?: string
      - language?: string
      - measurements?: boolean
      - mip_opt_out?: boolean
      - mode?: "general" | "medical" | "finance"
      - multichannel?: boolean
      - numerals?: boolean
      - paragraphs?: boolean
      - profanity_filter?: boolean
      - punctuate?: boolean
      - redact?: string
      - replace?: string
      - search?: string
      - sentiment?: boolean
      - smart_format?: boolean
      - topics?: boolean
      - utterances?: boolean
      - utt_split?: number
      - channels?: number
      - interim_results?: boolean
      - endpointing?: string
      - vad_events?: boolean
      - utterance_end_ms?: boolean
  - Ai_Cf_Deepgram_Nova_3_Output
    Properties:
      - results?: {
  - Ai_Cf_Qwen_Qwen3_Embedding_0_6B_Input
    Properties:
      - queries?: string | string[]
      - instruction?: string
      - documents?: string | string[]
      - text?: string | string[]
  - Ai_Cf_Qwen_Qwen3_Embedding_0_6B_Output
    Properties:
      - data?: number[][]
      - shape?: number[]
  - Ai_Cf_Pipecat_Ai_Smart_Turn_V2_Output
    Properties:
      - is_complete?: boolean
      - probability?: number
  - Ai_Cf_Leonardo_Phoenix_1_0_Input
    Properties:
      - prompt: string
      - guidance?: number
      - seed?: number
      - height?: number
      - width?: number
      - num_steps?: number
      - negative_prompt?: string
  - Ai_Cf_Leonardo_Lucid_Origin_Input
    Properties:
      - prompt: string
      - guidance?: number
      - seed?: number
      - height?: number
      - width?: number
      - num_steps?: number
      - steps?: number
  - Ai_Cf_Leonardo_Lucid_Origin_Output
    Properties:
      - image?: string
  - Ai_Cf_Deepgram_Aura_1_Input
    Properties:
      - speaker?:
      - encoding?: "linear16" | "flac" | "mulaw" | "alaw" | "mp3" | "opus" | "aac"
      - container?: "none" | "wav" | "ogg"
      - text: string
      - sample_rate?: number
      - bit_rate?: number
  - Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Input
    Properties:
      - text: string | string[]
      - target_language:
  - Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Output
    Properties:
      - translations: string[]
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Prompt
    Properties:
      - prompt: string
      - lora?: string
      - response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Messages
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_1
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_1
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Async_Batch
    Properties:
      - requests: (
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Prompt_1
    Properties:
      - prompt: string
      - lora?: string
      - response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_2
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_2
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Messages_1
    Properties:
      - messages: {
      - functions?: {
      - tools?: (
      - response_format?: Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_3
      - raw?: boolean
      - stream?: boolean
      - max_tokens?: number
      - temperature?: number
      - top_p?: number
      - top_k?: number
      - seed?: number
      - repetition_penalty?: number
      - frequency_penalty?: number
      - presence_penalty?: number
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_JSON_Mode_3
    Properties:
      - type?: "json_object" | "json_schema"
      - json_schema?: unknown
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Chat_Completion_Response
    Properties:
      - id?: string
      - object?: "chat.completion"
      - created?: number
      - model?: string
      - choices?: {
      - usage?: {
      - prompt_logprobs?: {} | null
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Text_Completion_Response
    Properties:
      - id?: string
      - object?: "text_completion"
      - created?: number
      - model?: string
      - choices?: {
      - usage?: {
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_AsyncResponse
    Properties:
      - request_id?: string
  - Ai_Cf_Pfnet_Plamo_Embedding_1B_Input
    Properties:
      - text: string | string[]
  - Ai_Cf_Pfnet_Plamo_Embedding_1B_Output
    Properties:
      - data: number[][]
      - shape: [number, number]
  - Ai_Cf_Deepgram_Flux_Input
    Properties:
      - encoding: "linear16"
      - sample_rate: string
      - eager_eot_threshold?: string
      - eot_threshold?: string
      - eot_timeout_ms?: string
      - keyterm?: string
      - mip_opt_out?: "true" | "false"
      - tag?: string
  - Ai_Cf_Deepgram_Flux_Output
    Properties:
      - request_id?: string
      - sequence_id?: number
      - event?: "Update" | "StartOfTurn" | "EagerEndOfTurn" | "TurnResumed" | "EndOfTurn"
      - turn_index?: number
      - audio_window_start?: number
      - audio_window_end?: number
      - transcript?: string
      - words?: {
      - end_of_turn_confidence?: number
  - Ai_Cf_Deepgram_Aura_2_En_Input
    Properties:
      - speaker?:
      - encoding?: "linear16" | "flac" | "mulaw" | "alaw" | "mp3" | "opus" | "aac"
      - container?: "none" | "wav" | "ogg"
      - text: string
      - sample_rate?: number
      - bit_rate?: number
  - Ai_Cf_Deepgram_Aura_2_Es_Input
    Properties:
      - speaker?:
      - encoding?: "linear16" | "flac" | "mulaw" | "alaw" | "mp3" | "opus" | "aac"
      - container?: "none" | "wav" | "ogg"
      - text: string
      - sample_rate?: number
      - bit_rate?: number
  - BasicImageTransformations
    Properties:
      - width?: number
      - height?: number
      - fit?: "scale-down" | "contain" | "cover" | "crop" | "pad" | "squeeze"
      - segment?: "foreground"
      - gravity?:
      - background?: string
      - rotate?: 0 | 90 | 180 | 270 | 360
  - BasicImageTransformationsGravityCoordinates
    Properties:
      - x?: number
      - y?: number
      - mode?: "remainder" | "box-center"
  - RequestInitCfProperties
    Properties:
      - cacheEverything?: boolean
      - cacheKey?: string
      - cacheTags?: string[]
      - cacheTtl?: number
      - cacheTtlByStatus?: Record<string, number>
      - scrapeShield?: boolean
      - apps?: boolean
      - image?: RequestInitCfPropertiesImage
      - minify?: RequestInitCfPropertiesImageMinify
      - mirage?: boolean
      - polish?: "lossy" | "lossless" | "off"
      - r2?: RequestInitCfPropertiesR2
      - resolveOverride?: string
  - RequestInitCfPropertiesImageDraw
    Properties:
      - url: string
      - opacity?: number
      - repeat?: true | "x" | "y"
      - top?: number
      - left?: number
      - bottom?: number
      - right?: number
  - RequestInitCfPropertiesImage
    Properties:
      - dpr?: number
      - trim?:
      - quality?: number | "low" | "medium-low" | "medium-high" | "high"
      - format?: "avif" | "webp" | "json" | "jpeg" | "png" | "baseline-jpeg" | "png-force" | "svg"
      - anim?: boolean
      - metadata?: "keep" | "copyright" | "none"
      - sharpen?: number
      - blur?: number
      - draw?: RequestInitCfPropertiesImageDraw[]
      - border?:
      - brightness?: number
      - contrast?: number
      - gamma?: number
      - saturation?: number
      - flip?: "h" | "v" | "hv"
      - compression?: "fast"
  - RequestInitCfPropertiesImageMinify
    Properties:
      - javascript?: boolean
      - css?: boolean
      - html?: boolean
  - RequestInitCfPropertiesR2
    Properties:
      - bucketColoId?: number
  - IncomingRequestCfPropertiesBase
    Properties:
      - asn?: number
      - asOrganization?: string
      - clientAcceptEncoding?: string
      - clientTcpRtt?: number
      - colo: string
      - edgeRequestKeepAliveStatus: IncomingRequestCfPropertiesEdgeRequestKeepAliveStatus
      - httpProtocol: string
      - requestPriority: string
      - tlsVersion: string
      - tlsCipher: string
      - tlsExportedAuthenticator?: IncomingRequestCfPropertiesExportedAuthenticatorMetadata
  - IncomingRequestCfPropertiesBotManagementBase
    Properties:
      - score: number
      - verifiedBot: boolean
      - corporateProxy: boolean
      - staticResource: boolean
      - detectionIds: number[]
  - IncomingRequestCfPropertiesBotManagement
    Properties:
      - botManagement: IncomingRequestCfPropertiesBotManagementBase
      - clientTrustScore: number
  - IncomingRequestCfPropertiesBotManagementEnterprise
    Properties:
      - botManagement: IncomingRequestCfPropertiesBotManagementBase & {
  - IncomingRequestCfPropertiesCloudflareForSaaSEnterprise
    Properties:
      - hostMetadata?: HostMetadata
  - IncomingRequestCfPropertiesCloudflareAccessOrApiShield
    Properties:
      - tlsClientAuth:
  - IncomingRequestCfPropertiesExportedAuthenticatorMetadata
    Properties:
      - clientHandshake: string
      - serverHandshake: string
      - clientFinished: string
      - serverFinished: string
  - IncomingRequestCfPropertiesGeographicInformation
    Properties:
      - country?: Iso3166Alpha2Code | "T1"
      - isEUCountry?: "1"
      - continent?: ContinentCode
      - city?: string
      - postalCode?: string
      - latitude?: string
      - longitude?: string
      - timezone?: string
      - region?: string
      - regionCode?: string
      - metroCode?: string
  - IncomingRequestCfPropertiesTLSClientAuth
    Properties:
      - certPresented: "1"
      - certVerified: Exclude<CertVerificationStatus, "NONE">
      - certRevoked: "1" | "0"
      - certIssuerDN: string
      - certSubjectDN: string
      - certIssuerDNRFC2253: string
      - certSubjectDNRFC2253: string
      - certIssuerDNLegacy: string
      - certSubjectDNLegacy: string
      - certSerial: string
      - certIssuerSerial: string
      - certSKI: string
      - certIssuerSKI: string
      - certFingerprintSHA1: string
      - certFingerprintSHA256: string
      - certNotBefore: string
      - certNotAfter: string
  - IncomingRequestCfPropertiesTLSClientAuthPlaceholder
    Properties:
      - certPresented: "0"
      - certVerified: "NONE"
      - certRevoked: "0"
      - certIssuerDN: ""
      - certSubjectDN: ""
      - certIssuerDNRFC2253: ""
      - certSubjectDNRFC2253: ""
      - certIssuerDNLegacy: ""
      - certSubjectDNLegacy: ""
      - certSerial: ""
      - certIssuerSerial: ""
      - certSKI: ""
      - certIssuerSKI: ""
      - certFingerprintSHA1: ""
      - certFingerprintSHA256: ""
      - certNotBefore: ""
      - certNotAfter: ""
  - D1Meta
    Properties:
      - duration: number
      - size_after: number
      - rows_read: number
      - rows_written: number
      - last_row_id: number
      - changed_db: boolean
      - changes: number
      - served_by_region?: string
      - served_by_colo?: string
      - served_by_primary?: boolean
      - timings?: {
      - total_attempts?: number
  - D1Response
    Properties:
      - success: true
      - meta: D1Meta & Record<string, unknown>
      - error?: never
  - D1ExecResult
    Properties:
      - count: number
      - duration: number
  - EmailSendResult
    Properties:
      - messageId: string
  - EmailMessage
    Properties:
      - readonly from: string
      - readonly to: string
  - ForwardableEmailMessage
    Methods:
      - L10526: setReject(reason: string): void
      - L10533: forward(rcptTo: string, headers?: Headers): Promise<EmailSendResult>
      - L10539: reply(message: EmailMessage): Promise<EmailSendResult>
    Properties:
      - readonly raw: ReadableStream<Uint8Array>
      - readonly headers: Headers
      - readonly rawSize: number
  - EmailAddress
    Properties:
      - name: string
      - email: string
  - SendEmail
    Methods:
      - L10566: send(message: EmailMessage): Promise<EmailSendResult>
      - L10567: send(builder: {
  - HelloWorldBinding
    Methods:
      - L10602: get(): Promise<{
      - L10609: set(value: string): Promise<void>
  - Hyperdrive
    Methods:
      - L10623: connect(): Socket
    Properties:
      - readonly connectionString: string
      - readonly host: string
      - readonly port: number
      - readonly user: string
      - readonly password: string
      - readonly database: string
  - ImagesBinding
    Methods:
      - L10751: info(stream: ReadableStream<Uint8Array>, options?: ImageInputOptions): Promise<ImageInfoResponse>
      - L10757: input(stream: ReadableStream<Uint8Array>, options?: ImageInputOptions): ImageTransformer
  - ImageTransformer
    Methods:
      - L10765: transform(transform: ImageTransform): ImageTransformer
      - L10772: draw(
      - L10781: output(options: ImageOutputOptions): Promise<ImageTransformationResult>
  - ImageTransformationResult
    Methods:
      - L10790: response(): Response
      - L10794: contentType(): string
      - L10798: image(options?: ImageTransformationOutputOptions): ReadableStream<Uint8Array>
  - ImagesError
    Properties:
      - readonly code: number
      - readonly message: string
      - readonly stack?: string
  - MediaBinding
    Methods:
      - L10815: input(media: ReadableStream<Uint8Array>): MediaTransformer
  - MediaTransformer
    Methods:
      - L10827: transform(transform: MediaTransformationInputOptions): MediaTransformationGenerator
  - MediaTransformationGenerator
    Methods:
      - L10839: output(output: MediaTransformationOutputOptions): MediaTransformationResult
  - MediaTransformationResult
    Methods:
      - L10850: media(): ReadableStream<Uint8Array>
      - L10855: response(): Response
      - L10860: contentType(): string
  - MediaError
    Properties:
      - readonly code: number
      - readonly message: string
      - readonly stack?: string
  - PubSubMessage
    Properties:
      - readonly mid: number
      - readonly broker: string
      - readonly topic: string
      - readonly clientId: string
      - readonly jti?: string
      - readonly receivedAt: number
      - readonly contentType: string
      - readonly payloadFormatIndicator: number
      - payload: string | Uint8Array
  - JsonWebKeyWithKid
    Properties:
      - readonly kid: string
  - RateLimitOptions
    Properties:
      - key: string
  - RateLimitOutcome
    Properties:
      - success: boolean
  - RateLimit
    Methods:
      - L11047: limit(options: RateLimitOptions): Promise<RateLimitOutcome>
  - SecretsStoreSecret
    Methods:
      - L11368: get(): Promise<string>
  - VectorizeError
    Properties:
      - code?: number
      - error: string
  - VectorizeQueryOptions
    Properties:
      - topK?: number
      - namespace?: string
      - returnValues?: boolean
      - returnMetadata?: boolean | VectorizeMetadataRetrievalLevel
      - filter?: VectorizeVectorMetadataFilter
  - VectorizeIndexDetails
    Properties:
      - readonly id: string
      - name: string
      - description?: string
      - config: VectorizeIndexConfig
      - vectorsCount: number
  - VectorizeIndexInfo
    Properties:
      - vectorCount: number
      - dimensions: number
      - processedUpToDatetime: number
      - processedUpToMutation: number
  - VectorizeVector
    Properties:
      - id: string
      - values: VectorFloatArray | number[]
      - namespace?: string
      - metadata?: Record<string, VectorizeVectorMetadata>
  - VectorizeMatches
    Properties:
      - matches: VectorizeMatch[]
      - count: number
  - VectorizeVectorMutation
    Properties:
      - ids: string[]
      - count: number
  - VectorizeAsyncMutation
    Properties:
      - mutationId: string
  - DynamicDispatchLimits
    Properties:
      - cpuMs?: number
      - subRequests?: number
  - DynamicDispatchOptions
    Properties:
      - limits?: DynamicDispatchLimits
      - outbound?: {
  - DispatchNamespace
    Methods:
      - L11947: get(
  - WorkflowInstanceCreateOptions
    Properties:
      - id?: string
      - params?: PARAMS
      - retention?: {
  - WorkflowError
    Properties:
      - code?: number
      - message: string

Type-aliases:
  - WorkerGlobalScopeEventMap
  - BufferSource
  - TypedArray
  - ExportedHandlerFetchHandler
  - ExportedHandlerTailHandler
  - ExportedHandlerTraceHandler
  - ExportedHandlerTailStreamHandler
  - ExportedHandlerScheduledHandler
  - ExportedHandlerQueueHandler
  - ExportedHandlerTestHandler
  - DurableObjectStub
  - DurableObjectJurisdiction
  - DurableObjectLocationHint
  - DurableObjectRoutingMode
  - EventListener
  - EventListenerOrEventListenerObject
  - HeadersInit
  - BodyInit
  - RequestInfo
  - Service
  - Fetcher
  - KVNamespaceListResult
  - QueueContentType
  - R2Range
  - R2Objects
  - ReadableStreamReadResult
  - WebSocketEventMap
  - SqlStorageValue
  - LoopbackForExport
  - LoopbackServiceStub
  - LoopbackDurableObjectClass
  - AiImageClassificationInput
  - AiImageClassificationOutput
  - AiImageToTextInput
  - AiImageToTextOutput
  - AiImageTextToTextInput
  - AiImageTextToTextOutput
  - AiMultimodalEmbeddingsInput
  - AiIMultimodalEmbeddingsOutput
  - AiObjectDetectionInput
  - AiObjectDetectionOutput
  - AiSentenceSimilarityInput
  - AiSentenceSimilarityOutput
  - AiAutomaticSpeechRecognitionInput
  - AiAutomaticSpeechRecognitionOutput
  - AiSummarizationInput
  - AiSummarizationOutput
  - AiTextClassificationInput
  - AiTextClassificationOutput
  - AiTextEmbeddingsInput
  - AiTextEmbeddingsOutput
  - RoleScopedChatInput
  - AiTextGenerationToolLegacyInput
  - AiTextGenerationToolInput
  - AiTextGenerationFunctionsInput
  - AiTextGenerationResponseFormat
  - AiTextGenerationInput
  - AiTextGenerationToolLegacyOutput
  - AiTextGenerationToolOutput
  - UsageTags
  - AiTextGenerationOutput
  - AiTextToSpeechInput
  - AiTextToSpeechOutput
  - AiTextToImageInput
  - AiTextToImageOutput
  - AiTranslationInput
  - AiTranslationOutput
  - ResponsesInput
  - ResponsesOutput
  - EasyInputMessage
  - ResponsesFunctionTool
  - ResponseIncompleteDetails
  - ResponsePrompt
  - Reasoning
  - ResponseContent
  - ResponseContentReasoningText
  - ResponseConversationParam
  - ResponseCreatedEvent
  - ResponseCustomToolCallOutput
  - ResponseError
  - ResponseErrorEvent
  - ResponseFailedEvent
  - ResponseFormatText
  - ResponseFormatJSONObject
  - ResponseFormatTextConfig
  - ResponseFormatTextJSONSchemaConfig
  - ResponseFunctionCallArgumentsDeltaEvent
  - ResponseFunctionCallArgumentsDoneEvent
  - ResponseFunctionCallOutputItem
  - ResponseFunctionCallOutputItemList
  - ResponseFunctionToolCall
  - ResponseFunctionToolCallOutputItem
  - ResponseIncludable
  - ResponseIncompleteEvent
  - ResponseInput
  - ResponseInputContent
  - ResponseInputImage
  - ResponseInputImageContent
  - ResponseInputItem
  - ResponseInputItemFunctionCallOutput
  - ResponseInputItemMessage
  - ResponseInputMessageContentList
  - ResponseInputMessageItem
  - ResponseInputText
  - ResponseInputTextContent
  - ResponseItem
  - ResponseOutputItem
  - ResponseOutputItemAddedEvent
  - ResponseOutputItemDoneEvent
  - ResponseOutputMessage
  - ResponseOutputRefusal
  - ResponseOutputText
  - ResponseReasoningItem
  - ResponseReasoningSummaryItem
  - ResponseReasoningContentItem
  - ResponseReasoningTextDeltaEvent
  - ResponseReasoningTextDoneEvent
  - ResponseRefusalDeltaEvent
  - ResponseRefusalDoneEvent
  - ResponseStatus
  - ResponseStreamEvent
  - ResponseCompletedEvent
  - ResponseTextConfig
  - ResponseTextDeltaEvent
  - ResponseTextDoneEvent
  - Logprob
  - TopLogprob
  - ResponseUsage
  - Tool
  - ToolChoiceFunction
  - ToolChoiceOptions
  - ReasoningEffort
  - StreamOptions
  - Ai_Cf_Baai_Bge_Base_En_V1_5_Input
  - Ai_Cf_Baai_Bge_Base_En_V1_5_Output
  - Ai_Cf_Openai_Whisper_Input
  - Ai_Cf_Meta_M2M100_1_2B_Output
  - Ai_Cf_Baai_Bge_Small_En_V1_5_Input
  - Ai_Cf_Baai_Bge_Small_En_V1_5_Output
  - Ai_Cf_Baai_Bge_Large_En_V1_5_Input
  - Ai_Cf_Baai_Bge_Large_En_V1_5_Output
  - Ai_Cf_Openai_Whisper_Tiny_En_Input
  - Ai_Cf_Baai_Bge_M3_Input
  - Ai_Cf_Baai_Bge_M3_Output
  - Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Input
  - Ai_Cf_Meta_Llama_3_2_11B_Vision_Instruct_Output
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Input
  - Ai_Cf_Meta_Llama_3_3_70B_Instruct_Fp8_Fast_Output
  - Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Input
  - Ai_Cf_Qwen_Qwen2_5_Coder_32B_Instruct_Output
  - Ai_Cf_Qwen_Qwq_32B_Input
  - Ai_Cf_Qwen_Qwq_32B_Output
  - Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Input
  - Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Output
  - Ai_Cf_Google_Gemma_3_12B_It_Input
  - Ai_Cf_Google_Gemma_3_12B_It_Output
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Input
  - Ai_Cf_Meta_Llama_4_Scout_17B_16E_Instruct_Output
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Input
  - Ai_Cf_Qwen_Qwen3_30B_A3B_Fp8_Output
  - Ai_Cf_Leonardo_Phoenix_1_0_Output
  - Ai_Cf_Deepgram_Aura_1_Output
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Input
  - Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Output
  - Ai_Cf_Deepgram_Aura_2_En_Output
  - Ai_Cf_Deepgram_Aura_2_Es_Output
  - AiOptions
  - AiModelsSearchParams
  - AiModelsSearchObject
  - AiModelListType
  - GatewayRetries
  - GatewayOptions
  - UniversalGatewayOptions
  - AiGatewayPatchLog
  - AiGatewayLog
  - AIGatewayProviders
  - AIGatewayHeaders
  - AIGatewayUniversalRequest
  - ComparisonFilter
  - CompoundFilter
  - AutoRagSearchRequest
  - AutoRagAiSearchRequest
  - AutoRagAiSearchRequestStreaming
  - AutoRagSearchResponse
  - AutoRagListResponse
  - AutoRagAiSearchResponse
  - IncomingRequestCfProperties
  - CfProperties
  - D1Result
  - D1SessionConstraint
  - D1SessionBookmark
  - EmailAttachment
  - ImageInfoResponse
  - ImageTransform
  - ImageDrawOptions
  - ImageInputOptions
  - ImageOutputOptions
  - ImageTransformationOutputOptions
  - MediaTransformationInputOptions
  - Params
  - EventContext
  - PagesFunction
  - EventPluginContext
  - PagesPluginFunction
  - MarkdownDocument
  - ConversionResponse
  - ImageConversionOptions
  - EmbeddedImageConversionOptions
  - ConversionOptions
  - ConversionRequestOptions
  - SupportedFileFormat
  - VectorizeVectorMetadataValue
  - VectorizeVectorMetadata
  - VectorFloatArray
  - VectorizeVectorMetadataFilterOp
  - VectorizeVectorMetadataFilterCollectionOp
  - VectorizeVectorMetadataFilter
  - VectorizeDistanceMetric
  - VectorizeMetadataRetrievalLevel
  - VectorizeMatch
  - WorkerVersionMetadata
  - WorkflowDurationLabel
  - WorkflowSleepDuration
  - WorkflowRetentionDuration
  - InstanceStatus

Literal-union aliases:
  - type Ai_Cf_Meta_M2M100_1_2B_Input = | { /** * The text to be translated */ text: string; /** * The language code of the source text (e.g., 'en' for English). Defaults to 'en' if not specified */ source_lang?: string; /** * The language code to translate the text into (e.g., 'es' for Spanish) */ target_lang: string; } | { /** * Batch of the embeddings requests to run using async-queue */ requests: { /** * The text to be translated */ text: string; /** * The language code of the source text (e.g., 'en' for English). Defaults to 'en' if not specified */ source_lang?: string; /** * The language code to translate the text into (e.g., 'es' for Spanish) */ target_lang: string; }[]; }
  - type Ai_Cf_Unum_Uform_Gen2_Qwen_500M_Input = | string | { /** * The input text prompt for the model to generate a response. */ prompt?: string; /** * If true, a chat template is not applied and you must adhere to the specific model's expected formatting. */ raw?: boolean; /** * Controls the creativity of the AI's responses by adjusting how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses. */ top_p?: number; /** * Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises. */ top_k?: number; /** * Random seed for reproducibility of the generation. */ seed?: number; /** * Penalty for repeated tokens; higher values discourage repetition. */ repetition_penalty?: number; /** * Decreases the likelihood of the model repeating the same lines verbatim. */ frequency_penalty?: number; /** * Increases the likelihood of the model introducing new topics. */ presence_penalty?: number; image: number[] | (string & NonNullable<unknown>); /** * The maximum number of tokens to generate in the response. */ max_tokens?: number; }
  - type Ai_Cf_Pipecat_Ai_Smart_Turn_V2_Input = | { /** * readable stream with audio data and content-type specified for that data */ audio: { body: object; contentType: string; }; /** * type of data PCM data that's sent to the inference server as raw array */ dtype?: "uint8" | "float32" | "float64"; } | { /** * base64 encoded audio data */ audio: string; /** * type of data PCM data that's sent to the inference server as raw array */ dtype?: "uint8" | "float32" | "float64"; }
  - type MediaTransformationOutputOptions = { /** * Output mode determining the type of media to generate */ mode?: "video" | "spritesheet" | "frame" | "audio"; /** Whether to include audio in the output */ audio?: boolean; /** * Starting timestamp for frame extraction or start time for clips. (e.g. '2s'). */ time?: string; /** * Duration for video clips, audio extraction, and spritesheet generation (e.g. '5s'). */ duration?: string; /** * Number of frames in the spritesheet. */ imageCount?: number; /** * Output format for the generated media. */ format?: "jpg" | "png" | "m4a"; }
  - type VectorizeIndexConfig = | { dimensions: number; metric: VectorizeDistanceMetric; } | { preset: string; // keep this generic, as we'll be adding more presets in the future and this is only in a read capacity }
---


File: /Users/masonjames/Projects/emdash/packages/core/src/database/types.ts
Imports:
  - import type { Generated } from "kysely";
---

Interfaces:
  - RevisionTable
    Properties:
      - id: string
      - collection: string
      - entry_id: string
      - data: string
      - author_id: string | null
      - created_at: Generated<string>
  - TaxonomyTable
    Properties:
      - id: string
      - name: string
      - slug: string
      - label: string
      - parent_id: string | null
      - data: string | null
  - ContentTaxonomyTable
    Properties:
      - collection: string
      - entry_id: string
      - taxonomy_id: string
  - TaxonomyDefTable
    Properties:
      - id: string
      - name: string
      - label: string
      - label_singular: string | null
      - hierarchical: number
      - collections: string | null
      - created_at: Generated<string>
  - MediaTable
    Properties:
      - id: string
      - filename: string
      - mime_type: string
      - size: number | null
      - width: number | null
      - height: number | null
      - alt: string | null
      - caption: string | null
      - storage_key: string
      - status: string
      - content_hash: string | null
      - blurhash: string | null
      - dominant_color: string | null
      - created_at: Generated<string>
      - author_id: string | null
  - UserTable
    Properties:
      - id: string
      - email: string
      - name: string | null
      - avatar_url: string | null
      - role: number
      - email_verified: number
      - data: string | null
      - disabled: Generated<number>
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - CredentialTable
    Properties:
      - id: string
      - user_id: string
      - public_key: Uint8Array
      - counter: number
      - device_type: string
      - backed_up: number
      - transports: string | null
      - name: string | null
      - created_at: Generated<string>
      - last_used_at: Generated<string>
  - AuthTokenTable
    Properties:
      - hash: string
      - user_id: string | null
      - email: string | null
      - type: string
      - role: number | null
      - invited_by: string | null
      - expires_at: string
      - created_at: Generated<string>
  - OAuthAccountTable
    Properties:
      - provider: string
      - provider_account_id: string
      - user_id: string
      - created_at: Generated<string>
  - AllowedDomainTable
    Properties:
      - domain: string
      - default_role: number
      - enabled: number
      - created_at: Generated<string>
  - AuthChallengeTable
    Properties:
      - challenge: string
      - type: string
      - user_id: string | null
      - data: string | null
      - expires_at: string
      - created_at: Generated<string>
  - ApiTokenTable
    Properties:
      - id: string
      - name: string
      - token_hash: string
      - prefix: string
      - user_id: string
      - scopes: string
      - expires_at: string | null
      - last_used_at: string | null
      - created_at: Generated<string>
  - OAuthTokenTable
    Properties:
      - token_hash: string
      - token_type: string
      - user_id: string
      - scopes: string
      - client_type: string
      - expires_at: string
      - refresh_token_hash: string | null
      - client_id: string | null
      - created_at: Generated<string>
  - AuthorizationCodeTable
    Properties:
      - code_hash: string
      - client_id: string
      - redirect_uri: string
      - user_id: string
      - scopes: string
      - code_challenge: string
      - code_challenge_method: string
      - resource: string | null
      - expires_at: string
      - created_at: Generated<string>
  - OAuthClientTable
    Properties:
      - id: string
      - name: string
      - redirect_uris: string
      - scopes: string | null
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - DeviceCodeTable
    Properties:
      - device_code: string
      - user_code: string
      - scopes: string
      - user_id: string | null
      - status: string
      - expires_at: string
      - interval: number
      - last_polled_at: string | null
      - created_at: Generated<string>
  - OptionTable
    Properties:
      - name: string
      - value: string
  - AuditLogTable
    Properties:
      - id: string
      - timestamp: Generated<string>
      - actor_id: string | null
      - actor_ip: string | null
      - action: string
      - resource_type: string | null
      - resource_id: string | null
      - details: string | null
      - status: string | null
  - MigrationTable
    Properties:
      - name: string
      - timestamp: string
  - CollectionTable
    Properties:
      - id: string
      - slug: string
      - label: string
      - label_singular: string | null
      - description: string | null
      - icon: string | null
      - supports: string | null
      - source: string | null
      - search_config: string | null
      - has_seo: number
      - url_pattern: string | null
      - comments_enabled: Generated<number>
      - comments_moderation: Generated<string>
      - comments_closed_after_days: Generated<number>
      - comments_auto_approve_users: Generated<number>
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - SeoTable
    Properties:
      - collection: string
      - content_id: string
      - seo_title: string | null
      - seo_description: string | null
      - seo_image: string | null
      - seo_canonical: string | null
      - seo_no_index: number
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - FieldTable
    Properties:
      - id: string
      - collection_id: string
      - slug: string
      - label: string
      - type: string
      - column_type: string
      - required: number
      - unique: number
      - default_value: string | null
      - validation: string | null
      - widget: string | null
      - options: string | null
      - sort_order: number
      - searchable: Generated<number>
      - translatable: Generated<number>
      - created_at: Generated<string>
  - PluginStorageTable
    Properties:
      - plugin_id: string
      - collection: string
      - id: string
      - data: string
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - PluginStateTable
    Properties:
      - plugin_id: string
      - version: string
      - status: string
      - installed_at: Generated<string>
      - activated_at: string | null
      - deactivated_at: string | null
      - data: string | null
      - source: Generated<string>
      - marketplace_version: string | null
      - display_name: string | null
      - description: string | null
  - PluginIndexTable
    Properties:
      - plugin_id: string
      - collection: string
      - index_name: string
      - fields: string
      - created_at: Generated<string>
  - MenuTable
    Properties:
      - id: string
      - name: string
      - label: string
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - MenuItemTable
    Properties:
      - id: string
      - menu_id: string
      - parent_id: string | null
      - sort_order: number
      - type: string
      - reference_collection: string | null
      - reference_id: string | null
      - custom_url: string | null
      - label: string
      - title_attr: string | null
      - target: string | null
      - css_classes: string | null
      - created_at: Generated<string>
  - WidgetAreaTable
    Properties:
      - id: string
      - name: string
      - label: string
      - description: string | null
      - created_at: Generated<string>
  - WidgetTable
    Properties:
      - id: string
      - area_id: string
      - sort_order: number
      - type: string
      - title: string | null
      - content: string | null
      - menu_name: string | null
      - component_id: string | null
      - component_props: string | null
      - created_at: Generated<string>
  - CronTaskTable
    Properties:
      - id: string
      - plugin_id: string
      - task_name: string
      - schedule: string
      - is_oneshot: number
      - data: string | null
      - next_run_at: string
      - last_run_at: string | null
      - status: string
      - locked_at: string | null
      - enabled: number
      - created_at: Generated<string>
  - CommentTable
    Properties:
      - id: string
      - collection: string
      - content_id: string
      - parent_id: string | null
      - author_name: string
      - author_email: string
      - author_user_id: string | null
      - body: string
      - status: string
      - ip_hash: string | null
      - user_agent: string | null
      - moderation_metadata: string | null
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - SectionTable
    Properties:
      - id: string
      - slug: string
      - title: string
      - description: string | null
      - keywords: string | null
      - content: string
      - preview_media_id: string | null
      - source: string
      - theme_id: string | null
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - Database
    Properties:
      - revisions: RevisionTable
      - taxonomies: TaxonomyTable
      - content_taxonomies: ContentTaxonomyTable
      - _emdash_taxonomy_defs: TaxonomyDefTable
      - media: MediaTable
      - users: UserTable
      - credentials: CredentialTable
      - auth_tokens: AuthTokenTable
      - oauth_accounts: OAuthAccountTable
      - allowed_domains: AllowedDomainTable
      - auth_challenges: AuthChallengeTable
      - options: OptionTable
      - audit_logs: AuditLogTable
      - _emdash_migrations: MigrationTable
      - _emdash_collections: CollectionTable
      - _emdash_fields: FieldTable
      - _plugin_storage: PluginStorageTable
      - _plugin_state: PluginStateTable
      - _plugin_indexes: PluginIndexTable
      - _emdash_menus: MenuTable
      - _emdash_menu_items: MenuItemTable
      - _emdash_widget_areas: WidgetAreaTable
      - _emdash_widgets: WidgetTable
      - _emdash_sections: SectionTable
      - _emdash_api_tokens: ApiTokenTable
      - _emdash_oauth_tokens: OAuthTokenTable
      - _emdash_device_codes: DeviceCodeTable
      - _emdash_authorization_codes: AuthorizationCodeTable
      - _emdash_oauth_clients: OAuthClientTable
      - _emdash_seo: SeoTable
      - _emdash_cron_tasks: CronTaskTable
      - _emdash_comments: CommentTable
      - _emdash_redirects: RedirectTable
      - _emdash_404_log: NotFoundLogTable
      - _emdash_bylines: BylineTable
      - _emdash_content_bylines: ContentBylineTable
      - _emdash_rate_limits: RateLimitTable
  - RedirectTable
    Properties:
      - id: string
      - source: string
      - destination: string
      - type: number
      - is_pattern: number
      - enabled: number
      - hits: number
      - last_hit_at: string | null
      - group_name: string | null
      - auto: number
      - created_at: string
      - updated_at: string
  - NotFoundLogTable
    Properties:
      - id: string
      - path: string
      - referrer: string | null
      - user_agent: string | null
      - ip: string | null
      - created_at: string
  - BylineTable
    Properties:
      - id: string
      - slug: string
      - display_name: string
      - bio: string | null
      - avatar_media_id: string | null
      - website_url: string | null
      - user_id: string | null
      - is_guest: number
      - created_at: Generated<string>
      - updated_at: Generated<string>
  - ContentBylineTable
    Properties:
      - id: string
      - collection_slug: string
      - content_id: string
      - byline_id: string
      - sort_order: number
      - role_label: string | null
      - created_at: Generated<string>
  - RateLimitTable
    Properties:
      - key: string
      - window: string
      - count: number

Literal-union aliases:
  - export type MediaRow = { id: string; filename: string; mime_type: string; size: number | null; width: number | null; height: number | null; alt: string | null; caption: string | null; storage_key: string; status: string; // 'pending' | 'ready' | 'failed' content_hash: string | null; // xxHash64 for deduplication blurhash: string | null; dominant_color: string | null; created_at: string; author_id: string | null; }

Exports:
  - export interface RevisionTable {
  - export interface TaxonomyTable {
  - export interface ContentTaxonomyTable {
  - export interface TaxonomyDefTable {
  - export interface MediaTable {
  - export interface UserTable {
  - export interface CredentialTable {
  - export interface AuthTokenTable {
  - export interface OAuthAccountTable {
  - export interface AllowedDomainTable {
  - export interface AuthChallengeTable {
  - export interface ApiTokenTable {
  - export interface OAuthTokenTable {
  - export interface AuthorizationCodeTable {
  - export interface OAuthClientTable {
  - export interface DeviceCodeTable {
  - export interface OptionTable {
  - export interface AuditLogTable {
  - export interface MigrationTable {
  - export interface CollectionTable {
  - export interface SeoTable {
  - export interface FieldTable {
  - export interface PluginStorageTable {
  - export interface PluginStateTable {
  - export interface PluginIndexTable {
  - export interface MenuTable {
  - export interface MenuItemTable {
  - export interface WidgetAreaTable {
  - export interface WidgetTable {
  - export interface CronTaskTable {
  - export interface CommentTable {
  - export interface SectionTable {
  - export interface Database {
  - export type MediaRow = {
  - export interface RedirectTable {
  - export interface NotFoundLogTable {
  - export interface BylineTable {
  - export interface ContentBylineTable {
  - export interface RateLimitTable {
---


File: /Users/masonjames/Projects/emdash/packages/core/src/astro/integration/runtime.ts
Imports:
  - import type { AuthDescriptor } from "../../auth/types.js";
  - import type { DatabaseDescriptor } from "../../db/adapters.js";
  - import type { MediaProviderDescriptor } from "../../media/types.js";
  - import type { ResolvedPlugin } from "../../plugins/types.js";
  - import type { StorageDescriptor } from "../storage/types.js";
---

Interfaces:
  - PluginAdminPage
    Properties:
      - path: string
      - label: string
      - icon?: string
  - PluginDashboardWidget
    Properties:
      - id: string
      - size?: "full" | "half" | "third"
      - title?: string
  - StorageCollectionDeclaration
    Properties:
      - indexes?: string[]
      - uniqueIndexes?: string[]
  - PluginDescriptor
    Properties:
      - id: string
      - version: string
      - entrypoint: string
      - options?: TOptions
      - format?: "standard" | "native"
      - adminEntry?: string
      - componentsEntry?: string
      - adminPages?: PluginAdminPage[]
      - adminWidgets?: PluginDashboardWidget[]
      - capabilities?: string[]
      - allowedHosts?: string[]
      - storage?: Record<string, StorageCollectionDeclaration>
  - EmDashConfig
    Properties:
      - database?: DatabaseDescriptor
      - storage?: StorageDescriptor
      - plugins?: PluginDescriptor[]
      - sandboxed?: SandboxedPluginDescriptor[]
      - sandboxRunner?: string
      - auth?: AuthDescriptor
      - mcp?: boolean
      - marketplace?: string
      - playground?: {
      - mediaProviders?: MediaProviderDescriptor[]

Type-aliases:
  - SandboxedPluginDescriptor

Functions:
  - L322: export function getStoredConfig(): EmDashConfig | null
  - L330: export function setStoredConfig(config: EmDashConfig): void

Exports:
  - export type { ResolvedPlugin };
  - export type { MediaProviderDescriptor };
  - export interface PluginAdminPage {
  - export interface PluginDashboardWidget {
  - export interface StorageCollectionDeclaration {
  - export interface PluginDescriptor<TOptions = Record<string, unknown>> {
  - export type SandboxedPluginDescriptor<TOptions = Record<string, unknown>> =
  - export interface EmDashConfig {
  - export function getStoredConfig(): EmDashConfig | null {
  - export function setStoredConfig(config: EmDashConfig): void {
---


File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/state.ts
Imports:
  - import type { Kysely } from "kysely";
  - import type { Database } from "../database/types.js";
---
Classes:
  - PluginStateRepository
    Methods:
      - L42: constructor(private db: Kysely<Database>)
      - L47: async get(pluginId: string): Promise<PluginState | null>
      - L73: async getAll(): Promise<PluginState[]>
      - L93: async getMarketplacePlugins(): Promise<PluginState[]>
      - L117: async upsert(
      - L186: async enable(pluginId: string, version: string): Promise<PluginState>
      - L193: async disable(pluginId: string, version: string): Promise<PluginState>
      - L200: async delete(pluginId: string): Promise<boolean>

Interfaces:
  - PluginState
    Properties:
      - pluginId: string
      - status: PluginStatus
      - version: string
      - installedAt: Date
      - activatedAt: Date | null
      - deactivatedAt: Date | null
      - source: PluginSource
      - marketplaceVersion: string | null
      - displayName: string | null
      - description: string | null

Type-aliases:
  - PluginStatus
  - PluginSource

Functions:
  - L15: function toPluginStatus(value: string): PluginStatus
  - L20: function toPluginSource(value: string | undefined | null): PluginSource

Exports:
  - export type PluginStatus = "active" | "inactive";
  - export type PluginSource = "config" | "marketplace";
  - export interface PluginState {
  - export class PluginStateRepository {
---


File: /Users/masonjames/Projects/emdash/packages/plugins/forms/src/schemas.ts
Imports:
  - import { z } from "astro/zod";
---

Type-aliases:
  - DefinitionInput
  - FormCreateInput
  - FormUpdateInput
  - FormDeleteInput
  - FormDuplicateInput
  - SubmitInput
  - SubmissionsListInput
  - SubmissionGetInput
  - SubmissionUpdateInput
  - SubmissionDeleteInput
  - ExportInput

Functions:
  - L18: const fieldOptionSchema = z.object({ label: z.string().min(1), value: z.string().min(1), })
  - L44: export const fieldTypeSchema = z.enum([ "text", "email", "textarea", "number", "tel", "url", "date", "select", "radio", "checkbox", "checkbox-group", "file", "hidden", ])
  - L60: const formFieldSchema = z.object({ id: z.string().min(1), type: fieldTypeSchema, label: z.string().min(1), name: z .string() .min(1) .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Invalid field name"), placeholder: z.string().optional(), helpText: z.string().optional(), required: z.boolean(), validation: fieldValidationSchema, options: z.array(fieldOptionSchema).optional(), defaultValue: z.string().optional(), width: z.enum(["full", "half"]).default("full"), condition: fieldConditionSchema, })
  - L78: const formPageSchema = z.object({ title: z.string().optional(), fields: z.array(formFieldSchema).min(1, "Each page must have at least one field"), })
  - L92: const formSettingsSchema = z.object({ confirmationMessage: z.string().min(1).default("Thank you for your submission."), redirectUrl: httpUrl.optional().or(z.literal("")), notifyEmails: z.array(z.string().email()).default([]), digestEnabled: z.boolean().default(false), digestHour: z.number().int().min(0).max(23).default(9), autoresponder: autoresponderSchema, webhookUrl: httpUrl.optional().or(z.literal("")), retentionDays: z.number().int().min(0).default(0), spamProtection: z.enum(["none", "honeypot", "turnstile"]).default("honeypot"), submitLabel: z.string().min(1).default("Submit"), nextLabel: z.string().optional(), prevLabel: z.string().optional(), })
  - L109: export const formCreateSchema = z.object({ name: z.string().min(1).max(200), slug: z .string() .min(1) .max(100) .regex(/^[a-z][a-z0-9-]*$/, "Slug must be lowercase alphanumeric with hyphens"), pages: z.array(formPageSchema).min(1), settings: formSettingsSchema, })
  - L120: export const formUpdateSchema = z.object({ id: z.string().min(1), name: z.string().min(1).max(200).optional(), slug: z .string() .min(1) .max(100) .regex(/^[a-z][a-z0-9-]*$/) .optional(), pages: z.array(formPageSchema).min(1).optional(), settings: formSettingsSchema.partial().optional(), status: z.enum(["active", "paused"]).optional(), })
  - L134: export const formDeleteSchema = z.object({ id: z.string().min(1), deleteSubmissions: z.boolean().default(true), })
  - L139: export const formDuplicateSchema = z.object({ id: z.string().min(1), name: z.string().min(1).max(200).optional(), slug: z .string() .min(1) .max(100) .regex(/^[a-z][a-z0-9-]*$/) .optional(), })
  - L150: export const definitionSchema = z.object({ id: z.string().min(1), })
  - L158: export const submitSchema = z.object({ formId: z.string().min(1), data: z.record(z.string(), z.unknown()), files: z .record( z.string(), z.object({ filename: z.string(), contentType: z.string(), bytes: z.custom<ArrayBuffer>(), }), ) .optional(), })
  - L173: export const submissionsListSchema = z.object({ formId: z.string().min(1), status: z.enum(["new", "read", "archived"]).optional(), starred: z.boolean().optional(), cursor: z.string().optional(), limit: z.number().int().min(1).max(100).default(50), })
  - L181: export const submissionGetSchema = z.object({ id: z.string().min(1), })
  - L185: export const submissionUpdateSchema = z.object({ id: z.string().min(1), status: z.enum(["new", "read", "archived"]).optional(), starred: z.boolean().optional(), notes: z.string().optional(), })
  - L192: export const submissionDeleteSchema = z.object({ id: z.string().min(1), })
  - L196: export const exportSchema = z.object({ formId: z.string().min(1), format: z.enum(["csv", "json"]).default("csv"), status: z.enum(["new", "read", "archived"]).optional(), from: z.string().datetime().optional(), to: z.string().datetime().optional(), })

Global vars:
  - HTTP_SCHEME_RE
  - httpUrl
  - fieldValidationSchema
  - fieldConditionSchema
  - autoresponderSchema

Exports:
  - export const fieldTypeSchema = z.enum([
  - export const formCreateSchema = z.object({
  - export const formUpdateSchema = z.object({
  - export const formDeleteSchema = z.object({
  - export const formDuplicateSchema = z.object({
  - export const definitionSchema = z.object({
  - export type DefinitionInput = z.infer<typeof definitionSchema>;
  - export const submitSchema = z.object({
  - export const submissionsListSchema = z.object({
  - export const submissionGetSchema = z.object({
  - export const submissionUpdateSchema = z.object({
  - export const submissionDeleteSchema = z.object({
  - export const exportSchema = z.object({
  - export type FormCreateInput = z.infer<typeof formCreateSchema>;
  - export type FormUpdateInput = z.infer<typeof formUpdateSchema>;
  - export type FormDeleteInput = z.infer<typeof formDeleteSchema>;
  - export type FormDuplicateInput = z.infer<typeof formDuplicateSchema>;
  - export type SubmitInput = z.infer<typeof submitSchema>;
  - export type SubmissionsListInput = z.infer<typeof submissionsListSchema>;
  - export type SubmissionGetInput = z.infer<typeof submissionGetSchema>;
  - export type SubmissionUpdateInput = z.infer<typeof submissionUpdateSchema>;
  - export type SubmissionDeleteInput = z.infer<typeof submissionDeleteSchema>;
  - export type ExportInput = z.infer<typeof exportSchema>;
---


File: /Users/masonjames/Projects/emdash/packages/admin/src/lib/api/content.ts
Imports:
  - import type { BylineCreditInput, BylineSummary } from "./bylines.js";
  - import {
	API_BASE,
	apiFetch,
	parseApiResponse,
	throwResponseError,
	type FindManyResult,
} from "./client.js";
---

Interfaces:
  - ContentSeo
    Properties:
      - title: string | null
      - description: string | null
      - image: string | null
      - canonical: string | null
      - noIndex: boolean
  - ContentItem
    Properties:
      - id: string
      - type: string
      - slug: string | null
      - status: string
      - locale: string
      - translationGroup: string | null
      - data: Record<string, unknown>
      - authorId: string | null
      - primaryBylineId: string | null
      - byline?: BylineSummary | null
      - bylines?: Array<{
      - createdAt: string
      - updatedAt: string
      - publishedAt: string | null
      - scheduledAt: string | null
      - liveRevisionId: string | null
      - draftRevisionId: string | null
      - seo?: ContentSeo
  - CreateContentInput
    Properties:
      - type: string
      - slug?: string
      - data: Record<string, unknown>
      - status?: string
      - bylines?: BylineCreditInput[]
      - locale?: string
      - translationOf?: string
  - TranslationSummary
    Properties:
      - id: string
      - locale: string
      - slug: string | null
      - status: string
      - updatedAt: string
  - TranslationsResponse
    Properties:
      - translationGroup: string
      - translations: TranslationSummary[]
  - ContentSeoInput
    Properties:
      - title?: string | null
      - description?: string | null
      - image?: string | null
      - canonical?: string | null
      - noIndex?: boolean
  - UpdateContentInput
    Properties:
      - data?: Record<string, unknown>
      - slug?: string
      - status?: string
      - authorId?: string | null
      - bylines?: BylineCreditInput[]
      - skipRevision?: boolean
      - seo?: ContentSeoInput
  - TrashedContentItem
    Properties:
      - deletedAt: string
  - PreviewUrlResponse
    Properties:
      - url: string
      - expiresAt: number
  - Revision
    Properties:
      - id: string
      - collection: string
      - entryId: string
      - data: Record<string, unknown>
      - authorId: string | null
      - createdAt: string
  - RevisionListResponse
    Properties:
      - items: Revision[]
      - total: number

Functions:
  - L17: export function getDraftStatus( item: ContentItem, ): "unpublished" | "published" | "published_with_changes"
  - L86: export async function fetchTranslations( collection: string, id: string, ): Promise<TranslationsResponse>
  - L132: export async function fetchContentList( collection: string, options?: { cursor?: string; limit?: number; status?: string; locale?: string; }, ): Promise<FindManyResult<ContentItem>>
  - L155: export async function fetchContent(collection: string, id: string): Promise<ContentItem>
  - L164: export async function createContent( collection: string, input: Omit<CreateContentInput, "type">, ): Promise<ContentItem>
  - L187: export async function updateContent( collection: string, id: string, input: UpdateContentInput, ): Promise<ContentItem>
  - L204: export async function deleteContent(collection: string, id: string): Promise<void>
  - L214: export async function fetchTrashedContent( collection: string, options?: { cursor?: string; limit?: number; }, ): Promise<FindManyResult<TrashedContentItem>>
  - L236: export async function restoreContent(collection: string, id: string): Promise<void>
  - L246: export async function permanentDeleteContent(collection: string, id: string): Promise<void>
  - L256: export async function duplicateContent(collection: string, id: string): Promise<ContentItem>
  - L270: export async function scheduleContent( collection: string, id: string, scheduledAt: string, ): Promise<ContentItem>
  - L290: export async function unscheduleContent(collection: string, id: string): Promise<ContentItem>
  - L307: export async function getPreviewUrl( collection: string, id: string, options?: { expiresIn?: string; pathPattern?: string; }, ): Promise<PreviewUrlResponse | null>
  - L354: export async function publishContent(collection: string, id: string): Promise<ContentItem>
  - L365: export async function unpublishContent(collection: string, id: string): Promise<ContentItem>
  - L379: export async function discardDraft(collection: string, id: string): Promise<ContentItem>
  - L390: export async function compareRevisions( collection: string, id: string, ): Promise<{ hasChanges: boolean; live: Record<string, unknown> | null; draft: Record<string, unknown> | null; }>
  - L427: export async function fetchRevisions( collection: string, entryId: string, options?: { limit?: number }, ): Promise<RevisionListResponse>
  - L443: export async function fetchRevision(revisionId: string): Promise<Revision>
  - L460: export async function restoreRevision(revisionId: string): Promise<ContentItem>

Exports:
  - export function getDraftStatus(
  - export interface ContentSeo {
  - export interface ContentItem {
  - export interface CreateContentInput {
  - export interface TranslationSummary {
  - export interface TranslationsResponse {
  - export async function fetchTranslations(
  - export interface ContentSeoInput {
  - export interface UpdateContentInput {
  - export interface TrashedContentItem extends ContentItem {
  - export interface PreviewUrlResponse {
  - export async function fetchContentList(
  - export async function fetchContent(collection: string, id: string): Promise<ContentItem> {
  - export async function createContent(
  - export async function updateContent(
  - export async function deleteContent(collection: string, id: string): Promise<void> {
  - export async function fetchTrashedContent(
  - export async function restoreContent(collection: string, id: string): Promise<void> {
  - export async function permanentDeleteContent(collection: string, id: string): Promise<void> {
  - export async function duplicateContent(collection: string, id: string): Promise<ContentItem> {
  - export async function scheduleContent(
  - export async function unscheduleContent(collection: string, id: string): Promise<ContentItem> {
  - export async function getPreviewUrl(
  - export async function publishContent(collection: string, id: string): Promise<ContentItem> {
  - export async function unpublishContent(collection: string, id: string): Promise<ContentItem> {
  - export async function discardDraft(collection: string, id: string): Promise<ContentItem> {
  - export async function compareRevisions(
  - export interface Revision {
  - export interface RevisionListResponse {
  - export async function fetchRevisions(
  - export async function fetchRevision(revisionId: string): Promise<Revision> {
  - export async function restoreRevision(revisionId: string): Promise<ContentItem> {
---


File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/email.ts
Imports:
  - import { AsyncLocalStorage } from "node:async_hooks";
  - import type { HookPipeline } from "./hooks.js";
  - import type { EmailDeliverEvent, EmailMessage } from "./types.js";
---
Classes:
  - EmailNotConfiguredError
    Methods:
      - L31: constructor()
  - EmailRecursionError
    Methods:
      - L44: constructor()
  - EmailPipeline
    Methods:
      - L75: constructor(pipeline: HookPipeline)
      - L86: setPipeline(pipeline: HookPipeline): void
      - L99: async send(message: EmailMessage, source: string): Promise<void>
      - L127: private async sendInner(message: EmailMessage, source: string): Promise<void>
      - L206: isAvailable(): boolean
    Properties:
      - private pipeline: HookPipeline

Global vars:
  - EMAIL_DELIVER_HOOK
  - SYSTEM_SOURCE
  - emailSendALS

Exports:
  - export class EmailNotConfiguredError extends Error {
  - export class EmailRecursionError extends Error {
  - export class EmailPipeline {
---


File: /Users/masonjames/Projects/emdash/packages/plugins/forms/src/types.ts
Imports:
---

Interfaces:
  - FormDefinition
    Properties:
      - name: string
      - slug: string
      - pages: FormPage[]
      - settings: FormSettings
      - status: "active" | "paused"
      - submissionCount: number
      - lastSubmissionAt: string | null
      - createdAt: string
      - updatedAt: string
  - FormPage
    Properties:
      - title?: string
      - fields: FormField[]
  - FormSettings
    Properties:
      - confirmationMessage: string
      - redirectUrl?: string
      - notifyEmails: string[]
      - digestEnabled: boolean
      - digestHour: number
      - autoresponder?: {
      - webhookUrl?: string
      - retentionDays: number
      - spamProtection: "none" | "honeypot" | "turnstile"
      - submitLabel: string
      - nextLabel?: string
      - prevLabel?: string
  - FormField
    Properties:
      - id: string
      - type: FieldType
      - label: string
      - name: string
      - placeholder?: string
      - helpText?: string
      - required: boolean
      - validation?: FieldValidation
      - options?: FieldOption[]
      - defaultValue?: string
      - width: "full" | "half"
      - condition?: FieldCondition
  - FieldValidation
    Properties:
      - minLength?: number
      - maxLength?: number
      - min?: number
      - max?: number
      - pattern?: string
      - patternMessage?: string
      - accept?: string
      - maxFileSize?: number
  - FieldOption
    Properties:
      - label: string
      - value: string
  - FieldCondition
    Properties:
      - field: string
      - op: "eq" | "neq" | "filled" | "empty"
      - value?: string
  - Submission
    Properties:
      - formId: string
      - data: Record<string, unknown>
      - files?: SubmissionFile[]
      - status: "new" | "read" | "archived"
      - starred: boolean
      - notes?: string
      - createdAt: string
      - meta: SubmissionMeta
  - SubmissionFile
    Properties:
      - fieldName: string
      - filename: string
      - contentType: string
      - size: number
      - mediaId: string
  - SubmissionMeta
    Properties:
      - ip: string | null
      - userAgent: string | null
      - referer: string | null
      - country: string | null

Type-aliases:
  - FieldType

Functions:
  - L152: export function getFormFields(form: FormDefinition): FormField[]
  - L157: export function isMultiPage(form: FormDefinition): boolean
  - L162: export function hasFileFields(form: FormDefinition): boolean

Exports:
  - export interface FormDefinition {
  - export interface FormPage {
  - export interface FormSettings {
  - export interface FormField {
  - export type FieldType =
  - export interface FieldValidation {
  - export interface FieldOption {
  - export interface FieldCondition {
  - export interface Submission {
  - export interface SubmissionFile {
  - export interface SubmissionMeta {
  - export function getFormFields(form: FormDefinition): FormField[] {
  - export function isMultiPage(form: FormDefinition): boolean {
  - export function hasFileFields(form: FormDefinition): boolean {
---


File: /Users/masonjames/Projects/emdash/packages/plugins/ai-moderation/src/admin.tsx
Imports:
  - import { Switch } from "@cloudflare/kumo";
  - import {
	ShieldCheck,
	CheckCircle,
	WarningCircle,
	FloppyDisk,
	CircleNotch,
	Trash,
	PencilSimple,
	Plus,
	TestTube,
	X,
} from "@phosphor-icons/react";
  - import type { PluginAdminExports } from "emdash";
  - import { apiFetch, isRecord, parseApiResponse } from "emdash/plugin-utils";
  - import * as React from "react";
  - import type { Category } from "./categories.js";
---

Interfaces:
  - PluginStatus
    Properties:
      - enabled: boolean
      - categoryCount: number
      - autoApproveClean: boolean
  - CategoryDialogProps
    Properties:
      - category: Category | null
      - onSave: (category: Category) => void
      - onClose: () => void

Functions:
  - L38: function StatusWidget()
  - L109: function CategoryDialog({ category, onSave, onClose }: CategoryDialogProps)
  - L217: function SettingsPage()

Global vars:
  - API_BASE
  - widgets: PluginAdminExports["widgets"]
  - pages: PluginAdminExports["pages"]

Exports:
  - export const widgets: PluginAdminExports["widgets"] = {
  - export const pages: PluginAdminExports["pages"] = {
---


File: /Users/masonjames/Projects/emdash/packages/core/src/api/types.ts
Imports:
  - import type { ContentItem } from "../database/repositories/types.js";
---

Interfaces:
  - ListResponse
    Properties:
      - items: T[]
      - nextCursor?: string
  - ContentResponse
    Properties:
      - item: ContentItem
      - _rev?: string
  - ManifestResponse
    Properties:
      - version: string
      - hash: string
      - collections: Record<
      - plugins: Record<
  - FieldDescriptor
    Properties:
      - kind: string
      - label?: string
      - required?: boolean
      - options?: Array<{ value: string; label: string }>
  - ApiContext
    Properties:
      - userId?: string
      - userRole?: string

Type-aliases:
  - ApiResult

Exports:
  - export interface ListResponse<T> {
  - export interface ContentListResponse extends ListResponse<ContentItem> {}
  - export interface ContentResponse {
  - export interface ManifestResponse {
  - export interface FieldDescriptor {
  - export type ApiResult<T, E extends string = string> =
  - export interface ApiContext {
---


File: /Users/masonjames/Projects/emdash/packages/admin/src/components/DeviceAuthorizePage.tsx
Imports:
  - import { Button, Input } from "@cloudflare/kumo";
  - import { useQuery } from "@tanstack/react-query";
  - import * as React from "react";
  - import { apiFetch, API_BASE, parseApiResponse } from "../lib/api";
---

Interfaces:
  - UserInfo
    Properties:
      - id: string
      - email: string
      - name: string | null
      - role: number

Type-aliases:
  - PageState

Functions:
  - L52: export function DeviceAuthorizePage()
  - L288: function PageWrapper({ children }: { children: React.ReactNode })
  - L300: function TerminalIcon({ className }: { className?: string })
  - L317: function CheckIcon({ className }: { className?: string })

Global vars:
  - ROLE_NAMES: Record<number, string>
  - DEVICE_CODE_INVALID_CHARS_REGEX
  - DEVICE_CODE_HYPHEN_REGEX

Exports:
  - export function DeviceAuthorizePage() {
---


File: /Users/masonjames/Projects/emdash/packages/core/src/media/types.ts
Imports:
---

Interfaces:
  - MediaProviderDescriptor
    Properties:
      - id: string
      - name: string
      - icon?: string
      - entrypoint: string
      - adminModule?: string
      - capabilities: MediaProviderCapabilities
      - config: TConfig
  - MediaProviderCapabilities
    Properties:
      - browse: boolean
      - search: boolean
      - upload: boolean
      - delete: boolean
  - MediaListOptions
    Properties:
      - cursor?: string
      - limit?: number
      - query?: string
      - mimeType?: string
  - MediaListResult
    Properties:
      - items: MediaProviderItem[]
      - nextCursor?: string
  - MediaProviderItem
    Properties:
      - id: string
      - filename: string
      - mimeType: string
      - size?: number
      - width?: number
      - height?: number
      - alt?: string
      - previewUrl?: string
      - meta?: Record<string, unknown>
  - MediaUploadInput
    Properties:
      - file: File
      - filename: string
      - alt?: string
  - EmbedOptions
    Properties:
      - width?: number
      - height?: number
      - format?: "webp" | "avif" | "jpeg" | "png" | "auto"
  - ImageEmbed
    Properties:
      - type: "image"
      - src: string
      - srcset?: string
      - sizes?: string
      - width?: number
      - height?: number
      - alt?: string
      - cdnBaseUrl?: string
      - getSrc?: (opts: { width?: number; height?: number; format?: string }) => string
  - VideoEmbed
    Properties:
      - type: "video"
      - src?: string
      - sources?: Array<{ src: string; type: string }>
      - poster?: string
      - width?: number
      - height?: number
      - controls?: boolean
      - autoplay?: boolean
      - muted?: boolean
      - loop?: boolean
      - playsinline?: boolean
      - preload?: "none" | "metadata" | "auto"
      - crossorigin?: "anonymous" | "use-credentials"
  - AudioEmbed
    Properties:
      - type: "audio"
      - src?: string
      - sources?: Array<{ src: string; type: string }>
      - controls?: boolean
      - autoplay?: boolean
      - muted?: boolean
      - loop?: boolean
      - preload?: "none" | "metadata" | "auto"
  - ComponentEmbed
    Properties:
      - type: "component"
      - package: string
      - export?: string
      - props: Record<string, unknown>
  - ThumbnailOptions
    Properties:
      - width?: number
      - height?: number
  - MediaProvider
    Methods:
      - L195: list(options: MediaListOptions): Promise<MediaListResult>
      - L200: get?(id: string): Promise<MediaProviderItem | null>
      - L205: upload?(input: MediaUploadInput): Promise<MediaProviderItem>
      - L210: delete?(id: string): Promise<void>
      - L216: getEmbed(value: MediaValue, options?: EmbedOptions): Promise<EmbedResult> | EmbedResult
      - L223: getThumbnailUrl?(id: string, mimeType?: string, options?: ThumbnailOptions): string
  - MediaValue
    Properties:
      - provider?: string
      - id: string
      - src?: string
      - previewUrl?: string
      - filename?: string
      - mimeType?: string
      - width?: number
      - height?: number
      - alt?: string
      - meta?: Record<string, unknown>

Type-aliases:
  - EmbedResult
  - CreateMediaProviderFn

Functions:
  - L268: export function mediaItemToValue(providerId: string, item: MediaProviderItem): MediaValue

Exports:
  - export interface MediaProviderDescriptor<TConfig = Record<string, unknown>> {
  - export interface MediaProviderCapabilities {
  - export interface MediaListOptions {
  - export interface MediaListResult {
  - export interface MediaProviderItem {
  - export interface MediaUploadInput {
  - export interface EmbedOptions {
  - export type EmbedResult = ImageEmbed | VideoEmbed | AudioEmbed | ComponentEmbed;
  - export interface ImageEmbed {
  - export interface VideoEmbed {
  - export interface AudioEmbed {
  - export interface ComponentEmbed {
  - export interface ThumbnailOptions {
  - export interface MediaProvider {
  - export type CreateMediaProviderFn<TConfig = Record<string, unknown>> = (
  - export interface MediaValue {
  - export function mediaItemToValue(providerId: string, item: MediaProviderItem): MediaValue {
---


File: /Users/masonjames/Projects/emdash/packages/core/src/database/repositories/options.ts
Imports:
  - import type { Kysely } from "kysely";
  - import type { Database, OptionTable } from "../types.js";
---
Classes:
  - OptionsRepository
    Methods:
      - L12: constructor(private db: Kysely<Database>)
      - L17: async get<T = unknown>(name: string): Promise<T | null>
      - L32: async getOrDefault<T>(name: string, defaultValue: T): Promise<T>
      - L40: async set<T = unknown>(name: string, value: T): Promise<void>
      - L57: async delete(name: string): Promise<boolean>
      - L66: async exists(name: string): Promise<boolean>
      - L79: async getMany<T = unknown>(names: string[]): Promise<Map<string, T>>
      - L99: async setMany<T = unknown>(options: Record<string, T>): Promise<void>
      - L111: async getAll(): Promise<Map<string, unknown>>
      - L124: async getByPrefix<T = unknown>(prefix: string): Promise<Map<string, T>>
      - L142: async deleteByPrefix(prefix: string): Promise<number>

Exports:
  - export class OptionsRepository {
---

</file_map>
<file_contents>
File: /Users/masonjames/Projects/emdash/skills/wordpress-plugin-to-emdash/SKILL.md
```md
---
name: wordpress-plugin-to-emdash
description: Port a WordPress plugin to EmDash CMS. Use this skill when asked to migrate, convert, or port a WordPress plugin, theme functionality, or custom post type to EmDash. Provides concept mapping and implementation patterns.
---

# Porting WordPress Plugins to EmDash

This skill maps WordPress concepts to their EmDash equivalents for plugin porting. For general plugin authoring details (plugin structure, `definePlugin()`, hooks, storage, admin UI, etc.), use the **creating-plugins** skill.

## Migration Approach

1. **Understand the plugin** — What does it do, not how
2. **Identify concepts** — Content types, admin pages, hooks, shortcodes
3. **Map to EmDash** — Use the tables below
4. **Implement in TypeScript** — Clean room, not line-by-line port. Use the **creating-plugins** skill for implementation details.
5. **Test behaviour** — Same result, different implementation

## Concept Mapping

### Content & Data

| WordPress               | EmDash                                    | Notes                                         |
| ----------------------- | ----------------------------------------- | --------------------------------------------- |
| `register_post_type()`  | `SchemaRegistry.createCollection()`       | Via Admin API or seed file                    |
| `register_taxonomy()`   | `_emdash_taxonomy_defs` table             | Hierarchical or flat, attached to collections |
| `register_meta()` / ACF | Collection fields via SchemaRegistry      | All become typed schema fields                |
| `get_post_meta()`       | `entry.data.fieldName`                    | Direct typed access                           |
| `get_option()`          | `getSiteSetting()` / `ctx.kv`             | Site settings or plugin-namespaced KV         |
| `WP_Query`              | `getEmDashCollection()`                   | Runtime queries with filters                  |
| `get_post($id)`         | `getEmDashEntry(collection, slug)`        | Returns entry or null                         |
| `wp_insert_post()`      | `POST /_emdash/api/content/{type}`        | REST API                                      |
| `wp_update_post()`      | `PUT /_emdash/api/content/{type}/{id}`    | REST API                                      |
| `wp_delete_post()`      | `DELETE /_emdash/api/content/{type}/{id}` | Soft delete                                   |
| Custom tables           | Plugin storage collections                | `ctx.storage.collectionName.put/get/query`    |

### Site Configuration

| WordPress                | EmDash                      | Notes                                    |
| ------------------------ | --------------------------- | ---------------------------------------- |
| `get_bloginfo('name')`   | `getSiteSetting('title')`   | From `options` table with `site:` prefix |
| `get_option('blogdesc')` | `getSiteSetting('tagline')` | Site settings API                        |
| Theme Customizer         | Site Settings admin page    | `/_emdash/admin/settings`                |
| `site_icon`              | `getSiteSetting('favicon')` | Media reference                          |
| `custom_logo`            | `getSiteSetting('logo')`    | Media reference                          |

### Navigation Menus

| WordPress              | EmDash                                  | Notes                               |
| ---------------------- | --------------------------------------- | ----------------------------------- |
| `register_nav_menu()`  | Create menu via admin or seed           | `_emdash_menus` table               |
| `wp_nav_menu()`        | `getMenu(name)`                         | Returns `{ items: MenuItem[] }`     |
| `wp_nav_menu_item`     | `_emdash_menu_items` table              | Type: custom, page, post, taxonomy  |
| `_menu_item_object_id` | `reference_id` + `reference_collection` | Links to content entries            |
| Menu locations         | Query by name in templates              | No locations concept — direct query |

### Taxonomies

| WordPress             | EmDash                                  | Notes                          |
| --------------------- | --------------------------------------- | ------------------------------ |
| `register_taxonomy()` | `_emdash_taxonomy_defs` table           | Define via admin, seed, or API |
| `get_terms()`         | `getTaxonomyTerms(name)`                | Returns tree for hierarchical  |
| `get_the_terms()`     | `getEntryTerms(collection, id, name)`   | Terms for specific entry       |
| `wp_set_post_terms()` | `TaxonomyRepository.setTermsForEntry()` | Replace terms for entry        |
| Hierarchical taxonomy | `hierarchical: true` in definition      | Categories-style               |
| Flat taxonomy         | `hierarchical: false`                   | Tags-style                     |

### Widgets & Sidebars

| WordPress            | EmDash                                 | Notes                           |
| -------------------- | -------------------------------------- | ------------------------------- |
| `register_sidebar()` | `_emdash_widget_areas` table           | Create via admin or seed        |
| `dynamic_sidebar()`  | `getWidgetArea(name)`                  | Returns `{ widgets: Widget[] }` |
| `WP_Widget` class    | Widget types: content, menu, component | Simplified — 3 types only       |
| Text widget          | `type: 'content'` + Portable Text      | Rich text widget                |
| Nav Menu widget      | `type: 'menu'` + `menuName`            | References a menu               |
| Custom widgets       | `type: 'component'` + `componentId`    | Plugin-registered components    |

### Admin UI

| WordPress                | EmDash                            | Notes                                    |
| ------------------------ | --------------------------------- | ---------------------------------------- |
| `add_menu_page()`        | `admin.pages` in `definePlugin()` | Plugin config                            |
| `add_submenu_page()`     | Nested admin pages                | Parent determines hierarchy              |
| `add_settings_section()` | `admin.settingsSchema`            | Auto-generated settings page             |
| `add_meta_box()`         | Field groups in collection schema | UI config in schema                      |
| `wp_enqueue_script()`    | ESM imports in admin components   | React (trusted) or Block Kit (sandboxed) |
| Admin notices            | Toast notifications               | Via admin UI framework                   |

### Hooks

| WordPress                          | EmDash                                  | Notes                                                 |
| ---------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `add_action('init')`               | `plugin:install` hook                   | Runs once on first install                            |
| `add_action('save_post')`          | `content:afterSave` hook                | Filter by `event.collection`                          |
| `add_action('before_delete_post')` | `content:beforeDelete` hook             | Return false to prevent                               |
| `add_action('wp_head')`            | `page:metadata` / `page:fragments` hook | Metadata is sandbox-safe; scripts need trusted plugin |
| `add_action('rest_api_init')`      | `definePlugin({ routes })`              | Trusted only                                          |
| `add_filter('the_content')`        | Portable Text components                | Custom block renderers                                |
| `add_filter('the_title')`          | Template logic                          | Handle in Astro component                             |

### Frontend Output

| WordPress               | EmDash                       | Notes                                                |
| ----------------------- | ---------------------------- | ---------------------------------------------------- |
| `add_shortcode()`       | Portable Text custom block   | Content → block. Template → component. Trusted only. |
| `register_block_type()` | PT block + `componentsEntry` | Block data → Astro component props. Trusted only.    |
| Template tags           | Astro expressions            | `get_the_title()` → `{post.data.title}`              |
| Widgets                 | Widget area + components     | Query with `getWidgetArea()`                         |

### Plugin Storage

| WordPress                | EmDash                   | Notes                              |
| ------------------------ | ------------------------ | ---------------------------------- |
| `get_option('plugin_*')` | `ctx.kv.get(key)`        | Namespaced to plugin automatically |
| `update_option()`        | `ctx.kv.set(key, value)` | Scoped KV storage                  |
| `delete_option()`        | `ctx.kv.delete(key)`     | Delete single key                  |
| Custom tables            | `ctx.storage.collection` | Document collections with indexes  |
| Transients               | Plugin KV                | No TTL yet                         |

## Porting-Specific Patterns

These patterns cover WordPress-specific concepts that don't have a direct 1:1 mapping. For general plugin patterns (defining hooks, storage, routes, admin UI), see the **creating-plugins** skill.

### Shortcodes → Portable Text Blocks

WordPress shortcodes (`[youtube id="xxx"]`) become Portable Text custom block types. The block data replaces shortcode attributes, and an Astro component replaces the shortcode render function. This is a trusted-only feature.

```typescript
// WordPress
add_shortcode('youtube', function($atts) {
    return '<iframe src="https://youtube.com/embed/' . $atts['id'] . '"></iframe>';
});

// EmDash — block type declaration in definePlugin()
admin: {
	portableTextBlocks: [{
		type: "youtube",
		label: "YouTube Video",
		icon: "video",
		fields: [
			{ type: "text_input", action_id: "id", label: "YouTube URL" },
			{ type: "text_input", action_id: "title", label: "Title" },
		],
	}],
}

// EmDash — Astro component for rendering
// src/astro/YouTube.astro
const { id, title } = Astro.props.node;
const videoId = id?.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] ?? id;
// <iframe src={`https://youtube-nocookie.com/embed/${videoId}`} ... />
```

### Options API → Plugin KV

WordPress's `get_option`/`update_option` maps to the plugin KV store. The key difference: WordPress options are global, EmDash KV is automatically scoped to the plugin.

```typescript
// WordPress
$count = get_option("myplugin_post_count", 0);
update_option("myplugin_post_count", $count + 1);
delete_option("myplugin_temp_data");

// EmDash — no prefix needed, automatically scoped
const count = (await ctx.kv.get<number>("post-count")) ?? 0;
await ctx.kv.set("post-count", count + 1);
await ctx.kv.delete("temp-data");
```

### Custom Database Tables → Storage Collections

WordPress plugins that create custom tables with `$wpdb->query("CREATE TABLE ...")` should use EmDash's storage collections instead. No migrations needed — declare the schema in `definePlugin()` and it's automatically provisioned.

```typescript
// WordPress
$wpdb->insert($table, ['form_id' => $id, 'data' => json_encode($data), 'created_at' => current_time('mysql')]);
$results = $wpdb->get_results("SELECT * FROM $table WHERE form_id = '$id' ORDER BY created_at DESC LIMIT 50");

// EmDash — declared in definePlugin()
storage: {
	submissions: {
		indexes: ["formId", "createdAt", ["formId", "createdAt"]],
	},
},

// In a hook or route handler
await ctx.storage.submissions!.put(entryId, { formId, data, createdAt: new Date().toISOString() });
const result = await ctx.storage.submissions!.query({
	where: { formId },
	orderBy: { createdAt: "desc" },
	limit: 50,
});
```

### Seeding Data (replaces starter content, theme setup)

WordPress plugins that call `wp_insert_term()`, `register_nav_menu()`, or insert default content on activation should use a seed file:

```json
{
	"version": "1",
	"settings": { "title": "My Site", "tagline": "Welcome" },
	"taxonomies": [
		{
			"name": "category",
			"label": "Categories",
			"hierarchical": true,
			"collections": ["posts"],
			"terms": [
				{ "slug": "news", "label": "News" },
				{ "slug": "tutorials", "label": "Tutorials" }
			]
		}
	],
	"menus": [
		{
			"name": "primary",
			"label": "Primary Navigation",
			"items": [
				{ "type": "custom", "label": "Home", "url": "/" },
				{ "type": "page", "ref": "about", "collection": "pages" }
			]
		}
	],
	"redirects": [
		{ "source": "/?p=123", "destination": "/about" },
		{ "source": "/old-contact", "destination": "/contact", "type": 301 }
	]
}
```

```bash
npx emdash seed .emdash/seed.json
```

Use `redirects` for legacy WordPress URLs that still receive traffic after migration.

### Querying Content (replaces WP_Query)

```typescript
// WordPress
$query = new WP_Query(['post_type' => 'post', 'category_name' => 'tech', 'posts_per_page' => 10]);

// EmDash — in Astro component frontmatter
import { getEmDashCollection, getEntryTerms } from "emdash";
const { entries } = await getEmDashCollection("posts", {
	where: { category: "technology" },
	limit: 10,
});
```

### Menus (replaces wp_nav_menu)

```typescript
// WordPress
wp_nav_menu(['theme_location' => 'primary']);

// EmDash — in Astro component
import { getMenu } from "emdash";
const nav = await getMenu("primary");
// nav.items[].label, nav.items[].url, nav.items[].children
```

### Widget Areas (replaces dynamic_sidebar)

```typescript
// WordPress
dynamic_sidebar("sidebar-1");

// EmDash — in Astro component
import { getWidgetArea } from "emdash";
const sidebar = await getWidgetArea("sidebar");
// sidebar.widgets[].type: "content" | "menu" | "component"
```

## Red Flags (Need Human Decision)

Flag these for review — they may need architectural decisions:

1. **Deep WP integration** — Hooks into WP core features not in EmDash
2. **Theme dependencies** — Assumes specific theme structure
3. **Multisite features** — Not supported
4. **Complex WP_Query** — Meta queries may need custom implementation
5. **Direct SQL** — Schema differs, use Kysely or plugin storage
6. **Session/transient abuse** — Needs proper caching layer
7. **User capability checks** — Review role mapping (future)
8. **ob_start() buffering** — PHP pattern, rethink for streaming
9. **Cron jobs** — `wp_schedule_event()` has no direct equivalent; needs platform cron

## Output Format

When porting a plugin, provide:

1. **Analysis** — What the WP plugin does (concepts, not code)
2. **Concept mapping** — Which WP concepts map to which EmDash features
3. **Plugin code** — `src/descriptor.ts` and `src/index.ts` (use **creating-plugins** skill for structure)
4. **Seed data** — If plugin needs default taxonomies/menus/widgets
5. **Astro components** — For frontend output
6. **Flags** — Anything needing human decision

```

File: /Users/masonjames/Projects/emdash/packages/core/src/api/handlers/marketplace.ts
```ts
/**
 * Marketplace plugin handlers
 *
 * Business logic for installing, updating, uninstalling, and checking
 * updates for marketplace plugins. Routes are thin wrappers around these.
 */

import type { Kysely } from "kysely";

import type { Database } from "../../database/types.js";
import { validatePluginIdentifier } from "../../database/validate.js";
import { pluginManifestSchema } from "../../plugins/manifest-schema.js";
import { normalizeManifestRoute } from "../../plugins/manifest-schema.js";
import {
	createMarketplaceClient,
	MarketplaceError,
	MarketplaceUnavailableError,
	type MarketplaceClient,
	type MarketplacePluginDetail,
	type MarketplaceSearchOpts,
	type MarketplaceThemeSearchOpts,
	type MarketplaceVersionSummary,
	type PluginBundle,
} from "../../plugins/marketplace.js";
import type { SandboxRunner } from "../../plugins/sandbox/types.js";
import { PluginStateRepository } from "../../plugins/state.js";
import type { PluginManifest } from "../../plugins/types.js";
import { EmDashStorageError } from "../../storage/types.js";
import type { Storage } from "../../storage/types.js";
import type { ApiResult } from "../types.js";

// ── Types ──────────────────────────────────────────────────────────

export interface MarketplaceInstallResult {
	pluginId: string;
	version: string;
	capabilities: string[];
}

export interface MarketplaceUpdateResult {
	pluginId: string;
	oldVersion: string;
	newVersion: string;
	capabilityChanges: {
		added: string[];
		removed: string[];
	};
	routeVisibilityChanges?: {
		newlyPublic: string[];
	};
}

export interface MarketplaceUpdateCheck {
	pluginId: string;
	installed: string;
	latest: string;
	hasUpdate: boolean;
	hasCapabilityChanges: boolean;
	capabilityChanges?: {
		added: string[];
		removed: string[];
	};
	hasRouteVisibilityChanges: boolean;
	routeVisibilityChanges?: {
		newlyPublic: string[];
	};
}

export interface MarketplaceUninstallResult {
	pluginId: string;
	dataDeleted: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────

/** Semver-like pattern: digits, dots, hyphens, plus signs (e.g. 1.0.0, 1.0.0-beta.1) */
const VERSION_PATTERN = /^[a-z0-9][a-z0-9._+-]*$/i;

function validateVersion(version: string): void {
	if (version.includes("..")) throw new Error("Invalid version format");
	if (!VERSION_PATTERN.test(version)) {
		throw new Error("Invalid version format");
	}
}

function getClient(marketplaceUrl: string | undefined): MarketplaceClient | null {
	if (!marketplaceUrl) return null;
	return createMarketplaceClient(marketplaceUrl);
}

function diffCapabilities(
	oldCaps: string[],
	newCaps: string[],
): { added: string[]; removed: string[] } {
	const oldSet = new Set(oldCaps);
	const newSet = new Set(newCaps);
	return {
		added: newCaps.filter((c) => !oldSet.has(c)),
		removed: oldCaps.filter((c) => !newSet.has(c)),
	};
}

/**
 * Diff route visibility between two manifests.
 * Returns routes that changed from private to public (newly exposed).
 */
function diffRouteVisibility(
	oldManifest: PluginManifest | undefined,
	newManifest: PluginManifest,
): { newlyPublic: string[] } {
	const oldPublicRoutes = new Set<string>();
	if (oldManifest) {
		for (const entry of oldManifest.routes) {
			const normalized = normalizeManifestRoute(entry);
			if (normalized.public === true) {
				oldPublicRoutes.add(normalized.name);
			}
		}
	}

	const newlyPublic: string[] = [];
	for (const entry of newManifest.routes) {
		const normalized = normalizeManifestRoute(entry);
		if (normalized.public === true && !oldPublicRoutes.has(normalized.name)) {
			newlyPublic.push(normalized.name);
		}
	}

	return { newlyPublic };
}

async function resolveVersionMetadata(
	client: MarketplaceClient,
	pluginId: string,
	pluginDetail: MarketplacePluginDetail,
	version: string,
): Promise<MarketplaceVersionSummary | null> {
	if (pluginDetail.latestVersion?.version === version) {
		return {
			version: pluginDetail.latestVersion.version,
			minEmDashVersion: pluginDetail.latestVersion.minEmDashVersion,
			bundleSize: pluginDetail.latestVersion.bundleSize,
			checksum: pluginDetail.latestVersion.checksum,
			changelog: pluginDetail.latestVersion.changelog,
			capabilities: pluginDetail.latestVersion.capabilities,
			status: pluginDetail.latestVersion.status,
			auditVerdict: pluginDetail.latestVersion.audit?.verdict ?? null,
			imageAuditVerdict: pluginDetail.latestVersion.imageAudit?.verdict ?? null,
			publishedAt: pluginDetail.latestVersion.publishedAt,
		};
	}

	const versions = await client.getVersions(pluginId);
	return versions.find((v) => v.version === version) ?? null;
}

function validateBundleIdentity(
	bundle: PluginBundle,
	pluginId: string,
	version: string,
): ApiResult<never> | null {
	if (bundle.manifest.id !== pluginId) {
		return {
			success: false,
			error: {
				code: "MANIFEST_MISMATCH",
				message: `Bundle manifest ID (${bundle.manifest.id}) does not match requested plugin (${pluginId})`,
			},
		};
	}

	if (bundle.manifest.version !== version) {
		return {
			success: false,
			error: {
				code: "MANIFEST_VERSION_MISMATCH",
				message: `Bundle manifest version (${bundle.manifest.version}) does not match requested version (${version})`,
			},
		};
	}

	return null;
}

/** Store a plugin bundle's files in site-local R2 storage */
async function storeBundleInR2(
	storage: Storage,
	pluginId: string,
	version: string,
	bundle: PluginBundle,
): Promise<void> {
	validatePluginIdentifier(pluginId, "plugin ID");
	validateVersion(version);
	const prefix = `marketplace/${pluginId}/${version}`;

	// Store manifest
	await storage.upload({
		key: `${prefix}/manifest.json`,
		body: new TextEncoder().encode(JSON.stringify(bundle.manifest)),
		contentType: "application/json",
	});

	// Store backend code
	await storage.upload({
		key: `${prefix}/backend.js`,
		body: new TextEncoder().encode(bundle.backendCode),
		contentType: "application/javascript",
	});

	// Store admin code if present
	if (bundle.adminCode) {
		await storage.upload({
			key: `${prefix}/admin.js`,
			body: new TextEncoder().encode(bundle.adminCode),
			contentType: "application/javascript",
		});
	}
}

/** Read a ReadableStream to string */
async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
	return new Response(stream).text();
}

/** Load a plugin bundle from site-local R2 storage */
export async function loadBundleFromR2(
	storage: Storage,
	pluginId: string,
	version: string,
): Promise<{ manifest: PluginManifest; backendCode: string; adminCode?: string } | null> {
	validatePluginIdentifier(pluginId, "plugin ID");
	validateVersion(version);
	const prefix = `marketplace/${pluginId}/${version}`;

	try {
		const manifestResult = await storage.download(`${prefix}/manifest.json`);
		const backendResult = await storage.download(`${prefix}/backend.js`);

		const manifestText = await streamToText(manifestResult.body);
		const backendCode = await streamToText(backendResult.body);
		const parsed: unknown = JSON.parse(manifestText);
		const result = pluginManifestSchema.safeParse(parsed);
		if (!result.success) return null;
		// Elements are validated as unknown[] by Zod; cast to PluginManifest
		// for the Element[] type (Block Kit validation happens at render time).
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Zod types elements as unknown[]; Element type validated at render time
		const manifest = result.data as unknown as PluginManifest;

		// Try to load admin code (optional)
		let adminCode: string | undefined;
		try {
			const adminResult = await storage.download(`${prefix}/admin.js`);
			adminCode = await streamToText(adminResult.body);
		} catch {
			// admin.js is optional
		}

		return { manifest, backendCode, adminCode };
	} catch {
		return null;
	}
}

/** Delete a plugin bundle from site-local R2 storage */
async function deleteBundleFromR2(
	storage: Storage,
	pluginId: string,
	version: string,
): Promise<void> {
	validatePluginIdentifier(pluginId, "plugin ID");
	validateVersion(version);
	const prefix = `marketplace/${pluginId}/${version}`;
	const files = ["manifest.json", "backend.js", "admin.js"];

	for (const file of files) {
		try {
			await storage.delete(`${prefix}/${file}`);
		} catch {
			// Ignore missing files
		}
	}
}

// ── Install ────────────────────────────────────────────────────────

export async function handleMarketplaceInstall(
	db: Kysely<Database>,
	storage: Storage | null,
	sandboxRunner: SandboxRunner | null,
	marketplaceUrl: string | undefined,
	pluginId: string,
	opts?: { version?: string; configuredPluginIds?: Set<string> },
): Promise<ApiResult<MarketplaceInstallResult>> {
	const client = getClient(marketplaceUrl);
	if (!client) {
		return {
			success: false,
			error: {
				code: "MARKETPLACE_NOT_CONFIGURED",
				message: "Marketplace is not configured",
			},
		};
	}

	if (!storage) {
		return {
			success: false,
			error: {
				code: "STORAGE_NOT_CONFIGURED",
				message: "Storage is required for marketplace plugin installation",
			},
		};
	}

	if (!sandboxRunner || !sandboxRunner.isAvailable()) {
		return {
			success: false,
			error: {
				code: "SANDBOX_NOT_AVAILABLE",
				message: "Sandbox runner is required for marketplace plugins",
			},
		};
	}

	try {
		// Check if already installed
		const stateRepo = new PluginStateRepository(db);
		const existing = await stateRepo.get(pluginId);
		if (existing && existing.source === "marketplace") {
			return {
				success: false,
				error: {
					code: "ALREADY_INSTALLED",
					message: `Plugin ${pluginId} is already installed`,
				},
			};
		}

		// Block installation if a configured (trusted) plugin with the same ID exists.
		// Without this check, the sandboxed plugin could shadow the trusted plugin's
		// route handlers while auth decisions are made against the trusted plugin's metadata.
		if (opts?.configuredPluginIds?.has(pluginId)) {
			return {
				success: false,
				error: {
					code: "PLUGIN_ID_CONFLICT",
					message: `Cannot install marketplace plugin "${pluginId}" — a configured plugin with the same ID already exists`,
				},
			};
		}

		// Fetch plugin detail from marketplace
		const pluginDetail = await client.getPlugin(pluginId);
		const version = opts?.version ?? pluginDetail.latestVersion?.version;
		if (!version) {
			return {
				success: false,
				error: {
					code: "NO_VERSION",
					message: `No published versions found for plugin ${pluginId}`,
				},
			};
		}

		const versionMetadata = await resolveVersionMetadata(client, pluginId, pluginDetail, version);
		if (!versionMetadata) {
			return {
				success: false,
				error: {
					code: "NO_VERSION",
					message: `Version ${version} was not found for plugin ${pluginId}`,
				},
			};
		}

		// Block installation of plugins that haven't passed audit.
		// Both "fail" (explicitly malicious) and "warn" (audit error or
		// inconclusive) are non-installable — only "pass" or null (no audit
		// ran) are allowed through.
		if (versionMetadata.auditVerdict === "fail" || versionMetadata.auditVerdict === "warn") {
			return {
				success: false,
				error: {
					code: "AUDIT_FAILED",
					message:
						versionMetadata.auditVerdict === "fail"
							? "Plugin failed security audit and cannot be installed"
							: "Plugin audit was inconclusive and cannot be installed until reviewed",
				},
			};
		}

		// Download and extract bundle
		const bundle = await client.downloadBundle(pluginId, version);

		// Verify checksum matches marketplace-published checksum
		if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) {
			return {
				success: false,
				error: {
					code: "CHECKSUM_MISMATCH",
					message: "Bundle checksum does not match marketplace record. Download may be corrupted.",
				},
			};
		}

		const bundleIdentityError = validateBundleIdentity(bundle, pluginId, version);
		if (bundleIdentityError) return bundleIdentityError;

		// Store bundle in site-local R2
		await storeBundleInR2(storage, pluginId, version, bundle);

		// Write plugin state
		await stateRepo.upsert(pluginId, version, "active", {
			source: "marketplace",
			marketplaceVersion: version,
			displayName: pluginDetail.name,
			description: pluginDetail.description ?? undefined,
		});

		// Fire-and-forget install stat
		client.reportInstall(pluginId, version).catch(() => {
			// Intentional: never fails the install
		});
		return {
			success: true,
			data: {
				pluginId,
				version,
				capabilities: bundle.manifest.capabilities,
			},
		};
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) {
			return {
				success: false,
				error: {
					code: "MARKETPLACE_UNAVAILABLE",
					message: "Plugin marketplace is currently unavailable",
				},
			};
		}
		if (err instanceof MarketplaceError) {
			return {
				success: false,
				error: {
					code: err.code ?? "MARKETPLACE_ERROR",
					message: err.message,
				},
			};
		}
		if (err instanceof EmDashStorageError) {
			return {
				success: false,
				error: {
					code: err.code ?? "STORAGE_ERROR",
					message: "Storage error while installing plugin",
				},
			};
		}
		if (err && typeof err === "object" && "code" in err) {
			const code = (err as { code?: unknown }).code;
			if (typeof code === "string" && code.trim()) {
				return {
					success: false,
					error: {
						code,
						message: "Failed to install plugin from marketplace",
					},
				};
			}
		}
		console.error("Failed to install marketplace plugin:", err);
		return {
			success: false,
			error: {
				code: "INSTALL_FAILED",
				message: "Failed to install plugin from marketplace",
			},
		};
	}
}

// ── Update ─────────────────────────────────────────────────────────

export async function handleMarketplaceUpdate(
	db: Kysely<Database>,
	storage: Storage | null,
	sandboxRunner: SandboxRunner | null,
	marketplaceUrl: string | undefined,
	pluginId: string,
	opts?: {
		version?: string;
		confirmCapabilityChanges?: boolean;
		confirmRouteVisibilityChanges?: boolean;
	},
): Promise<ApiResult<MarketplaceUpdateResult>> {
	const client = getClient(marketplaceUrl);
	if (!client) {
		return {
			success: false,
			error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" },
		};
	}
	if (!storage) {
		return {
			success: false,
			error: { code: "STORAGE_NOT_CONFIGURED", message: "Storage is required" },
		};
	}
	if (!sandboxRunner || !sandboxRunner.isAvailable()) {
		return {
			success: false,
			error: { code: "SANDBOX_NOT_AVAILABLE", message: "Sandbox runner is required" },
		};
	}

	try {
		const stateRepo = new PluginStateRepository(db);
		const existing = await stateRepo.get(pluginId);
		if (!existing || existing.source !== "marketplace") {
			return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `No marketplace plugin found: ${pluginId}`,
				},
			};
		}

		const oldVersion = existing.marketplaceVersion ?? existing.version;

		// Get target version
		const pluginDetail = await client.getPlugin(pluginId);
		const newVersion = opts?.version ?? pluginDetail.latestVersion?.version;
		if (!newVersion) {
			return {
				success: false,
				error: { code: "NO_VERSION", message: "No newer version available" },
			};
		}

		if (newVersion === oldVersion) {
			return {
				success: false,
				error: { code: "ALREADY_UP_TO_DATE", message: "Plugin is already up to date" },
			};
		}

		const versionMetadata = await resolveVersionMetadata(
			client,
			pluginId,
			pluginDetail,
			newVersion,
		);
		if (!versionMetadata) {
			return {
				success: false,
				error: {
					code: "NO_VERSION",
					message: `Version ${newVersion} was not found for plugin ${pluginId}`,
				},
			};
		}

		// Download new bundle
		const bundle = await client.downloadBundle(pluginId, newVersion);

		// Verify checksum matches marketplace-published checksum for this version
		if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) {
			return {
				success: false,
				error: {
					code: "CHECKSUM_MISMATCH",
					message: "Bundle checksum does not match marketplace record. Download may be corrupted.",
				},
			};
		}

		const bundleIdentityError = validateBundleIdentity(bundle, pluginId, newVersion);
		if (bundleIdentityError) return bundleIdentityError;

		// Diff capabilities and route visibility against old version
		const oldBundle = await loadBundleFromR2(storage, pluginId, oldVersion);
		const oldCaps = oldBundle?.manifest.capabilities ?? [];
		const capabilityChanges = diffCapabilities(oldCaps, bundle.manifest.capabilities);
		const hasEscalation = capabilityChanges.added.length > 0;

		// If capabilities escalated, require explicit confirmation
		if (hasEscalation && !opts?.confirmCapabilityChanges) {
			return {
				success: false,
				error: {
					code: "CAPABILITY_ESCALATION",
					message: "Plugin update requires new capabilities",
					details: { capabilityChanges },
				},
			};
		}

		// Diff route visibility — routes going from private to public are a
		// security-sensitive change that exposes unauthenticated endpoints.
		const routeVisibilityChanges = diffRouteVisibility(oldBundle?.manifest, bundle.manifest);
		const hasNewPublicRoutes = routeVisibilityChanges.newlyPublic.length > 0;

		if (hasNewPublicRoutes && !opts?.confirmRouteVisibilityChanges) {
			return {
				success: false,
				error: {
					code: "ROUTE_VISIBILITY_ESCALATION",
					message: "Plugin update exposes new public (unauthenticated) routes",
					details: { routeVisibilityChanges, capabilityChanges },
				},
			};
		}

		// Store new bundle
		await storeBundleInR2(storage, pluginId, newVersion, bundle);

		// Update state
		await stateRepo.upsert(pluginId, newVersion, "active", {
			source: "marketplace",
			marketplaceVersion: newVersion,
			displayName: pluginDetail.name,
			description: pluginDetail.description ?? undefined,
		});

		// Clean up old bundle from R2 (best-effort)
		deleteBundleFromR2(storage, pluginId, oldVersion).catch(() => {});

		return {
			success: true,
			data: {
				pluginId,
				oldVersion,
				newVersion,
				capabilityChanges,
				routeVisibilityChanges: hasNewPublicRoutes ? routeVisibilityChanges : undefined,
			},
		};
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) {
			return {
				success: false,
				error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" },
			};
		}
		if (err instanceof MarketplaceError) {
			return {
				success: false,
				error: { code: err.code ?? "MARKETPLACE_ERROR", message: err.message },
			};
		}
		console.error("Failed to update marketplace plugin:", err);
		return {
			success: false,
			error: { code: "UPDATE_FAILED", message: "Failed to update plugin" },
		};
	}
}

// ── Uninstall ──────────────────────────────────────────────────────

export async function handleMarketplaceUninstall(
	db: Kysely<Database>,
	storage: Storage | null,
	pluginId: string,
	opts?: { deleteData?: boolean },
): Promise<ApiResult<MarketplaceUninstallResult>> {
	try {
		const stateRepo = new PluginStateRepository(db);
		const existing = await stateRepo.get(pluginId);
		if (!existing || existing.source !== "marketplace") {
			return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `No marketplace plugin found: ${pluginId}`,
				},
			};
		}

		const version = existing.marketplaceVersion ?? existing.version;

		// Delete bundle from site R2
		if (storage) {
			await deleteBundleFromR2(storage, pluginId, version);
		}

		// Optionally delete plugin storage data
		let dataDeleted = false;
		if (opts?.deleteData) {
			try {
				await db.deleteFrom("_plugin_storage").where("plugin_id", "=", pluginId).execute();
				dataDeleted = true;
			} catch {
				// Plugin storage table may not have data for this plugin
			}
		}

		// Delete state row
		await stateRepo.delete(pluginId);

		return {
			success: true,
			data: { pluginId, dataDeleted },
		};
	} catch (err) {
		console.error("Failed to uninstall marketplace plugin:", err);
		return {
			success: false,
			error: {
				code: "UNINSTALL_FAILED",
				message: "Failed to uninstall plugin",
			},
		};
	}
}

// ── Update check ───────────────────────────────────────────────────

export async function handleMarketplaceUpdateCheck(
	db: Kysely<Database>,
	marketplaceUrl: string | undefined,
): Promise<ApiResult<{ items: MarketplaceUpdateCheck[] }>> {
	const client = getClient(marketplaceUrl);
	if (!client) {
		return {
			success: false,
			error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" },
		};
	}

	try {
		const stateRepo = new PluginStateRepository(db);
		const marketplacePlugins = await stateRepo.getMarketplacePlugins();

		const items: MarketplaceUpdateCheck[] = [];

		for (const plugin of marketplacePlugins) {
			try {
				const detail = await client.getPlugin(plugin.pluginId);
				const latest = detail.latestVersion?.version;
				const installed = plugin.marketplaceVersion ?? plugin.version;

				if (!latest) continue;

				const hasUpdate = latest !== installed;
				let capabilityChanges: { added: string[]; removed: string[] } | undefined;
				let hasCapabilityChanges = false;

				if (hasUpdate && detail.latestVersion) {
					const oldCaps = detail.capabilities ?? [];
					const newCaps = detail.latestVersion.capabilities ?? [];
					capabilityChanges = diffCapabilities(oldCaps, newCaps);
					hasCapabilityChanges =
						capabilityChanges.added.length > 0 || capabilityChanges.removed.length > 0;
				}

				items.push({
					pluginId: plugin.pluginId,
					installed,
					latest: latest ?? installed,
					hasUpdate,
					hasCapabilityChanges,
					capabilityChanges: hasCapabilityChanges ? capabilityChanges : undefined,
					// Route visibility changes require downloading both bundles to compare
					// manifests, which is too expensive for a preview check. The actual
					// enforcement happens at update time in handleMarketplaceUpdate.
					hasRouteVisibilityChanges: false,
				});
			} catch (err) {
				// Skip plugins that can't be checked (marketplace down, plugin delisted)
				console.warn(`Failed to check updates for ${plugin.pluginId}:`, err);
			}
		}

		return { success: true, data: { items } };
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) {
			return {
				success: false,
				error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" },
			};
		}
		console.error("Failed to check marketplace updates:", err);
		return {
			success: false,
			error: { code: "UPDATE_CHECK_FAILED", message: "Failed to check for updates" },
		};
	}
}

// ── Proxy ──────────────────────────────────────────────────────────

export async function handleMarketplaceSearch(
	marketplaceUrl: string | undefined,
	query?: string,
	opts?: MarketplaceSearchOpts,
): Promise<ApiResult<unknown>> {
	const client = getClient(marketplaceUrl);
	if (!client) {
		return {
			success: false,
			error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" },
		};
	}

	try {
		const result = await client.search(query, opts);
		return { success: true, data: result };
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) {
			return {
				success: false,
				error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" },
			};
		}
		console.error("Failed to search marketplace:", err);
		return {
			success: false,
			error: { code: "SEARCH_FAILED", message: "Failed to search marketplace" },
		};
	}
}

export async function handleMarketplaceGetPlugin(
	marketplaceUrl: string | undefined,
	pluginId: string,
): Promise<ApiResult<unknown>> {
	const client = getClient(marketplaceUrl);
	if (!client) {
		return {
			success: false,
			error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" },
		};
	}

	try {
		const result = await client.getPlugin(pluginId);
		return { success: true, data: result };
	} catch (err) {
		if (err instanceof MarketplaceError && err.status === 404) {
			return {
				success: false,
				error: { code: "NOT_FOUND", message: `Plugin not found: ${pluginId}` },
			};
		}
		if (err instanceof MarketplaceUnavailableError) {
			return {
				success: false,
				error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" },
			};
		}
		console.error("Failed to get marketplace plugin:", err);
		return {
			success: false,
			error: { code: "GET_PLUGIN_FAILED", message: "Failed to get plugin details" },
		};
	}
}

// ── Theme proxy handlers ──────────────────────────────────────────

export async function handleThemeSearch(
	marketplaceUrl: string | undefined,
	query?: string,
	opts?: MarketplaceThemeSearchOpts,
): Promise<ApiResult<unknown>> {
	const client = getClient(marketplaceUrl);
	if (!client) {
		return {
			success: false,
			error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" },
		};
	}

	try {
		const result = await client.searchThemes(query, opts);
		return { success: true, data: result };
	} catch (err) {
		if (err instanceof MarketplaceUnavailableError) {
			return {
				success: false,
				error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" },
			};
		}
		console.error("Failed to search themes:", err);
		return {
			success: false,
			error: { code: "THEME_SEARCH_FAILED", message: "Failed to search themes" },
		};
	}
}

export async function handleThemeGetDetail(
	marketplaceUrl: string | undefined,
	themeId: string,
): Promise<ApiResult<unknown>> {
	const client = getClient(marketplaceUrl);
	if (!client) {
		return {
			success: false,
			error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" },
		};
	}

	try {
		const result = await client.getTheme(themeId);
		return { success: true, data: result };
	} catch (err) {
		if (err instanceof MarketplaceError && err.status === 404) {
			return {
				success: false,
				error: { code: "NOT_FOUND", message: `Theme not found: ${themeId}` },
			};
		}
		if (err instanceof MarketplaceUnavailableError) {
			return {
				success: false,
				error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" },
			};
		}
		console.error("Failed to get marketplace theme:", err);
		return {
			success: false,
			error: { code: "GET_THEME_FAILED", message: "Failed to get theme details" },
		};
	}
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/api/handlers/plugins.ts
```ts
/**
 * Plugin management handlers
 */

import type { Kysely } from "kysely";

import type { Database } from "../../database/types.js";
import { PluginStateRepository, type PluginState, type PluginStatus } from "../../plugins/state.js";
import type { ResolvedPlugin } from "../../plugins/types.js";
import type { ApiResult } from "../types.js";

export interface PluginInfo {
	id: string;
	name: string;
	version: string;
	package?: string;
	enabled: boolean;
	status: PluginStatus;
	source?: "config" | "marketplace";
	marketplaceVersion?: string;
	capabilities: string[];
	hasAdminPages: boolean;
	hasDashboardWidgets: boolean;
	hasHooks: boolean;
	installedAt?: string;
	activatedAt?: string;
	deactivatedAt?: string;
	/** Description of what the plugin does */
	description?: string;
	/** URL to the plugin icon on the marketplace */
	iconUrl?: string;
}

export interface PluginListResponse {
	items: PluginInfo[];
}

export interface PluginResponse {
	item: PluginInfo;
}

function marketplaceIconUrl(marketplaceUrl: string, pluginId: string): string {
	return `${marketplaceUrl}/api/v1/plugins/${encodeURIComponent(pluginId)}/icon`;
}

/**
 * Get plugin info from configured plugin and database state
 */
function buildPluginInfo(
	plugin: ResolvedPlugin,
	state: PluginState | null,
	marketplaceUrl?: string,
): PluginInfo {
	// If no state exists, plugin is considered active (default on first run)
	const status = state?.status ?? "active";
	const enabled = status === "active";
	const isMarketplace = (state?.source ?? "config") === "marketplace";

	return {
		id: plugin.id,
		name: state?.displayName || plugin.id,
		version: plugin.version,
		package: undefined, // v2 doesn't have package field
		enabled,
		status,
		source: state?.source ?? "config",
		marketplaceVersion: state?.marketplaceVersion ?? undefined,
		capabilities: plugin.capabilities,
		hasAdminPages: (plugin.admin.pages?.length ?? 0) > 0,
		hasDashboardWidgets: (plugin.admin.widgets?.length ?? 0) > 0,
		hasHooks: Object.keys(plugin.hooks ?? {}).length > 0,
		installedAt: state?.installedAt?.toISOString(),
		activatedAt: state?.activatedAt?.toISOString() ?? undefined,
		deactivatedAt: state?.deactivatedAt?.toISOString() ?? undefined,
		description: state?.description ?? undefined,
		iconUrl:
			isMarketplace && marketplaceUrl ? marketplaceIconUrl(marketplaceUrl, plugin.id) : undefined,
	};
}

/**
 * List all configured plugins with their state
 */
export async function handlePluginList(
	db: Kysely<Database>,
	configuredPlugins: ResolvedPlugin[],
	marketplaceUrl?: string,
): Promise<ApiResult<PluginListResponse>> {
	try {
		const stateRepo = new PluginStateRepository(db);
		const allStates = await stateRepo.getAll();
		const stateMap = new Map(allStates.map((s) => [s.pluginId, s]));

		const configuredIds = new Set(configuredPlugins.map((p) => p.id));

		const items = configuredPlugins.map((plugin) => {
			const state = stateMap.get(plugin.id) ?? null;
			return buildPluginInfo(plugin, state, marketplaceUrl);
		});

		// Include marketplace-installed plugins that aren't in the configured plugins list
		for (const state of allStates) {
			if (state.source !== "marketplace") continue;
			if (configuredIds.has(state.pluginId)) continue;

			items.push({
				id: state.pluginId,
				name: state.displayName || state.pluginId,
				version: state.marketplaceVersion ?? state.version,
				enabled: state.status === "active",
				status: state.status,
				source: "marketplace",
				marketplaceVersion: state.marketplaceVersion ?? undefined,
				capabilities: [],
				hasAdminPages: false,
				hasDashboardWidgets: false,
				hasHooks: false,
				installedAt: state.installedAt?.toISOString(),
				activatedAt: state.activatedAt?.toISOString() ?? undefined,
				deactivatedAt: state.deactivatedAt?.toISOString() ?? undefined,
				description: state.description ?? undefined,
				iconUrl: marketplaceUrl ? marketplaceIconUrl(marketplaceUrl, state.pluginId) : undefined,
			});
		}

		return {
			success: true,
			data: { items },
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_LIST_ERROR",
				message: "Failed to list plugins",
			},
		};
	}
}

/**
 * Get a single plugin's info
 */
export async function handlePluginGet(
	db: Kysely<Database>,
	configuredPlugins: ResolvedPlugin[],
	pluginId: string,
	marketplaceUrl?: string,
): Promise<ApiResult<PluginResponse>> {
	try {
		const plugin = configuredPlugins.find((p) => p.id === pluginId);
		if (!plugin) {
			return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `Plugin not found: ${pluginId}`,
				},
			};
		}

		const stateRepo = new PluginStateRepository(db);
		const state = await stateRepo.get(pluginId);

		return {
			success: true,
			data: { item: buildPluginInfo(plugin, state, marketplaceUrl) },
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_GET_ERROR",
				message: "Failed to get plugin",
			},
		};
	}
}

/**
 * Enable a plugin
 */
export async function handlePluginEnable(
	db: Kysely<Database>,
	configuredPlugins: ResolvedPlugin[],
	pluginId: string,
): Promise<ApiResult<PluginResponse>> {
	try {
		const plugin = configuredPlugins.find((p) => p.id === pluginId);
		if (!plugin) {
			return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `Plugin not found: ${pluginId}`,
				},
			};
		}

		const stateRepo = new PluginStateRepository(db);
		const state = await stateRepo.enable(pluginId, plugin.version);

		return {
			success: true,
			data: { item: buildPluginInfo(plugin, state) },
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_ENABLE_ERROR",
				message: "Failed to enable plugin",
			},
		};
	}
}

/**
 * Disable a plugin
 */
export async function handlePluginDisable(
	db: Kysely<Database>,
	configuredPlugins: ResolvedPlugin[],
	pluginId: string,
): Promise<ApiResult<PluginResponse>> {
	try {
		const plugin = configuredPlugins.find((p) => p.id === pluginId);
		if (!plugin) {
			return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `Plugin not found: ${pluginId}`,
				},
			};
		}

		const stateRepo = new PluginStateRepository(db);
		const state = await stateRepo.disable(pluginId, plugin.version);

		return {
			success: true,
			data: { item: buildPluginInfo(plugin, state) },
		};
	} catch {
		return {
			success: false,
			error: {
				code: "PLUGIN_DISABLE_ERROR",
				message: "Failed to disable plugin",
			},
		};
	}
}

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

File: /Users/masonjames/Projects/emdash/packages/plugins/forms/src/storage.ts
```ts
/**
 * Storage type definition for the forms plugin.
 *
 * Declares the two storage collections and their indexes.
 */

import type { PluginStorageConfig } from "emdash";

export type FormsStorage = PluginStorageConfig & {
	forms: {
		indexes: ["status", "createdAt"];
		uniqueIndexes: ["slug"];
	};
	submissions: {
		indexes: [
			"formId",
			"status",
			"starred",
			"createdAt",
			["formId", "createdAt"],
			["formId", "status"],
		];
	};
};

export const FORMS_STORAGE_CONFIG = {
	forms: {
		indexes: ["status", "createdAt"] as const,
		uniqueIndexes: ["slug"] as const,
	},
	submissions: {
		indexes: [
			"formId",
			"status",
			"starred",
			"createdAt",
			["formId", "createdAt"],
			["formId", "status"],
		] as const,
	},
} satisfies PluginStorageConfig;

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

File: /Users/masonjames/Projects/emdash/packages/plugins/webhook-notifier/src/index.ts
```ts
/**
 * Webhook Notifier Plugin for EmDash CMS
 *
 * Posts to external URLs when content changes occur.
 *
 * Features:
 * - Configurable webhook URLs (admin settings)
 * - Secret token for authentication (encrypted)
 * - Retry logic with exponential backoff
 * - Event filtering by collection and action
 * - Manual trigger via API route
 *
 * Demonstrates:
 * - network:fetch:any capability (unrestricted outbound for user-configured URLs)
 * - settings.secret() for encrypted tokens
 * - apiRoutes for custom endpoints
 * - content:afterDelete hook
 * - Hook dependencies (runs after audit-log)
 * - errorPolicy: "continue" (don't block save on webhook failure)
 */

import type { PluginDescriptor } from "emdash";

export interface WebhookPayload {
	event: "content:create" | "content:update" | "content:delete" | "media:upload";
	timestamp: string;
	collection?: string;
	resourceId: string;
	resourceType: "content" | "media";
	data?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

/**
 * Create the webhook notifier plugin descriptor
 */
export function webhookNotifierPlugin(): PluginDescriptor {
	return {
		id: "webhook-notifier",
		version: "0.1.0",
		format: "standard",
		entrypoint: "@emdash-cms/plugin-webhook-notifier/sandbox",
		capabilities: ["network:fetch:any"],
		storage: {
			deliveries: { indexes: ["timestamp", "webhookUrl", "status"] },
		},
		adminPages: [{ path: "/settings", label: "Webhook Settings", icon: "send" }],
		adminWidgets: [{ id: "status", title: "Webhooks", size: "third" }],
	};
}

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/migration/content-import.mdx
```mdx
---
title: Content Import
description: Import content from WordPress and other sources into EmDash.
---

import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

EmDash's import system uses a pluggable source architecture. Each source knows how to probe, analyze, and fetch content from a specific platform.

## Import Sources

| Source ID        | Platform              | Probe | OAuth | Full Import |
| ---------------- | --------------------- | ----- | ----- | ----------- |
| `wxr`            | WordPress export file | No    | No    | Yes         |
| `wordpress-com`  | WordPress.com         | Yes   | Yes   | Yes         |
| `wordpress-rest` | Self-hosted WordPress | Yes   | No    | Probe only  |

### WXR File Upload

The most complete import method. Upload a WordPress eXtended RSS (WXR) export file directly to the admin dashboard.

**Capabilities:**

- All post types (including custom)
- All meta fields
- Drafts and private posts
- Full taxonomy hierarchy
- Media attachment metadata

**How to get a WXR file:**

<Steps>

1. In WordPress admin, go to **Tools → Export**
2. Select **All content** or specific post types
3. Click **Download Export File**
4. Upload the `.xml` file to EmDash

</Steps>

### WordPress.com OAuth

For sites hosted on WordPress.com, connect via OAuth to import without manual file exports.

<Steps>

1. Enter your WordPress.com site URL
2. Click **Connect with WordPress.com**
3. Authorize EmDash in the WordPress.com popup
4. Select content to import

</Steps>

<Aside type="caution">
	WordPress.com OAuth requires environment variables `WPCOM_CLIENT_ID` and `WPCOM_CLIENT_SECRET`.
	Register an app at [developer.wordpress.com](https://developer.wordpress.com/apps/).
</Aside>

**What's included:**

- Published and draft content
- Private posts (with authorization)
- Media files via API
- Custom fields exposed to REST API

### WordPress REST API Probe

When you enter a URL, EmDash probes the site to detect WordPress and show available content:

```
Detected: WordPress 6.4
├── Posts: 127 (published)
├── Pages: 12 (published)
└── Media: 89 files

Note: Drafts and private content require authentication
or a full WXR export.
```

The REST probe is informational. For complete imports, it suggests uploading a WXR file or connecting via OAuth (for WordPress.com).

## Import Flow

All sources follow the same flow:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Connect   │────▶│   Analyze   │────▶│   Prepare   │────▶│   Execute   │
│  (probe/    │     │  (schema    │     │  (create    │     │  (import    │
│   upload)   │     │   check)    │     │   schema)   │     │   content)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Step 1: Connect

Enter a URL to probe or upload a file directly.

**URL probing** runs all registered sources in parallel. The highest-confidence match determines the suggested next action:

- **WordPress.com site** → Offer OAuth connection
- **Self-hosted WordPress** → Show export instructions
- **Unknown** → Suggest file upload

### Step 2: Analyze

The source parses content and checks schema compatibility:

```
Post Types:
├── post (127) → posts [New collection]
├── page (12)  → pages [Existing, compatible]
├── product (45) → products [Add 3 fields]
└── revision (234) → [Skip - internal type]

Required Schema Changes:
├── Create collection: posts
├── Add fields to pages: featured_image
└── Create collection: products
```

Each post type shows its status:

| Status         | Meaning                                  |
| -------------- | ---------------------------------------- |
| Ready          | Collection exists with compatible fields |
| New collection | Will be created automatically            |
| Add fields     | Collection exists, missing fields added  |
| Incompatible   | Field type conflicts (manual fix needed) |

### Step 3: Prepare Schema

Click **Create Schema & Import** to:

1. Create new collections via SchemaRegistry
2. Add missing fields with correct column types
3. Set up content tables with indexes

### Step 4: Execute Import

Content imports sequentially:

- Gutenberg/HTML converted to Portable Text
- WordPress status mapped to EmDash status
- WordPress authors mapped to ownership (`authorId`) and presentation bylines
- Taxonomies created and linked
- Reusable blocks (`wp_block`) imported as [Sections](/guides/sections/)
- Progress shown in real-time

Author import behavior:

- If an author mapping points to an EmDash user, ownership is set to that user and a linked byline is created/reused for the same user.
- If there is no user mapping, a guest byline is created/reused from the WordPress author identity.
- Imported entries get ordered byline credits, with the first credit set as `primaryBylineId`.

### Step 5: Media Import (Optional)

After content, optionally import media:

<Steps>

1. **Analysis** — Shows attachment counts by type

   ```
   Media found:
   ├── Images: 75 files
   ├── Video: 10 files
   └── Other: 4 files
   ```

2. **Download** — Streams from WordPress URLs with progress

   ```
   Importing media...
   ├── 45 of 89 (50%)
   ├── Current: vacation-photo.jpg
   └── Status: Uploading
   ```

3. **Rewrite URLs** — Content automatically updated with new URLs

</Steps>

Media import uses content hashing (xxHash64) for deduplication. The same image used in multiple posts is stored once.

## Source Interface

Import sources implement a standard interface:

```typescript
interface ImportSource {
	/** Unique identifier */
	id: string;

	/** Display name */
	name: string;

	/** Probe a URL (optional) */
	probe?(url: string): Promise<SourceProbeResult | null>;

	/** Analyze content from this source */
	analyze(input: SourceInput, context: ImportContext): Promise<ImportAnalysis>;

	/** Stream content items */
	fetchContent(input: SourceInput, options: FetchOptions): AsyncGenerator<NormalizedItem>;
}
```

### Input Types

Sources accept different input types:

```typescript
// File upload (WXR)
{ type: "file", file: File }

// URL with optional token (REST API)
{ type: "url", url: string, token?: string }

// OAuth connection (WordPress.com)
{ type: "oauth", url: string, accessToken: string }
```

### Normalized Output

All sources produce the same normalized format:

```typescript
interface NormalizedItem {
	sourceId: string | number;
	postType: string;
	status: "publish" | "draft" | "pending" | "private" | "future";
	slug: string;
	title: string;
	content: PortableTextBlock[];
	excerpt?: string;
	date: Date;
	author?: string;
	authors?: string[];
	categories?: string[];
	tags?: string[];
	meta?: Record<string, unknown>;
	featuredImage?: string;
}
```

## API Endpoints

The import system exposes these endpoints:

### Probe URL

```http
POST /_emdash/api/import/probe
Content-Type: application/json

{ "url": "https://example.com" }
```

Returns detected platform and suggested action.

### Analyze WXR

```http
POST /_emdash/api/import/wordpress/analyze
Content-Type: multipart/form-data

file: [WordPress export .xml]
```

Returns post type analysis with schema compatibility.

### Prepare Schema

```http
POST /_emdash/api/import/wordpress/prepare
Content-Type: application/json

{
  "postTypes": [
    { "name": "post", "collection": "posts", "enabled": true }
  ]
}
```

Creates collections and fields.

### Execute Import

```http
POST /_emdash/api/import/wordpress/execute
Content-Type: multipart/form-data

file: [WordPress export .xml]
config: { "postTypeMappings": { "post": { "collection": "posts" } } }
```

Imports content to specified collections.

### Import Media

```http
POST /_emdash/api/import/wordpress/media
Content-Type: application/json

{
  "attachments": [{ "id": 123, "url": "https://..." }],
  "stream": true
}
```

Streams NDJSON progress updates during download/upload.

### Rewrite URLs

```http
POST /_emdash/api/import/wordpress/rewrite-urls
Content-Type: application/json

{
  "urlMap": { "https://old.com/image.jpg": "/_emdash/media/abc123" }
}
```

Updates Portable Text content with new media URLs.

## Error Handling

### Recoverable Errors

- **Network timeout** — Retried with backoff
- **Single item parse failure** — Logged, skipped, import continues
- **Media download failure** — Marked for manual handling

### Fatal Errors

- **Invalid file format** — Import stops with error message
- **Database connection lost** — Import pauses, allows resume
- **Storage quota exceeded** — Import stops, shows usage

### Error Report

After import:

```
Import Complete

✓ 125 posts imported
✓ 12 pages imported
✓ 85 media references recorded

⚠ 2 items had warnings:
  - Post "Special Characters ñ" - title encoding fixed
  - Page "About" - duplicate slug renamed to "about-1"

✗ 1 item failed:
  - Post ID 456 - content parsing error (saved as draft)
```

Failed items are saved as drafts with original content in `_importError` for review.

## Building Custom Sources

Create a source for other platforms:

```typescript title="src/import/custom-source.ts"
import type { ImportSource } from "emdash/import";

export const mySource: ImportSource = {
	id: "my-platform",
	name: "My Platform",
	description: "Import from My Platform",
	icon: "globe",
	canProbe: true,

	async probe(url) {
		// Check if URL matches your platform
		const response = await fetch(`${url}/api/info`);
		if (!response.ok) return null;

		return {
			sourceId: "my-platform",
			confidence: "definite",
			detected: { platform: "my-platform" },
			// ...
		};
	},

	async analyze(input, context) {
		// Parse and analyze content
		// Return ImportAnalysis
	},

	async *fetchContent(input, options) {
		// Yield NormalizedItem for each content piece
		for (const item of items) {
			yield {
				sourceId: item.id,
				postType: "post",
				title: item.title,
				content: convertToPortableText(item.body),
				// ...
			};
		}
	},
};
```

Register the source in your EmDash configuration:

```typescript title="astro.config.mjs"
import { mySource } from "./src/import/custom-source";

export default defineConfig({
	integrations: [
		emdash({
			import: {
				sources: [mySource],
			},
		}),
	],
});
```

## Next Steps

- **[WordPress Migration](/migration/from-wordpress/)** — Complete WordPress migration guide
- **[Plugin Porting](/migration/plugin-porting/)** — Port WordPress plugins to EmDash

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/migration/plugin-porting.mdx
```mdx
---
title: Porting WordPress Plugins
description: Migrate WordPress plugin functionality to EmDash plugins.
---

import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

WordPress plugins extend the CMS with custom functionality. EmDash provides equivalent extension points through its plugin system. This guide shows how to translate common WordPress patterns.

## Plugin Architecture Comparison

| WordPress                          | EmDash                                |
| ---------------------------------- | --------------------------------------- |
| PHP files in `wp-content/plugins/` | TypeScript modules registered in config |
| `add_action()` / `add_filter()`    | Hook functions                          |
| Admin menu pages                   | Admin panel routes                      |
| REST API endpoints                 | API route handlers                      |
| Database via `$wpdb`               | Storage via `ctx.storage`               |
| Options via `wp_options`           | Key-value via `ctx.kv`                  |
| Post meta                          | Collection fields                       |
| Shortcodes                         | Portable Text custom blocks             |
| Gutenberg blocks                   | Portable Text custom blocks             |

## Concept Mapping

### Actions and Filters → Hooks

WordPress uses `add_action()` and `add_filter()` for extensibility. EmDash uses typed hook functions.

<Tabs>
<TabItem label="WordPress">
```php
// WordPress action
add_action('save_post', function($post_id, $post) {
    if ($post->post_type !== 'product') return;
    update_post_meta($post_id, 'last_updated', time());
}, 10, 2);

// WordPress filter
add_filter('the_content', function($content) {
return $content . '<p>Read more articles</p>';
});

````
</TabItem>
<TabItem label="EmDash">
```typescript
// EmDash hook
export const hooks = {
  'content:beforeSave': async (ctx, entry) => {
    if (entry.collection !== 'products') return entry;
    return {
      ...entry,
      data: {
        ...entry.data,
        lastUpdated: new Date().toISOString()
      }
    };
  },

  'content:afterRender': async (ctx, html) => {
    return html + '<p>Read more articles</p>';
  }
};
````

</TabItem>
</Tabs>

### Available Hooks

| Hook                   | Equivalent WordPress Hook    | Purpose                    |
| ---------------------- | ---------------------------- | -------------------------- |
| `content:beforeSave`   | `wp_insert_post_data`        | Modify content before save |
| `content:afterSave`    | `save_post`                  | React after content saved  |
| `content:beforeDelete` | `before_delete_post`         | Validate before deletion   |
| `content:afterRender`  | `the_content`                | Transform rendered output  |
| `media:beforeUpload`   | `wp_handle_upload_prefilter` | Validate/transform uploads |
| `media:afterUpload`    | `add_attachment`             | React after upload         |
| `admin:init`           | `admin_init`                 | Admin panel initialization |
| `api:request`          | `rest_pre_dispatch`          | Intercept API requests     |

### Database Access

WordPress uses `$wpdb` for direct database queries. EmDash provides `ctx.storage` for structured data access.

<Tabs>
<TabItem label="WordPress">
```php
global $wpdb;

// Insert
$wpdb->insert('custom_table', [
'name' => 'Example',
'value' => 42
]);

// Query
$results = $wpdb->get_results(
"SELECT \* FROM custom_table WHERE value > 10"
);

// Update
$wpdb->update('custom_table',
['value' => 50],
['name' => 'Example']
);

````
</TabItem>
<TabItem label="EmDash">
```typescript
// Using ctx.storage (D1/SQLite)
const db = ctx.storage;

// Insert
await db.prepare(
  'INSERT INTO custom_table (name, value) VALUES (?, ?)'
).bind('Example', 42).run();

// Query
const results = await db.prepare(
  'SELECT * FROM custom_table WHERE value > ?'
).bind(10).all();

// Update
await db.prepare(
  'UPDATE custom_table SET value = ? WHERE name = ?'
).bind(50, 'Example').run();
````

</TabItem>
</Tabs>

<Aside>
	EmDash runs on Cloudflare Workers with D1 (SQLite). Use prepared statements with parameter
	binding for security.
</Aside>

### Options Storage

WordPress uses `get_option()` / `update_option()`. EmDash uses `ctx.kv` for key-value storage.

<Tabs>
<TabItem label="WordPress">
```php
// Get option
$api_key = get_option('my_plugin_api_key', '');

// Set option
update_option('my_plugin_api_key', 'abc123');

// Delete option
delete_option('my_plugin_api_key');

````
</TabItem>
<TabItem label="EmDash">
```typescript
// Get value
const apiKey = await ctx.kv.get('my_plugin_api_key') ?? '';

// Set value
await ctx.kv.put('my_plugin_api_key', 'abc123');

// Delete value
await ctx.kv.delete('my_plugin_api_key');
````

</TabItem>
</Tabs>

### Custom Post Types → Collections

WordPress registers post types with `register_post_type()`. EmDash uses collections defined in the admin UI or via API.

<Tabs>
<TabItem label="WordPress">
```php
register_post_type('product', [
    'labels' => [
        'name' => 'Products',
        'singular_name' => 'Product'
    ],
    'public' => true,
    'supports' => ['title', 'editor', 'thumbnail'],
    'has_archive' => true
]);

register_meta('post', 'price', [
'type' => 'number',
'single' => true,
'show_in_rest' => true
]);

````
</TabItem>
<TabItem label="EmDash">
```typescript
// Create via API
await fetch('/_emdash/api/schema/collections', {
  method: 'POST',
  body: JSON.stringify({
    slug: 'products',
    label: 'Products',
    labelSingular: 'Product',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'content', type: 'portableText' },
      { slug: 'featuredImage', type: 'media' },
      { slug: 'price', type: 'number' }
    ]
  })
});
````

</TabItem>
</Tabs>

Collections are typically created through the admin UI at **Content Types → New Content Type**.

### Shortcodes → Portable Text Blocks

WordPress shortcodes embed dynamic content. EmDash uses custom Portable Text blocks with React/Astro components.

<Tabs>
<TabItem label="WordPress">
```php
// Register shortcode
add_shortcode('product_card', function($atts) {
    $atts = shortcode_atts([
        'id' => 0,
        'show_price' => true
    ], $atts);

    $product = get_post($atts['id']);
    $price = get_post_meta($atts['id'], 'price', true);

    return sprintf(
        '<div class="product-card">
            <h3>%s</h3>
            %s
        </div>',
        esc_html($product->post_title),
        $atts['show_price'] ? '<p>$' . esc_html($price) . '</p>' : ''
    );

});

// Usage in content: [product_card id="123" show_price="true"]

````
</TabItem>
<TabItem label="EmDash">
```typescript
// Define Portable Text block schema
const productCardBlock = {
  name: 'productCard',
  type: 'object',
  fields: [
    { name: 'productId', type: 'reference', to: 'products' },
    { name: 'showPrice', type: 'boolean', default: true }
  ]
};

// Render component (Astro)
---
// src/components/ProductCard.astro
import { getEntry } from 'emdash';

const { productId, showPrice = true } = Astro.props;
const product = await getEntry('products', productId);
---

<div class="product-card">
  <h3>{product.data.title}</h3>
  {showPrice && <p>${product.data.price}</p>}
</div>
````

```typescript
// Register with Portable Text renderer
import ProductCard from "./components/ProductCard.astro";

const components = {
	types: {
		productCard: ProductCard,
	},
};

// Usage: <PortableText value={content} components={components} />
```

</TabItem>
</Tabs>

### Admin Pages

WordPress uses `add_menu_page()` for admin screens. EmDash plugins define admin routes.

<Tabs>
<TabItem label="WordPress">
```php
add_action('admin_menu', function() {
    add_menu_page(
        'My Plugin Settings',
        'My Plugin',
        'manage_options',
        'my-plugin',
        'render_settings_page',
        'dashicons-admin-generic',
        30
    );
});

function render_settings_page() {
?>

<div class="wrap">
<h1>My Plugin Settings</h1>
<form method="post" action="options.php">
<?php settings_fields('my_plugin_options'); ?>
<input type="text" name="api_key" value="<?php echo esc_attr(get_option('api_key')); ?>">
<?php submit_button(); ?>
</form>
</div>
<?php
}

````
</TabItem>
<TabItem label="EmDash">
```typescript
// Plugin definition
export default {
  name: 'my-plugin',

  admin: {
    // Menu entry
    menu: {
      label: 'My Plugin',
      icon: 'settings'
    },

    // Admin page component
    pages: [{
      path: '/settings',
      component: () => import('./admin/Settings')
    }]
  }
};
````

```tsx
// admin/Settings.tsx (React component)
import { useState, useEffect } from "react";

export default function Settings() {
	const [apiKey, setApiKey] = useState("");

	useEffect(() => {
		fetch("/_emdash/api/plugins/my-plugin/settings")
			.then((r) => r.json())
			.then((data) => setApiKey(data.apiKey || ""));
	}, []);

	const save = async () => {
		await fetch("/_emdash/api/plugins/my-plugin/settings", {
			method: "POST",
			body: JSON.stringify({ apiKey }),
		});
	};

	return (
		<div>
			<h1>My Plugin Settings</h1>
			<input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
			<button onClick={save}>Save</button>
		</div>
	);
}
```

</TabItem>
</Tabs>

### REST API Endpoints

WordPress uses `register_rest_route()`. EmDash plugins define API handlers.

<Tabs>
<TabItem label="WordPress">
```php
add_action('rest_api_init', function() {
    register_rest_route('my-plugin/v1', '/calculate', [
        'methods' => 'POST',
        'callback' => function($request) {
            $params = $request->get_json_params();
            $result = $params['a'] + $params['b'];
            return new WP_REST_Response(['result' => $result]);
        },
        'permission_callback' => function() {
            return current_user_can('edit_posts');
        }
    ]);
});
```
</TabItem>
<TabItem label="EmDash">
```typescript
// Plugin API routes
export default {
  name: 'my-plugin',
  
  api: {
    routes: [{
      method: 'POST',
      path: '/calculate',
      handler: async (ctx, req) => {
        // Check permissions
        if (!ctx.user?.can('edit:content')) {
          return new Response('Forbidden', { status: 403 });
        }
        
        const { a, b } = await req.json();
        return Response.json({ result: a + b });
      }
    }]
  }
};
```
</TabItem>
</Tabs>

## Migration Workflow

<Steps>

1. **Analyze the WordPress plugin**

   Identify what the plugin does:
   - Custom post types and fields
   - Admin pages
   - Shortcodes or blocks
   - Hooks used
   - Database tables
   - API endpoints

2. **Map concepts to EmDash**

   Use the tables above to find equivalents. Note which features need different approaches.

3. **Create the EmDash plugin structure**

   ```
   my-plugin/
   ├── index.ts          # Plugin entry point
   ├── hooks.ts          # Hook implementations
   ├── api/              # API route handlers
   ├── admin/            # Admin UI components
   └── components/       # Portable Text components
   ```

4. **Implement core functionality**

   Start with the data model (collections and fields), then add hooks, then admin UI.

5. **Migrate data**

   If the WordPress plugin stored custom data:
   - Export from WordPress (custom tables, post meta)
   - Transform to EmDash format
   - Import via API or direct database insert

6. **Test thoroughly**
   - Verify hook behavior matches expectations
   - Test admin pages render correctly
   - Check API endpoints return correct data

</Steps>

## Common Plugin Patterns

### SEO Plugin

WordPress SEO plugins add meta fields and generate tags.

```typescript
export default {
	name: "seo",

	hooks: {
		"content:beforeSave": async (ctx, entry) => {
			// Auto-generate meta description from excerpt
			if (!entry.data.seo?.description && entry.data.excerpt) {
				return {
					...entry,
					data: {
						...entry.data,
						seo: {
							...entry.data.seo,
							description: entry.data.excerpt.slice(0, 160),
						},
					},
				};
			}
			return entry;
		},
	},

	// Add SEO fields to all collections
	fields: {
		seo: {
			type: "object",
			fields: [
				{ slug: "title", type: "string" },
				{ slug: "description", type: "text" },
				{ slug: "keywords", type: "string" },
			],
		},
	},
};
```

### Form Plugin

WordPress form plugins store submissions.

```typescript
export default {
	name: "forms",

	// Create submissions collection on install
	install: async (ctx) => {
		await ctx.schema.createCollection({
			slug: "form_submissions",
			label: "Form Submissions",
			fields: [
				{ slug: "formId", type: "string" },
				{ slug: "data", type: "json" },
				{ slug: "submittedAt", type: "datetime" },
			],
		});
	},

	api: {
		routes: [
			{
				method: "POST",
				path: "/submit/:formId",
				handler: async (ctx, req) => {
					const formId = ctx.params.formId;
					const data = await req.json();

					await ctx.content.create("form_submissions", {
						formId,
						data,
						submittedAt: new Date().toISOString(),
					});

					return Response.json({ success: true });
				},
			},
		],
	},
};
```

### E-commerce Plugin

WordPress WooCommerce patterns translated to EmDash.

```typescript
export default {
	name: "shop",

	collections: [
		{
			slug: "products",
			label: "Products",
			fields: [
				{ slug: "title", type: "string", required: true },
				{ slug: "price", type: "number", required: true },
				{ slug: "salePrice", type: "number" },
				{ slug: "sku", type: "string" },
				{ slug: "stock", type: "number", default: 0 },
				{ slug: "gallery", type: "media", multiple: true },
			],
		},
	],

	hooks: {
		"content:beforeSave": async (ctx, entry) => {
			if (entry.collection !== "products") return entry;

			// Generate SKU if not set
			if (!entry.data.sku) {
				const count = await ctx.content.count("products");
				entry.data.sku = `PROD-${String(count + 1).padStart(5, "0")}`;
			}

			return entry;
		},
	},
};
```

## Security Considerations

<Aside type="caution">
	EmDash plugins run in a sandboxed environment with limited capabilities. Direct file system
	access and shell commands are not available.
</Aside>

### Available in Sandbox

- `ctx.storage` — Database access
- `ctx.kv` — Key-value store
- `ctx.content` — Content API
- `ctx.media` — Media API
- `fetch()` — HTTP requests

### Not Available

- File system access
- Shell commands
- Environment variables (use plugin settings)
- Global state between requests

## Next Steps

- **[WordPress Migration](/migration/from-wordpress/)** — Import your WordPress content
- **[Plugin Development](/plugins/development/)** — Full plugin development guide
- **[Hooks Reference](/reference/hooks/)** — Complete hooks API

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

File: /Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/plugins/[pluginId]/[...path].ts
```ts
/**
 * Plugin API routes - dynamic handler for plugin-defined endpoints
 *
 * Routes are mounted at /_emdash/api/plugins/{pluginId}/*
 * Plugins register routes like "POST /do-something" which becomes
 * POST /_emdash/api/plugins/{pluginId}/do-something
 *
 * Routes marked as `public: true` skip authentication and CSRF checks.
 * Private routes (the default) require authentication and appropriate permissions.
 */

import type { APIRoute } from "astro";

import { requirePerm } from "#api/authorize.js";
import { apiError, apiSuccess } from "#api/error.js";
import { requireScope } from "#auth/scopes.js";

export const prerender = false;

/**
 * Handle all methods by matching against plugin-defined routes
 */
const handleRequest: APIRoute = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const pluginId = params.pluginId!;
	const path = params.path || "";
	const method = request.method.toUpperCase();

	if (!emdash?.handlePluginApiRoute) {
		return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	}

	// Resolve route metadata to decide auth before dispatch
	const routeMeta = emdash.getPluginRouteMeta(pluginId, `/${path}`);

	if (!routeMeta) {
		return apiError("NOT_FOUND", "Plugin route not found", 404);
	}

	// Public routes skip auth, CSRF, and scope checks entirely
	if (!routeMeta.public) {
		// Private routes require authentication and permission checks
		const permission = ["GET", "HEAD", "OPTIONS"].includes(method)
			? "plugins:read"
			: "plugins:manage";
		const denied = requirePerm(user, permission);
		if (denied) return denied;

		// Token scope enforcement — plugin routes require "admin" scope.
		// Session auth is implicitly full-access (requireScope returns null).
		const scopeError = requireScope(locals, "admin");
		if (scopeError) return scopeError;

		// CSRF protection for state-changing requests on private routes.
		// Plugin routes use soft auth in the middleware (user resolved but not required),
		// so the middleware's CSRF check doesn't run. We enforce it here for private routes.
		// Token-authed requests (which set tokenScopes) are exempt — tokens aren't
		// ambient credentials like cookies.
		if (
			!["GET", "HEAD", "OPTIONS"].includes(method) &&
			!locals.tokenScopes &&
			request.headers.get("X-EmDash-Request") !== "1"
		) {
			return apiError("CSRF_REJECTED", "Missing required header", 403);
		}
	}

	const result = await emdash.handlePluginApiRoute(pluginId, method, `/${path}`, request);

	if (!result.success) {
		const code = result.error?.code ?? "PLUGIN_ERROR";
		// Pass through messages from known plugin errors (PluginRouteError),
		// but mask internal errors (unhandled exceptions) to avoid leaking
		// database errors, file paths, etc. from sandboxed plugins.
		const message =
			code === "INTERNAL_ERROR"
				? "Plugin route error"
				: (result.error?.message ?? "Plugin route error");
		// PluginRouteError status is returned at the top level of the result
		const status = (result as { status?: number }).status ?? (code === "NOT_FOUND" ? 404 : 400);
		return apiError(code, message, status);
	}

	return apiSuccess(result.data);
};

// Export handlers for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

```

File: /Users/masonjames/Projects/emdash/packages/marketplace/src/workflows/audit.ts
```ts
import { WorkflowEntrypoint } from "cloudflare:workers";
import type { WorkflowEvent, WorkflowStep } from "cloudflare:workers";
import { createGzipDecoder, unpackTar } from "modern-tar";

import type { ImageInput } from "../audit/image-types.js";
import { createWorkersAIImageAuditor } from "../audit/image-workers-ai.js";
import type { AuditInput } from "../audit/types.js";
import { createWorkersAIAuditor } from "../audit/workers-ai.js";
import {
	createAudit,
	createImageAudit,
	linkAuditToVersion,
	linkImageAuditToVersion,
	updateVersionStatus,
} from "../db/queries.js";
import { getAuditEnforcement, resolveVersionStatus } from "../env.js";

// ── Types ───────────────────────────────────────────────────────

export interface AuditParams {
	pluginId: string;
	version: string;
	bundleKey: string;
	versionId: string;
	/** Manifest fields needed for audit input */
	manifest: {
		id: string;
		version: string;
		capabilities: string[];
		allowedHosts?: string[];
		admin?: { settingsSchema?: Record<string, unknown> };
	};
	/** Whether the tarball contains images to audit */
	hasImages: boolean;
}

interface CodeAuditStepResult {
	verdict: string;
	riskScore: number;
	findings: unknown[];
	summary: string;
	model: string;
	durationMs: number;
}

interface ImageAuditStepResult {
	verdict: string;
	images: unknown[];
	model: string;
	durationMs: number;
}

// ── Constants ───────────────────────────────────────────────────

const RE_LEADING_DOT_SLASH = /^\.\//;
const RE_LEADING_PACKAGE = /^package\//;
const MAX_DECOMPRESSED_BYTES = 50 * 1024 * 1024;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TAR_FILES = 200;

const RETRY_CONFIG = {
	retries: {
		limit: 3,
		delay: "10 seconds" as const,
		backoff: "exponential" as const,
	},
};

// ── Workflow ─────────────────────────────────────────────────────

export class AuditWorkflow extends WorkflowEntrypoint<Env, AuditParams> {
	override async run(event: Readonly<WorkflowEvent<AuditParams>>, step: WorkflowStep) {
		const { pluginId, version, bundleKey, versionId, manifest, hasImages } = event.payload;

		// Step 1: Run code audit
		const auditResult = await step.do("code-audit", RETRY_CONFIG, async () => {
			const { backendCode, adminCode } = await this.extractCodeFromR2(bundleKey);
			const auditor = createWorkersAIAuditor(this.env.AI);
			const input: AuditInput = {
				manifest,
				backendCode,
				adminCode,
			};
			const result = await auditor.audit(input);
			// Return a plain serializable object (no class instances)
			return {
				verdict: result.verdict,
				riskScore: result.riskScore,
				findings: result.findings,
				summary: result.summary,
				model: result.model,
				durationMs: result.durationMs,
			} satisfies CodeAuditStepResult;
		});

		// Step 2: Run image audit (skip if no images)
		const imageAuditResult = hasImages
			? await step.do("image-audit", RETRY_CONFIG, async () => {
					const imageFiles = await this.extractImagesFromR2(bundleKey);
					if (imageFiles.length === 0) return null;
					const imageAuditor = createWorkersAIImageAuditor(this.env.AI);
					const result = await imageAuditor.auditImages(imageFiles);
					return {
						verdict: result.verdict,
						images: result.images,
						model: result.model,
						durationMs: result.durationMs,
					} satisfies ImageAuditStepResult;
				})
			: null;

		// Step 3: Store results in D1 and link to version
		await step.do("store-results", async () => {
			// Store code audit
			const auditRow = await createAudit(this.env.DB, {
				pluginId,
				version,
				verdict: auditResult.verdict,
				riskScore: auditResult.riskScore,
				summary: auditResult.summary,
				// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- findings shape is preserved from AuditResult
				findings: auditResult.findings as unknown[],
				model: auditResult.model,
				durationMs: auditResult.durationMs,
			});
			await linkAuditToVersion(this.env.DB, versionId, auditRow.id, auditResult.verdict);

			// Store image audit if available
			if (imageAuditResult) {
				const imageAuditRow = await createImageAudit(this.env.DB, {
					pluginId,
					version,
					verdict: imageAuditResult.verdict,
					// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- images shape is preserved from ImageAuditResult
					findings: imageAuditResult.images as unknown[],
					model: imageAuditResult.model,
					durationMs: imageAuditResult.durationMs,
				});
				await linkImageAuditToVersion(
					this.env.DB,
					versionId,
					imageAuditRow.id,
					imageAuditResult.verdict,
				);
			}
		});

		// Step 4: Resolve version status and update D1
		await step.do("finalize", async () => {
			const enforcement = getAuditEnforcement(this.env);
			const status = resolveVersionStatus(
				enforcement,
				auditResult.verdict,
				imageAuditResult?.verdict ?? null,
			);
			await updateVersionStatus(this.env.DB, versionId, status);
		});

		return { auditResult, imageAuditResult };
	}

	// ── Helpers ────────────────────────────────────────────────

	private async extractCodeFromR2(
		bundleKey: string,
	): Promise<{ backendCode: string; adminCode?: string }> {
		const object = await this.env.R2.get(bundleKey);
		if (!object) throw new Error(`Bundle not found in R2: ${bundleKey}`);

		const files = await extractTarball(await object.arrayBuffer());
		const backendBytes = files.get("backend.js");
		const backendCode = backendBytes ? new TextDecoder().decode(backendBytes) : "";
		const adminBytes = files.get("admin.js");
		const adminCode = adminBytes ? new TextDecoder().decode(adminBytes) : undefined;

		return { backendCode, adminCode };
	}

	private async extractImagesFromR2(bundleKey: string): Promise<ImageInput[]> {
		const object = await this.env.R2.get(bundleKey);
		if (!object) throw new Error(`Bundle not found in R2: ${bundleKey}`);

		const files = await extractTarball(await object.arrayBuffer());
		const imageFiles: ImageInput[] = [];

		const iconData = files.get("icon.png");
		if (iconData) {
			// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- Uint8Array.buffer is ArrayBuffer at runtime
			imageFiles.push({ filename: "icon.png", data: iconData.buffer as ArrayBuffer });
		}
		for (const [path, data] of files) {
			if (path.startsWith("screenshots/")) {
				// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- Uint8Array.buffer is ArrayBuffer at runtime
				imageFiles.push({ filename: path, data: data.buffer as ArrayBuffer });
			}
		}

		return imageFiles;
	}
}

// ── Tarball extraction (shared with author.ts) ──────────────────

async function collectStream(
	stream: ReadableStream<Uint8Array>,
	limit: number,
): Promise<Uint8Array> {
	const reader = stream.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			total += value.length;
			if (total > limit) {
				throw new Error(`Decompressed bundle exceeds ${limit} byte limit`);
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const result = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}

async function extractTarball(data: ArrayBuffer): Promise<Map<string, Uint8Array>> {
	const decompressed = await collectStream(
		new Response(data).body!.pipeThrough(createGzipDecoder()),
		MAX_DECOMPRESSED_BYTES,
	);

	let fileCount = 0;
	const entries = await unpackTar(decompressed, {
		strip: 0,
		filter: (header) => {
			if (header.type !== "file") return false;
			if (header.size > MAX_FILE_BYTES) {
				throw new Error(`File ${header.name} exceeds ${MAX_FILE_BYTES} byte limit`);
			}
			fileCount++;
			if (fileCount > MAX_TAR_FILES) {
				throw new Error(`Bundle contains too many files (>${MAX_TAR_FILES})`);
			}
			return true;
		},
		map: (header) => ({
			...header,
			name: header.name.replace(RE_LEADING_DOT_SLASH, "").replace(RE_LEADING_PACKAGE, ""),
		}),
	});

	const files = new Map<string, Uint8Array>();
	for (const entry of entries) {
		if (entry.data && entry.header.name) {
			files.set(entry.header.name, entry.data);
		}
	}
	return files;
}

```

File: /Users/masonjames/Projects/emdash/packages/plugins/embeds/src/index.ts
```ts
/**
 * Embeds Plugin for EmDash CMS
 *
 * Provides Portable Text block types for embedding external content:
 * - YouTube videos
 * - Vimeo videos
 * - Twitter/X tweets
 * - Bluesky posts
 * - Mastodon posts
 * - Link previews (Open Graph)
 * - GitHub Gists
 *
 * Uses astro-embed components for high-performance, privacy-respecting embeds.
 *
 * @example
 * ```typescript
 * // live.config.ts
 * import { embedsPlugin } from "@emdash-cms/plugin-embeds";
 *
 * export default defineConfig({
 *   plugins: [embedsPlugin()],
 * });
 * ```
 *
 * Embed components are automatically registered with PortableText when
 * the plugin is enabled. No manual component wiring needed!
 *
 * If you need to customize rendering, you can still override specific types:
 *
 * @example
 * ```astro
 * <PortableText
 *   value={content}
 *   components={{
 *     types: {
 *       youtube: MyCustomYouTube, // Override just this one
 *     },
 *   }}
 * />
 * ```
 */

import type { Element } from "@emdash-cms/blocks";
import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import { EMBED_BLOCK_TYPES } from "./schemas.js";

/** Rich metadata for each embed block type */
const EMBED_BLOCK_META: Record<
	string,
	{
		label: string;
		icon?: string;
		description?: string;
		placeholder?: string;
		fields?: Element[];
	}
> = {
	youtube: {
		label: "YouTube Video",
		icon: "video",
		placeholder: "Paste YouTube URL...",
		fields: [
			{
				type: "text_input",
				action_id: "id",
				label: "YouTube URL",
				placeholder: "https://youtube.com/watch?v=...",
			},
			{ type: "text_input", action_id: "title", label: "Title" },
			{ type: "text_input", action_id: "poster", label: "Poster Image URL" },
			{
				type: "text_input",
				action_id: "params",
				label: "Player Parameters",
				placeholder: "start=57&end=75",
			},
		],
	},
	vimeo: {
		label: "Vimeo Video",
		icon: "video",
		placeholder: "Paste Vimeo URL...",
		fields: [
			{
				type: "text_input",
				action_id: "id",
				label: "Vimeo URL",
				placeholder: "https://vimeo.com/...",
			},
			{ type: "text_input", action_id: "poster", label: "Poster Image URL" },
			{ type: "text_input", action_id: "params", label: "Player Parameters" },
		],
	},
	tweet: { label: "Tweet (X)", icon: "link", placeholder: "Paste tweet URL..." },
	bluesky: { label: "Bluesky Post", icon: "link", placeholder: "Paste Bluesky post URL..." },
	mastodon: { label: "Mastodon Post", icon: "link", placeholder: "Paste Mastodon post URL..." },
	linkPreview: {
		label: "Link Preview",
		icon: "link-external",
		placeholder: "Paste any URL...",
	},
	gist: {
		label: "GitHub Gist",
		icon: "code",
		placeholder: "Paste Gist URL...",
		fields: [
			{
				type: "text_input",
				action_id: "id",
				label: "Gist URL",
				placeholder: "https://gist.github.com/.../...",
			},
			{
				type: "text_input",
				action_id: "file",
				label: "Specific File",
				placeholder: "Optional: filename to show",
			},
		],
	},
};

export interface EmbedsPluginOptions {
	/**
	 * Which embed types to enable.
	 * Defaults to all types.
	 */
	types?: Array<(typeof EMBED_BLOCK_TYPES)[number]>;
}

/**
 * Create the embeds plugin descriptor
 */
export function embedsPlugin(
	options: EmbedsPluginOptions = {},
): PluginDescriptor<EmbedsPluginOptions> {
	return {
		id: "embeds",
		version: "0.0.1",
		entrypoint: "@emdash-cms/plugin-embeds",
		componentsEntry: "@emdash-cms/plugin-embeds/astro",
		options,
	};
}

/**
 * Create the embeds plugin
 */
export function createPlugin(options: EmbedsPluginOptions = {}): ResolvedPlugin {
	const _enabledTypes = options.types ?? [...EMBED_BLOCK_TYPES];

	return definePlugin({
		id: "embeds",
		version: "0.0.1",

		// This plugin only provides block types - no server-side capabilities needed
		capabilities: [],

		admin: {
			portableTextBlocks: _enabledTypes.map((type) => {
				const meta = EMBED_BLOCK_META[type];
				return {
					type,
					label: meta?.label ?? type,
					icon: meta?.icon,
					description: meta?.description,
					placeholder: meta?.placeholder,
					fields: meta?.fields,
				};
			}),
		},
	});
}

// Re-export schemas for consumers who need them
export * from "./schemas.js";

export default createPlugin;

// Re-export the enabled types for the plugin to use
export { EMBED_BLOCK_TYPES };

```

File: /Users/masonjames/Projects/emdash/packages/plugins/forms/src/index.ts
```ts
/**
 * Forms Plugin for EmDash CMS
 *
 * Build forms in the admin, embed them in content via Portable Text,
 * accept submissions from anonymous visitors, send notifications, export data.
 *
 * This is a trusted plugin shipped as an npm package. It uses the standard
 * plugin APIs — nothing privileged.
 *
 * @example
 * ```typescript
 * // live.config.ts
 * import { formsPlugin } from "@emdash-cms/plugin-forms";
 *
 * export default defineConfig({
 *   plugins: [formsPlugin()],
 * });
 * ```
 */

import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import { handleCleanup, handleDigest } from "./handlers/cron.js";
import {
	formsCreateHandler,
	formsDeleteHandler,
	formsDuplicateHandler,
	formsListHandler,
	formsUpdateHandler,
} from "./handlers/forms.js";
import {
	exportHandler,
	submissionDeleteHandler,
	submissionGetHandler,
	submissionsListHandler,
	submissionUpdateHandler,
} from "./handlers/submissions.js";
import { definitionHandler, submitHandler } from "./handlers/submit.js";
import {
	definitionSchema,
	exportSchema,
	formCreateSchema,
	formDeleteSchema,
	formDuplicateSchema,
	formUpdateSchema,
	submissionDeleteSchema,
	submissionGetSchema,
	submissionsListSchema,
	submitSchema,
	submissionUpdateSchema,
} from "./schemas.js";
import { FORMS_STORAGE_CONFIG } from "./storage.js";

// ─── Plugin Options ──────────────────────────────────────────────

export interface FormsPluginOptions {
	/** Default spam protection for new forms */
	defaultSpamProtection?: "none" | "honeypot" | "turnstile";
}

// ─── Plugin Descriptor (for live.config.ts) ──────────────────────

export function formsPlugin(
	options: FormsPluginOptions = {},
): PluginDescriptor<FormsPluginOptions> {
	return {
		id: "emdash-forms",
		version: "0.0.1",
		entrypoint: "@emdash-cms/plugin-forms",
		adminEntry: "@emdash-cms/plugin-forms/admin",
		componentsEntry: "@emdash-cms/plugin-forms/astro",
		options,
		capabilities: ["email:send", "write:media", "network:fetch"],
		allowedHosts: ["*"],
		adminPages: [
			{ path: "/", label: "Forms", icon: "list" },
			{ path: "/submissions", label: "Submissions", icon: "inbox" },
		],
		adminWidgets: [{ id: "recent-submissions", title: "Recent Submissions", size: "half" }],
		// Descriptor uses flat indexes only; composite indexes are in definePlugin
		storage: {
			forms: { indexes: ["status", "createdAt"], uniqueIndexes: ["slug"] },
			submissions: { indexes: ["formId", "status", "starred", "createdAt"] },
		},
	};
}

// ─── Plugin Implementation ───────────────────────────────────────

export function createPlugin(_options: FormsPluginOptions = {}): ResolvedPlugin {
	return definePlugin({
		id: "emdash-forms",
		version: "0.0.1",
		capabilities: ["email:send", "write:media", "network:fetch"],
		allowedHosts: ["*"],

		storage: FORMS_STORAGE_CONFIG,

		hooks: {
			"plugin:activate": {
				handler: async (_event, ctx) => {
					// Schedule weekly cleanup for expired submissions
					if (ctx.cron) {
						await ctx.cron.schedule("cleanup", { schedule: "@weekly" });
					}
				},
			},

			cron: {
				handler: async (event, ctx) => {
					if (event.name === "cleanup") {
						await handleCleanup(ctx);
					} else if (event.name.startsWith("digest:")) {
						const formId = event.name.slice("digest:".length);
						await handleDigest(formId, ctx);
					}
				},
			},
		},

		// Route handlers are typed with specific input schemas but the route record
		// erases the generic to `unknown`. The cast is safe because the input schema
		// guarantees the runtime shape matches the handler's expected type.
		routes: {
			// --- Public routes ---

			submit: {
				public: true,
				input: submitSchema,
				handler: submitHandler as never,
			},

			definition: {
				public: true,
				input: definitionSchema,
				handler: definitionHandler as never,
			},

			// --- Admin routes (require auth) ---

			"forms/list": {
				handler: formsListHandler,
			},
			"forms/create": {
				input: formCreateSchema,
				handler: formsCreateHandler as never,
			},
			"forms/update": {
				input: formUpdateSchema,
				handler: formsUpdateHandler as never,
			},
			"forms/delete": {
				input: formDeleteSchema,
				handler: formsDeleteHandler as never,
			},
			"forms/duplicate": {
				input: formDuplicateSchema,
				handler: formsDuplicateHandler as never,
			},

			"submissions/list": {
				input: submissionsListSchema,
				handler: submissionsListHandler as never,
			},
			"submissions/get": {
				input: submissionGetSchema,
				handler: submissionGetHandler as never,
			},
			"submissions/update": {
				input: submissionUpdateSchema,
				handler: submissionUpdateHandler as never,
			},
			"submissions/delete": {
				input: submissionDeleteSchema,
				handler: submissionDeleteHandler as never,
			},
			"submissions/export": {
				input: exportSchema,
				handler: exportHandler as never,
			},

			"settings/turnstile-status": {
				handler: async (ctx) => {
					const siteKey = await ctx.kv.get<string>("settings:turnstileSiteKey");
					const secretKey = await ctx.kv.get<string>("settings:turnstileSecretKey");
					return {
						hasSiteKey: !!siteKey,
						hasSecretKey: !!secretKey,
					};
				},
			},
		},

		admin: {
			settingsSchema: {
				turnstileSiteKey: { type: "string", label: "Turnstile Site Key" },
				turnstileSecretKey: { type: "secret", label: "Turnstile Secret Key" },
			},
			pages: [
				{ path: "/", label: "Forms", icon: "list" },
				{ path: "/submissions", label: "Submissions", icon: "inbox" },
			],
			widgets: [{ id: "recent-submissions", title: "Recent Submissions", size: "half" }],
			portableTextBlocks: [
				{
					type: "emdash-form",
					label: "Form",
					icon: "form",
					description: "Embed a form",
					fields: [
						{
							type: "select",
							action_id: "formId",
							label: "Form",
							options: [],
							optionsRoute: "forms/list",
						},
					],
				},
			],
		},
	});
}

export default createPlugin;

// Re-export types for consumers
export type * from "./types.js";
export type { FormsStorage } from "./storage.js";

```

File: /Users/masonjames/Projects/emdash/packages/plugins/forms/src/handlers/forms.ts
```ts
/**
 * Form CRUD route handlers.
 *
 * Admin-only routes for managing form definitions.
 */

import type { RouteContext, StorageCollection } from "emdash";
import { PluginRouteError } from "emdash";
import { ulid } from "ulidx";

import type {
	FormCreateInput,
	FormDeleteInput,
	FormDuplicateInput,
	FormUpdateInput,
} from "../schemas.js";
import type { FormDefinition } from "../types.js";

/** Typed access to plugin storage collections */
function forms(ctx: RouteContext): StorageCollection<FormDefinition> {
	return ctx.storage.forms as StorageCollection<FormDefinition>;
}

function submissions(ctx: RouteContext): StorageCollection {
	return ctx.storage.submissions as StorageCollection;
}

// ─── List Forms ──────────────────────────────────────────────────

export async function formsListHandler(ctx: RouteContext) {
	const result = await forms(ctx).query({
		orderBy: { createdAt: "desc" },
		limit: 100,
	});

	return {
		items: result.items.map((item) => ({ id: item.id, ...item.data })),
		hasMore: result.hasMore,
		cursor: result.cursor,
	};
}

// ─── Create Form ─────────────────────────────────────────────────

export async function formsCreateHandler(ctx: RouteContext<FormCreateInput>) {
	const input = ctx.input;

	// Check slug uniqueness
	const existing = await forms(ctx).query({
		where: { slug: input.slug },
		limit: 1,
	});
	if (existing.items.length > 0) {
		throw PluginRouteError.conflict(`A form with slug "${input.slug}" already exists`);
	}

	// Validate field names are unique across all pages
	validateFieldNames(input.pages);

	const now = new Date().toISOString();
	const id = ulid();
	const form: FormDefinition = {
		name: input.name,
		slug: input.slug,
		pages: input.pages,
		settings: {
			confirmationMessage: input.settings.confirmationMessage ?? "Thank you for your submission.",
			redirectUrl: input.settings.redirectUrl || undefined,
			notifyEmails: input.settings.notifyEmails ?? [],
			digestEnabled: input.settings.digestEnabled ?? false,
			digestHour: input.settings.digestHour ?? 9,
			autoresponder: input.settings.autoresponder,
			webhookUrl: input.settings.webhookUrl || undefined,
			retentionDays: input.settings.retentionDays ?? 0,
			spamProtection: input.settings.spamProtection ?? "honeypot",
			submitLabel: input.settings.submitLabel ?? "Submit",
			nextLabel: input.settings.nextLabel,
			prevLabel: input.settings.prevLabel,
		},
		status: "active",
		submissionCount: 0,
		lastSubmissionAt: null,
		createdAt: now,
		updatedAt: now,
	};

	await forms(ctx).put(id, form);

	// Schedule digest cron if enabled
	if (form.settings.digestEnabled && ctx.cron) {
		await ctx.cron.schedule(`digest:${id}`, {
			schedule: `0 ${form.settings.digestHour} * * *`,
		});
	}

	return { id, ...form };
}

// ─── Update Form ─────────────────────────────────────────────────

export async function formsUpdateHandler(ctx: RouteContext<FormUpdateInput>) {
	const input = ctx.input;

	const existing = await forms(ctx).get(input.id);
	if (!existing) {
		throw PluginRouteError.notFound("Form not found");
	}

	// Check slug uniqueness if changing
	if (input.slug && input.slug !== existing.slug) {
		const slugCheck = await forms(ctx).query({
			where: { slug: input.slug },
			limit: 1,
		});
		if (slugCheck.items.length > 0) {
			throw PluginRouteError.conflict(`A form with slug "${input.slug}" already exists`);
		}
	}

	if (input.pages) {
		validateFieldNames(input.pages);
	}

	const updated: FormDefinition = {
		...existing,
		name: input.name ?? existing.name,
		slug: input.slug ?? existing.slug,
		pages: input.pages ?? existing.pages,
		settings: input.settings ? { ...existing.settings, ...input.settings } : existing.settings,
		status: input.status ?? existing.status,
		updatedAt: new Date().toISOString(),
	};

	// Clean up empty strings
	if (updated.settings.redirectUrl === "") updated.settings.redirectUrl = undefined;
	if (updated.settings.webhookUrl === "") updated.settings.webhookUrl = undefined;

	await forms(ctx).put(input.id, updated);

	// Update digest cron if settings changed
	if (ctx.cron) {
		if (updated.settings.digestEnabled && !existing.settings.digestEnabled) {
			await ctx.cron.schedule(`digest:${input.id}`, {
				schedule: `0 ${updated.settings.digestHour} * * *`,
			});
		} else if (!updated.settings.digestEnabled && existing.settings.digestEnabled) {
			await ctx.cron.cancel(`digest:${input.id}`);
		} else if (
			updated.settings.digestEnabled &&
			updated.settings.digestHour !== existing.settings.digestHour
		) {
			await ctx.cron.schedule(`digest:${input.id}`, {
				schedule: `0 ${updated.settings.digestHour} * * *`,
			});
		}
	}

	return { id: input.id, ...updated };
}

// ─── Delete Form ─────────────────────────────────────────────────

export async function formsDeleteHandler(ctx: RouteContext<FormDeleteInput>) {
	const input = ctx.input;

	const existing = await forms(ctx).get(input.id);
	if (!existing) {
		throw PluginRouteError.notFound("Form not found");
	}

	// Delete associated submissions if requested
	if (input.deleteSubmissions) {
		await deleteFormSubmissions(input.id, ctx);
	}

	// Cancel digest cron
	if (ctx.cron) {
		await ctx.cron.cancel(`digest:${input.id}`).catch(() => {});
	}

	await forms(ctx).delete(input.id);

	return { deleted: true };
}

// ─── Duplicate Form ──────────────────────────────────────────────

export async function formsDuplicateHandler(ctx: RouteContext<FormDuplicateInput>) {
	const input = ctx.input;

	const existing = await forms(ctx).get(input.id);
	if (!existing) {
		throw PluginRouteError.notFound("Form not found");
	}

	const newSlug = input.slug ?? `${existing.slug}-copy`;
	const newName = input.name ?? `${existing.name} (Copy)`;

	// Check slug uniqueness
	const slugCheck = await forms(ctx).query({
		where: { slug: newSlug },
		limit: 1,
	});
	if (slugCheck.items.length > 0) {
		throw PluginRouteError.conflict(`A form with slug "${newSlug}" already exists`);
	}

	const now = new Date().toISOString();
	const id = ulid();
	const duplicate: FormDefinition = {
		...existing,
		name: newName,
		slug: newSlug,
		submissionCount: 0,
		lastSubmissionAt: null,
		createdAt: now,
		updatedAt: now,
	};

	await forms(ctx).put(id, duplicate);

	return { id, ...duplicate };
}

// ─── Helpers ─────────────────────────────────────────────────────

function validateFieldNames(pages: Array<{ fields: Array<{ name: string }> }>) {
	const names = new Set<string>();
	for (const page of pages) {
		for (const field of page.fields) {
			if (names.has(field.name)) {
				throw PluginRouteError.badRequest(`Duplicate field name "${field.name}" across form pages`);
			}
			names.add(field.name);
		}
	}
}

/** Delete all submissions for a form, including media files */
async function deleteFormSubmissions(formId: string, ctx: RouteContext) {
	let cursor: string | undefined;
	do {
		const batch = await submissions(ctx).query({
			where: { formId },
			limit: 100,
			cursor,
		});

		// Delete associated media files
		if (ctx.media && "delete" in ctx.media) {
			const mediaWithDelete = ctx.media as { delete(id: string): Promise<boolean> };
			for (const item of batch.items) {
				const sub = item.data as { files?: Array<{ mediaId: string }> };
				if (sub.files) {
					for (const file of sub.files) {
						await mediaWithDelete.delete(file.mediaId).catch(() => {});
					}
				}
			}
		}

		const ids = batch.items.map((item) => item.id);
		if (ids.length > 0) {
			await submissions(ctx).deleteMany(ids);
		}

		cursor = batch.cursor;
	} while (cursor);
}

```

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/coming-from/wordpress.mdx
```mdx
---
title: EmDash for WordPress Developers
description: A guide to EmDash's features and concepts for developers familiar with WordPress
---

import { Aside, Card, CardGrid, Tabs, TabItem } from "@astrojs/starlight/components";

EmDash brings familiar WordPress concepts—posts, pages, taxonomies, menus, widgets, and a media library—into a modern Astro stack. Your content management knowledge transfers directly.

## What Stays Familiar

The concepts you know from WordPress are first-class features in EmDash:

- **Collections** work like Custom Post Types—define your content structure, query it in templates
- **Taxonomies** work the same way—hierarchical (like categories) and flat (like tags)
- **Menus** with drag-and-drop ordering and nested items
- **Widget Areas** for sidebars and dynamic content regions
- **Media library** with upload, organization, and image management
- **Admin UI** that content editors can use without touching code

<Aside type="tip">
	You don't need to know React or any specific JavaScript framework. Astro components use HTML with
	simple template expressions—closer to PHP templates than to React.
</Aside>

## What's Different

The implementation changes, but the mental model stays the same:

<CardGrid>
	<Card title="TypeScript instead of PHP" icon="seti:typescript">
		Templates are Astro components. The syntax is cleaner, but the concept is the same: server code
		that outputs HTML.
	</Card>
	<Card title="Content APIs instead of WP_Query" icon="document">
		Query functions like `getEmDashCollection()` replace `WP_Query`. No SQL, just function calls.
	</Card>
	<Card title="File-based routing" icon="puzzle">
		Files in `src/pages/` become URLs. No rewrite rules or template hierarchy to memorize.
	</Card>
	<Card title="Components instead of template parts" icon="rocket">
		Import and use components. Same idea as `get_template_part()`, better organization.
	</Card>
</CardGrid>

## Quick Reference

| WordPress              | EmDash                             | Notes                             |
| ---------------------- | ------------------------------------ | --------------------------------- |
| Custom Post Types      | Collections                          | Define via admin UI or API        |
| `WP_Query`             | `getEmDashCollection()`            | Filters, limits, taxonomy queries |
| `get_post()`           | `getEmDashEntry()`                 | Returns entry or null             |
| Categories/Tags        | Taxonomies                           | Hierarchical support preserved    |
| `register_nav_menus()` | `getMenu()`                          | First-class menu support          |
| `register_sidebar()`   | `getWidgetArea()`                    | First-class widget areas          |
| `bloginfo('name')`     | `getSiteSetting("title")`            | Site settings API                 |
| `the_content()`        | `<PortableText />`                   | Structured content rendering      |
| Shortcodes             | Portable Text blocks                 | Custom components                 |
| `add_action/filter()`  | Plugin hooks                         | `content:beforeSave`, etc.        |
| `wp_options`           | `ctx.kv`                             | Key-value storage                 |
| Theme directory        | `src/` directory                     | Components, layouts, pages        |
| `functions.php`        | `astro.config.mjs` + EmDash config | Build and runtime config          |

## Content APIs

### Querying Collections

WordPress queries use `WP_Query` or helper functions. EmDash uses typed query functions.

<Tabs>
	<TabItem label="WordPress">
```php title="archive.php"
<?php
$posts = new WP_Query([
  'post_type' => 'post',
  'posts_per_page' => 10,
  'post_status' => 'publish',
  'category_name' => 'news',
]);

while ($posts->have_posts()) :
$posts->the_post();
?>

  <h2><?php the_title(); ?></h2>
  <?php the_excerpt(); ?>
<?php endwhile; ?>
```
	</TabItem>
	<TabItem label="EmDash">
```astro title="src/pages/posts/index.astro"
---
import { getEmDashCollection } from "emdash";

const { entries: posts } = await getEmDashCollection("posts", {
status: "published",
limit: 10,
where: { category: "news" },
});

---

{posts.map((post) => (

  <article>
    <h2>{post.data.title}</h2>
    <p>{post.data.excerpt}</p>
  </article>
))}
```
	</TabItem>
</Tabs>

### Getting a Single Entry

<Tabs>
	<TabItem label="WordPress">
```php title="single.php"
<?php
$post = get_post($id);
?>
<article>
  <h1><?php echo $post->post_title; ?></h1>
  <?php echo apply_filters('the_content', $post->post_content); ?>
</article>
```
	</TabItem>
	<TabItem label="EmDash">
```astro title="src/pages/posts/[slug].astro"
---
import { getEmDashEntry } from "emdash";
import { PortableText } from "emdash/ui";

const { slug } = Astro.params;
const { entry: post } = await getEmDashEntry("posts", slug);

## if (!post) return Astro.redirect("/404");

<article>
  <h1>{post.data.title}</h1>
  <PortableText value={post.data.content} />
</article>
```
	</TabItem>
</Tabs>

## Template Hierarchy

WordPress uses a template hierarchy to select which file renders a page. Astro uses explicit file-based routing.

| WordPress Template          | EmDash Equivalent                 |
| --------------------------- | ----------------------------------- |
| `index.php`                 | `src/pages/index.astro`             |
| `single.php`                | `src/pages/posts/[slug].astro`      |
| `single-{type}.php`         | `src/pages/{type}/[slug].astro`     |
| `page.php`                  | `src/pages/pages/[slug].astro`      |
| `archive.php`               | `src/pages/posts/index.astro`       |
| `archive-{type}.php`        | `src/pages/{type}/index.astro`      |
| `category.php`              | `src/pages/categories/[slug].astro` |
| `tag.php`                   | `src/pages/tags/[slug].astro`       |
| `search.php`                | `src/pages/search.astro`            |
| `404.php`                   | `src/pages/404.astro`               |
| `header.php` / `footer.php` | `src/layouts/Base.astro`            |
| `sidebar.php`               | `src/components/Sidebar.astro`      |

<Aside type="tip">
	Astro's routing is more explicit than WordPress's hierarchy. Each route is a file. Dynamic
	segments use `[param]` syntax.
</Aside>

## Template Parts → Components

WordPress template parts become Astro components:

<Tabs>
	<TabItem label="WordPress">
```php title="functions.php / template"
// In template:
get_template_part('template-parts/content', 'post');

// template-parts/content-post.php:

<article class="post">
  <h2><?php the_title(); ?></h2>
  <?php the_excerpt(); ?>
</article>
```
	</TabItem>
	<TabItem label="EmDash">
```astro title="src/components/PostCard.astro"
---
const { post } = Astro.props;
---

<article class="post">
	<h2>{post.data.title}</h2>
	<p>{post.data.excerpt}</p>
</article>
```

```astro title="src/pages/index.astro"
---
import PostCard from "../components/PostCard.astro";
import { getEmDashCollection } from "emdash";

const { entries: posts } = await getEmDashCollection("posts");
---

{posts.map((post) => <PostCard {post} />)}
```

    </TabItem>

</Tabs>

## Menus

EmDash has first-class menu support with automatic URL resolution:

<Tabs>
	<TabItem label="WordPress">
```php title="header.php"
<?php
wp_nav_menu([
  'theme_location' => 'primary',
  'container' => 'nav',
]);
?>
```
	</TabItem>
	<TabItem label="EmDash">
```astro title="src/components/Header.astro"
---
import { getMenu } from "emdash";

## const menu = await getMenu("primary");

<nav>
  <ul>
    {menu?.items.map((item) => (
      <li>
        <a href={item.url}>{item.label}</a>
      </li>
    ))}
  </ul>
</nav>
```
	</TabItem>
</Tabs>

Menus are created via the admin UI, seed files, or WordPress import.

## Widget Areas

Widget areas work like sidebars in WordPress:

<Tabs>
	<TabItem label="WordPress">
```php title="sidebar.php"
<?php if (is_active_sidebar('sidebar-1')) : ?>
  <aside>
    <?php dynamic_sidebar('sidebar-1'); ?>
  </aside>
<?php endif; ?>
```
	</TabItem>
	<TabItem label="EmDash">
```astro title="src/components/Sidebar.astro"
---
import { getWidgetArea } from "emdash";
import { PortableText } from "emdash/ui";

## const sidebar = await getWidgetArea("sidebar");

{sidebar && (

  <aside>
    {sidebar.widgets.map((widget) => {
      if (widget.type === "content") {
        return <PortableText value={widget.content} />;
      }
      // Handle other widget types
    })}
  </aside>
)}
```
	</TabItem>
</Tabs>

## Site Settings

Site options and customizer settings map to `getSiteSetting()`:

| WordPress                   | EmDash                       |
| --------------------------- | ------------------------------ |
| `bloginfo('name')`          | `getSiteSetting("title")`      |
| `bloginfo('description')`   | `getSiteSetting("tagline")`    |
| `get_custom_logo()`         | `getSiteSetting("logo")`       |
| `get_option('date_format')` | `getSiteSetting("dateFormat")` |
| `home_url()`                | `Astro.site`                   |

```ts
import { getSiteSetting } from "emdash";

const title = await getSiteSetting("title");
const logo = await getSiteSetting("logo"); // Returns { mediaId, alt, url }
```

## Taxonomies

Taxonomies work the same conceptually—hierarchical (like categories) or flat (like tags):

```ts
import { getTaxonomyTerms, getEntryTerms, getTerm } from "emdash";

// Get all categories
const categories = await getTaxonomyTerms("categories");

// Get a specific term
const news = await getTerm("categories", "news");

// Get terms for a post
const postCategories = await getEntryTerms("posts", postId, "categories");
```

## Hooks → Plugin System

WordPress hooks (`add_action`, `add_filter`) become EmDash plugin hooks:

| WordPress Hook  | EmDash Hook           | Purpose                      |
| --------------- | ----------------------- | ---------------------------- |
| `save_post`     | `content:beforeSave`    | Modify content before saving |
| `the_content`   | PortableText components | Transform rendered content   |
| `pre_get_posts` | Query options           | Filter queries               |
| `wp_head`       | Layout `<head>`         | Add head content             |
| `wp_footer`     | Layout before `</body>` | Add footer content           |

## What's Better in EmDash

<CardGrid>
	<Card title="Type Safety" icon="seti:typescript">
		TypeScript throughout. Collections, queries, and components are fully typed. No more guessing
		field names or return types.
	</Card>
	<Card title="Performance" icon="rocket">
		No PHP overhead. Static generation by default. Server rendering when needed. Edge deployment
		ready.
	</Card>
	<Card title="Modern DX" icon="laptop">
		Hot module replacement. Component-based architecture. Modern tooling (Vite, TypeScript, ESLint).
	</Card>
	<Card title="Git-based Deployments" icon="github">
		Code and templates in git. Content in the database. No FTP, no file permissions, no hacked
		sites.
	</Card>
</CardGrid>

### Preview Links

EmDash generates secure preview URLs with HMAC-signed tokens. Content editors can preview drafts without logging into production—share a link, not credentials.

### No Plugin Conflicts

WordPress plugin conflicts disappear. EmDash plugins run in isolated contexts with explicit APIs. No global state pollution.

## Content Editor Experience

Content editors use the EmDash admin panel, similar to wp-admin:

- **Dashboard** with recent activity
- **Collection listings** with search, filter, and bulk actions
- **Rich editor** for content (Portable Text, not Gutenberg)
- **Media library** with drag-and-drop upload
- **Menu builder** with drag-and-drop ordering
- **Widget area editor** for sidebar content

The editing experience is familiar. The technology underneath is modern.

## Migration Path

EmDash imports WordPress content directly:

1. Export from WordPress (Tools → Export)
2. Upload the `.xml` file in EmDash's admin
3. Map post types to collections
4. Import content and media

Posts, pages, taxonomies, menus, and media transfer. Gutenberg blocks convert to Portable Text. Custom fields are analyzed and mapped.

See the [WordPress Migration Guide](/migration/from-wordpress/) for complete instructions.

## Next Steps

- **[Getting Started](/getting-started/)** — Set up your first EmDash site
- **[Querying Content](/guides/querying-content/)** — Deep dive into content APIs
- **[Taxonomies](/guides/taxonomies/)** — Categories, tags, and custom taxonomies
- **[Menus](/guides/menus/)** — Navigation menus
- **[Migrate from WordPress](/migration/from-wordpress/)** — Import existing content

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

File: /Users/masonjames/Projects/emdash/packages/plugins/audit-log/src/index.ts
```ts
/**
 * Audit Log Plugin for EmDash CMS
 *
 * Tracks all content and media changes for compliance and debugging.
 *
 * Features:
 * - Logs create, update, delete operations
 * - Tracks before/after state for updates
 * - Records user information (when available)
 * - Provides admin UI for viewing audit history
 * - Configurable retention period (admin settings)
 * - Uses plugin storage for persistent audit trail
 *
 * Demonstrates:
 * - Plugin storage with indexes and queries
 * - Admin-configurable settings schema
 * - Lifecycle hooks (install, activate, deactivate, uninstall)
 * - content:afterDelete hook
 */

import type { PluginDescriptor } from "emdash";

export interface AuditEntry {
	timestamp: string;
	action: "create" | "update" | "delete" | "media:upload" | "media:delete";
	collection?: string;
	resourceId: string;
	resourceType: "content" | "media";
	userId?: string;
	changes?: {
		before?: Record<string, unknown>;
		after?: Record<string, unknown>;
	};
	metadata?: Record<string, unknown>;
}

/**
 * Create the audit log plugin descriptor
 */
export function auditLogPlugin(): PluginDescriptor {
	return {
		id: "audit-log",
		version: "0.1.0",
		format: "standard",
		entrypoint: "@emdash-cms/plugin-audit-log/sandbox",
		capabilities: ["read:content"],
		storage: {
			entries: { indexes: ["timestamp", "action", "resourceType", "collection"] },
		},
		adminPages: [{ path: "/history", label: "Audit History", icon: "history" }],
		adminWidgets: [{ id: "recent-activity", title: "Recent Activity", size: "half" }],
	};
}

```

File: /Users/masonjames/Projects/emdash/packages/core/src/plugins/sandbox/types.ts
```ts
/**
 * Plugin Sandbox Types
 *
 * Defines interfaces for running plugins in sandboxed V8 isolates.
 * The SandboxRunner interface is implemented by platform adapters
 * (e.g., Cloudflare Worker Loader) to provide isolation.
 *
 */

import type { Kysely } from "kysely";

import type { Database } from "../../database/types.js";
import type { PluginManifest, RequestMeta } from "../types.js";

/**
 * Resource limits for sandboxed plugins.
 * Enforced by the sandbox runtime (e.g., Worker Loader).
 */
export interface ResourceLimits {
	/** CPU time per invocation in milliseconds (default: 50ms) */
	cpuMs?: number;
	/** Memory limit in MB (default: 128MB) */
	memoryMb?: number;
	/** Maximum subrequests per invocation (default: 10) */
	subrequests?: number;
	/** Wall-clock time limit in milliseconds (default: 30000ms) */
	wallTimeMs?: number;
}

/**
 * Storage interface for loading plugin code.
 * Could be R2, local filesystem, or any other storage backend.
 */
export interface PluginCodeStorage {
	/** Get plugin bundle code by path */
	get(path: string): Promise<string | null>;
	/** Check if a bundle exists */
	exists(path: string): Promise<boolean>;
}

/**
 * Serialized email message for sandbox RPC transport.
 * Matches the core EmailMessage type but uses only serializable fields.
 */
export interface SandboxEmailMessage {
	to: string;
	subject: string;
	text: string;
	html?: string;
}

/**
 * Callback for sending email from a sandboxed plugin.
 * The sandbox runner wires this up from the EmailPipeline.
 *
 * @param message - The email message to send
 * @param pluginId - The sending plugin's ID (used as source)
 */
export type SandboxEmailSendCallback = (
	message: SandboxEmailMessage,
	pluginId: string,
) => Promise<void>;

/**
 * Options for creating a sandbox runner
 */
export interface SandboxOptions {
	/** Storage interface for loading plugin code */
	storage?: PluginCodeStorage;
	/** Database for bridge operations */
	db: Kysely<Database>;
	/** Default resource limits */
	limits?: ResourceLimits;
	/** Site info for plugin context (injected into wrapper at generation time) */
	siteInfo?: { name: string; url: string; locale: string };
	/** Email send callback, wired from the EmailPipeline by the runtime */
	emailSend?: SandboxEmailSendCallback;
}

/**
 * A sandboxed plugin instance.
 * Provides methods to invoke hooks and routes in the isolated environment.
 */
export interface SandboxedPlugin {
	/** Unique identifier: `${manifest.id}:${manifest.version}` */
	readonly id: string;

	/**
	 * Invoke a hook in the sandboxed plugin.
	 *
	 * @param hookName - Name of the hook (e.g., "content:beforeSave")
	 * @param event - Event data to pass to the hook
	 * @returns Hook result (transformed content, void, etc.)
	 */
	invokeHook(hookName: string, event: unknown): Promise<unknown>;

	/**
	 * Invoke an API route in the sandboxed plugin.
	 *
	 * @param routeName - Name of the route
	 * @param input - Validated input data
	 * @param request - Serialized request info for context
	 * @returns Route response data
	 */
	invokeRoute(routeName: string, input: unknown, request: SerializedRequest): Promise<unknown>;

	/**
	 * Terminate the sandboxed plugin.
	 * Releases resources and prevents further invocations.
	 */
	terminate(): Promise<void>;
}

/**
 * Serialized request for RPC transport.
 * Worker Loader can't pass Request objects directly.
 */
export interface SerializedRequest {
	url: string;
	method: string;
	headers: Record<string, string>;
	/** Normalized request metadata extracted before RPC serialization */
	meta: RequestMeta;
}

/**
 * Sandbox runner interface.
 * Platform adapters implement this to provide plugin isolation.
 */
export interface SandboxRunner {
	/**
	 * Check if sandboxing is available on this platform.
	 * Returns false for platforms that don't support isolation.
	 */
	isAvailable(): boolean;

	/**
	 * Load a sandboxed plugin from code.
	 *
	 * @param manifest - Plugin manifest with metadata and capabilities
	 * @param code - The bundled plugin JavaScript code
	 * @returns A sandboxed plugin instance
	 * @throws If sandboxing is not available or plugin can't be loaded
	 */
	load(manifest: PluginManifest, code: string): Promise<SandboxedPlugin>;

	/**
	 * Set the email send callback for sandboxed plugins.
	 * Called after the EmailPipeline is created, since the pipeline
	 * doesn't exist when the sandbox runner is constructed.
	 */
	setEmailSend(callback: SandboxEmailSendCallback | null): void;

	/**
	 * Terminate all loaded sandboxed plugins.
	 * Called during shutdown or when reconfiguring.
	 */
	terminateAll(): Promise<void>;
}

/**
 * Factory function type for creating sandbox runners.
 * Exported by platform adapters (e.g., @emdash-cms/adapter-cloudflare/sandbox).
 *
 * @example
 * ```typescript
 * // In @emdash-cms/adapter-cloudflare/sandbox.ts
 * export const createSandboxRunner: SandboxRunnerFactory = (options) => {
 *   return new CloudflareSandboxRunner(options);
 * };
 * ```
 */
export type SandboxRunnerFactory = (options: SandboxOptions) => SandboxRunner;

```

File: /Users/masonjames/Projects/emdash/packages/marketplace/src/audit/types.ts
```ts
export interface AuditResult {
	verdict: "pass" | "warn" | "fail";
	riskScore: number;
	findings: AuditFinding[];
	summary: string;
	model: string;
	durationMs: number;
}

export interface AuditFinding {
	severity: "critical" | "high" | "medium" | "low" | "info";
	title: string;
	description: string;
	category: string;
	location?: string;
}

export interface AuditInput {
	manifest: {
		id: string;
		version: string;
		capabilities: string[];
		allowedHosts?: string[];
		admin?: { settingsSchema?: Record<string, unknown> };
		[key: string]: unknown;
	};
	backendCode: string;
	adminCode?: string;
}

export interface Auditor {
	audit(input: AuditInput): Promise<AuditResult>;
}

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

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/migration/porting-plugins.mdx
```mdx
---
title: Porting WordPress Plugins
description: Convert WordPress plugins to EmDash plugins using the Plugin API
---

import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

Many WordPress plugins can be ported to EmDash. The plugin model is different—TypeScript instead of PHP, hooks instead of actions/filters, structured storage instead of wp_options—but most functionality maps cleanly.

## Portability Assessment

Not all plugins make sense to port. Assess candidates before starting.

<CardGrid>
	<Card title="Good candidates" icon="approve-check">
		Custom fields, SEO plugins, content processors, admin UI extensions, analytics, social sharing, forms
	</Card>
	<Card title="Poor candidates" icon="close">
		Multisite features, WooCommerce/Gutenberg integrations, plugins that patch WordPress core internals
	</Card>
</CardGrid>

## Plugin Structure Comparison

<Tabs>
<TabItem label="WordPress">
```
wp-content/plugins/my-plugin/
├── my-plugin.php       # Main file with plugin header
├── includes/
│   ├── class-admin.php
│   └── class-api.php
└── admin/
    └── js/
```
</TabItem>
<TabItem label="EmDash">
```
my-plugin/
├── src/
│   ├── index.ts    # Plugin definition (definePlugin)
│   └── admin.tsx   # Admin UI exports (React)
├── package.json
└── tsconfig.json
```
</TabItem>
</Tabs>

## Hooks Mapping

WordPress uses `add_action()` and `add_filter()` with string hook names. EmDash uses typed hooks declared in the plugin definition.

### Lifecycle Hooks

| WordPress                    | EmDash            | Notes                                    |
| ---------------------------- | ------------------- | ---------------------------------------- |
| `register_activation_hook()` | `plugin:install`    | Runs once on first install               |
| Plugin enabled               | `plugin:activate`   | Runs when enabled                        |
| Plugin disabled              | `plugin:deactivate` | Runs when disabled                       |
| `register_uninstall_hook()`  | `plugin:uninstall`  | `event.deleteData` indicates user choice |

### Content Hooks

| WordPress             | EmDash               | Notes                                      |
| --------------------- | ---------------------- | ------------------------------------------ |
| `wp_insert_post_data` | `content:beforeSave`   | Return modified content or throw to cancel |
| `save_post`           | `content:afterSave`    | Side effects after save                    |
| `before_delete_post`  | `content:beforeDelete` | Return `false` to cancel                   |
| `deleted_post`        | `content:afterDelete`  | Cleanup after deletion                     |

<Tabs>
<TabItem label="WordPress">
```php
add_action('save_post', function($post_id, $post, $update) {
    if ($post->post_type !== 'product') return;

    $price = get_post_meta($post_id, 'price', true);
    if ($price > 1000) {
        update_post_meta($post_id, 'is_premium', true);
    }

}, 10, 3);

````
</TabItem>
<TabItem label="EmDash">
```typescript
hooks: {
    "content:afterSave": async (event, ctx) => {
        if (event.collection !== "products") return;

        const price = event.content.price as number;
        if (price > 1000) {
            await ctx.kv.set(`premium:${event.content.id}`, true);
        }
    },
}
````

</TabItem>
</Tabs>

### Media Hooks

| WordPress                    | EmDash             | Notes                 |
| ---------------------------- | -------------------- | --------------------- |
| `wp_handle_upload_prefilter` | `media:beforeUpload` | Validate or transform |
| `add_attachment`             | `media:afterUpload`  | React after upload    |

## Storage Mapping

### Options API → KV Store

<Tabs>
<TabItem label="WordPress">
```php
$api_key = get_option('my_plugin_api_key', '');
update_option('my_plugin_api_key', 'abc123');
delete_option('my_plugin_api_key');
```
</TabItem>
<TabItem label="EmDash">
```typescript
const apiKey = await ctx.kv.get<string>("settings:apiKey") ?? "";
await ctx.kv.set("settings:apiKey", "abc123");
await ctx.kv.delete("settings:apiKey");
```
</TabItem>
</Tabs>

<Aside>
	Use `settings:` prefix for user-configurable values and `state:` prefix for internal plugin state.
</Aside>

### Custom Tables → Storage Collections

<Tabs>
<TabItem label="WordPress">
```php
global $wpdb;
$table = $wpdb->prefix . 'my_plugin_items';

// Insert
$wpdb->insert($table, ['name' => 'Item 1', 'status' => 'active']);

// Query
$items = $wpdb->get_results(
"SELECT \* FROM $table WHERE status = 'active' LIMIT 10"
);

````
</TabItem>
<TabItem label="EmDash">
```typescript
// Declare in plugin definition
storage: {
    items: {
        indexes: ["status", "createdAt"],
    },
},

// In hooks or routes:
await ctx.storage.items.put("item-1", {
    name: "Item 1",
    status: "active",
    createdAt: new Date().toISOString(),
});

const result = await ctx.storage.items.query({
    where: { status: "active" },
    limit: 10,
});
````

</TabItem>
</Tabs>

## Settings Schema

WordPress uses the Settings API for admin forms. EmDash uses a declarative schema that auto-generates UI.

<Tabs>
<TabItem label="WordPress">
```php
add_action('admin_init', function() {
    register_setting('my_plugin', 'my_plugin_api_key');
    add_settings_section('main', 'Settings', null, 'my-plugin');
    add_settings_field('api_key', 'API Key', function() {
        $value = get_option('my_plugin_api_key');
        echo '<input type="text" name="my_plugin_api_key"
              value="' . esc_attr($value) . '">';
    }, 'my-plugin', 'main');
});
```
</TabItem>
<TabItem label="EmDash">
```typescript
admin: {
    settingsSchema: {
        apiKey: {
            type: "secret",
            label: "API Key",
            description: "Your API key from the dashboard",
        },
        enabled: {
            type: "boolean",
            label: "Enabled",
            default: true,
        },
        limit: {
            type: "number",
            label: "Item Limit",
            default: 100,
            min: 1,
            max: 1000,
        },
    },
}
```
</TabItem>
</Tabs>

## Admin UI

WordPress admin pages are PHP. EmDash uses React components.

```tsx title="src/admin.tsx"
import { useState, useEffect } from "react";

export const widgets = {
	summary: function SummaryWidget() {
		const [count, setCount] = useState(0);

		useEffect(() => {
			fetch("/_emdash/api/plugins/my-plugin/status")
				.then((r) => r.json())
				.then((data) => setCount(data.count));
		}, []);

		return <div>Total items: {count}</div>;
	},
};

export const pages = {
	settings: function SettingsPage() {
		// React component for settings page
		return <div>Settings content</div>;
	},
};
```

Register in the plugin definition:

```typescript title="src/index.ts"
admin: {
    entry: "@my-org/my-plugin/admin",
    pages: [{ path: "/settings", label: "Dashboard" }],
    widgets: [{ id: "summary", title: "Summary", size: "half" }],
},
```

## REST API → Plugin Routes

<Tabs>
<TabItem label="WordPress">
```php
register_rest_route('my-plugin/v1', '/items', [
    'methods' => 'GET',
    'callback' => function($request) {
        global $wpdb;
        $items = $wpdb->get_results("SELECT * FROM items LIMIT 50");
        return new WP_REST_Response($items);
    },
]);
```
</TabItem>
<TabItem label="EmDash">
```typescript
routes: {
    items: {
        handler: async (ctx) => {
            const result = await ctx.storage.items.query({ limit: 50 });
            return { items: result.items };
        },
    },
},
```
</TabItem>
</Tabs>

Routes are available at `/_emdash/api/plugins/{plugin-id}/{route-name}`.

## Porting Process

<Steps>

1. **Analyze the WordPress plugin**

   Document what it does: hooks, database operations, admin pages, REST endpoints.

2. **Map to EmDash concepts**

   WordPress hooks → EmDash hooks. `wp_options` → `ctx.kv`. Custom tables → Storage collections. Admin pages → React components. REST endpoints → Plugin routes.

3. **Create the plugin skeleton**

   ```typescript title="src/index.ts"
   import { definePlugin } from "emdash";

   export function createPlugin() {
   	return definePlugin({
   		id: "my-ported-plugin",
   		version: "1.0.0",
   		capabilities: [],
   		storage: {},
   		hooks: {},
   		routes: {},
   		admin: {},
   	});
   }
   ```

4. **Implement in order**

   Storage → Hooks → Admin UI → Routes

5. **Test thoroughly**

   Verify hooks fire correctly, storage works, and admin UI renders.

</Steps>

## Example: Read Time Plugin

<Tabs>
<TabItem label="WordPress">
```php
add_filter('wp_insert_post_data', function($data, $postarr) {
    if ($data['post_type'] !== 'post') return $data;

    $content = strip_tags($data['post_content']);
    $word_count = str_word_count($content);
    $read_time = ceil($word_count / 200);

    if (!empty($postarr['ID'])) {
        update_post_meta($postarr['ID'], '_read_time', $read_time);
    }
    return $data;

}, 10, 2);

````
</TabItem>
<TabItem label="EmDash">
```typescript title="src/index.ts"
export function createPlugin() {
    return definePlugin({
        id: "read-time",
        version: "1.0.0",

        admin: {
            settingsSchema: {
                wordsPerMinute: {
                    type: "number",
                    label: "Words per minute",
                    default: 200,
                    min: 100,
                    max: 400,
                },
            },
        },

        hooks: {
            "content:beforeSave": async (event, ctx) => {
                if (event.collection !== "posts") return;

                const wpm = await ctx.kv.get<number>("settings:wordsPerMinute") ?? 200;
                const text = JSON.stringify(event.content.body || "");
                const readTime = Math.ceil(text.split(/\s+/).length / wpm);

                return { ...event.content, readTime };
            },
        },
    });
}
````

</TabItem>
</Tabs>

<Aside type="tip" title="AI-Assisted Porting">
	Plugin porting is more nuanced than theme porting, but AI agents still help significantly. Provide
	the WordPress plugin code along with EmDash's Plugin API documentation, and the agent can
	generate a reasonable first draft. Complex plugins may need multiple iterations.
</Aside>

## Capabilities

Plugins must declare required capabilities for security sandboxing:

| Capability      | Provides                      | Use Case            |
| --------------- | ----------------------------- | ------------------- |
| `network:fetch` | `ctx.http.fetch()`            | External API calls  |
| `read:content`  | `ctx.content.get()`, `list()` | Reading CMS content |
| `write:content` | `ctx.content.create()`, etc.  | Modifying content   |
| `read:media`    | `ctx.media.get()`, `list()`   | Reading media       |
| `write:media`   | `ctx.media.getUploadUrl()`    | Uploading media     |

## Common Gotchas

**No global state** — Use storage instead of global variables.

**Async everything** — Always `await` storage and API calls.

**No direct SQL** — Use structured storage collections.

**No file system** — Use the media API for files.

## Next Steps

- [Hooks Reference](/plugins/hooks/) — All hooks with signatures
- [Storage API](/plugins/storage/) — Collections and queries
- [Settings](/plugins/settings/) — Settings schema and KV store
- [Admin UI](/plugins/admin-ui/) — Building admin pages

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

File: /Users/masonjames/Projects/emdash/packages/marketplace/src/routes/public.ts
```ts
import { Hono } from "hono";

import {
	getInstallCount,
	getLatestVersion,
	getPluginVersion,
	getPluginVersions,
	getPluginWithAuthor,
	searchPlugins,
} from "../db/queries.js";

export const publicRoutes = new Hono<{ Bindings: Env }>();

// ── GET /auth/discovery — Auth config for CLI ───────────────────

publicRoutes.get("/auth/discovery", (c) => {
	return c.json({
		github: {
			clientId: c.env.GITHUB_CLIENT_ID,
			deviceAuthorizationEndpoint: "https://github.com/login/device/code",
			tokenEndpoint: "https://github.com/login/oauth/access_token",
		},
		marketplace: {
			deviceTokenEndpoint: "/api/v1/auth/github/device",
		},
	});
});

// ── GET /plugins — Search/list plugins ──────────────────────────

publicRoutes.get("/plugins", async (c) => {
	const url = new URL(c.req.url);
	const q = url.searchParams.get("q") ?? undefined;
	const capability = url.searchParams.get("capability") ?? undefined;
	const sortParam = url.searchParams.get("sort");
	const validSorts = new Set(["installs", "updated", "created", "name"]);
	let sort: "installs" | "updated" | "created" | "name" | undefined;
	if (sortParam && validSorts.has(sortParam)) {
		// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- validated by Set.has check above
		sort = sortParam as "installs" | "updated" | "created" | "name";
	}
	const cursor = url.searchParams.get("cursor") ?? undefined;
	const limitStr = url.searchParams.get("limit");
	const limit = limitStr ? parseInt(limitStr, 10) : undefined;

	const baseUrl = url.origin;

	try {
		const result = await searchPlugins(c.env.DB, { q, capability, sort, cursor, limit });

		const items = result.items.map((row) => ({
			id: row.id,
			name: row.name,
			description: row.description,
			author: {
				name: row.author_name,
				verified: row.author_verified === 1,
				avatarUrl: row.author_avatar_url,
			},
			capabilities: safeJsonParse<string[]>(row.capabilities, []),
			keywords: safeJsonParse<string[]>(row.keywords, []),
			installCount: row.install_count,
			hasIcon: row.has_icon === 1,
			iconUrl: `${baseUrl}/api/v1/plugins/${row.id}/icon`,
			latestVersion: row.latest_version
				? {
						version: row.latest_version,
						audit: row.latest_audit_verdict
							? {
									verdict: row.latest_audit_verdict,
									riskScore: row.latest_audit_risk_score ?? 0,
								}
							: undefined,
						imageAudit: row.latest_image_audit_verdict
							? {
									verdict: row.latest_image_audit_verdict,
								}
							: undefined,
					}
				: undefined,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}));

		return c.json({ items, nextCursor: result.nextCursor });
	} catch (err) {
		console.error("Failed to search plugins:", err);
		return c.json({ error: "Internal server error" }, 500);
	}
});

// ── GET /plugins/:id — Plugin detail ────────────────────────────

publicRoutes.get("/plugins/:id", async (c) => {
	const id = c.req.param("id");
	const baseUrl = new URL(c.req.url).origin;

	try {
		const plugin = await getPluginWithAuthor(c.env.DB, id);
		if (!plugin) return c.json({ error: "Plugin not found" }, 404);

		const latestVersion = await getLatestVersion(c.env.DB, id);
		const installCount = await getInstallCount(c.env.DB, id);

		const capabilities = safeJsonParse<string[]>(plugin.capabilities, []);
		const keywords = safeJsonParse<string[]>(plugin.keywords, []);

		const response: Record<string, unknown> = {
			id: plugin.id,
			name: plugin.name,
			description: plugin.description,
			author: {
				id: plugin.author_id,
				name: plugin.author_name,
				verified: plugin.author_verified === 1,
				avatarUrl: plugin.author_avatar_url,
			},
			capabilities,
			keywords,
			repositoryUrl: plugin.repository_url,
			homepageUrl: plugin.homepage_url,
			license: plugin.license,
			hasIcon: plugin.has_icon === 1,
			iconUrl: `${baseUrl}/api/v1/plugins/${plugin.id}/icon`,
			installCount,
			createdAt: plugin.created_at,
			updatedAt: plugin.updated_at,
		};

		let latestAuditRiskScore: number | null = null;
		if (latestVersion?.audit_id) {
			const auditRow = await c.env.DB.prepare("SELECT risk_score FROM plugin_audits WHERE id = ?")
				.bind(latestVersion.audit_id)
				.first<{ risk_score: number }>();
			latestAuditRiskScore = auditRow?.risk_score ?? null;
		}

		if (latestVersion) {
			const screenshotUrls: string[] = [];
			for (let i = 0; i < latestVersion.screenshot_count; i++) {
				screenshotUrls.push(
					`${baseUrl}/api/v1/plugins/${id}/versions/${latestVersion.version}/screenshots/screenshot-${i}.png`,
				);
			}

			response.latestVersion = {
				version: latestVersion.version,
				minEmDashVersion: latestVersion.min_emdash_version,
				bundleSize: latestVersion.bundle_size,
				checksum: latestVersion.checksum,
				changelog: latestVersion.changelog,
				readme: latestVersion.readme,
				hasIcon: latestVersion.has_icon === 1,
				screenshotCount: latestVersion.screenshot_count,
				screenshotUrls,
				capabilities: safeJsonParse<string[]>(latestVersion.capabilities, []),
				status: latestVersion.status,
				audit: latestVersion.audit_verdict
					? {
							verdict: latestVersion.audit_verdict,
							riskScore: latestAuditRiskScore ?? 0,
						}
					: undefined,
				imageAudit: latestVersion.image_audit_verdict
					? {
							verdict: latestVersion.image_audit_verdict,
						}
					: undefined,
				publishedAt: latestVersion.published_at,
			};
		}

		return c.json(response);
	} catch (err) {
		console.error("Failed to get plugin:", err);
		return c.json({ error: "Internal server error" }, 500);
	}
});

// ── GET /plugins/:id/versions — Version history ─────────────────

publicRoutes.get("/plugins/:id/versions", async (c) => {
	const pluginId = c.req.param("id");

	try {
		const versions = await getPluginVersions(c.env.DB, pluginId);

		const items = versions.map((v) => ({
			version: v.version,
			minEmDashVersion: v.min_emdash_version,
			bundleSize: v.bundle_size,
			checksum: v.checksum,
			changelog: v.changelog,
			capabilities: safeJsonParse<string[]>(v.capabilities, []),
			status: v.status,
			auditVerdict: v.audit_verdict,
			imageAuditVerdict: v.image_audit_verdict,
			publishedAt: v.published_at,
		}));

		return c.json({ items });
	} catch (err) {
		console.error("Failed to get versions:", err);
		return c.json({ error: "Internal server error" }, 500);
	}
});

// ── GET /plugins/:id/versions/:version/bundle — Bundle download ─

publicRoutes.get("/plugins/:id/versions/:version/bundle", async (c) => {
	const pluginId = c.req.param("id");
	const version = c.req.param("version");

	try {
		const versionRow = await getPluginVersion(c.env.DB, pluginId, version);
		if (!versionRow) return c.json({ error: "Version not found" }, 404);
		if (versionRow.status !== "published" && versionRow.status !== "flagged") {
			return c.json({ error: "Version not found" }, 404);
		}

		const object = await c.env.R2.get(versionRow.bundle_key);
		if (!object) return c.json({ error: "Bundle not found" }, 404);

		return new Response(object.body, {
			headers: {
				"Content-Type": "application/gzip",
				"Content-Disposition": `attachment; filename="${pluginId}-${version}.tar.gz"`,
				"Content-Length": String(object.size),
			},
		});
	} catch (err) {
		console.error("Failed to download bundle:", err);
		return c.json({ error: "Internal server error" }, 500);
	}
});

// ── GET /plugins/:id/versions/:version/audit — Audit result ─────

publicRoutes.get("/plugins/:id/versions/:version/audit", async (c) => {
	const pluginId = c.req.param("id");
	const version = c.req.param("version");

	try {
		const versionRow = await getPluginVersion(c.env.DB, pluginId, version);
		if (!versionRow) return c.json({ error: "Version not found" }, 404);
		if (versionRow.status !== "published" && versionRow.status !== "flagged") {
			return c.json({ error: "Version not found" }, 404);
		}

		if (!versionRow.audit_id) {
			return c.json({ error: "No audit result available" }, 404);
		}

		const audit = await c.env.DB.prepare("SELECT * FROM plugin_audits WHERE id = ?")
			.bind(versionRow.audit_id)
			.first();
		if (!audit) return c.json({ error: "Audit result not found" }, 404);

		return c.json(audit);
	} catch (err) {
		console.error("Failed to get audit:", err);
		return c.json({ error: "Internal server error" }, 500);
	}
});

// ── GET /plugins/:id/versions/:version/image-audit — Image audit ─

publicRoutes.get("/plugins/:id/versions/:version/image-audit", async (c) => {
	const pluginId = c.req.param("id");
	const version = c.req.param("version");

	try {
		const versionRow = await getPluginVersion(c.env.DB, pluginId, version);
		if (!versionRow) return c.json({ error: "Version not found" }, 404);
		if (versionRow.status !== "published" && versionRow.status !== "flagged") {
			return c.json({ error: "Version not found" }, 404);
		}

		if (!versionRow.image_audit_id) {
			return c.json({ error: "No image audit result available" }, 404);
		}

		const audit = await c.env.DB.prepare("SELECT * FROM plugin_image_audits WHERE id = ?")
			.bind(versionRow.image_audit_id)
			.first();
		if (!audit) return c.json({ error: "Image audit result not found" }, 404);

		return c.json(audit);
	} catch (err) {
		console.error("Failed to get image audit:", err);
		return c.json({ error: "Internal server error" }, 500);
	}
});

// ── Helpers ─────────────────────────────────────────────────────

function safeJsonParse<T>(value: string | null, fallback: T): T {
	if (!value) return fallback;
	try {
		// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- caller provides type parameter
		const parsed: T = JSON.parse(value);
		return parsed;
	} catch {
		return fallback;
	}
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

File: /Users/masonjames/Projects/emdash/packages/plugins/color/src/index.ts
```ts
/**
 * Color Picker Plugin for EmDash CMS
 *
 * Provides a color picker field widget that replaces the default
 * string input with a visual color selector. Demonstrates the
 * field widget plugin capability.
 *
 * Usage:
 *   1. Add the plugin to your emdash config
 *   2. Create a field with type "string" and widget "color:picker"
 *   3. The admin editor will show a color picker instead of a text input
 *
 * The color value is stored as a hex string (e.g., "#ff6600").
 */

import type { PluginDescriptor } from "emdash";
import { definePlugin } from "emdash";

/**
 * Create the color picker plugin instance.
 * Called by the virtual module system at runtime.
 */
export function createPlugin() {
	return definePlugin({
		id: "color",
		version: "0.0.1",

		admin: {
			entry: "@emdash-cms/plugin-color/admin",
			fieldWidgets: [
				{
					name: "picker",
					label: "Color Picker",
					fieldTypes: ["string"],
				},
			],
		},
	});
}

export default createPlugin;

/**
 * Create a plugin descriptor for use in emdash config.
 */
export function colorPlugin(): PluginDescriptor {
	return {
		id: "color",
		version: "0.0.1",
		entrypoint: "@emdash-cms/plugin-color",
		options: {},
		adminEntry: "@emdash-cms/plugin-color/admin",
	};
}

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

File: /Users/masonjames/Projects/emdash/docs/src/content/docs/migration/from-wordpress.mdx
```mdx
---
title: Migrate from WordPress
description: Import your WordPress content into EmDash with a step-by-step guide.
---

import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from "@astrojs/starlight/components";

EmDash provides a complete migration path from WordPress. Import your posts, pages, media, and taxonomies through the admin dashboard—no CLI required.

## Before You Begin

<CardGrid>
	<Card title="Export your content" icon="document">
		In WordPress, go to **Tools → Export** and download a complete export file (.xml).
	</Card>
	<Card title="Back up your site" icon="warning">
		Keep your WordPress site running until you verify the migration succeeded.
	</Card>
</CardGrid>

## Import Methods

EmDash supports three methods for importing WordPress content:

| Method           | Best for                       | Includes drafts | Requires auth |
| ---------------- | ------------------------------ | --------------- | ------------- |
| WXR file upload  | Complete migrations            | Yes             | No            |
| WordPress.com    | WordPress.com hosted sites     | Yes             | OAuth         |
| REST API (probe) | Checking content before export | No              | Optional      |

The WXR file upload is recommended for most migrations. It captures all content, including drafts, custom fields, and private posts.

## WXR File Import

<Steps>

1. **Export from WordPress**

   In your WordPress admin, go to **Tools → Export → All content → Download Export File**.

2. **Open the Import wizard**

   In EmDash, go to **Admin → Settings → Import → WordPress**.

3. **Upload your export file**

   Drag and drop your `.xml` file or click to browse. The file is parsed in your browser.

4. **Review detected content**

   The wizard shows what was found:

   ```
   Found in export:
   ├── Posts: 127 → posts [New collection]
   ├── Pages: 12  → pages [Add fields]
   └── Media: 89 attachments
   ```

5. **Configure mappings**

   Toggle which post types to import. EmDash automatically:
   - Creates new collections for unmapped post types
   - Adds missing fields to existing collections
   - Warns about field type conflicts

6. **Execute the import**

   Click **Import Content**. Progress displays as each item is processed.

7. **Import media (optional)**

   After content imports, choose whether to download media files. EmDash:
   - Downloads from your WordPress URLs
   - Deduplicates by content hash
   - Rewrites URLs in your content automatically

</Steps>

<Aside type="tip">
	Re-running the import is safe. Items are matched by WordPress ID, so you won't create duplicates.
</Aside>

## Content Conversion

### Gutenberg to Portable Text

EmDash converts Gutenberg blocks to [Portable Text](https://github.com/portabletext/portabletext), a structured content format.

| Gutenberg Block  | Portable Text                | Notes                         |
| ---------------- | ---------------------------- | ----------------------------- |
| `core/paragraph` | `block` style="normal"       | Inline marks preserved        |
| `core/heading`   | `block` style="h1-h6"        | Level from block attributes   |
| `core/image`     | `image` block                | Media reference updated       |
| `core/list`      | `block` with `listItem` type | Ordered and unordered         |
| `core/quote`     | `block` style="blockquote"   | Citation included             |
| `core/code`      | `code` block                 | Language attribute preserved  |
| `core/embed`     | `embed` block                | URL and provider stored       |
| `core/gallery`   | `gallery` block              | Array of image references     |
| `core/columns`   | `columns` block              | Nested content preserved      |
| Unknown blocks   | `htmlBlock`                  | Raw HTML preserved for review |

Unknown blocks are stored as `htmlBlock` with the original HTML and block metadata. You can review and convert these manually or create custom Portable Text components to render them.

### Classic Editor Content

HTML from the Classic Editor is converted to Portable Text blocks. Inline styles (`<strong>`, `<em>`, `<a>`) become marks on spans.

### Status Mapping

| WordPress Status | EmDash Status |
| ---------------- | --------------- |
| `publish`        | `published`     |
| `draft`          | `draft`         |
| `pending`        | `pending`       |
| `private`        | `private`       |
| `future`         | `scheduled`     |
| `trash`          | `archived`      |

## Taxonomy Import

Categories and tags import as taxonomies with hierarchy preserved:

```
WordPress:                    EmDash:
├── Categories (hierarchical) ├── taxonomies table
│   ├── News                  │   ├── category/news
│   │   ├── Local             │   ├── category/local (parent: news)
│   │   └── World             │   ├── category/world (parent: news)
│   └── Sports                │   └── category/sports
└── Tags (flat)               └── content_taxonomies junction
    ├── featured                  ├── tag/featured
    └── breaking                  └── tag/breaking
```

## Custom Fields and ACF

WordPress post meta and ACF fields are analyzed during import:

<Steps>

1. **Analysis phase**

   The wizard detects custom fields and suggests EmDash field types:

   ```
   Custom Fields:
   ├── subtitle (string, 45 posts)
   ├── _yoast_wpseo_title → seo.title (string, 127 posts)
   ├── _thumbnail_id → featuredImage (reference, 89 posts)
   └── price (number, 23 posts)
   ```

2. **Field mapping**

   Internal WordPress fields (starting with `_edit_`, `_wp_`) are hidden by default. SEO plugin fields map to an `seo` object.

3. **Type inference**

   EmDash infers field types from values:
   - Numeric strings → `number`
   - `"1"`, `"0"`, `"true"`, `"false"` → `boolean`
   - ISO dates → `date`
   - Serialized PHP/JSON → `json`
   - WordPress IDs (e.g., `_thumbnail_id`) → `reference`

</Steps>

<Aside>
	ACF repeater fields and flexible content import as JSON. Create matching Portable Text or array
	fields in EmDash to structure this data.
</Aside>

## URL Redirects

After import, EmDash generates a redirect map:

```json
{
	"redirects": [
		{ "from": "/?p=123", "to": "/posts/hello-world" },
		{ "from": "/2024/01/hello-world/", "to": "/posts/hello-world" },
		{ "from": "/category/news/", "to": "/categories/news" }
	],
	"feeds": [
		{ "from": "/feed/", "to": "/rss.xml" },
		{ "from": "/feed/atom/", "to": "/atom.xml" }
	]
}
```

Apply these redirects to:

- Cloudflare redirect rules
- Your hosting platform's redirect config
- Astro's `redirects` option in `astro.config.mjs`

## Concept Mapping Reference

Use this table when adapting WordPress patterns to EmDash:

| WordPress               | EmDash                             | Notes                          |
| ----------------------- | ------------------------------------ | ------------------------------ |
| `register_post_type()`  | Collection in admin UI               | Created via dashboard or API   |
| `register_taxonomy()`   | Taxonomy or array field              | Depends on complexity          |
| `register_meta()`       | Field in collection schema           | Typed, not key-value           |
| `WP_Query`              | `getCollection(filters)`             | Runtime queries                |
| `get_post()`            | `getEntry(collection, id)`           | Returns entry or null          |
| `wp_insert_post()`      | `POST /_emdash/api/content/{type}` | REST API                       |
| `the_content`           | `<PortableText value={...} />`       | Portable Text rendering        |
| `add_shortcode()`       | Portable Text custom block           | Custom component renderer      |
| `register_block_type()` | Portable Text custom block           | Same as shortcodes             |
| `add_menu_page()`       | Plugin admin page                    | Under `/_emdash/admin/`      |
| `add_action/filter()`   | Plugin hooks                         | `hooks.content:beforeSave`     |
| `wp_options`            | `ctx.kv`                             | Key-value store                |
| `wp_postmeta`           | Collection fields                    | Structured, not key-value      |
| `$wpdb`                 | `ctx.storage`                        | Direct storage access          |
| Categories/Tags         | Taxonomies                           | Hierarchical support preserved |

## CLI Import (Advanced)

Developers can also import via the CLI:

```bash
# Analyze export file
npx emdash import wordpress export.xml --analyze

# Run import
npx emdash import wordpress export.xml --execute

# With media download
npx emdash import wordpress export.xml --execute --download-media
```

The CLI uses the same APIs as the dashboard and supports `--resume` for interrupted imports.

## Troubleshooting

### "XML parsing error"

The export file may be corrupted or incomplete. Re-export from WordPress.

### Media download failures

Some images may be behind authentication or have moved. The import continues, and failed URLs are logged for manual handling.

### Field type conflicts

If an existing collection has a field with an incompatible type, the import wizard shows the conflict. Either:

- Rename the EmDash field
- Change the WordPress field mapping
- Delete and recreate the collection

### Large exports

For exports over 100MB, consider:

1. Export post types separately in WordPress
2. Import each file sequentially
3. Use the CLI with `--resume` for reliability

## Next Steps

- **[Content Import](/migration/content-import/)** — Other import sources and methods
- **[Plugin Porting](/migration/plugin-porting/)** — Migrate WordPress plugin functionality
- **[Working with Content](/guides/working-with-content/)** — Query and render your imported content

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

─── ANALYSIS ───

Current-state analysis (always include):
- Map the existing responsibilities, type relationships, ownership, data flow, and mutation points relevant to the request.
- Identify existing code that should be reused or extended — never duplicate what already exists without justification.
- Note hard constraints: API contracts, protocol conformances, state ownership rules, thread/actor isolation, persistence schemas, UI update mechanisms.
- When multiple subsystems interact, trace the call chain end-to-end and identify each transformation boundary.

─── DESIGN ───

Design standards — apply uniformly to every aspect of the plan:

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

5. **Trade-offs and alternatives** — What was considered and rejected, and why. Include the cost/benefit of the chosen approach vs. the runner-up.

6. **Risks and migration** — Breaking changes, rollback concerns, data migration, feature flags, and incremental delivery strategy if the change is large.

7. **Implementation order** — A numbered sequence of steps. Each step should be independently compilable and testable where possible. Call out steps that must be atomic (landed together).

Response discipline:
- Be specific to the provided code — reference actual type names, file paths, method names, and property names.
- Make every assumption explicit.
- Flag unknowns that must be validated during implementation, with a suggested validation approach.
- When a design decision has a non-obvious rationale, explain it in one sentence.
- Do not pad with generic advice. Every sentence should convey information the implementer needs.

Please proceed with your analysis based on the following <user instructions>
</meta prompt 1>
<user_instructions>
<taskname="WP plugin shortlist"/>
<task>Develop a prioritized plan for porting 10 low-complexity, high-fit WordPress.org plugins into EmDash CMS. Focus on what is already supported in EmDash’s plugin/runtime model, what capabilities are safest/easiest, and which WordPress plugin categories map cleanly with minimal architectural friction.</task>

<architecture>
- EmDash plugin runtime centers on `definePlugin()` + `PluginDescriptor` with capability-gated context (`ctx.kv`, `ctx.storage`, `ctx.content`, `ctx.media`, `ctx.http`, `ctx.users`, `ctx.cron`, `ctx.email`).
- Core execution is orchestrated by `PluginManager` + `HookPipeline` + `PluginRouteRegistry`; hooks are typed and ordered with priority/dependencies/timeouts/error policies.
- Marketplace-installed plugins require sandbox runner + storage; install/update flow validates manifest/checksum/capability and route-visibility escalation.
- Security and trust boundary differ by mode: trusted config plugins vs Cloudflare sandboxed marketplace plugins.
- Existing first-party plugins show a complexity spectrum: very simple descriptor/widget plugins (`color`) up to multi-route/storage/admin plugins (`forms`).
- Migration docs provide explicit WordPress→EmDash mappings (actions/filters, options, custom tables, shortcodes, admin pages, REST routes).
</architecture>

<selected_context>
/Users/masonjames/Projects/emdash/skills/wordpress-plugin-to-emdash/SKILL.md: WordPress→EmDash mapping tables and porting patterns used internally.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/plugin-porting.mdx: Detailed WP plugin concept translation and examples.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/porting-plugins.mdx: Portability assessment (good vs poor candidates), process, capability guidance.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/from-wordpress.mdx: Migration mappings and status/field/taxonomy conversion constraints.
/Users/masonjames/Projects/emdash/docs/src/content/docs/migration/content-import.mdx: Import architecture and source capabilities (WXR, wordpress-com, probe).
/Users/masonjames/Projects/emdash/docs/src/content/docs/coming-from/wordpress.mdx: WP mental model mapping to EmDash APIs/UI.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/overview.mdx: Plugin philosophy, execution modes, capability model.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/creating-plugins.mdx: Descriptor vs runtime definition, package exports, portable text blocks.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/hooks.mdx: Hook signatures/configuration and available hook surface.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/storage.mdx: Plugin storage collections, indexes, query constraints.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/settings.mdx: `settingsSchema` + KV conventions and secret handling.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/api-routes.mdx: Route model, validation, admin integration patterns.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/admin-ui.mdx: Admin pages/widgets + when auto-generated settings are enough.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/sandbox.mdx: Trusted vs sandbox security model and platform limits.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/installing.mdx: Marketplace prerequisites and consent/update semantics.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/publishing.mdx: Bundle format, validation, audit expectations.
/Users/masonjames/Projects/emdash/docs/src/content/docs/plugins/block-kit.mdx: Block Kit model for sandbox-safe admin UX.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/types.ts: Canonical plugin interfaces/capabilities/hooks/routes/admin/storage types.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/define-plugin.ts: Native/standard plugin format behavior and validation.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/adapt-sandbox-entry.ts: Standard-format adaptation and capability implication logic.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/context.ts: Capability-gated context construction and HTTP/media/user access rules.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/hooks.ts: Runtime hook registration, required-capability checks, exclusive-hook resolution.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/routes.ts: Route invocation, input validation, error/status handling.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manager.ts: Plugin lifecycle orchestration and active-plugin dispatch behavior.
/Users/masonjames/Projects/emdash/packages/core/src/plugins/manifest-schema.ts: Manifest constraints (capabilities, hooks, routes, settings/field widget schema).
/Users/masonjames/Projects/emdash/packages/core/src/plugins/sandbox/types.ts: Sandbox runner interfaces and limits model.
/Users/masonjames/Projects/emdash/packages/core/src/astro/routes/api/plugins/[pluginId]/[...path].ts: Public/private plugin route auth + CSRF enforcement behavior.
/Users/masonjames/Projects/emdash/packages/core/src/api/handlers/marketplace.ts: Install/update/uninstall checks (sandbox required, audit checks, capability/route escalation).
/Users/masonjames/Projects/emdash/packages/core/src/api/handlers/plugins.ts: Plugin list/detail model exposed to admin.
/Users/masonjames/Projects/emdash/packages/marketplace/src/workflows/audit.ts: Marketplace code/image audit workflow.
/Users/masonjames/Projects/emdash/packages/marketplace/src/audit/types.ts: Audit verdict/findings schema.
/Users/masonjames/Projects/emdash/packages/marketplace/src/routes/public.ts: Public marketplace metadata surface.
/Users/masonjames/Projects/emdash/packages/plugins/color/src/index.ts: Minimal field-widget plugin example (very low complexity).
/Users/masonjames/Projects/emdash/packages/plugins/embeds/src/index.ts: Portable Text block plugin example with no server capabilities.
/Users/masonjames/Projects/emdash/packages/plugins/forms/src/index.ts: Advanced plugin example (public routes, storage, cron, admin, settings).
/Users/masonjames/Projects/emdash/packages/plugins/forms/src/storage.ts: Storage/index declaration pattern.
/Users/masonjames/Projects/emdash/packages/plugins/forms/src/handlers/forms.ts: Route handler + plugin storage CRUD idioms.
/Users/masonjames/Projects/emdash/packages/plugins/webhook-notifier/src/index.ts: Network-heavy standard plugin descriptor pattern.
/Users/masonjames/Projects/emdash/packages/plugins/audit-log/src/index.ts: Read-content + storage/admin descriptor pattern.
/Users/masonjames/Projects/emdash/packages/plugins/atproto/src/index.ts: Descriptor-only integration plugin pattern.
</selected_context>

<relationships>
- `definePlugin` + `types.ts` define contract -> `manager.ts` registers/activates -> `hooks.ts` executes hook pipelines -> `context.ts` enforces capability-shaped `ctx`.
- `routes.ts` runtime route handler metadata feeds auth gating in `[...path].ts` (`public` skips auth; private enforces permissions/scope/CSRF).
- `manifest-schema.ts` validates bundle manifest used by `api/handlers/marketplace.ts` during install/update/uninstall.
- Marketplace flow: marketplace client download -> manifest/checksum validation -> store bundle in R2 -> plugin state update -> sandbox execution requirement.
- WordPress porting docs map WP concepts (`add_action`, `wp_options`, custom tables, shortcodes, admin pages, REST routes) to EmDash hooks/KV/storage/portable text/admin/routes.
- Example plugin spectrum can anchor effort estimates: `color` (tiny UI extension), `embeds` (content block extension), `forms` (full-stack plugin complexity).
</relationships>

<ambiguities>
- Docs include some examples that appear older than current runtime contracts (e.g., references to `content:afterRender` and route capability notes differ from current `types.ts`/`hooks.ts`/`[...path].ts`). Prefer core source files as source-of-truth when conflicts appear.
- `plugins/api-routes.mdx` states trusted-only routes, while runtime route handling and docs elsewhere present public/private plugin route behavior; treat execution-mode caveats as important when ranking candidates.
- Marketplace audit policy wording in docs can differ from handler enforcement details (`warn`/`fail` handling). Use `api/handlers/marketplace.ts` + marketplace workflow as authoritative.
</ambiguities>
</user_instructions>
