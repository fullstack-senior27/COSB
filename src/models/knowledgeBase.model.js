const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const knowledgeBaseSchema = mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['for-clients', 'for-beautician'],
      validate: {
        validator: function (value) {
          return value === 'for-clients' || value === 'for-beautician';
        },
        message: 'Key must be either "for-clients" or "for-beautician"',
      },
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
