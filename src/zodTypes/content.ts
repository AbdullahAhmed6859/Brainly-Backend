import { z } from "zod";

export const contentBody = z.object({
  title: z.string(),
  link: z.string(),
  tags: z.array(z.string()),
  userId: z.string().length(24),
});
