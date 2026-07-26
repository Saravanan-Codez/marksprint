const fs = require('fs');
const path = require('path');

const datasetsDir = path.join(__dirname, '..', 'public', 'datasets');
const tnState12Dir = path.join(datasetsDir, 'tn_state', '12');

// Ensure base directories exist
fs.mkdirSync(tnState12Dir, { recursive: true });

const subjects = [
  'physics', 'chemistry', 'maths', 'cs', 'biology', 'english', 'tamil'
];

// 1. Move existing files to tn_state/12
console.log('Moving existing datasets to /datasets/tn_state/12/...');
subjects.forEach(subject => {
  const oldPath = path.join(datasetsDir, `${subject}.csv`);
  const newPath = path.join(tnState12Dir, `${subject}.csv`);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${subject}.csv -> tn_state/12/${subject}.csv`);
  }
});

// 2. Generate mock data for all other combinations
const boards = ['tn_state', 'cbse', 'icse'];
const standards = ['10', '11', '12'];

const generateMockCSV = (board, standard, subject) => {
  let csv = 'id,question,option_a,option_b,option_c,option_d,correct_option,explanation,lesson,vol\n';
  for (let i = 1; i <= 5; i++) {
    csv += `mock_${board}_${standard}_${subject}_${i},"Mock Question ${i} for ${board.toUpperCase()} Standard ${standard} ${subject.toUpperCase()}","Option A","Option B","Option C","Option D","A","This is a generated mock explanation for ${board} ${standard} ${subject}.","Mock Lesson 1","1"\n`;
  }
  return csv;
};

console.log('Generating mock datasets for missing combinations...');
boards.forEach(board => {
  standards.forEach(standard => {
    const dirPath = path.join(datasetsDir, board, standard);
    fs.mkdirSync(dirPath, { recursive: true });
    
    subjects.forEach(subject => {
      const filePath = path.join(dirPath, `${subject}.csv`);
      // If the file doesn't exist (like tn_state 12 which we just moved), generate mock
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, generateMockCSV(board, standard, subject));
        console.log(`Generated mock data: ${board}/${standard}/${subject}.csv`);
      }
    });
  });
});

console.log('Dataset architecture initialized successfully.');
