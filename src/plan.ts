import { parse } from "std/yaml/mod.ts";

export type Plan = {
  active?: Active;
  windows?: (Window | null)[];
};

export type Active = {
  window?: string | number;
  pane?: number;
};

export type Window = {
  name?: string;
  layout?: string;
  panes?: (Pane | null)[];
};

export type Pane = {
  command?: string | string[];
};

export const loadPlan = async (path: string): Promise<Plan | null> => {
  let content;
  try {
    content = await Deno.readTextFile(path);
  } catch (_) {
    return null;
  }
  const plan = parse(content);
  return plan as Plan;
};
