import { z } from "zod";

export const fileCreateSchema = z.object({
  body: z.object({
    desc: z.string().optional(),
    dealId: z.string({
      required_error: "Deal Id is required",
    }),
    contactId: z.string({
      required_error: "Contact Id is required",
    }),
  }),
});
export const fileUploadSchema = z.object({
  name: z.string({
    required_error: "File Name is required",
  }),
  size: z.number({
    required_error: "File size is required",
  }),
  type: z.string({
    required_error: "File type is required",
  }),
  url: z.string({
    required_error: "File Path/Url is required",
  }),
});

export const fileUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    size: z.number().optional(),
    type: z.string().optional(),
    url: z.string().optional(),
    dealId: z.string().optional(),
    contactId: z.string().optional(),
    createdById: z.string().optional(),
  }),
});
