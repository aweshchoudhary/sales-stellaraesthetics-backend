import { z } from "zod";
import { DealBaseInterface } from "../deal/deal.util";
import { BaseModel } from "../../common/interfaces";
import { ContactBaseInterface } from "../contact/contact.util";

export interface NoteBaseInterface {
  content: string;
  dealId: string | (DealBaseInterface & BaseModel);
  contactId: string | (ContactBaseInterface & BaseModel);
  creatorId: string;
}

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
    creatorId: z.string({
      required_error: "Creator ID is required",
    }),
  }),
});

export const noteUpdateSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    dealId: z.string().optional(),
    contactId: z.string().optional(),
    creatorId: z.string().optional(),
  }),
});