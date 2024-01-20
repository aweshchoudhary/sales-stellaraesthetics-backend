import { z } from "zod";
export const userCreateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "User Full Name is required",
    }),
    email: z
      .string({
        required_error: "User email is required",
      })
      .email({ message: "Not A valid User email" }),
    mobile: z.string({
      required_error: "User Mobile Number is required",
    }),
    userId: z.string({
      required_error: "User ID is required",
    }),
    roles: z.string().optional(),
    created: z
      .object({
        activities: z.array(z.string()).nullable().optional(),
        notes: z.array(z.string()).nullable().optional(),
        files: z.array(z.string()).nullable().optional(),
        contacts: z.array(z.string()).nullable().optional(),
        deals: z.array(z.string()).nullable().optional(),
        pipelines: z.array(z.string()).nullable().optional(),
        performers: z.array(z.string()).nullable().optional(),
      })
      .optional(),
    createdBy: z.string().optional(),
  }),
});

export const userUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().optional(),
    userId: z.string().optional(),
    roles: z.string().optional(),
    created: z
      .object({
        activities: z.array(z.string()).nullable().optional(),
        notes: z.array(z.string()).nullable().optional(),
        files: z.array(z.string()).nullable().optional(),
        contacts: z.array(z.string()).nullable().optional(),
        deals: z.array(z.string()).nullable().optional(),
        pipelines: z.array(z.string()).nullable().optional(),
        performers: z.array(z.string()).nullable().optional(),
      })
      .optional(),
  }),
});

export const userPublicUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().optional(),
  }),
});
