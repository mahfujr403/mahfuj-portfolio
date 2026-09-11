import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Layers,
  LayoutGrid,
  LineChart,
  Server,
  Wrench,
} from "lucide-react";

export type CategoryMeta = {
  Icon: LucideIcon;
  /** Two-tone gradient used for the card's accent bar, glow, and icon chip. */
  accent: [string, string];
};

// Keyword rules are checked in order; the first match wins. This keeps
// category → icon/accent mapping meaningful even though categories come
// from the API and aren't a fixed enum.
const RULES: { test: RegExp; meta: CategoryMeta }[] = [
  {
    test: /machine ?learning|deep ?learning|\bai\b|neural|model(l?ing)?/i,
    meta: { Icon: BrainCircuit, accent: ["#8b5cf6", "#ec4899"] },
  },
  {
    test: /mlops|pipeline|orchestration/i,
    meta: { Icon: Layers, accent: ["#ec4899", "#3b82f6"] },
  },
  {
    test: /cloud|devops|infra|deployment|ci\/?cd|kubernetes|docker/i,
    meta: { Icon: Cloud, accent: ["#3b82f6", "#22c55e"] },
  },
  {
    test: /data ?(base|bases)|sql|nosql/i,
    meta: { Icon: Database, accent: ["#00f2fe", "#3b82f6"] },
  },
  {
    test: /data ?(engineering|science)?|analytics|etl|warehouse/i,
    meta: { Icon: Database, accent: ["#00f2fe", "#8b5cf6"] },
  },
  {
    test: /visualiz|chart|dashboard/i,
    meta: { Icon: LineChart, accent: ["#00f2fe", "#22c55e"] },
  },
  {
    test: /web|frontend|front-end|ui\/?ux/i,
    meta: { Icon: LayoutGrid, accent: ["#ec4899", "#8b5cf6"] },
  },
  {
    test: /backend|back-end|server|\bapi\b/i,
    meta: { Icon: Server, accent: ["#22c55e", "#00f2fe"] },
  },
  {
    test: /language|programming/i,
    meta: { Icon: Code2, accent: ["#f59e0b", "#ec4899"] },
  },
  {
    test: /version control|\bgit\b/i,
    meta: { Icon: GitBranch, accent: ["#f97316", "#ec4899"] },
  },
  {
    test: /tool|framework|misc|other/i,
    meta: { Icon: Wrench, accent: ["#8b5cf6", "#00f2fe"] },
  },
];

// Cycled for any category that doesn't match a keyword rule above, so a
// new/unexpected category from the API still gets a distinct, on-brand look.
const FALLBACK_PALETTE: [string, string][] = [
  ["#00f2fe", "#8b5cf6"],
  ["#8b5cf6", "#ec4899"],
  ["#ec4899", "#00f2fe"],
  ["#22c55e", "#00f2fe"],
  ["#f59e0b", "#8b5cf6"],
];

export function getCategoryMeta(category: string, index: number): CategoryMeta {
  const rule = RULES.find((r) => r.test.test(category));
  if (rule) return rule.meta;
  return { Icon: Layers, accent: FALLBACK_PALETTE[index % FALLBACK_PALETTE.length] };
}
