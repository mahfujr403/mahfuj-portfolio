import type { IconType } from "react-icons";
import {
  Sparkles,
  Cloud,
  BrainCircuit,
  Layers,
  ArrowLeftRight,
  Filter,
  Database,
  PenTool,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiGit,
  SiDocker,
  SiMongodb,
  SiPostgresql,
  SiGraphql,
  SiRedux,
  SiVuedotjs,
  SiAngular,
  SiOpenjdk,
  SiCplusplus,
  SiSharp,
  SiPytorch,
  SiTensorflow,
  SiFigma,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiKubernetes,
  SiJupyter,
  SiHuggingface,
  SiKeras,
  SiApachespark,
  SiMysql,
  SiRedis,
  SiLinux,
  SiGo,
  SiRust,
  SiFlask,
  SiFastapi,
  SiDjango,
  SiFirebase,
  SiVercel,
  SiGooglecloud,
  SiScala,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiSqlite,
  SiApachekafka,
  SiOpencv,
  SiTerraform,
  SiJenkins,
  SiGithubactions,
  SiNginx,
  SiExpress,
  SiVite,
  SiJest,
  SiWebpack,
  SiScipy,
  SiPlotly,
  SiMlflow,
  SiOnnx,
  SiApacheairflow,
  SiApachehadoop,
  SiApachehive,
  SiApachecassandra,
  SiLatex,
  SiGithub,
} from "react-icons/si";

export type SkillMeta = {
  Icon: IconType;
  color: string;
};

// Normalize an incoming skill name into a lookup key:
// lowercase, strip anything that isn't a letter or digit.
//
// Symbol-only names need special-casing *before* that strip, otherwise
// "C++" and "C#" both collapse to the same "c" key (the "+"/"#" just get
// dropped) and collide with each other instead of reaching their own
// SKILL_MAP entries.
function normalize(name: string) {
  const lower = name.toLowerCase().trim();
  if (lower === "c++") return "cpp";
  if (lower === "c#") return "csharp";
  return lower.replace(/[^a-z0-9]/g, "");
}

