import { Command, Option } from "commander";
import spec from "../openapi.json";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { CliError, handleError } from "../lib/errors.js";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface OpenApiParameter {
  name: string;
  in: "path" | "query" | "header";
  required?: boolean;
  description?: string;
  schema?: { default?: unknown; enum?: unknown[] };
}

interface OpenApiOperation {
  operationId: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenApiParameter[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, unknown>;
  };
  responses?: Record<string, { content?: Record<string, unknown> }>;
  bodyDescription?: string;
}

interface OpenApiDocument {
  paths: Record<string, Record<string, OpenApiOperation | OpenApiParameter[]>>;
}

const resourceNames: Record<string, string> = {
  Billing: "billing",
  "Customer Portal": "customer-portal",
  Opportunity: "opportunities",
  advance: "advances",
  asset: "assets",
  company: "company",
  contact: "contacts",
  estimate: "estimates",
  invoice: "invoices",
  organization: "organizations",
  products: "products",
  "income-book": "income-book",
  "purchase-book": "purchase-book",
};

const resourceDescriptions: Record<string, string> = {
  billing: "Manage billing documents, emails, PDFs, lines, and payment settings",
  "customer-portal": "Retrieve customer portal payments",
  opportunities: "Manage sales opportunities and categories",
  advances: "Manage advance invoices",
  assets: "Manage credit notes and other billing assets",
  company: "Retrieve the current company, user, and preferences",
  contacts: "Manage customer contacts",
  estimates: "Manage estimates, purchase orders, signatures, and advances",
  invoices: "Manage invoices, recurring frequencies, payment requests, and assets",
  organizations: "Manage customer organizations and their contacts",
  products: "Manage the Abby product catalog",
  "income-book": "Create and delete income book entries",
  "purchase-book": "Create and delete purchase book entries",
};

const manualOperations: Array<{ method: HttpMethod; path: string; operation: OpenApiOperation }> = [
  {
    method: "get",
    path: "/v2/catalog",
    operation: {
      operationId: "CatalogController-listProducts",
      summary: "List products in the Abby catalog",
      tags: ["products"],
      parameters: [
        { name: "page", in: "query", required: true, description: "Page number, starting at 1" },
        { name: "limit", in: "query", required: true, description: "Results per page" },
        { name: "search", in: "query", description: "Search products" },
        {
          name: "orderBy",
          in: "query",
          description: "Sort field",
          schema: { enum: ["createdAt", "designation"] },
        },
        {
          name: "orderDirection",
          in: "query",
          description: "Sort direction",
          schema: { enum: ["ASC", "DESC"] },
        },
        { name: "sapCompatible", in: "query", description: "Filter for SAP-compatible products" },
      ],
    },
  },
  {
    method: "get",
    path: "/v2/catalog/product/{productId}",
    operation: {
      operationId: "CatalogController-getProduct",
      summary: "Get a product by ID",
      tags: ["products"],
      parameters: [{ name: "productId", in: "path", required: true, description: "Product ID" }],
    },
  },
  {
    method: "post",
    path: "/v2/catalog/product",
    operation: {
      operationId: "CatalogController-createProduct",
      summary: "Create a product",
      tags: ["products"],
      requestBody: { required: true, content: { "application/json": {} } },
      bodyDescription: "JSON body. Required: type, unit, designation",
    },
  },
  {
    method: "put",
    path: "/v2/catalog/product/{productId}",
    operation: {
      operationId: "CatalogController-updateProduct",
      summary: "Replace a product",
      tags: ["products"],
      parameters: [{ name: "productId", in: "path", required: true, description: "Product ID" }],
      requestBody: { required: true, content: { "application/json": {} } },
      bodyDescription: "JSON body. Required on every call: type, unit, designation, vatCode",
    },
  },
  {
    method: "post",
    path: "/incomeBook",
    operation: {
      operationId: "IncomeBookController-createEntry",
      summary: "Create an income book entry",
      tags: ["income-book"],
      requestBody: { required: true, content: { "application/json": {} } },
      bodyDescription: "JSON body. Required: client, priceWithoutTax, priceTotalTax, productType",
    },
  },
  {
    method: "delete",
    path: "/incomeBook/{id}",
    operation: {
      operationId: "IncomeBookController-deleteEntry",
      summary: "Delete an income book entry",
      tags: ["income-book"],
      parameters: [{ name: "id", in: "path", required: true, description: "Income book entry ID" }],
    },
  },
  {
    method: "post",
    path: "/v2/purchaseRegister",
    operation: {
      operationId: "PurchaseBookController-createEntry",
      summary: "Create a purchase book entry",
      tags: ["purchase-book"],
      requestBody: { required: true, content: { "application/json": {} } },
      bodyDescription: "JSON body. Required: valueDate, paymentMethodUsed, amount, thirdPartyId, label, entries",
    },
  },
  {
    method: "delete",
    path: "/v2/purchaseRegister/{id}",
    operation: {
      operationId: "PurchaseBookController-deleteEntry",
      summary: "Delete a purchase book entry",
      tags: ["purchase-book"],
      parameters: [{ name: "id", in: "path", required: true, description: "Purchase book entry ID" }],
    },
  },
];

const methods = new Set<HttpMethod>(["get", "post", "put", "patch", "delete"]);

function kebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function actionName(operationId: string): string {
  return kebabCase(operationId.split("-").slice(1).join("-") || operationId);
}

function optionName(name: string): string {
  return kebabCase(name);
}

