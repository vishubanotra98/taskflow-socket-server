import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { passwordHash } from "../helpers/passwordHashing.js";
import { prisma } from "../lib/prisma.js";
import { resend } from "../lib/emailService.js";
import { userSchema } from "../lib/schema.js";
import Email from "../emails/templates/VerificationEmail.js";

export const signUpController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { formData, token, isAdmin } = req.body;
    const validatedData = userSchema.parse(formData);

    const hashedPassword = await passwordHash(validatedData?.password);

    const verificationToken = Math.floor(
      100000 + Math.random() * 999999,
    ).toString();
    const tokenExpiryDate = new Date(Date.now() + 15 * 60 * 1000); //15 min

    if (token) {
      const ifUserExists = await prisma.invitation.findUnique({
        where: { email: validatedData?.email, token: token },
      });

      if (!ifUserExists) {
        return res?.status(400).json({
          success: false,
          status: 400,
          errMsg: "Invalid User.",
        });
      }

      const workspaceId = ifUserExists?.workspaceId;

      const user = await prisma.user.create({
        data: {
          firstName: validatedData?.firstName,
          lastName: validatedData?.lastName,
          email: ifUserExists.email,
          password: hashedPassword,
          emailVerified: true,
          verificationToken: null,
          tokenExpiry: null,
          workspaces: {
            create: {
              workspaceId: ifUserExists?.workspaceId,
              role: !isAdmin ? "MEMBER" : "ADMIN",
            },
          },
        },
      });

      await prisma.invitation.delete({
        where: { id: ifUserExists?.id },
      });

      return res.status(201).json({
        success: true,
        status: 201,
        data: { email: user.email, invited: true, workspaceId },
      });
    } else {
      const existingUser = await prisma.user.findFirst({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        if (existingUser.emailVerified) {
          return res.status(409).json({
            success: false,
            status: 409,
            errMsg: "User with this email already exists.",
          });
        }

        await prisma.user.update({
          where: { email: validatedData.email },
          data: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            password: hashedPassword,
            tokenExpiry: tokenExpiryDate,
            verificationToken: verificationToken,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: hashedPassword,
            tokenExpiry: tokenExpiryDate,
            emailVerified: false,
            verificationToken: verificationToken,
          },
        });
      }

      await resend.emails.send({
        from: "TaskFlow <verification@taskflow.vishubanotra.xyz>",
        to: [validatedData.email],
        subject: "TaskFlow Verification OTP",
        react: Email({
          firstName: validatedData.firstName,
          email: validatedData.email,
          verificationToken: verificationToken,
        }),
      });

      return res.status(200).json({
        success: true,
        status: 200,
        message: "OTP sent to the registered email.",
        data: { email: validatedData.email },
      });
    }
  },
);