const SKILL_MAP: Record<string, SkillMeta> = {
  react: { Icon: SiReact, color: "#61DAFB" },
  reactjs: { Icon: SiReact, color: "#61DAFB" },
  nextjs: { Icon: SiNextdotjs, color: "#FFFFFF" },
  next: { Icon: SiNextdotjs, color: "#FFFFFF" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  js: { Icon: SiJavascript, color: "#F7DF1E" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  ts: { Icon: SiTypescript, color: "#3178C6" },
  python: { Icon: SiPython, color: "#3776AB" },
  nodejs: { Icon: SiNodedotjs, color: "#339933" },
  node: { Icon: SiNodedotjs, color: "#339933" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  html5: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#1572B6" },
  css3: { Icon: SiCss, color: "#1572B6" },
  tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  tailwindcss: { Icon: SiTailwindcss, color: "#06B6D4" },
  git: { Icon: SiGit, color: "#F05032" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  // simple-icons no longer ships an AWS mark (trademark removal), so we
  // fall back to a generic cloud glyph in AWS's brand orange.
  aws: { Icon: Cloud, color: "#FF9900" },
  amazonaws: { Icon: Cloud, color: "#FF9900" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  mongo: { Icon: SiMongodb, color: "#47A248" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  postgres: { Icon: SiPostgresql, color: "#4169E1" },
  graphql: { Icon: SiGraphql, color: "#E10098" },
  redux: { Icon: SiRedux, color: "#764ABC" },
  vue: { Icon: SiVuedotjs, color: "#4FC08D" },
  vuejs: { Icon: SiVuedotjs, color: "#4FC08D" },
  angular: { Icon: SiAngular, color: "#DD0031" },
  java: { Icon: SiOpenjdk, color: "#437291" },
  // Reached via normalize("C++") -> "cpp" (see the normalize() special-case
  // above). A literal "c++" key here would never be hit.
  cpp: { Icon: SiCplusplus, color: "#00599C" },
  // Reached via normalize("C#") -> "csharp".
  csharp: { Icon: SiSharp, color: "#512BD4" },
  pytorch: { Icon: SiPytorch, color: "#EE4C2C" },
  tensorflow: { Icon: SiTensorflow, color: "#FF6F00" },
  figma: { Icon: SiFigma, color: "#F24E1E" },
  numpy: { Icon: SiNumpy, color: "#4D77CF" },
  pandas: { Icon: SiPandas, color: "#8BC7F5" },
  scikitlearn: { Icon: SiScikitlearn, color: "#F7931E" },
  sklearn: { Icon: SiScikitlearn, color: "#F7931E" },
  kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
  k8s: { Icon: SiKubernetes, color: "#326CE5" },
  jupyter: { Icon: SiJupyter, color: "#F37626" },
  huggingface: { Icon: SiHuggingface, color: "#FFD21E" },
  keras: { Icon: SiKeras, color: "#D00000" },
  apachespark: { Icon: SiApachespark, color: "#E25A1C" },
  spark: { Icon: SiApachespark, color: "#E25A1C" },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  redis: { Icon: SiRedis, color: "#DC382D" },
  linux: { Icon: SiLinux, color: "#FCC624" },
  go: { Icon: SiGo, color: "#00ADD8" },
  golang: { Icon: SiGo, color: "#00ADD8" },
  rust: { Icon: SiRust, color: "#F2F2F2" },
  flask: { Icon: SiFlask, color: "#F2F2F2" },
  fastapi: { Icon: SiFastapi, color: "#009688" },
  django: { Icon: SiDjango, color: "#44B78B" },
  firebase: { Icon: SiFirebase, color: "#FFCA28" },
  vercel: { Icon: SiVercel, color: "#F2F2F2" },
  googlecloud: { Icon: SiGooglecloud, color: "#4285F4" },
  gcp: { Icon: SiGooglecloud, color: "#4285F4" },
  scala: { Icon: SiScala, color: "#DC322F" },
  php: { Icon: SiPhp, color: "#777BB4" },
  swift: { Icon: SiSwift, color: "#F05138" },
  kotlin: { Icon: SiKotlin, color: "#7F52FF" },
  sqlite: { Icon: SiSqlite, color: "#8BB6D6" },
  apachekafka: { Icon: SiApachekafka, color: "#E8E8E8" },
  kafka: { Icon: SiApachekafka, color: "#E8E8E8" },
  opencv: { Icon: SiOpencv, color: "#8A5CF6" },
  terraform: { Icon: SiTerraform, color: "#7B42BC" },
  jenkins: { Icon: SiJenkins, color: "#D24939" },
  githubactions: { Icon: SiGithubactions, color: "#2088FF" },
  nginx: { Icon: SiNginx, color: "#009639" },
  express: { Icon: SiExpress, color: "#F2F2F2" },
  expressjs: { Icon: SiExpress, color: "#F2F2F2" },
  vite: { Icon: SiVite, color: "#646CFF" },
  jest: { Icon: SiJest, color: "#C21325" },
  webpack: { Icon: SiWebpack, color: "#8DD6F9" },
  scipy: { Icon: SiScipy, color: "#8CAAE6" },
  plotly: { Icon: SiPlotly, color: "#3F4F75" },
  mlflow: { Icon: SiMlflow, color: "#0194E2" },
  onnx: { Icon: SiOnnx, color: "#4E92E8" },
  apacheairflow: { Icon: SiApacheairflow, color: "#017CEE" },
  airflow: { Icon: SiApacheairflow, color: "#017CEE" },
  apachehadoop: { Icon: SiApachehadoop, color: "#66CCFF" },
  hadoop: { Icon: SiApachehadoop, color: "#66CCFF" },
  apachehive: { Icon: SiApachehive, color: "#FDEE21" },
  hive: { Icon: SiApachehive, color: "#FDEE21" },
  apachecassandra: { Icon: SiApachecassandra, color: "#4A9BD5" },
  cassandra: { Icon: SiApachecassandra, color: "#4A9BD5" },

  // --- Aliases: same underlying tech, different display name ---
  // "TensorFlow Lite" -> normalize() gives "tensorflowlite", which is a
  // distinct key from "tensorflow" above, so it needs its own entry.
  tensorflowlite: { Icon: SiTensorflow, color: "#FF6F00" },
  tflite: { Icon: SiTensorflow, color: "#FF6F00" },
  // "Hugging Face Hub" -> "huggingfacehub", distinct from "huggingface".
  huggingfacehub: { Icon: SiHuggingface, color: "#FFD21E" },
  // "Computer Vision" (the field) reuses the OpenCV mark, the closest
  // recognizable brand icon for the concept.
  computervision: { Icon: SiOpencv, color: "#8A5CF6" },
  // "Jupyter Notebook" -> "jupyternotebook", distinct from "jupyter".
  jupyternotebook: { Icon: SiJupyter, color: "#F37626" },
  // "Git & GitHub" is listed as a single skill; GitHub's mark reads best
  // at this size and covers both halves of the name.
  gitgithub: { Icon: SiGithub, color: "#F2F2F2" },

  // --- Skills/tools with an official brand mark ---
  latex: { Icon: SiLatex, color: "#008080" },
  github: { Icon: SiGithub, color: "#F2F2F2" },
  // Generic SQL (as opposed to a specific engine like MySQL/Postgres) has
  // no simple-icons brand mark, so it gets a neutral database glyph.
  sql: { Icon: Database, color: "#4479A1" },

  // --- Concepts with no single official logo: neutral, semantic glyphs ---
  datapreprocessing: { Icon: Filter, color: "#8b5cf6" },
  deeplearning: { Icon: BrainCircuit, color: "#8b5cf6" },
  transferlearning: { Icon: ArrowLeftRight, color: "#8b5cf6" },
  cnn: { Icon: Layers, color: "#8b5cf6" },
  convolutionalneuralnetworks: { Icon: Layers, color: "#8b5cf6" },
  convolutionalneuralnetworkscnn: { Icon: Layers, color: "#8b5cf6" },
  researchwriting: { Icon: PenTool, color: "#8b5cf6" },
};

// Falls back to a generic sparkle glyph so an unmapped skill name
// (e.g. a newly added one from the API) never breaks the UI.
const FALLBACK: SkillMeta = { Icon: Sparkles, color: "#8b5cf6" };

export function getSkillMeta(name: string): SkillMeta {
  return SKILL_MAP[normalize(name)] ?? FALLBACK;
}
