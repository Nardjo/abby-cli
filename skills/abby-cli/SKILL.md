---
name: abby-cli
description: "Manage Abby via CLI - advances, assets, billing, company, contacts, customer-portal, estimates, income-book, invoices, opportunities, organizations, products, purchase-book. Use when user mentions 'Abby', invoices, estimates, credit notes, billing PDFs, contacts, product catalog, income book, purchase book, or wants to automate the Abby API."
category: "payments"
---

# abby-cli

## When To Use This Skill

Use the `abby-cli` skill when you need to:

- inspect Abby billing documents, contacts, organizations, opportunities, products, or company settings
- create or update invoices, estimates, credit notes, contacts, organizations, and sales opportunities
- download billing PDFs, send billing emails, or manage signatures and payment requests
- record or remove entries in the income book or purchase book
- automate Abby workflows with stable JSON output

## Capabilities

- **Billing**: create and update invoices and estimates, manage billing lines, finalize, archive, email, sign, refuse, and download PDFs.
- **CRM**: manage contacts, organizations, organization contacts, opportunities, and categories.
- **Catalog and accounting books**: list, inspect, create, and update products, plus create or delete income and purchase entries.
- **Automation**: accept JSON bodies inline or from files and return a standard `--json` envelope.
- **Discovery**: expose help at CLI, resource, and action level for all 76 operations.

## Common Use Cases

- "List my Abby products and find the one matching this designation."
- "Create an invoice for this contact from a JSON body, then finalize it."
- "Download this billing document as a PDF."
- "Show the latest contacts and organizations in Abby."
- "Record this receipt in the income book."
- "Create a purchase-book entry for this supplier expense."

## Setup and Authentication

```bash
npx api2cli install Nardjo/abby-cli
abby-cli auth set
abby-cli auth test
```

The token prompt is hidden. The token is stored in `~/.config/tokens/abby-cli.txt` with mode `600`. Abby API access requires an Abby Pro or Business subscription. Always use `--json` for programmatic calls.

For request bodies, prefer a local JSON file:

```bash
abby-cli contacts create-contact --body-file contact.json --json
```

Use `--body '{"key":"value"}'` for small payloads. Write commands can alter billing or accounting data, so inspect the target first and verify IDs before deleting or finalizing.

## Product API Note

The official Abby product documentation uses string values such as `service_delivery` for `type` and `unit` for `unit`, although embedded schema fragments also show numeric types. Follow the documented string examples unless Abby changes the API.

## Resources

### advances

| Command | Description |
|---|---|
| `abby-cli advances update-general-informations <advance-id> --body-file <body.json> --json` | Update advance general informations |
| `abby-cli advances create-asset <advance-id> --json` | Create asset from advance |

### assets

| Command | Description |
|---|---|
| `abby-cli assets get-asset <asset-id> --json` | Get an asset by ID |
| `abby-cli assets update-general-informations <asset-id> --body-file <body.json> --json` | Update asset general informations |
| `abby-cli assets update-locale <asset-id> --body-file <body.json> --json` | Update asset locale |
| `abby-cli assets update-currency <asset-id> --body-file <body.json> --json` | Update asset currency |

### billing

| Command | Description |
|---|---|
| `abby-cli billing download-pdf <billing-id> --output-file <document.pdf> --json` | Download a billing document |
| `abby-cli billing archive-billing-document <document-id> --json` | Archive a document |
| `abby-cli billing unarchive-billing-document <document-id> --json` | Unarchive a document |
| `abby-cli billing update-title <document-id> --body-file <body.json> --json` | Update a document title |
| `abby-cli billing delete-billing-document <document-id> --json` | Permanently delete a document |
| `abby-cli billing get-billing-by-id <document-id> --json` | Get any billing document by ID |
| `abby-cli billing send-test-email-signature --body-file <body.json> --json` | Send a test email signature |
| `abby-cli billing render-email <billing-id> <email-type> --json` | Render a billing email |
| `abby-cli billing send-email-test <billing-id> <email-type> --json` | Send a billing email test |
| `abby-cli billing send-by-email <billing-id> --body-file <body.json> --json` | Send a billing document by email |
| `abby-cli billing update-bank-information <billing-id> --body-file <body.json> --json` | Update bank information |
| `abby-cli billing update-billing-delivery-address <billing-id> --body-file <body.json> --json` | Update the delivery address |
| `abby-cli billing finalize <billing-id> --json` | Finalize a billing document |
| `abby-cli billing update-lines <billing-id> --body-file <body.json> --json` | Update billing lines |
| `abby-cli billing migrate-sap-products <billing-id> --body-file <body.json> --json` | Migrate lines for SAP compliance |
| `abby-cli billing toggle-include-discount-disbursement <billing-id> --body-file <body.json> --json` | Toggle discount disbursement inclusion |
| `abby-cli billing update-display-settings <billing-id> --body-file <body.json> --json` | Update display settings |
| `abby-cli billing retrieve-payment-account --json` | Retrieve the payment account |

### company

| Command | Description |
|---|---|
| `abby-cli company get-me --json` | Get the current company, user, and preferences |

### contacts

| Command | Description |
|---|---|
| `abby-cli contacts create-contact --body-file <body.json> --json` | Create a contact |
| `abby-cli contacts get-contact <id> --json` | Get a contact by ID |
| `abby-cli contacts update-contact <id> --body-file <body.json> --json` | Update a contact |
| `abby-cli contacts delete-contact <id> --json` | Delete a contact |
| `abby-cli contacts get-contact-by-legacy-id <legacy-id> --json` | Get a contact by legacy ID |
| `abby-cli contacts retrieve-contacts --page 1 --limit 10 --json` | List contacts |

