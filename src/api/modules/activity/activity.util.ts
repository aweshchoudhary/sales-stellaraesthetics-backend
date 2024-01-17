import { z } from "zod";

export interface ActivityBaseInterface {
  name: string;
  desc?: string;
  type: string;
  start: Date;
  end: Date;
  location?: string;
  taskUrl?: string;
  performer: string;
  creator: string;
  deals: string[];
  contacts: string[];
  involved_contacts: string[];
  involved_users: string[];
  completed_on: Date | null;
  googleEventId?: string;
  googleEventHtmlLink?: string;
  files: ActivityFiles[];
}
//   deals: DealInterface[];
//   contacts: ContactInterface[];
//   involved_contacts: ContactInterface[];

export interface ActivityFiles {
  desc: string;
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
}

export const activityCreateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Activity Name is required",
    }),
    desc: z.string().optional(),
    type: z.string({
      required_error: "Activity Type is required",
    }),
    start: z.date({
      required_error: "Activity Start Date Time is required",
    }),
    end: z.date({
      required_error: "Activity Start Date Time is required",
    }),
    location: z.string().optional(),
    taskUrl: z
      .string()
      .url({ message: "Not a valid Activity Task Url" })
      .optional(),
    performer: z.string({
      required_error: "Activity Performer is required",
    }),
    creator: z.string({
      required_error: "Activity Creator is required",
    }),
    deals: z.array(z.string()).nullable(),
    contacts: z.array(z.string()).nullable(),
    completed_on: z.date().nullable(),
    googleEventId: z.string().nullable(),
    googleEventHtmlLink: z.string().nullable(),
    files: z
      .array(
        z
          .object({
            desc: z.string().optional(),
            name: z.string({
              required_error: "Activity File Name is required",
            }),
            path: z.string({
              required_error: "Activity File Path is required",
            }),
            url: z.string({
              required_error: "Activity File Url is required",
            }),
            type: z.string({
              required_error: "Activity File Type is required",
            }),
            size: z.number({
              required_error: "Activity File Size is required",
            }),
          })
          .nullable()
      )
      .optional(),
  }),
});

export const activityUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    type: z.string().optional(),
    start: z.date().optional(),
    end: z.date().optional(),
    location: z.string().optional(),
    taskUrl: z
      .string()
      .url({ message: "Not a valid Activity Task Url" })
      .optional(),
    performer: z.string().optional(),
    creator: z.string().optional(),
    deals: z.array(z.string()).nullable().optional(),
    contacts: z.array(z.string()).nullable().optional(),
    completed_on: z.date().nullable().optional(),
    googleEventId: z.string().nullable().optional(),
    googleEventHtmlLink: z.string().nullable().optional(),
    files: z
      .array(
        z
          .object({
            desc: z.string().optional(),
            name: z.string({
              required_error: "Activity File Name is required",
            }),
            path: z.string({
              required_error: "Activity File Path is required",
            }),
            url: z.string({
              required_error: "Activity File Url is required",
            }),
            type: z.string({
              required_error: "Activity File Type is required",
            }),
            size: z.number({
              required_error: "Activity File Size is required",
            }),
          })
          .nullable()
      )
      .optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: "Activity Id is required",
    }),
  }),
});
