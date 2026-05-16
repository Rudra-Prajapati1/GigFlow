import { Response } from "express";
import Lead from "../models/Lead";
import { AuthRequest } from "../types";

// GET /api/leads
export const getLeads = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = "latest",
      page = "1",
      limit = "10",
    } = req.query;

    const filter: Record<string, any> = {};

    // Filter by status
    if (status) filter.status = status;

    // Filter by source
    if (source) filter.source = source;

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Sales users only see their own leads
    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    const sortOrder = sort === "oldest" ? 1 : -1;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/leads/:id
export const getLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/leads
export const createLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user?.id,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/leads/:id
export const updateLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    // Only admins can delete
    if (req.user?.role !== "admin") {
      res
        .status(403)
        .json({ success: false, message: "Admin access required" });
      return;
    }

    await lead.deleteOne();
    res.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/leads/export
export const exportLeads = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const filter: Record<string, any> = {};
    if (req.user?.role === "sales") filter.createdBy = req.user.id;

    const leads = await Lead.find(filter).populate("createdBy", "name email");

    const csvRows = [
      ["Name", "Email", "Status", "Source", "Created At"],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        new Date(lead.createdAt).toLocaleDateString(),
      ]),
    ];

    const csv = csvRows.map((row) => row.join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
