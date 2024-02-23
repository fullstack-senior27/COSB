const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const knowledgeBaseSchema = mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['clients', 'beautician'],
    },
    title: {
      type: String,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);

module.exports = KnowledgeBase;
