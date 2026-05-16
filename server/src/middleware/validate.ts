import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "sales"])
    .withMessage("Role must be admin or sales"),
  handleValidation,
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

export const leadValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("status")
    .optional()
    .isIn(["new", "contacted", "qualified", "lost"])
    .withMessage("Invalid status"),
  body("source")
    .notEmpty()
    .isIn(["website", "instagram", "referral"])
    .withMessage("Invalid source"),
  handleValidation,
];
