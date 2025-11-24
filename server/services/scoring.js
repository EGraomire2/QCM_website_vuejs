/**
 * Scoring Service
 * 
 * This service implements the scoring algorithm for QCM questions.
 * It handles both single-choice and multiple-choice questions with
 * negative points and floor at zero logic.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

/**
 * Calculate the score for a single question based on user answers
 * 
 * @param {Object} question - The question object
 * @param {string} question.type - 'unique' or 'multiple'
 * @param {number} question.points - Points awarded for correct answer
 * @param {number} question.negativePoints - Points deducted for incorrect answer
 * @param {Array} question.propositions - Array of proposition objects
 * @param {number} question.propositions[].id - Proposition ID
 * @param {boolean} question.propositions[].validity - Whether proposition is correct
 * @param {Array<number>} userAnswers - Array of proposition IDs selected by user
 * @returns {number} Score for the question (floored at 0)
 */
const calculateQuestionScore = (question, userAnswers) => {
  const { type, points, negativePoints, propositions } = question;
  
  // Validate inputs
  if (!type || !propositions || !Array.isArray(propositions)) {
    throw new Error('Invalid question structure');
  }
  
  if (!Array.isArray(userAnswers)) {
    throw new Error('User answers must be an array');
  }
  
  if (type === 'unique') {
    // Single choice: full points if correct, negative points if wrong
    // Requirements: 6.1, 6.2
    const correctProp = propositions.find(p => p.validity === true || p.validity === 1);
    
    if (!correctProp) {
      throw new Error('No correct answer found for single-choice question');
    }
    
    // If no answer selected, return 0
    if (userAnswers.length === 0) {
      return 0;
    }
    
    const userSelected = userAnswers[0];
    
    if (userSelected === correctProp.id) {
      // Correct answer: award full points
      return points;
    } else {
      // Incorrect answer: deduct negative points
      const score = -negativePoints;
      // Floor at 0 (Requirement 6.4)
      return Math.max(0, score);
    }
  } else if (type === 'multiple') {
    // Multiple choice: deduct for each wrong selection or missed correct answer
    // Requirement: 6.3
    let score = points;
    
    for (const prop of propositions) {
      const isSelected = userAnswers.includes(prop.id);
      const isCorrect = prop.validity === true || prop.validity === 1;
      
      if (isSelected && !isCorrect) {
        // Selected wrong answer: deduct negative points
        score -= negativePoints;
      } else if (!isSelected && isCorrect) {
        // Missed correct answer: deduct negative points
        score -= negativePoints;
      }
      // If selected and correct, or not selected and incorrect: no change
    }
    
    // Floor at 0 (Requirement 6.4)
    return Math.max(0, score);
  } else {
    throw new Error(`Unknown question type: ${type}`);
  }
};

/**
 * Calculate the final grade for a QCM attempt
 * 
 * @param {Array} questions - Array of question objects with scores
 * @param {Object} userAnswersByQuestion - Map of questionId to array of proposition IDs
 * @returns {Object} Object containing totalPoints, earnedPoints, and grade
 */
const calculateFinalGrade = (questions, userAnswersByQuestion) => {
  // Validate inputs
  if (!Array.isArray(questions)) {
    throw new Error('Questions must be an array');
  }
  
  if (!userAnswersByQuestion || typeof userAnswersByQuestion !== 'object') {
    throw new Error('User answers must be an object');
  }
  
  let totalPoints = 0;
  let earnedPoints = 0;
  const questionScores = {};
  
  for (const question of questions) {
    totalPoints += question.points;
    const userAnswers = userAnswersByQuestion[question.id] || [];
    const questionScore = calculateQuestionScore(question, userAnswers);
    earnedPoints += questionScore;
    questionScores[question.id] = questionScore;
  }
  
  // Calculate grade on scale of 20 (Requirement 6.5)
  let grade = 0;
  if (totalPoints > 0) {
    grade = (earnedPoints / totalPoints) * 20;
  }
  
  // Floor at 0 (Requirement 6.6)
  grade = Math.max(0, grade);
  
  return {
    totalPoints,
    earnedPoints,
    grade: Math.round(grade * 100) / 100, // Round to 2 decimal places
    questionScores
  };
};

export {
  calculateQuestionScore,
  calculateFinalGrade
};
