import { Router } from "express";
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from "../controllers/leadController";
import { protect, adminOnly } from "../middleware/auth";
import { leadValidation } from "../middleware/validate";

const leadRouter = Router();

// All routes are protected
leadRouter.use(protect);

leadRouter.get("/export", exportLeads);
leadRouter.get("/", getLeads);
leadRouter.get("/:id", getLead);
leadRouter.post("/", leadValidation, createLead);
leadRouter.put("/:id", leadValidation, updateLead);
leadRouter.delete("/:id", adminOnly, deleteLead);

export default leadRouter;
