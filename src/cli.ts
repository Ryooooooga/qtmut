import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { exec as execNewSession } from "./cmd/start.ts";

export const run = async () => {
  await new Command()
    .name("qtmut -s <session-name> -c <directory>")
    .description("Simple Tmux session manager powered by Deno.")
    .option("-s, --session-name <session-name>", "Session name")
    .option("-c, --start-directory <directory>", "Start directory")
    .action(execNewSession)
    .parse(Deno.args);
};