function substitutePath(path: string, parameters: OpenApiParameter[], args: string[]): string {
  let argIndex = 0;
  let resolved = path;
  for (const parameter of parameters.filter((item) => item.in === "path" && path.includes(`{${item.name}}`))) {
    resolved = resolved.replace(`{${parameter.name}}`, encodeURIComponent(args[argIndex++] ?? ""));
  }
  return resolved;
}

async function parseBody(opts: Record<string, unknown>): Promise<Record<string, unknown> | undefined> {
  if (opts.body && opts.bodyFile) {
    throw new CliError(2, "Use either --body or --body-file, not both.");
  }
  if (typeof opts.body === "string") {
    try {
      return JSON.parse(opts.body) as Record<string, unknown>;
    } catch {
      throw new CliError(2, "--body must contain a valid JSON object.");
    }
  }
  if (typeof opts.bodyFile === "string") {
    return Bun.file(opts.bodyFile).json() as Promise<Record<string, unknown>>;
  }
  return undefined;
}

function createAction(method: HttpMethod, path: string, operation: OpenApiOperation): Command {
  const parameters = operation.parameters ?? [];
  const command = new Command(actionName(operation.operationId)).description(
    operation.summary || operation.description || operation.operationId,
  );

  const pathParameters = parameters.filter((item) => item.in === "path" && path.includes(`{${item.name}}`));
  const extraPathParameters = parameters.filter(
    (item) => item.in === "path" && !path.includes(`{${item.name}}`),
  );
  for (const parameter of pathParameters) {
    command.argument(`<${optionName(parameter.name)}>`, parameter.description || parameter.name);
  }

  for (const parameter of extraPathParameters) {
    command.addOption(
      new Option(`--${optionName(parameter.name)} <value>`, parameter.description || parameter.name)
        .makeOptionMandatory(),
    );
  }

  for (const parameter of parameters.filter((item) => item.in === "query")) {
    const option = new Option(
      `--${optionName(parameter.name)} <value>`,
      parameter.description || parameter.name,
    );
    if (parameter.required) option.makeOptionMandatory();
    if (parameter.schema?.default !== undefined) option.default(String(parameter.schema.default));
    if (parameter.schema?.enum) option.choices(parameter.schema.enum.map(String));
    command.addOption(option);
  }

  if (operation.requestBody) {
    command.option("--body <json>", operation.bodyDescription ?? "Request body as a JSON object");
    command.option("--body-file <path>", "Read the JSON request body from a file");
  }

  const isPdf = Object.values(operation.responses ?? {}).some((response) =>
    Object.keys(response.content ?? {}).includes("application/pdf"),
  );
  if (isPdf) command.requiredOption("--output-file <path>", "Destination path for the PDF");

  command.option("--fields <columns>", "Comma-separated output fields");
  command.option("--json", "Output as JSON");
  command.option("--format <format>", "Output format: text, json, csv, yaml");
  command.addHelpText(
    "after",
    `\nAPI operation: ${method.toUpperCase()} ${path}\nOpenAPI operationId: ${operation.operationId}`,
  );

  command.action(async (...values: unknown[]) => {
    const opts = command.optsWithGlobals() as Record<string, unknown>;
    const args = values.slice(0, pathParameters.length).map(String);
    const resolvedPath = substitutePath(path, parameters, args);
    const query = Object.fromEntries(
      parameters
        .filter((item) => item.in === "query")
        .map((item) => [item.name, opts[item.name]])
        .filter((entry): entry is [string, string] => entry[1] !== undefined)
        .map(([key, value]) => [key, String(value)]),
    );

    try {
      let data: unknown;
      if (isPdf) {
        data = await client.download(resolvedPath, query, String(opts.outputFile));
      } else if (method === "get") {
        data = await client.get(resolvedPath, query);
      } else if (method === "delete") {
        data = await client.delete(resolvedPath);
      } else {
        const body = (await parseBody(opts)) ?? {};
        if (operation.requestBody?.required && !opts.body && !opts.bodyFile) {
          throw new CliError(2, "This operation requires --body or --body-file.");
        }
        for (const parameter of extraPathParameters) {
          body[parameter.name] = opts[parameter.name];
        }
        data = await client[method](resolvedPath, body);
      }
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { json: Boolean(opts.json), format: opts.format as string | undefined, fields });
    } catch (error) {
      handleError(error, Boolean(opts.json));
    }
  });

  return command;
}

function buildResources(document: OpenApiDocument): Command[] {
  const resources = new Map<string, Command>();

  for (const [path, pathItem] of Object.entries(document.paths)) {
    for (const [method, value] of Object.entries(pathItem)) {
      if (!methods.has(method as HttpMethod) || Array.isArray(value)) continue;
      const operation = value as OpenApiOperation;
      const tag = operation.tags?.[0] ?? "other";
      const resourceName = resourceNames[tag] ?? kebabCase(tag);
      let resource = resources.get(resourceName);
      if (!resource) {
        resource = new Command(resourceName).description(resourceDescriptions[resourceName] ?? `Manage ${tag}`);
        resources.set(resourceName, resource);
      }
      resource.addCommand(createAction(method as HttpMethod, path, operation));
    }
  }

  for (const { method, path, operation } of manualOperations) {
    const tag = operation.tags?.[0] ?? "other";
    const resourceName = resourceNames[tag] ?? kebabCase(tag);
    let resource = resources.get(resourceName);
    if (!resource) {
      resource = new Command(resourceName).description(resourceDescriptions[resourceName] ?? `Manage ${tag}`);
      resources.set(resourceName, resource);
    }
    resource.addCommand(createAction(method, path, operation));
  }

  return [...resources.values()].sort((left, right) => left.name().localeCompare(right.name()));
}

export const openApiResources = buildResources(spec as OpenApiDocument);
