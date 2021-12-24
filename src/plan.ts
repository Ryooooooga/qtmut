import { parse } from "https://deno.land/std@0.119.0/encoding/yaml.ts";

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
  command?: string;
};

export const loadPlan = async (path: string): Promise<Plan> => {
  const content = await Deno.readTextFile(path);
  const plan = parse(content);
  return plan as Plan;
};
