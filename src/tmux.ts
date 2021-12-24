class TmuxException extends Error {}

// tmux
export const tmux = async (args: string[]) => {
  const cmd = ["tmux", ...args];
  const p = Deno.run({ cmd });
  const status = await p.status();

  if (!status.success) {
    throw new TmuxException(`failed to run: ${cmd.join(" ")}`);
  }
};

// tmux new-session
export type NewSessionArgs = {
  sessionName?: string;
  startDirectory?: string;
  windowName?: string;
  detach?: boolean;
};

export const newSession = async (
  { sessionName, startDirectory, windowName, detach }: NewSessionArgs,
) => {
  const args = ["new-session"];
  if (detach) {
    args.push("-d");
  }
  if (sessionName) {
    args.push("-s", sessionName);
  }
  if (startDirectory) {
    args.push("-c", startDirectory);
  }
  if (windowName) {
    args.push("-n", windowName);
  }
  return await tmux(args);
};

// tmux new-window
export type NewWindowArgs = {
  targetWindow?: string;
  startDirectory?: string;
  windowName?: string;
};

export const newWindow = async (
  { targetWindow, startDirectory, windowName }: NewWindowArgs,
) => {
  const args = ["new-window"];
  if (targetWindow) {
    args.push("-t", targetWindow);
  }
  if (startDirectory) {
    args.push("-c", startDirectory);
  }
  if (windowName) {
    args.push("-n", windowName);
  }
  return await tmux(args);
};

// tmux split-window
export type SplitWindowArgs = {
  startDirectory?: string;
  targetPane?: string;
};

export const splitWindow = async (
  { startDirectory, targetPane }: SplitWindowArgs,
) => {
  const args = ["split-window"];
  if (startDirectory) {
    args.push("-c", startDirectory);
  }
  if (targetPane) {
    args.push("-t", targetPane);
  }
  return await tmux(args);
};

// tmux send-keys
export type SendKeysArgs = {
  targetPane?: string;
};

export const sendKeys = async (
  { targetPane }: SendKeysArgs,
  keys: string[],
) => {
  const args = ["send-keys"];
  if (targetPane) {
    args.push("-t", targetPane);
  }
  args.push(...keys);
  return await tmux(args);
};

// tmux select-layout
export type SelectLayoutArgs = {
  targetPane?: string;
};

export const selectLayout = async (
  { targetPane }: SelectLayoutArgs,
  layout: string,
) => {
  const args = ["select-layout"];
  if (targetPane) {
    args.push("-t", targetPane);
  }
  args.push(layout);
  return await tmux(args);
};

// tmux select-window
export type SelectWindowArgs = {
  targetWindow?: string;
};

export const selectWindow = async ({ targetWindow }: SelectWindowArgs) => {
  const args = ["select-window"];
  if (targetWindow) {
    args.push("-t", targetWindow);
  }
  return await tmux(args);
};

// tmux select-pane
export type SelectPaneArgs = {
  targetPane?: string;
};

export const selectPane = async ({ targetPane }: SelectPaneArgs) => {
  const args = ["select-pane"];
  if (targetPane) {
    args.push("-t", targetPane);
  }
  return await tmux(args);
};

// tmux switch-client
export type SwitchClientArgs = {
  targetSession?: string;
};

export const switchClient = async ({ targetSession }: SwitchClientArgs) => {
  const args = ["-u", "switch-client"];
  if (targetSession) {
    args.push("-t", targetSession);
  }
  return await tmux(args);
};

// tmux attach-session
export type AttachSessionArgs = {
  targetSession?: string;
};

export const attachSession = async ({ targetSession }: AttachSessionArgs) => {
  const args = ["-u", "attach-session"];
  if (targetSession) {
    args.push("-t", targetSession);
  }
  return await tmux(args);
};
