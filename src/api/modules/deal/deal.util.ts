import { z } from "zod";
import { LabelBaseInterface } from "../label/label.util";
import { BaseModel } from "../../common/interfaces";
import { NoteBaseInterface } from "../note/note.util";

export interface DealBaseInterface {
  desc?: string;
  value: number;
  currency: string;
  currentStageId: string;
  expectedClosingDate?: Date;
  status: string;
  pipelineId?: string;
  contacts: string[];
  items: string;
  labelId?: string | (LabelBaseInterface & BaseModel);
  notes: string | (NoteBaseInterface & BaseModel)[];
  notes: NoteInterface[];
  activities: ActivityInterface[];
  files: FileInterface[];
  creator: User;
}

export const dealCreateSchema = z.object({
  body: z.object({
    desc: z.string().optional(),
    value: z.number({
      required_error: "Deal Value is required",
    }),
    currency: z.string({
      required_error: "Deal Currency is required",
    }),
    currentStageId: z.string({
      required_error: "Stage Id is required",
    }),
    expectedClosingDate: z.date().optional(),
    status: z.string({
      required_error: "Deal Status is required",
    }),
    contacts: z.array(z.string()).nullable(),
    items: z.array(z.string()).nullable(),
    notes: z.array(z.string()).nullable(),
    files: z.array(z.string()).nullable(),
    creator: z.string(),
  }),
});

export const dealUpdateSchema = z.object({
  body: z.object({
    desc: z.string().optional(),
    value: z.number().optional(),
    currency: z.string().optional(),
    currentStageId: z.string().optional(),
    expectedClosingDate: z.date().optional(),
    status: z.string().optional(),
    contacts: z.array(z.string()).nullable().optional(),
    items: z.array(z.string()).nullable().optional(),
    notes: z.array(z.string()).nullable().optional(),
    files: z.array(z.string()).nullable().optional(),
  }),
});
