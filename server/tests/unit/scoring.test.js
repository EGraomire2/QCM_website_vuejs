/**
 * Unit tests for the Scoring Service
 * 
 * These tests verify the core scoring logic for single-choice and
 * multiple-choice questions, including negative points and floor at zero.
 */

import { describe, it, expect } from 'vitest';
import { calculateQuestionScore, calculateFinalGrade } from '../../services/scoring.js';

describe('Scoring Service - Single Choice Questions', () => {
  it('should award full points for correct single-choice answer', () => {
    // Requirement 6.1
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: false },
        { id: 3, validity: false }
      ]
    };
    
    const userAnswers = [1];
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(5);
  });
  
  it('should deduct negative points for incorrect single-choice answer', () => {
    // Requirement 6.2
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: false }
      ]
    };
    
    const userAnswers = [2];
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(0); // -2 floored at 0
  });
  
  it('should return 0 when no answer is selected for single-choice', () => {
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: false }
      ]
    };
    
    const userAnswers = [];
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(0);
  });
});

describe('Scoring Service - Multiple Choice Questions', () => {
  it('should award full points when all correct answers selected and no incorrect ones', () => {
    // Requirement 6.3
    const question = {
      type: 'multiple',
      points: 10,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: true },
        { id: 3, validity: false },
        { id: 4, validity: false }
      ]
    };
    
    const userAnswers = [1, 2];
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(10);
  });
  
  it('should deduct points for each incorrect selection', () => {
    // Requirement 6.3
    const question = {
      type: 'multiple',
      points: 10,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: true },
        { id: 3, validity: false },
        { id: 4, validity: false }
      ]
    };
    
    const userAnswers = [1, 2, 3]; // Selected one incorrect
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(8); // 10 - 2 = 8
  });
  
  it('should deduct points for each missed correct answer', () => {
    // Requirement 6.3
    const question = {
      type: 'multiple',
      points: 10,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: true },
        { id: 3, validity: false }
      ]
    };
    
    const userAnswers = [1]; // Missed one correct answer (id: 2)
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(8); // 10 - 2 = 8
  });
  
  it('should floor question score at zero', () => {
    // Requirement 6.4
    const question = {
      type: 'multiple',
      points: 10,
      negativePoints: 5,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: true },
        { id: 3, validity: false },
        { id: 4, validity: false }
      ]
    };
    
    const userAnswers = [3, 4]; // Selected 2 incorrect, missed 2 correct = -20
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(0); // Floored at 0
  });
});

describe('Scoring Service - Final Grade Calculation', () => {
  it('should calculate final grade on scale of 20', () => {
    // Requirement 6.5
    const questions = [
      {
        id: 1,
        type: 'unique',
        points: 5,
        negativePoints: 2,
        propositions: [
          { id: 1, validity: true },
          { id: 2, validity: false }
        ]
      },
      {
        id: 2,
        type: 'unique',
        points: 5,
        negativePoints: 2,
        propositions: [
          { id: 3, validity: true },
          { id: 4, validity: false }
        ]
      }
    ];
    
    const userAnswers = {
      1: [1], // Correct
      2: [3]  // Correct
    };
    
    const result = calculateFinalGrade(questions, userAnswers);
    
    expect(result.totalPoints).toBe(10);
    expect(result.earnedPoints).toBe(10);
    expect(result.grade).toBe(20); // Perfect score
  });
  
  it('should calculate partial grade correctly', () => {
    const questions = [
      {
        id: 1,
        type: 'unique',
        points: 5,
        negativePoints: 2,
        propositions: [
          { id: 1, validity: true },
          { id: 2, validity: false }
        ]
      },
      {
        id: 2,
        type: 'unique',
        points: 5,
        negativePoints: 2,
        propositions: [
          { id: 3, validity: true },
          { id: 4, validity: false }
        ]
      }
    ];
    
    const userAnswers = {
      1: [1], // Correct (5 points)
      2: [4]  // Incorrect (0 points after floor)
    };
    
    const result = calculateFinalGrade(questions, userAnswers);
    
    expect(result.totalPoints).toBe(10);
    expect(result.earnedPoints).toBe(5);
    expect(result.grade).toBe(10); // 5/10 * 20 = 10
  });
  
  it('should floor final grade at zero', () => {
    // Requirement 6.6
    const questions = [
      {
        id: 1,
        type: 'unique',
        points: 5,
        negativePoints: 10,
        propositions: [
          { id: 1, validity: true },
          { id: 2, validity: false }
        ]
      }
    ];
    
    const userAnswers = {
      1: [2] // Incorrect, but floored at 0
    };
    
    const result = calculateFinalGrade(questions, userAnswers);
    
    expect(result.grade).toBeGreaterThanOrEqual(0);
  });
  
  it('should return question scores for each question', () => {
    const questions = [
      {
        id: 1,
        type: 'unique',
        points: 5,
        negativePoints: 2,
        propositions: [
          { id: 1, validity: true },
          { id: 2, validity: false }
        ]
      },
      {
        id: 2,
        type: 'unique',
        points: 3,
        negativePoints: 1,
        propositions: [
          { id: 3, validity: true },
          { id: 4, validity: false }
        ]
      }
    ];
    
    const userAnswers = {
      1: [1], // Correct
      2: [4]  // Incorrect
    };
    
    const result = calculateFinalGrade(questions, userAnswers);
    
    expect(result.questionScores).toBeDefined();
    expect(result.questionScores[1]).toBe(5);
    expect(result.questionScores[2]).toBe(0);
  });
});

describe('Scoring Service - Edge Cases', () => {
  it('should handle validity as number (1/0) instead of boolean', () => {
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: 1 }, // Using 1 instead of true
        { id: 2, validity: 0 }  // Using 0 instead of false
      ]
    };
    
    const userAnswers = [1];
    const score = calculateQuestionScore(question, userAnswers);
    
    expect(score).toBe(5);
  });
  
  it('should throw error for invalid question structure', () => {
    const question = {
      type: 'unique',
      points: 5
      // Missing propositions
    };
    
    expect(() => {
      calculateQuestionScore(question, [1]);
    }).toThrow('Invalid question structure');
  });
  
  it('should throw error for non-array user answers', () => {
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: false }
      ]
    };
    
    expect(() => {
      calculateQuestionScore(question, 1); // Not an array
    }).toThrow('User answers must be an array');
  });
});
