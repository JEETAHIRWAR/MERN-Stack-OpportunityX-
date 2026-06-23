import UserPreference from "../models/UserPreference.js";

const writableFields = [
  "theme",
  "emailNotifications",
  "pushNotifications",
  "jobAlerts",
  "messageNotifications",
  "marketingEmails",
];

export const getPreferences = async (req, res) => {
  const preferences = await UserPreference.findOne({ user: req.user._id });
  return res.status(200).json({
    preferences: preferences || { user: req.user._id },
  });
};

export const updatePreferences = async (req, res) => {
  const update = Object.fromEntries(
    writableFields
      .filter((field) => req.body[field] !== undefined)
      .map((field) => [field, req.body[field]])
  );
  const preferences = await UserPreference.findOneAndUpdate(
    { user: req.user._id },
    { $set: update, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true, runValidators: true }
  );
  return res.status(200).json({ preferences });
};
