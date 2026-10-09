import mongoose from 'mongoose';

const { Schema } = mongoose;
const publicUrl = {
  type: String,
  default: null,
  validate: {
    validator: (value) => value == null || /^https:\/\/[^\s]+$/.test(value),
    message: 'Public links must be HTTPS URLs or null.',
  },
};
const nested = { _id: false };

const portfolioSchema = new Schema({
  _id: { type: String, default: 'main' },
  profile: new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    tagline: String,
    location: String,
    availability: String,
    bio: [String],
  }, nested),
  socials: [new Schema({ name: { type: String, required: true }, url: publicUrl }, nested)],
  experience: [new Schema({
    id: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    url: publicUrl,
    period: String,
    description: String,
    skills: [String],
  }, nested)],
  education: new Schema({ degree: String, school: String, date: String }, nested),
  projects: [new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    eyebrow: String,
    description: String,
    status: String,
    kind: String,
    tags: [String],
    url: publicUrl,
  }, nested)],
  interests: [String],
}, { versionKey: false, strict: 'throw' });

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
