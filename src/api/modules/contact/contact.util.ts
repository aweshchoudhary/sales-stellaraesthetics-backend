import { z } from "zod";

export interface ContactBaseInterface {
  fullname: string;
  companyName?: string;
  mobile: string;
  whatsapp: string;
  email: string;
  createdById: string;
}

export const contactCreateSchema = z.object({
  body: z.object({
    fullname: z.string({
      required_error: "Contact Name is required",
    }),
    companyName: z.string().optional(),
    mobile: z.string({
      required_error: "Mobile Number is required",
    }),
    whatsapp: z.string({
      required_error: "Mobile Number is required",
    }),
    email: z
      .string({
        required_error: "Contact Name is required",
      })
      .email({ message: "Not a valid email" }),
    createdById: z.string({
      required_error: "Creator ID is required",
    }),
  }),
});

export const contactUpdateSchema = z.object({
  body: z.object({
    fullname: z.string().optional(),
    companyName: z.string().optional(),
    mobile: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email({ message: "Not a valid email" }).optional(),
  }),
});
