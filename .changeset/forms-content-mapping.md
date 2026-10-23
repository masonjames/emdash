---
"@emdash-cms/plugin-forms": minor
---

Adds the optional `settings.contentMapping` form setting to create draft content entries from form submissions. Configure it through the authenticated `forms/create` or `forms/update` plugin routes; the admin form editor does not expose it. This version requires EmDash 0.42.0 or later for collection schema access, the shared content-create path, and compatible URL validation; upgrade older EmDash installations before updating the forms plugin. Existing forms keep their inbox-only behavior until a mapping is configured.

Map form fields to a collection's fields, with optional `portableText`, `string`, `number`, or `date` transforms and fixed `metadata` values. Mappings are checked on create, duplication, and changes to pages or mapping settings for compatible field types, unambiguous targets, and required-field coverage. Entries use the site's default content locale and core slug generation. See the [forms plugin setup example](https://github.com/emdash-cms/emdash/tree/main/packages/plugins/forms#create-draft-content-from-submissions).

Draft creation runs separately from the confirmation response. The submission stays in the inbox if content creation fails, and the failure is logged. Collection constraints and later schema changes can still reject entries. The plugin adds the `content:write` and `schema:read` capabilities; file fields cannot be mapped.

Form submission validation also rejects non-finite numbers, malformed HTTP(S) URLs, and empty required checkbox-group selections before storing a submission.
