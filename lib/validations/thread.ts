import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string(),
  accountId: z.string(),
  document: z.string(),
  title: z.string(),
  niveau: z.string(),
  matiere: z.string(),
});

export const MatiereValidation = z.object({
  thread: z.string(),
  accountId: z.string(),
  title: z.string(),
  niveau: z.string(),
  codematiere: z.string(),
});
