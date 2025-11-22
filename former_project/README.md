# QCM Website

## Description
This project is a multi-page web application that allows users to create and answer multiple-choice quizzes (QCM). The application consists of three main pages: a homepage, a QCM creation page, and a QCM answering page.

## Features
- **Homepage**: Provides navigation links to the QCM creation and answering pages.
- **Create QCM Page**: Users can create new QCMs by filling out a form with questions and answers.
- **Answer QCM Page**: Users can view existing QCMs and submit their answers.

## Project Structure
```
qcm-website
├── src
│   ├── index.html          # Homepage
│   ├── create-qcm.html     # QCM creation page
│   ├── answer-qcm.html     # QCM answering page
│   ├── css
│   │   └── styles.css      # Styles for the website
│   ├── js
│   │   ├── main.js         # General functionality
│   │   ├── create-qcm.js   # Logic for creating QCMs
│   │   └── answer-qcm.js    # Logic for answering QCMs
│   └── assets
│       └── README.md       # Documentation for assets
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies using npm:
   ```
   npm install
   ```
4. Open `src/index.html` in your web browser to view the application.

## Usage
- To create a new QCM, navigate to the "Create QCM" page and fill out the form.
- To answer an existing QCM, go to the "Answer QCM" page and select a quiz to respond to.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.