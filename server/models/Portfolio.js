import mongoose from "mongoose";

const { Schema } = mongoose;
const publicUrl = {
  type: String,
  default: null,
  validate: {
    validator: (value) => value == null || /^https:\/\/[^\s]+$/.test(value),
    message: "Public links must be HTTPS URLs or null.",
  },
};
const nested = { _id: false };
const photoFields = {
  src: {
    type: String,
    required: true,
    validate: {
      validator: (value) =>
        /^(?:\/(?!\/)[^\s\\]+|https:\/\/[^\s\\]+)$/.test(value),
      message: "Photo sources must be root-relative paths or HTTPS URLs.",
    },
  },
  alt: { type: String, required: true },
  position: String,
};

const portfolioSchema = new Schema(
  {
    _id: { type: String, default: "main" },
    profile: new Schema(
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        tagline: String,
        location: String,
        availability: String,
        email: {
          type: String,
          trim: true,
          validate: {
            validator: (value) =>
              value == null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: "Contact email must be a valid email address.",
          },
        },
        portrait: new Schema(photoFields, nested),
        bio: [String],
      },
      nested,
    ),
    aboutPhotos: {
      type: [new Schema({ ...photoFields, caption: String }, nested)],
      default: undefined,
    },
    socials: [
      new Schema(
        { name: { type: String, required: true }, url: publicUrl },
        nested,
      ),
    ],
    experience: [
      new Schema(
        {
          id: { type: String, required: true },
          role: { type: String, required: true },
          company: { type: String, required: true },
          url: publicUrl,
          period: String,
          location: String,
          compact: Boolean,
          description: String,
          skills: [String],
        },
        nested,
      ),
    ],
    education: new Schema(
      {
        degree: String,
        school: String,
        date: String,
        description: String,
        photo: new Schema(photoFields, nested),
      },
      nested,
    ),
    skillGroups: {
      type: [
        new Schema(
          {
            title: { type: String, required: true },
            description: String,
            skills: [String],
          },
          nested,
        ),
      ],
      default: undefined,
    },
    projects: [
      new Schema(
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          eyebrow: String,
          description: String,
          status: String,
          kind: String,
          contribution: String,
          tags: [String],
          url: publicUrl,
          links: {
            type: [
              new Schema(
                {
                  label: { type: String, required: true },
                  url: { ...publicUrl, required: true },
                },
                nested,
              ),
            ],
            default: undefined,
          },
        },
        nested,
      ),
    ],
    interests: [String],
  },
  { versionKey: false, strict: "throw" },
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
