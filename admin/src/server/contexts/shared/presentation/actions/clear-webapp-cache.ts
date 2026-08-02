"use server";

import { WebappCacheInvalidator } from "@/server/contexts/shared/infrastructure/services/webapp-cache-invalidator";
import { ClearWebappCacheUsecase } from "@/server/contexts/shared/application/usecases/clear-webapp-cache-usecase";
import { requireAuth } from "@/server/contexts/auth/presentation/loaders/require-auth";

interface ClearWebappCacheResponse {
  success: boolean;
  message: string;
}

const cacheInvalidator = new WebappCacheInvalidator();
const clearWebappCacheUsecase = new ClearWebappCacheUsecase(cacheInvalidator);

export async function clearWebappCacheAction(): Promise<ClearWebappCacheResponse> {
  await requireAuth();

  return await clearWebappCacheUsecase.execute();
}
