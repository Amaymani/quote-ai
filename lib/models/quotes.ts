import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuote extends Document {
  client_name: string;
  project_title: string;
  project_type: string;
  project_description: string;
  estimated_area: number;
  ai_response: any; 
  createdAt: Date;     
  updatedAt: Date;   
}

const QuoteSchema: Schema<IQuote> = new Schema(
  {
    client_name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    project_title: {
      type: String,
      required: [true, 'Project Title is required.'],
    },
    project_type: {
      type: String,
      required: [true, 'Project type is required.'],
    },
    project_description: {
      type: String,
      required: [true, 'Project description is required.'],
    },
    estimated_area: {
      type: Number,
      required: [true, 'Estimated area is required.'],
      min: [0, 'Estimated area must be a positive number.'],
    },
    ai_response: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);

export default Quote;