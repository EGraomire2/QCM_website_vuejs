# AnswerQCM View - Manual Testing Guide

## Overview
This document describes how to manually test the AnswerQCM view implementation.

## Prerequisites
1. Server must be running on http://localhost:3000
2. Client must be running (npm run serve)
3. Database must have at least one QCM with questions
4. User must be logged in

## Test Cases

### Test 1: Load QCM with Questions
**Steps:**
1. Navigate to SelectQCM view
2. Select a subject and chapter
3. Click on a QCM to answer it
4. Verify the QCM loads with:
   - QCM name displayed in header
   - Difficulty level shown
   - All questions displayed with their propositions

**Expected Result:**
- QCM details load successfully
- Questions are numbered (Question 1, Question 2, etc.)
- All answer options are visible

### Test 2: Single Choice Question Selection (Property 19)
**Steps:**
1. Find a question with type "unique" (radio buttons)
2. Select an answer
3. Select a different answer
4. Verify only one answer is selected at a time

**Expected Result:**
- Selecting a new answer automatically deselects the previous one
- Only one radio button is checked per question
- Visual feedback shows selected answer (green dot)

### Test 3: Multiple Choice Question Selection (Property 20)
**Steps:**
1. Find a question with type "multiple" (checkboxes)
2. Select multiple answers
3. Verify multiple selections are allowed

**Expected Result:**
- Multiple checkboxes can be checked simultaneously
- All selected answers show visual feedback (green dots)

### Test 4: Submit Answers
**Steps:**
1. Answer at least one question
2. Click "Soumettre mes réponses" button
3. Wait for submission to complete

**Expected Result:**
- Success notification appears with grade
- User is redirected to correction page
- Correction page shows the attempt details

### Test 5: Error Handling - Invalid QCM ID
**Steps:**
1. Navigate to /qcm/99999/answer (non-existent ID)
2. Verify error handling

**Expected Result:**
- Error message displayed
- "Retour à la sélection" button appears
- No crash or console errors

### Test 6: Loading State
**Steps:**
1. Navigate to a QCM answer page
2. Observe the loading state before data loads

**Expected Result:**
- "Chargement du QCM..." message appears
- No flickering or layout shifts

### Test 7: Styling Verification
**Steps:**
1. Verify all CSS classes from answer.css are applied
2. Check visual appearance matches design

**Expected Result:**
- Questions are in styled boxes (div.answers)
- Submit button has correct styling (id="submit-qcm")
- Answer dots change color when selected
- Hover effects work on answer options

## Requirements Validated

- **Requirement 5.2**: QCM with questions loaded from API ✓
- **Requirement 5.3**: Single-choice answer deselection (Property 19) ✓
- **Requirement 5.4**: Multiple-choice multiple selections (Property 20) ✓
- **Requirement 5.5**: Answer submission creates attempt ✓
- **Requirement 14.2**: Existing CSS styles applied ✓

## Notes
- The view properly handles both single and multiple choice questions
- Error states are handled gracefully
- Loading states provide good UX
- Navigation guards ensure authentication
