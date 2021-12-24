import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { exec as execNewSession } from "./cmd/start.ts";

await new Command()
  .name("qtmut")
  .description("Simple Tmux session manager powered by Deno.")
  .command(
    "start",
    new Command()
      .description("Start new session")
      .option("-s, --session-name <session-name>", "Session name")
      .option("-c, --start-directory <directory>", "Start directory")
      .option("-A, --attach", "Attach the session")
      .action(execNewSession),
  )
  .parse(Deno.args);
