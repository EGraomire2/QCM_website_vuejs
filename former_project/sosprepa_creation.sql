-- create schema projet_QCM;
use sos_prepa_bdd;

drop table if exists accountt, attempt, question, has_answered, possible_answer, answer_question, qcm, Subjectt, Chapter;

-- Table Compte
CREATE TABLE Accountt(
    ID_user INT NOT NULL,
    Administrator BOOLEAN NOT NULL,
    Teacher BOOLEAN NOT NULL,
    Nickname VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL, 
    Score_account INT DEFAULT 0,
    Token VARCHAR(255) UNIQUE
);

-- Table QCM
CREATE TABLE QCM (
    ID_QCM INT NOT NULL,
    Name_QCM VARCHAR(500) NOT NULL,
    Difficulty INT DEFAULT 0,
    ID_user INT NOT NULL,
    explanation VARCHAR(1000),
    ID_chapter INT NOT NULL    
);

CREATE TABLE Subjectt(
    ID_Subject INT NOT NULL,
    Subject_name VARCHAR(500) NOT NULL
);

CREATE TABLE Chapter(
    ID_chapter INT NOT NULL,
    Chapter_name VARCHAR(500) NOT NULL,
	ID_Subject INT NOT NULL
);

-- Table Question
CREATE TABLE Question (
    ID_Question INT NOT NULL,
    Question_heading VARCHAR(500) NOT NULL,
    Number_of_points INT NOT NULL,
    Type_of_question VARCHAR(500) NOT NULL,
    Negative_points FLOAT DEFAULT 0,
    ID_QCM INT NOT NULL
);

-- Table Reponse_possible
CREATE TABLE Possible_answer(
    ID_Proposition INT NOT NULL,
    Proposition VARCHAR(500) NOT NULL,
    Validity BOOLEAN NOT NULL,
    ID_Question INT NOT NULL
);

-- Table Tentative
CREATE TABLE Attempt(
    ID_Attempt INT NOT NULL,
    Date_attempt DATE NOT NULL,
    Grade FLOAT NOT NULL,
    ID_QCM INT NOT NULL,
    ID_user INT NOT NULL
);
 
-- Table Reponse_question
CREATE TABLE Answer_question(
    ID_Answer INT NOT NULL unique,
    Points_earned FLOAT NOT NULL,
    ID_Question INT NOT NULL,
    ID_Attempt INT NOT NULL
);

-- Table a_repondu (table d'association)
CREATE TABLE Has_answered(
    ID_Proposition INT NOT NULL,
    ID_Answer INT NOT NULL
);