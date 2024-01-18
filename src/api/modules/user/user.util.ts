import { z } from "zod";
import { BaseModel } from "../../common/interfaces";
import { DealBaseInterface } from "../deal/deal.util";
import { PipelineBaseInterface } from "../pipeline/pipeline.util";
import { NoteBaseInterface } from "../note/note.util";
import { FileBaseInterface } from "../file/file.util";
import { ContactBaseInterface } from "../contact/contact.util";
import { ActivityBaseInterface } from "../activity/activity.util";
import { APIKeyBaseInterface } from "../auth/auth.utils";

export interface noteModel extends BaseModel, NoteBaseInterface {}
export interface activityModel extends BaseModel, ActivityBaseInterface {}
export interface fileModel extends BaseModel, FileBaseInterface {}
export interface contactModel extends BaseModel, ContactBaseInterface {}
export interface activityModel extends BaseModel, ActivityBaseInterface {}
export interface pipelineModel extends BaseModel, PipelineBaseInterface {}
export interface dealModel extends BaseModel, DealBaseInterface {}

export interface UserBaseInterface {
  name: string;
  email: string;
  mobile: string;
  userId: string;
  roles: string;
  apiKey?: string | (APIKeyBaseInterface & BaseModel);
  created?: {
    activities: activityModel[];
    notes: noteModel[];
    files: fileModel[];
    contacts: contactModel[];
    deals: dealModel[];
    pipelines: pipelineModel[];
    perform_activities: activityModel[];
  };
  createdBy?: string;
}

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
