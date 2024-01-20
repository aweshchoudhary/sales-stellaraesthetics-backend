import { z } from "zod";

export const pipelineCreateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Pipeline Name is required",
    }),
    desc: z.string().optional(),
    stages: z.array(z.string()).optional(),
    deals: z.array(z.string()).optional(),
    assignees: z.array(z.string()).optional(),
  }),
});

export const pipelineUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    stages: z.array(z.string()).optional(),
    deals: z.array(z.string()).optional(),
  }),
});

export const pipelineGetByUserIdSchema = z.object({
  body: z.object({
    createdById: z.string({
      required_error: "User ID is required",
    }),
  }),
});

export const pipelineAssignUserSchema = z.object({
  body: z.object({
    newAssigneeId: z.string({
      required_error: "Assignee User ID is required",
    }),
  }),
});

export const pipelineChangeOwnershipSchema = z.object({
  body: z.object({
    newOwnerId: z.string({
      required_error: "New Owner ID is required",
    }),
  }),
});

export const pipelineRemoveUserSchema = z.object({
  body: z.object({
    assigneeId: z.string({
      required_error: "User ID is required",
    }),
  }),
});
