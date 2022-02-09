class TmuxException extends Error {}

export type NewSessionArgs = {
  detach?: boolean;
  sessionName?: string;
  startDirectory?: string;
  windowName?: string;
};

export type NewWindowArgs = {
  targetWindow?: string;
  startDirectory?: string;
  windowName?: string;
};

export type SplitWindowArgs = {
  startDirectory?: string;
  targetPane?: string;
};

export type SendKeysArgs = {
  targetPane?: string;
};

export type SelectLayoutArgs = {
  targetPane?: string;
};

export type SelectWindowArgs = {
  targetWindow?: string;
};

export type SelectPaneArgs = {
  targetPane?: string;
};

export type SwitchClientArgs = {
  targetSession?: string;
};

export type AttachSessionArgs = {
  targetSession?: string;
};

export class TmuxCommand {
  private cmd: string[];

  constructor() {
    this.cmd = ["tmux", "-u"];
  }

  async run() {
    if (this.cmd.length === 2) {
      return;
    }

    const p = Deno.run({ cmd: this.cmd });
    const status = await p.status();

    if (!status.success) {
      throw new TmuxException(`failed to run: ${this.cmd.join(" ")}`);
    }
  }

  // tmux new-session
  newSession({
    detach,
    sessionName,
    startDirectory,
    windowName,
  }: NewSessionArgs) {
    this.cmd.push("new-session");
    if (detach) {
      this.cmd.push("-d");
    }
    if (sessionName) {
      this.cmd.push("-s", sessionName);
    }
    if (startDirectory) {
      this.cmd.push("-c", startDirectory);
    }
    if (windowName) {
      this.cmd.push("-n", windowName);
    }
    this.cmd.push(";");
  }

  // tmux new-window
  newWindow({
    targetWindow,
    startDirectory,
    windowName,
  }: NewWindowArgs) {
    this.cmd.push("new-window");
    if (targetWindow) {
      this.cmd.push("-t", targetWindow);
    }
    if (startDirectory) {
      this.cmd.push("-c", startDirectory);
    }
    if (windowName) {
      this.cmd.push("-n", windowName);
    }
    this.cmd.push(";");
  }

  // tmux split-window
  splitWindow({
    startDirectory,
    targetPane,
  }: SplitWindowArgs) {
    this.cmd.push("split-window");
    if (startDirectory) {
      this.cmd.push("-c", startDirectory);
    }
    if (targetPane) {
      this.cmd.push("-t", targetPane);
    }
    this.cmd.push(";");
  }

  // tmux send-keys
  sendKeys(
    { targetPane }: SendKeysArgs,
    keys: string[],
  ) {
    this.cmd.push("send-keys");
    if (targetPane) {
      this.cmd.push("-t", targetPane);
    }
    this.cmd.push(...keys.map((k) => k === ";" ? "\\;" : k));
    this.cmd.push(";");
  }

  // tmux select-layout
  selectLayout(
    { targetPane }: SelectLayoutArgs,
    layout: string,
  ) {
    this.cmd.push("select-layout");
    if (targetPane) {
      this.cmd.push("-t", targetPane);
    }
    this.cmd.push(layout);
    this.cmd.push(";");
  }

  // tmux select-window
  selectWindow({ targetWindow }: SelectWindowArgs) {
    this.cmd.push("select-window");
    if (targetWindow) {
      this.cmd.push("-t", targetWindow);
    }
    this.cmd.push(";");
  }

  // tmux select-pane
  selectPane({ targetPane }: SelectPaneArgs) {
    this.cmd.push("select-pane");
    if (targetPane) {
      this.cmd.push("-t", targetPane);
    }
    this.cmd.push(";");
  }

  // tmux switch-client
  switchClient({ targetSession }: SwitchClientArgs) {
    this.cmd.push("switch-client");
    if (targetSession) {
      this.cmd.push("-t", targetSession);
    }
    this.cmd.push(";");
  }

  // tmux attach-session
  attachSession({ targetSession }: AttachSessionArgs) {
    this.cmd.push("attach-session");
    if (targetSession) {
      this.cmd.push("-t", targetSession);
    }
    this.cmd.push(";");
  }
}

// tmux has-session
export const hasSession = async (
  targetSession: string,
  exactly: boolean,
): Promise<boolean> => {
  const cmd = [
    "tmux",
    "has-session",
    "-t",
    exactly ? `=${targetSession}` : targetSession,
  ];
  const p = Deno.run({ cmd, stderr: "null" });
  const status = await p.status();
  return status.success;
};
