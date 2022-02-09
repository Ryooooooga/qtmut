import { join } from "https://deno.land/std@0.119.0/path/mod.ts";
import {
  attachSession,
  hasSession,
  newSession,
  newWindow,
  selectLayout,
  selectPane,
  selectWindow,
  sendKeys,
  splitWindow,
  switchClient,
} from "../tmux.ts";
import { loadPlan } from "../plan.ts";

export type Args = {
  sessionName?: string;
  startDirectory?: string;
};

export const exec = async ({
  sessionName = crypto.randomUUID(),
  startDirectory = Deno.cwd(),
}: Args) => {
  if (!await hasSession(sessionName, true)) {
    const planPath = join(startDirectory, ".qtmut.yaml");
    const plan = await loadPlan(planPath);

    const windows = plan?.windows ?? [];
    const windowName = windows[0]?.name;

    // Create the session.
    await newSession({
      sessionName,
      startDirectory,
      windowName,
      detach: true,
    });

    if (plan) {
      // Create windows.
      for (let winIdx = 0; winIdx < windows.length; winIdx++) {
        const win = windows[winIdx];
        const panes = win?.panes ?? [];

        if (winIdx > 0) {
          // Create the window.
          await newWindow({
            targetWindow: sessionName,
            startDirectory,
            windowName: win?.name,
          });
        }

        for (let paneIdx = 0; paneIdx < panes.length; paneIdx++) {
          const pane = panes[paneIdx];

          if (paneIdx > 0) {
            // Split the window.
            await splitWindow({
              targetPane: sessionName,
              startDirectory,
            });
          }

          // Send keys.
          const command = pane?.command;
          if (!command) {
            // nothing
          } else if (typeof command === "string") {
            await sendKeys({ targetPane: sessionName }, [command]);
          } else if (typeof command === "object") {
            await sendKeys({ targetPane: sessionName }, command);
          }
        }

        // Select layout.
        const layout = win?.layout;
        await selectLayout({ targetPane: sessionName }, layout ?? "tile");
      }
    }

    // Select active window and pane.
    const active = plan?.active;
    if (active) {
      if (active.window) {
        await selectWindow({ targetWindow: `${sessionName}:${active.window}` });
      }
      if (active.pane) {
        await selectPane({
          targetPane: `${sessionName}:${active.window ?? ""}.${active.pane}`,
        });
      }
    }
  }

  // Attach the session.
  if (Deno.env.get("TMUX")) {
    await switchClient({ targetSession: sessionName });
  } else {
    await attachSession({ targetSession: sessionName });
  }
};
