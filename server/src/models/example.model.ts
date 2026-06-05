import { model, Schema } from "mongoose";

export interface ExampleDocument {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exampleSchema = new Schema<ExampleDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const ExampleModel = model<ExampleDocument>("Example", exampleSchema);
