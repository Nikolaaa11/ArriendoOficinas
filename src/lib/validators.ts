import { z } from "zod";

export const emailSchema = z.string().email("Email inválido");
export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9\s-]{8,15}$/u, "Teléfono inválido");

export const contactFormSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  message: z.string().min(10, "Mínimo 10 caracteres"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: emailSchema,
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phone: phoneSchema.optional().or(z.literal("")),
  profession: z.string().optional(),
  company: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
