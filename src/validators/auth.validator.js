import { z } from "zod";

const registerSchema = z.object({
  fullName: z
    .string({ required_error: "Fullname is required" })
    .trim()
    .min(3, { message: "Fullname must be at least of 3 character" })
    .max(747, { message: "fullName can't be more than 747 character" }),
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(4, { message: "Username must be at least of 4 character" })
    .max(20, { message: "Username can't be more than 20 character" })
    .regex(/^[a-z0-9]+$/, {
      message:
        "Username must not contain uppercase letters or special characters",
    }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email" })
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least of 8 character" })
    .regex(/[a-z]/, {
      message: "Password must be have at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must be have at least one uppercase letter",
    })
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
      message: "Password must be have at least one special character",
    })
    .regex(/[0-9]/, { message: "Password must be have at least one number" }),
});

const loginSchema = z.object({
  usernameOREmail: z
    .string({ required_error: "Username or Email is required" })
    .trim()
    .refine(
      (value) => {
        const usernameRegex =
          /^(?!.*[\.\-\_]{2})(?=[a-z0-9])[a-z0-9._-]{4,20}(?<![\.\-\_])$/;
        const emailRegex =
          /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/;

        return emailRegex.test(value) || usernameRegex.test(value);
      },
      { message: "Must be a valid email or username" }
    ),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least of 8 character" })
    .regex(/[a-z]/, {
      message: "Password must be have at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must be have at least one uppercase letter",
    })
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
      message: "Password must be have at least one special character",
    })
    .regex(/[0-9]/, { message: "Password must be have at least one number" }),
});

export { registerSchema, loginSchema };
