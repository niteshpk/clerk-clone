import { Types } from "mongoose";

type TransformedValue =
  | string
  | Date
  | TransformedDocument
  | TransformedValue[];
type TransformedDocument = {
  [key: string]: TransformedValue;
};

export const transformDocument = (
  doc: any
): TransformedDocument | TransformedValue[] => {
  if (!doc) return doc;

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(transformDocument);
  }

  // Handle single document
  const transformed: TransformedDocument = {};

  for (const [key, value] of Object.entries(doc)) {
    // Skip internal Mongoose fields
    if (key.startsWith("$") || key === "__v") {
      continue;
    }

    // Handle ObjectId
    if (value instanceof Types.ObjectId) {
      transformed[key] = value.toString();
    }
    // Handle Date
    else if (value instanceof Date) {
      transformed[key] = value.toISOString();
    }
    // Handle nested objects
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      transformed[key] = transformDocument(value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      transformed[key] = value.map(transformDocument);
    }
    // Handle other values
    else {
      transformed[key] = value as string;
    }
  }

  // Rename _id to id
  if (transformed._id) {
    transformed.id = transformed._id;
    delete transformed._id;
  }

  return transformed;
};
