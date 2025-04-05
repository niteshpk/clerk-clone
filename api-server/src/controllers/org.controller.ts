import { Request, Response } from "express";
import Organization from "../models/org.model";

export const createOrg = async (req: Request, res: Response) => {
  const { name } = req.body;
  const org = await Organization.create({
    name,
    ownerId: res.locals.userId,
    members: [res.locals.userId],
  });
  res.status(201).json(org);
};

export const getMyOrgs = async (_: Request, res: Response) => {
  const orgs = await Organization.find({ members: res.locals.userId });
  res.json(orgs);
};
