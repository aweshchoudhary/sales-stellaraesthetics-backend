import { z } from "zod";

export interface SortInterface {
  id: string;
  desc: boolean;
}

export interface GetManyFiltersInterface {
  sort: SortInterface[];
  populate: any;
  limit: number;
  skip: number;
}

export const GetManyFilters = z.object({
  name: z.string().optional(),
  desc: z.string().optional(),
  stages: z.array(z.string()).nullable().optional(),
  deals: z.array(z.string()).nullable().optional(),
  assignees: z.array(z.string()).nullable().optional(),
  owner: z.string().optional(),
});
