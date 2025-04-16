// mockApi.js - Mock API service for development

// Mock User Data
const mockUsers = [
  {
    _id: '1',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    token: 'mock-jwt-token'
  }
];

// Mock Health Records
const mockHealthRecords = [
  {
    _id: '1',
    userId: '1',
    recordType: 'Allergies',
    recordDate: new Date().toISOString(),
    facility: 'Healthy Family Centre',
    allergies: [
      { name: 'Peanuts', severity: 'Severe' },
      { name: 'Penicillin', severity: 'Moderate' }
    ],
    notes: 'Annual allergy check-up'
  },
  {
    _id: '2',
    userId: '1',
    recordType: 'Health Issues',
    recordDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    facility: 'Healthy Family Centre',
    conditions: [
      { name: 'Asthma', status: 'Controlled', details: 'Mild symptoms during spring' }
    ],
    notes: 'Regular check-up'
  },
  {
    _id: '3',
    userId: '1',
    recordType: 'Vitals',
    recordDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    facility: 'Health Metrics Lab',
    vitals: {
      temperature: { value: 37.2, unit: 'C' },
      bloodPressure: { systolic: 120, diastolic: 80, unit: 'mmHg' },
      heartRate: { value: 72, unit: 'bpm' },
      respiratoryRate: { value: 16, unit: 'breaths/min' }
    },
    notes: 'Routine vital check'
  },
  {
    _id: '4',
    userId: '1',
    recordType: 'Diagnoses',
    recordDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    facility: 'Medical Center',
    conditions: [
      { name: 'Seasonal Allergies', status: 'Active', details: 'Prescribed antihistamines' }
    ],
    notes: 'Spring allergies'
  }
];

// Auth APIs
export const mockAuthApi = {
  login: (username, password) => {
    // Simple mock authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'testuser' && password === 'password') {
          const user = { ...mockUsers[0] };
          resolve({ user, token: user.token });
        } else {
          reject({ message: 'Invalid username or password' });
        }
      }, 800); // Simulate network delay
    });
  },
  
  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if username already exists
        if (userData.username === 'testuser') {
          reject({ message: 'Username already exists' });
        } else {
          const newUser = {
            _id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            token: 'new-mock-jwt-token'
          };
          resolve({ user: newUser, token: newUser.token });
        }
      }, 800);
    });
  }
};

// Health Record APIs
export const mockHealthRecordApi = {
  getRecords: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockHealthRecords]);
      }, 800);
    });
  },
  
  addRecord: (recordData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          _id: Date.now().toString(),
          userId: '1',
          recordDate: new Date().toISOString(),
          ...recordData
        };
        mockHealthRecords.push(newRecord);
        resolve(newRecord);
      }, 800);
    });
  },
  
  updateRecord: (id, recordData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockHealthRecords.findIndex(record => record._id === id);
        if (index !== -1) {
          mockHealthRecords[index] = {
            ...mockHealthRecords[index],
            ...recordData,
            recordDate: recordData.recordDate || mockHealthRecords[index].recordDate
          };
          resolve(mockHealthRecords[index]);
        } else {
          reject({ message: 'Record not found' });
        }
      }, 800);
    });
  },
  
  deleteRecord: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockHealthRecords.findIndex(record => record._id === id);
        if (index !== -1) {
          mockHealthRecords.splice(index, 1);
          resolve({ message: 'Record deleted successfully' });
        } else {
          reject({ message: 'Record not found' });
        }
      }, 800);
    });
  }
};

// User APIs
export const mockUserApi = {
  updateProfile: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = {
          ...mockUsers[0],
          ...userData
        };
        mockUsers[0] = updatedUser;
        resolve({ user: updatedUser });
      }, 800);
    });
  },
  
  updatePassword: (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === 'password') {
          resolve({ message: 'Password updated successfully' });
        } else {
          reject({ message: 'Current password is incorrect' });
        }
      }, 800);
    });
  }
};
