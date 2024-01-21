import { z } from "zod";

export interface SortInterface {
  id: string;
  desc: boolean;
}

export interface GetManyFiltersInterface {
  sort: SortInterface[];
  include: string;
  limit: number;
  skip: number;
}

export const getManyReqFilters = z.object({
  sort: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      })
    )
    .optional(),
  include: z.string().optional(),
  limit: z.string().min(0).max(100).optional(),
  skip: z.string().optional(),
});
