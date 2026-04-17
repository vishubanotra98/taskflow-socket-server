import { z } from "zod";

const hasLowercase = /[a-z]/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;
const hasSpecialChar = /[^A-Za-z0-9]/;
const hasNoSpaces = /^\S*$/;

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "First name should have atleast 3 characters.")
    .max(50, "First name should have atleast 3 characters."),
  lastName: z
    .string()
    .trim()
    .min(3, "Last name should have atleast 3 characters.")
    .max(50, "Last name should have atleast 3 characters."),

  email: z.string().email("E-mail must be a valid mail."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(hasLowercase, "Must contain at least one lowercase letter")
    .regex(hasUppercase, "Must contain at least one uppercase letter")
    .regex(hasNumber, "Must contain at least one number")
    .regex(hasSpecialChar, "Must contain at least one special character")
    .regex(hasNoSpaces, "Password cannot contain spaces"),
});

export const signInSchema = z.object({
  email: z.string().email("E-mail must be a valid mail."),
  password: z.string(),
});

export const registerUserWithConfirmSchema = userSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords donot match",
    path: ["confirmPassword"],
  });

export const workspaceNameSchema = z.object({
  name: z
    .string()
    .min(3, "Workspace name must be at least 3 characters")
    .max(50, "Workspace name must not exceed 50 characters."),
});

export const teamNameSchema = z.object({
  teamName: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name must not exceed 50 characters."),
});

export const projectNameSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name must not exceed 50 characters."),
});

export const emailSchema = z.object({
  email: z.string().email("E-mail must be a valid mail."),
});

export type EmailType = z.infer<typeof emailSchema>;

export type RegisterUserWithConfirmSchema = z.infer<
  typeof registerUserWithConfirmSchema
>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type WorkspaceNameType = z.infer<typeof workspaceNameSchema>;
export type TeamNameType = z.infer<typeof teamNameSchema>;
export type ProjectNameType = z.infer<typeof projectNameSchema>;
