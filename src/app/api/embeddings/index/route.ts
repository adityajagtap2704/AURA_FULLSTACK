import "server-only";

import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";
import { runEmbeddingPipeline } from "@/lib/embeddings/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface IndexRequestBody {
  batchSize?: unknown;
  objectTypes?: unknown;
}

const allowedObjectTypes = [
  "task",
  "event",
  "message",
  "document",
] as const;

type ObjectType = (typeof allowedObjectTypes)[number];

const objectTypeMap = {
  task: "tasks",
  event: "events",
  message: "messages",
  document: "documents",
} as const;

function isObjectType(value: unknown): value is ObjectType {
  return (
    typeof value === "string" &&
    allowedObjectTypes.includes(value as ObjectType)
  );
}

function getResultNumber(
  result: unknown,
  property: "fetched" | "processed" | "skipped",
): number {
  if (
    typeof result === "object" &&
    result !== null &&
    property in result
  ) {
    const value = (result as Record<string, unknown>)[property];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return 0;
}

export async function POST(request: Request) {
  try {
    const supabase = supabaseServer;

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Missing authorization token",
        },
        {
          status: 401,
        },
      );
    }

    const accessToken = authHeader.slice(7).trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Authorization token is empty",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          details: userError?.message,
        },
        {
          status: 401,
        },
      );
    }

    /*
     * AURA Phase 1:
     * one authenticated user = one tenant
     */
    const tenantId = user.id;

    let body: IndexRequestBody = {};

    try {
      const requestText = await request.text();

      if (requestText.trim()) {
        body = JSON.parse(requestText) as IndexRequestBody;
      }
    } catch {
      return NextResponse.json(
        {
          error: "Request body must contain valid JSON",
        },
        {
          status: 400,
        },
      );
    }

    let objectTypes: ObjectType[];

    if (body.objectTypes === undefined) {
      objectTypes = [...allowedObjectTypes];
    } else {
      if (
        !Array.isArray(body.objectTypes) ||
        body.objectTypes.length === 0 ||
        !body.objectTypes.every(isObjectType)
      ) {
        return NextResponse.json(
          {
            error:
              "objectTypes must contain only task, event, message, or document.",
          },
          {
            status: 400,
          },
        );
      }

      objectTypes = [...new Set(body.objectTypes)];
    }

    const batchSize =
      typeof body.batchSize === "number" &&
      Number.isFinite(body.batchSize) &&
      body.batchSize > 0
        ? Math.floor(body.batchSize)
        : 100;

    if (batchSize > 1000) {
      return NextResponse.json(
        {
          error: "batchSize cannot be greater than 1000.",
        },
        {
          status: 400,
        },
      );
    }

    const results: Partial<
      Record<
        ObjectType,
        {
          fetched: number;
          processed: number;
          skipped: number;
          error?: string;
        }
      >
    > = {};

    let totalFetched = 0;
    let totalProcessed = 0;
    let totalSkipped = 0;

    for (const objectType of objectTypes) {
      const pipelineObjectType = objectTypeMap[objectType];

      try {
        const result = await runEmbeddingPipeline(supabase, {
          tenantId,
          objectType: pipelineObjectType,
          limit: batchSize,
        });

        const fetched = getResultNumber(result, "fetched");
        const processed = getResultNumber(result, "processed");
        const skipped = getResultNumber(result, "skipped");

        results[objectType] = {
          fetched,
          processed,
          skipped,
        };

        totalFetched += fetched;
        totalProcessed += processed;
        totalSkipped += skipped;
      } catch (pipelineError) {
        console.error(
          `Embedding pipeline failed for ${objectType}:`,
          pipelineError,
        );

        results[objectType] = {
          fetched: 0,
          processed: 0,
          skipped: 0,
          error:
            pipelineError instanceof Error
              ? pipelineError.message
              : String(pipelineError),
        };
      }
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      tenantId,
      objectTypes,
      batchSize,
      totals: {
        fetched: totalFetched,
        processed: totalProcessed,
        skipped: totalSkipped,
      },
      results,
    });
  } catch (error) {
    console.error("Embedding index error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      },
    );
  }
}