### customer-portal

| Command | Description |
|---|---|
| `abby-cli customer-portal get-payments --id <value> --token <portal-token> --json` | Retrieve portal billings and payment metadata |

### estimates

| Command | Description |
|---|---|
| `abby-cli estimates create-estimate-by-contact-or-organization-id <customer-id> --body-file <body.json> --json` | Create an estimate for a contact or organization |
| `abby-cli estimates update-timeline <estimate-id> --body-file <body.json> --json` | Update the timeline |
| `abby-cli estimates sign <estimate-id> --json` | Sign an estimate or purchase order |
| `abby-cli estimates unsign <estimate-id> --json` | Unsign an estimate or purchase order |
| `abby-cli estimates refuse <estimate-id> --json` | Refuse an estimate or purchase order |
| `abby-cli estimates unrefuse <estimate-id> --json` | Undo refusal |
| `abby-cli estimates create-advance <id> --json` | Create an advance invoice |
| `abby-cli estimates update-general-informations <estimate-id> --body-file <body.json> --json` | Update general information |
| `abby-cli estimates update-locale <estimate-id> --body-file <body.json> --json` | Update locale |
| `abby-cli estimates update-currency <estimate-id> --body-file <body.json> --json` | Update currency |
| `abby-cli estimates update-advance-lines <estimate-id> --body-file <body.json> --json` | Update advance lines |

### income-book

| Command | Description |
|---|---|
| `abby-cli income-book create-entry --body-file <body.json> --json` | Create an income-book entry |
| `abby-cli income-book delete-entry <id> --json` | Delete an income-book entry |

### invoices

| Command | Description |
|---|---|
| `abby-cli invoices get-invoice <invoice-id> --json` | Get an invoice by ID |
| `abby-cli invoices create-invoice-by-contact-or-organization-id <customer-id> --json` | Create an invoice for a contact or organization |
| `abby-cli invoices update-timeline <invoice-id> --body-file <body.json> --json` | Update the timeline |
| `abby-cli invoices update-invoice-payment-request <invoice-id> --body-file <body.json> --json` | Create or update a payment request |
| `abby-cli invoices update-invoice-general-informations <invoice-id> --body-file <body.json> --json` | Update general information |
| `abby-cli invoices update-invoice-locale <invoice-id> --body-file <body.json> --json` | Update locale |
| `abby-cli invoices update-invoice-currency <invoice-id> --body-file <body.json> --json` | Update currency |
| `abby-cli invoices create-invoice-frequency <invoice-id> --body-file <body.json> --json` | Create a recurring frequency |
| `abby-cli invoices delete-invoice-frequency <invoice-id> --json` | Delete a recurring frequency |
| `abby-cli invoices update-invoice-frequency <invoice-id> --frequency-id <value> --body-file <body.json> --json` | Update a recurring frequency |
| `abby-cli invoices create-asset <invoice-id> --json` | Create a credit note from an invoice |

### opportunities

| Command | Description |
|---|---|
| `abby-cli opportunities retrieve-categories --json` | List opportunity categories |
| `abby-cli opportunities retrieve-opportunity <id> --json` | Get an opportunity |
| `abby-cli opportunities update-opportunity <id> --body-file <body.json> --json` | Update an opportunity |
| `abby-cli opportunities delete-opportunity <id> --json` | Delete an opportunity |
| `abby-cli opportunities create-opportunity --body-file <body.json> --json` | Create an opportunity |

### organizations

| Command | Description |
|---|---|
| `abby-cli organizations create-organization --body-file <body.json> --json` | Create an organization |
| `abby-cli organizations retrieve-organization <id> --json` | Get an organization |
| `abby-cli organizations update-organization <id> --body-file <body.json> --json` | Update an organization |
| `abby-cli organizations retrieve-organization-contacts <id> --json` | List organization contacts |
| `abby-cli organizations create-organization-contact <id> --body-file <body.json> --json` | Create an organization contact |
| `abby-cli organizations update-organization-contact <id> --body-file <body.json> --json` | Update an organization contact |
| `abby-cli organizations delete-organization <organization-id> --json` | Delete an organization |
| `abby-cli organizations set-default-contact <organization-id> --body-file <body.json> --json` | Set the default contact |
| `abby-cli organizations retrieve-organizations --page <value> --limit <value> --json` | List organizations |

### products

| Command | Description |
|---|---|
| `abby-cli products list-products --page <value> --limit <value> --json` | List catalog products |
| `abby-cli products get-product <product-id> --json` | Get a product |
| `abby-cli products create-product --body-file <body.json> --json` | Create a product |
| `abby-cli products update-product <product-id> --body-file <body.json> --json` | Replace a product |

### purchase-book

| Command | Description |
|---|---|
| `abby-cli purchase-book create-entry --body-file <body.json> --json` | Create a purchase-book entry |
| `abby-cli purchase-book delete-entry <id> --json` | Delete a purchase-book entry |

## Output Format

`--json` returns:

```json
{ "ok": true, "data": { "...": "..." }, "meta": { "total": 42 } }
```

Errors return `{ "ok": false, "error": { "code": 401, "message": "..." } }`.

## Quick Reference

```bash
abby-cli --help
abby-cli <resource> --help
abby-cli <resource> <action> --help
```

Global flags: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`.

Exit codes: 0 = success, 1 = API error, 2 = usage error.
