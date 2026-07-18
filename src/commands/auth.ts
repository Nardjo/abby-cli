import { Command } from "commander";
import { getToken, setToken, removeToken, hasToken, maskToken } from "../lib/auth.js";
import { client } from "../lib/client.js";
import { log } from "../lib/logger.js";
import { handleError } from "../lib/errors.js";

export const authCommand = new Command("auth").description("Manage API authentication");

async function readToken(): Promise<string> {
  if (!process.stdin.isTTY) {
    return (await Bun.stdin.text()).trim();
  }

  process.stdout.write("Token: ");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  return new Promise((resolve, reject) => {
    let token = "";
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      resolve(token.trim());
    };
    process.stdin.on("data", (chunk: string) => {
      for (const character of chunk) {
        if (character === "\u0003") {
          process.stdin.setRawMode(false);
          reject(new Error("Authentication setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f") {
          token = token.slice(0, -1);
        } else {
          token += character;
        }
      }
    });
  });
}

authCommand
  .command("set")
  .description("Save your API token")
  .argument("[token]", "Your API token (prompts securely when omitted)")
  .addHelpText("after", "\nExample:\n  abby-cli auth set")
  .action(async (token?: string) => {
    const value = token ?? (await readToken());
    if (!value) throw new Error("Token cannot be empty.");
    setToken(value);
    log.success("Token saved securely");
  });

authCommand
  .command("show")
  .description("Display current token (masked by default)")
  .option("--raw", "Show the full unmasked token")
  .addHelpText("after", "\nExample:\n  abby-cli auth show\n  abby-cli auth show --raw")
  .action((opts: { raw?: boolean }) => {
    if (!hasToken()) {
      log.warn("No token configured. Run: abby-cli auth set <token>");
      return;
    }
    const token = getToken();
    console.log(opts.raw ? token : `Token: ${maskToken(token)}`);
  });

authCommand
  .command("remove")
  .description("Delete the saved token")
  .addHelpText("after", "\nExample:\n  abby-cli auth remove")
  .action(() => {
    removeToken();
    log.success("Token removed");
  });

authCommand
  .command("test")
  .description("Verify your token works by making a test API call")
  .addHelpText("after", "\nExample:\n  abby-cli auth test")
  .action(async () => {
    try {
      await client.get("/v2/company/me");
      log.success("Token is valid");
    } catch (err) {
      handleError(err);
    }
  });
