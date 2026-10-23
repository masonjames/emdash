# Forms plugin

`@emdash-cms/plugin-forms` collects submissions in the EmDash forms inbox. It is a native plugin and requires EmDash 0.42.0 or later.

## Create draft content from submissions

Set `settings.contentMapping` through the authenticated `forms/create` or `forms/update` plugin route. The mapping creates a draft in a chosen collection after a successful submission. The admin form editor does not expose this setting.

Before configuring a mapping, create the target collection and its fields. Each mapped source must name a field in the form. For this example, the `events` collection has a required string field named `title` and an optional Portable Text field named `body`. The form has a required text field named `name` with no display condition, and an optional textarea named `details`.

Send the following JSON body to `POST /_emdash/api/plugins/emdash-forms/forms/update`, replacing `FORM_ID` with the form's ID. Use an administrator session and the `X-EmDash-Request: 1` header.

```json
{
	"id": "FORM_ID",
	"settings": {
		"contentMapping": {
			"collection": "events",
			"fieldMappings": {
				"name": "title",
				"details": { "field": "body", "transform": "portableText" }
			}
		}
	}
}
```

Submitting the form creates a draft in the site's default content locale. Its slug is generated from the mapped `title` or `name` field. Existing forms keep their inbox-only behavior until a mapping is configured. To remove a mapping, update the form with `"settings": { "contentMapping": null }`.

Mappings support these transforms:

| Transform      | Result                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------- |
| `portableText` | Plain text becomes paragraph blocks, separated by blank lines.                            |
| `string`       | Scalars become strings; checkbox-group values are joined with a comma and space.          |
| `number`       | Values become finite numbers; values that cannot be converted are omitted.                |
| `date`         | Parseable dates become ISO datetime strings; values that cannot be converted are omitted. |

Omit the transform to keep the validated form value. Use a number form field for a required number target, and a date form field with the `date` transform for a required datetime target. Number form fields cannot map to integer targets because submissions may contain decimals. File fields cannot be mapped.

The optional `metadata` object supplies fixed collection field values, such as `"metadata": { "source": "form" }` when the collection has a `source` text field. Each target field can be assigned once, through either a field mapping or metadata. Every required target needs non-empty metadata or a required source field with no display condition. Mappings are checked when forms are created or duplicated, and when their pages or mapping settings change. A stale mapping does not prevent status-only updates, such as pausing a form, or settings updates that leave pages and the mapping unchanged. For forms with multiple pages or page titles, update settings through the API while omitting `pages`; the admin editor sends only the first page without its title.

A mapping checks field existence, compatible value types, and required-field coverage. Collection constraints such as length limits, supported date ranges, uniqueness, and subsequent schema changes can still reject an entry. Test a submission after configuring the mapping and after changing the target collection.

Draft creation runs separately from the confirmation response. If it fails, the submission stays in the inbox and the server logs `Failed to create content entry from submission`; the draft is not retried automatically. The plugin declares `content:write` and `schema:read` to support this feature.
