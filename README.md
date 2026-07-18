# abby-cli

Command-line client and AgentSkill for the official [Abby API](https://docs.abby.fr/). It exposes 76 operations across billing, CRM, products, opportunities, company data, and accounting books.

## Install

```bash
npx api2cli install Nardjo/abby-cli
abby-cli auth set
abby-cli auth test
```

API access requires an Abby Pro or Business subscription. The hidden token prompt stores the token in `~/.config/tokens/abby-cli.txt` with mode `600`.

## Usage

```bash
abby-cli --help
abby-cli contacts retrieve-contacts --page 1 --limit 10 --json
abby-cli products list-products --page 1 --limit 20 --json
abby-cli billing download-pdf <billing-id> --output-file invoice.pdf --json
```

Send request bodies inline with `--body '{"key":"value"}'` or from a file with `--body-file body.json`. Use `--json` for automation. Write operations can alter billing or accounting data, so verify IDs before deleting or finalizing.

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

## Product API Note

The official Abby product documentation uses strings such as `service_delivery` for `type` and `unit` for `unit`, although embedded schema fragments also show numeric types. Follow the documented string examples unless Abby changes the API.

## Output

`--json` returns `{ "ok": true, "data": ... }`. Errors return `{ "ok": false, "error": { "code": 401, "message": "..." } }`.

Global flags: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`.

## Development

```bash
bun install
bun run build
npx api2cli link abby
```

The 68 generated operations come from Abby's public OpenAPI 1.90.0. Eight catalog and accounting-book operations are maintained manually from the official Abby documentation because they are absent from the primary specification and SDK.

## License

MIT
