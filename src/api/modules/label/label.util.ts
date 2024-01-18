import { z } from "zod";

export interface LabelBaseInterface {
  label: string;
  desc?: string;
  color: string;
  pipelineId: string;
  creatorId: string;
}

export const labelCreateSchema = z.object({
  body: z.object({
    label: z.string({
      required_error: "Label Name is required",
    }),
    desc: z.string().optional(),
    color: z.string({
      required_error: "Label Color is required",
    }),
    pipelineId: z.string({
      required_error: "Pipeline ID is required",
    }),
    creatorId: z.string({
      required_error: "Creator ID is required",
    }),
  }),
});

export const labelUpdateSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    desc: z.string().optional(),
    color: z.string().optional(),
    pipelineId: z.string().optional(),
    creatorId: z.string().optional(),
  }),
});
