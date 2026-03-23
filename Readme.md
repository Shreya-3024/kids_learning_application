# Kids Learning Quiz App

![App Screenshot](https://via.placeholder.com/800x400.png?text=Kids+Learning+Quiz+App)

A fun and interactive quiz application designed for kids to learn various subjects with timed questions.

## Features

- **Multiple Subjects**: English, Hindi, Math, and General Knowledge
- **Timed Questions**: 30-second timer per question with visual countdown
- **Interactive UI**: Colorful and engaging interface
- **Progress Tracking**: Score counter and progress bar
- **Instant Feedback**: Correct/incorrect answer highlighting
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Implementations**:
  - Web (HTML/CSS/JavaScript)
  - Desktop (Java Swing)
  - Data Structure (Java DSA)

## Implementations

### 1. Web Version (HTML/CSS/JavaScript)

#### Files:
- `index.html` - Main HTML structure
- `styles.css` - Styling for the application
- `script.js` - Quiz logic and functionality

#### How to Run:
1. Open `index.html` in any modern web browser
2. No additional dependencies required

### 2. Java Swing Version

#### Files:
- `KidsLearningQuiz.java` - Main application class
- `QuizSubject.java` - Subject data class
- `Question.java` - Question data class

#### How to Run:
1. Ensure you have Java JDK installed
2. Compile: `javac KidsLearningQuiz.java`
3. Run: `java KidsLearningQuiz`

### 3. Java DSA Version

#### Files:
- `QuizDataStructure.java` - Demonstrates the data structures used
- `Subject.java` - Subject data class
- `Question.java` - Question data class with timer

#### How to Run:
1. Ensure you have Java JDK installed
2. Compile: `javac QuizDataStructure.java`
3. Run: `java QuizDataStructure`

## Timer Implementation Details

All versions include a timed quiz feature:

1. **Web Version**:
   - 30-second countdown per question
   - Visual timer that turns red when time is low
   - Automatic question advance when time expires

2. **Java Swing**:
   - Configurable time limit per question
   - Visual countdown display
   - Time up handling with automatic question transition

3. **Java DSA**:
   - Time limit stored with each question
   - Console-based timer simulation
   - Demonstrates how timer logic can be implemented in data structures

## Project Structure
