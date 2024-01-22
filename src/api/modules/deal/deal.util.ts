import { z } from "zod";

export const dealCreateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    value: z
      .number({
        required_error: "Deal Value is required",
      })
      .optional(),
    currency: z
      .string({
        required_error: "Deal Currency is required",
      })
      .optional(),
    currentStageId: z
      .string({
        required_error: "Stage Id is required",
      })
      .optional(),
    expectedClosingDate: z.string().transform((str) => new Date(str)),
    status: z
      .string({
        required_error: "Deal Status is required",
      })
      .optional(),
    contactId: z.string({
      required_error: "Contact ID is required",
    }),
  }),
});

export const dealUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    value: z.number().optional(),
    currency: z.string().optional(),
    currentStageId: z.string().optional(),
    contactId: z.string().optional(),
    expectedClosingDate: z.date().optional(),
    status: z.string().optional(),
    // items: z.array(z.string()).optional(),
    notes: z.array(z.string()).optional(),
    files: z.array(z.string()).optional(),
  }),
});
