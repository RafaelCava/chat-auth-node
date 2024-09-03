import mongoose from "mongoose";
import { Message } from "@/domain/entities";

export const messageSchema = new mongoose.Schema<Message>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
