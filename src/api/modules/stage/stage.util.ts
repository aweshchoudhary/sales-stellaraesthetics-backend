import { z } from "zod";

export const stageCreateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Stage Name is required",
    }),
    desc: z.string({}).optional(),
    position: z.number({}).optional(),
    pipelineId: z.string({
      required_error: "Pipeline ID is required",
    }),
    deals: z.array(z.string()).optional(),
  }),
});

export const stageUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    position: z.number().optional(),
    pipelineId: z.string().optional(),
    deals: z.array(z.string()).optional(),
  }),
});
// export const stageUpdateSchema = z.object({
//   aquey: z.object({
//     name: z.string().optional(),
//     desc: z.string().optional(),
//     position: z.number().optional(),
//     pipelineId: z.string().optional(),
//     deals: z.array(z.string()).optional(),
//   }),
// });

export const stageReorderSchema = z.object({
  body: z.object({
    stageId: z.string({
      required_error: "Stage ID is required",
    }),
    newPosition: z.number({
      required_error: "Stage New Position is required",
    }),
  }),
});
