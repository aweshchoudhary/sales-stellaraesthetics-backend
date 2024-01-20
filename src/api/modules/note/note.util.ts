import { z } from "zod";

export const noteCreateSchema = z.object({
  body: z.object({
    content: z.string({
      required_error: "Note Name is required",
    }),
    dealId: z.string({
      required_error: "Deal ID is required",
    }),
    contactId: z.string({
      required_error: "Contact ID is required",
    }),
  }),
});

export const noteUpdateSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    dealId: z.string().optional(),
    contactId: z.string().optional(),
  }),
});
