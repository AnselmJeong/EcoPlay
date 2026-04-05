import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type { QuestionnaireSchema } from "questionnaire-js";
import type {
  QuestionnaireDefinition,
  QuestionnaireStage,
  QuestionnaireSummary,
} from "@/lib/questionnaireTypes";

type QuestionnaireManifestEntry = {
  key?: string;
  name?: string;
  stage?: QuestionnaireStage;
  enabled?: boolean;
};

type QuestionnaireManifest = {
  displayOrder?: string[];
  questionnaires?: Record<string, QuestionnaireManifestEntry>;
};

const MANIFEST_FILE_NAME = "manifest.json";

async function directoryExists(targetPath: string) {
  try {
    const stat = await fs.stat(targetPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function getQuestionnaireDirectory() {
  const candidates = [
    path.resolve(process.cwd(), "..", "questionnaire"),
    path.resolve(process.cwd(), "questionnaire"),
  ];

  for (const candidate of candidates) {
    if (await directoryExists(candidate)) {
      return candidate;
    }
  }

  throw new Error("questionnaire 폴더를 찾을 수 없습니다.");
}

function normalizeKey(fileName: string) {
  return fileName
    .replace(/\.json$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function inferQuestionnaireName(schema: QuestionnaireSchema, fallbackKey: string) {
  if (typeof schema.title === "string" && schema.title.trim()) {
    return schema.title.trim();
  }

  for (const page of schema.pages ?? []) {
    if (typeof page.title === "string" && page.title.trim()) {
      return page.title.trim();
    }

    for (const element of page.elements ?? []) {
      if (
        "title" in element &&
        typeof element.title === "string" &&
        element.title.trim()
      ) {
        return element.title.trim();
      }
    }
  }

  return fallbackKey;
}

async function readManifest(
  questionnaireDirectory: string
): Promise<QuestionnaireManifest> {
  const manifestPath = path.join(questionnaireDirectory, MANIFEST_FILE_NAME);

  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    return JSON.parse(raw) as QuestionnaireManifest;
  } catch {
    return {};
  }
}

function buildOrderLookup(displayOrder: string[] = []) {
  return new Map(displayOrder.map((value, index) => [value, index]));
}

function getOrderIndex(
  orderLookup: Map<string, number>,
  questionnaire: QuestionnaireDefinition
) {
  const baseName = questionnaire.fileName.replace(/\.json$/i, "");
  const candidates = [questionnaire.fileName, baseName, questionnaire.key, questionnaire.slug];

  for (const candidate of candidates) {
    const index = orderLookup.get(candidate);
    if (typeof index === "number") {
      return index;
    }
  }

  return Number.POSITIVE_INFINITY;
}

export async function getAllQuestionnaires(): Promise<QuestionnaireDefinition[]> {
  const questionnaireDirectory = await getQuestionnaireDirectory();
  const manifest = await readManifest(questionnaireDirectory);
  const files = await fs.readdir(questionnaireDirectory);

  const questionnaires = await Promise.all(
    files
      .filter((fileName) => fileName.endsWith(".json") && fileName !== MANIFEST_FILE_NAME)
      .map(async (fileName) => {
        const filePath = path.join(questionnaireDirectory, fileName);
        const baseName = fileName.replace(/\.json$/i, "");
        const schema = JSON.parse(
          await fs.readFile(filePath, "utf8")
        ) as QuestionnaireSchema;
        const entry =
          manifest.questionnaires?.[fileName] ??
          manifest.questionnaires?.[baseName] ??
          {};

        if (entry.enabled === false) {
          return null;
        }

        const slug = entry.key ?? normalizeKey(baseName);
        const stage =
          entry.stage ??
          (slug === "demographic" || baseName === "demographic"
            ? "demographic"
            : "followup");

        return {
          key: slug,
          slug,
          fileName,
          name: entry.name ?? inferQuestionnaireName(schema, baseName),
          stage,
          schema,
        } satisfies QuestionnaireDefinition;
      })
  );

  const orderLookup = buildOrderLookup(manifest.displayOrder);

  return questionnaires
    .filter((questionnaire): questionnaire is QuestionnaireDefinition => questionnaire !== null)
    .sort((left, right) => {
      const leftIndex = getOrderIndex(orderLookup, left);
      const rightIndex = getOrderIndex(orderLookup, right);

      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }

      return left.name.localeCompare(right.name, "ko");
    });
}

export async function getDemographicQuestionnaire() {
  const questionnaires = await getAllQuestionnaires();
  const demographic = questionnaires.find(
    (questionnaire) => questionnaire.stage === "demographic"
  );

  if (!demographic) {
    throw new Error("demographic 설문을 찾을 수 없습니다.");
  }

  return demographic;
}

export async function getFollowUpQuestionnaires() {
  const questionnaires = await getAllQuestionnaires();
  return questionnaires.filter(
    (questionnaire) => questionnaire.stage === "followup"
  );
}

export async function getFollowUpQuestionnaireBySlug(slug: string) {
  const questionnaires = await getFollowUpQuestionnaires();
  return questionnaires.find((questionnaire) => questionnaire.slug === slug);
}

export function toQuestionnaireSummary(
  questionnaire: QuestionnaireDefinition
): QuestionnaireSummary {
  return {
    key: questionnaire.key,
    slug: questionnaire.slug,
    name: questionnaire.name,
  };
}
