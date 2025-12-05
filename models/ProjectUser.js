/**
 * ProjectUser Model
 *
 * Tracks user-specific preferences and metadata for each project:
 * - isPinned: user marked project as favorite/pinned
 * - isArchived: user archived this project
 * - isFavorite: user added to favorites
 * - isContributing: user is actively contributing (not just viewing)
 * - recentlyViewed: user recently viewed this project
 * - viewedAt: last time user viewed this project
 *
 * This decouples user preferences from project data.
 */

const mongoose = require('mongoose');

const ProjectUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isContributing: {
      type: Boolean,
      default: false,
    },
    recentlyViewed: {
      type: Boolean,
      default: false,
    },
    viewedAt: Date,
  },
  { timestamps: true }
);

// Compound unique index to ensure one document per user-project pair
ProjectUserSchema.index({ user: 1, project: 1 }, { unique: true });

module.exports =
  mongoose.models.ProjectUser ||
  mongoose.model('ProjectUser', ProjectUserSchema);
