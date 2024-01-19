import { z } from "zod";
import { LabelBaseInterface } from "../label/label.util";
import { BaseModel } from "../../common/interfaces";
import { NoteBaseInterface } from "../note/note.util";
import { ActivityBaseInterface } from "../activity/activity.util";
import { UserBaseInterface } from "../user/user.util";
import { FileBaseInterface } from "../file/file.util";
import { ContactBaseInterface } from "../contact/contact.util";

export interface DealBaseInterface {
  name?: string;
  desc?: string;
  value: number;
  currency: string;
  currentStageId: string;
  expectedClosingDate?: Date;
  status: string;
  pipelineId?: string;
  contactId: string | (ContactBaseInterface & BaseModel);
  labelId?: string | (LabelBaseInterface & BaseModel);
  notes: string | (NoteBaseInterface & BaseModel)[];
  activities: string | (ActivityBaseInterface & BaseModel)[];
  files: string | (FileBaseInterface & BaseModel)[];
  createdById: string | (UserBaseInterface & BaseModel);
  // items: string;
}

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
    expectedClosingDate: z.date().optional(),
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
