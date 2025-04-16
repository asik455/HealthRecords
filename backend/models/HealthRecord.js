const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    enum: ['Allergies', 'Health Issues', 'Diagnoses', 'Vitals', 'Medications'],
    required: true
  },
  recordDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  facility: {
    type: String,
    default: 'Healthy Family Centre'
  },
  // For allergies
  allergies: [{
    name: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe']
    }
  }],
  // For health issues and diagnoses
  conditions: [{
    name: String,
    status: String,
    details: String
  }],
  // For vitals tracking
  vitals: {
    temperature: {
      value: Number,
      unit: {
        type: String,
        default: '°C'
      }
    },
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      unit: {
        type: String,
        default: 'mmHg'
      }
    },
    heartRate: {
      value: Number,
      unit: {
        type: String,
        default: 'bpm'
      }
    },
    respiratoryRate: {
      value: Number,
      unit: {
        type: String,
        default: 'breaths/min'
      }
    },
    oxygenSaturation: {
      value: Number,
      unit: {
        type: String,
        default: '%'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        default: 'kg'
      }
    },
    height: {
      value: Number,
      unit: {
        type: String,
        default: 'cm'
      }
    }
  },
  // For medications
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date
  }],
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
