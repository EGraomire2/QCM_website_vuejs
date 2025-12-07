USE sos_prepa_bdd;

ALTER TABLE users 
    ADD CONSTRAINT uq_user_id UNIQUE (ID_user),
    ADD CONSTRAINT uq_user_email UNIQUE (Email),
    ADD CONSTRAINT chk_user_score CHECK (Score_account >= 0),
    ADD CONSTRAINT pk_user PRIMARY KEY (ID_user);
ALTER TABLE users 
    MODIFY COLUMN ID_user INT NOT NULL AUTO_INCREMENT;

ALTER TABLE QCM 
    ADD CONSTRAINT uq_qcm_id UNIQUE (ID_QCM),
    ADD CONSTRAINT chk_qcm_difficulty CHECK (Difficulty BETWEEN 0 AND 5),
    ADD CONSTRAINT pk_qcm PRIMARY KEY (ID_QCM),
    ADD CONSTRAINT fk_qcm_user FOREIGN KEY (ID_user) REFERENCES users(ID_user) ON DELETE CASCADE,
    ADD CONSTRAINT fk_qcm_chapter FOREIGN KEY (ID_Chapter) REFERENCES Chapter(ID_Chapter) ON DELETE CASCADE;
ALTER TABLE QCM
    MODIFY COLUMN ID_QCM INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Chapter
    ADD CONSTRAINT uq_chapter_id UNIQUE (ID_Chapter),
    ADD CONSTRAINT pk_chapter PRIMARY KEY (ID_Chapter),
    ADD CONSTRAINT fk_chapter_subject FOREIGN KEY(ID_Subject) REFERENCES Subjectt(ID_Subject) ON DELETE CASCADE;
ALTER TABLE Chapter
    MODIFY COLUMN ID_Chapter INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Subjectt
    ADD CONSTRAINT uq_subject_id UNIQUE (ID_Subject),
    ADD CONSTRAINT pk_subject PRIMARY KEY (ID_Subject);
ALTER TABLE Subjectt
    MODIFY COLUMN ID_Subject INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Question 
    ADD CONSTRAINT uq_question_id UNIQUE (ID_Question),
    ADD CONSTRAINT chk_question_points CHECK (Number_of_points BETWEEN 0 and 5),
    ADD CONSTRAINT chk_question_negpoints CHECK (Negative_points BETWEEN 0 and 5),
    ADD CONSTRAINT pk_question PRIMARY KEY (ID_Question),
    ADD CONSTRAINT fk_question_qcm FOREIGN KEY (ID_QCM) REFERENCES QCM(ID_QCM) ON DELETE CASCADE;
ALTER TABLE Question 
    MODIFY COLUMN ID_Question INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Possible_answer 
    ADD CONSTRAINT uq_possible_answer_id UNIQUE (ID_Proposition),
    ADD CONSTRAINT pk_possible_answer PRIMARY KEY (ID_Proposition),
    ADD CONSTRAINT fk_possible_answer_question FOREIGN KEY (ID_Question) REFERENCES Question(ID_Question) ON DELETE CASCADE;
ALTER TABLE Possible_answer 
    MODIFY COLUMN ID_Proposition INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Attempt
    ADD CONSTRAINT uq_attempt_id UNIQUE (ID_Attempt),
    ADD CONSTRAINT chk_attempt_grade CHECK (Grade BETWEEN 0 AND 20),
    ADD CONSTRAINT pk_attempt PRIMARY KEY (ID_Attempt),
    ADD CONSTRAINT fk_attempt_qcm FOREIGN KEY (ID_QCM) REFERENCES QCM(ID_QCM) ON DELETE CASCADE,
    ADD CONSTRAINT fk_attempt_user FOREIGN KEY (ID_user) REFERENCES users(ID_user) ON DELETE CASCADE;
ALTER TABLE Attempt 
    MODIFY COLUMN ID_Attempt INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Answer_question
    ADD CONSTRAINT uq_answer_question_id UNIQUE (ID_Answer),
    ADD CONSTRAINT pk_answer_question PRIMARY KEY (ID_Answer),
    ADD CONSTRAINT fk_answer_question FOREIGN KEY (ID_Question) REFERENCES Question(ID_Question) ON DELETE CASCADE,
    ADD CONSTRAINT fk_answer_attempt FOREIGN KEY (ID_Attempt) REFERENCES Attempt(ID_Attempt) ON DELETE CASCADE;
ALTER TABLE Answer_question 
    MODIFY COLUMN ID_Answer INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Has_answered
    ADD CONSTRAINT pk_has_answered PRIMARY KEY (ID_Proposition, ID_Answer),
    ADD CONSTRAINT fk_has_answered_proposition FOREIGN KEY (ID_Proposition) REFERENCES Possible_answer(ID_Proposition) ON DELETE CASCADE,
    ADD CONSTRAINT fk_has_answered_answer FOREIGN KEY (ID_Answer) REFERENCES Answer_question(ID_Answer) ON DELETE CASCADE;