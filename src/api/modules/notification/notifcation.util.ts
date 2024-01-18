import { z } from "zod";

export interface NotificationBaseInterface {
  name: string;
  content?: string;
  sentTo: any;
  openBy: any;
}

export const notificationCreateSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    content: z.string().min(0).max(500).optional().nullable(),
    sentTo: z.array(z.string()).refine((data) => data.length > 0, {
      message: "Sent To must have at least one string",
    }),
    openBy: z.array(z.string()).optional(),
  }),
});

export const notificationReadSchema = z.object({
  body: z.object({
    openBy: z.array(z.string()).optional(),
  }),
});
