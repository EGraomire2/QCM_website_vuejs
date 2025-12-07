USE sos_prepa_bdd;

-- Désactiver les vérifications de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- Nettoyer les tables existantes
TRUNCATE TABLE Has_answered;
TRUNCATE TABLE Answer_question;
TRUNCATE TABLE Attempt;
TRUNCATE TABLE Possible_answer;
TRUNCATE TABLE Question;
TRUNCATE TABLE QCM;
TRUNCATE TABLE Chapter;
TRUNCATE TABLE Subjectt;
TRUNCATE TABLE users;

-- Réactiver les vérifications
SET FOREIGN_KEY_CHECKS = 1;

-- Insertion des utilisateurs (mots de passe hashés avec bcrypt)
-- Mot de passe pour tous: "password123"
INSERT INTO users(Nickname, Email, Password, Teacher, Administrator, Score_account) VALUES 
('Etienne', 'etienne@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', TRUE, TRUE, 100),
('Gabriel', 'gabriel@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', TRUE, TRUE, 1),
('Evan', 'evan@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', TRUE, TRUE, 10),
('Alexandre', 'alexandre@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', TRUE, FALSE, 11),
('Charlotte', 'charlotte@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', FALSE, FALSE, 10),
('Nassim', 'nassim@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', FALSE, FALSE, 7),
('Billy', 'billy@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', FALSE, FALSE, 12),
('Andrew', 'andrew@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', FALSE, FALSE, 7),
('Kevin', 'kevin@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', FALSE, FALSE, 3),
('Juliette', 'juliette@efrei.fr', '$2b$10$rZ5qH8qF9xK3vL2mN4pO5eYwX7tU6sR8qP9oM1nL2kJ3iH4gF5dE6', FALSE, FALSE, 6);

-- Insertion des matières
INSERT INTO Subjectt(Subject_name) VALUES
('Mathématiques'),
('Informatique Théorique'),
('Statistiques'),
('Analyse Complexe');

-- Insertion des chapitres
INSERT INTO Chapter(Chapter_name, ID_Subject) VALUES
('Algèbre linéaire', 1),
('Analyse', 1),
('Automates Finis', 2),
('Statistiques Descriptives', 3),
('Nombres Complexes', 4),
('Probabilités', 3);

-- Insertion des QCM
INSERT INTO QCM(Name_QCM, Difficulty, ID_user, ID_Chapter) VALUES
('QCM d''algèbre - Prépa', 1, 1, 1),
('QCM d''Analyse - Prépa', 2, 1, 2),
('QCM Automates et Expressions Rationnelles - Prépa', 2, 3, 3),
('QCM Statistiques - Prépa', 2, 1, 4),
('QCM Nombres Complexes - Prépa', 2, 1, 5),
('QCM Probabilités - Prépa', 2, 1, 6);

-- Insertion des questions
INSERT INTO Question(Question_heading, Number_of_points, Type_of_question, Negative_points, ID_QCM, Explanation) VALUES
-- Algèbre (QCM 1)
('Soit A une matrice 3×3 inversible. Quelle est la valeur de det(A⁻¹) en fonction de det(A) ?', 3, 'unique', 0, 1, 'Le déterminant de l''inverse est l''inverse du déterminant'),
('Les colonnes d''une matrice carrée sont linéairement indépendantes si et seulement si…', 2, 'multiple', 1, 1, 'Plusieurs conditions équivalentes existent'),
('Trouvez les valeurs propres de la matrice A = [[2, -1], [1, 4]].', 4, 'unique', 0, 1, 'Résoudre det(A - λI) = 0'),
('Si A est une matrice symétrique réelle, que peut-on dire de ses valeurs propres ?', 3, 'unique', 0, 1, 'Théorème spectral pour matrices symétriques'),

-- Analyse (QCM 2)
('Quelle est la dérivée de f(x) = x² + 3x - 5 ?', 2, 'unique', 0, 2, 'Règle de dérivation des polynômes'),
('Soit f une fonction continue sur [a,b]. Que dit le théorème des valeurs intermédiaires ?', 3, 'multiple', 1, 2, 'Propriétés des fonctions continues'),
('Quelle est la série de Taylor de e^x centrée en 0 ?', 4, 'unique', 0, 2, 'Développement en série de l''exponentielle'),
('Quelle est la condition pour qu''une fonction soit uniformément continue sur un intervalle ?', 3, 'unique', 0, 2, 'Définition de la continuité uniforme'),
('Soit f une fonction dérivable sur ℝ avec f''(x) > 0 sur ℝ. Que peut-on en conclure ?', 2, 'unique', 0, 2, 'Lien entre signe de la dérivée et monotonie'),
('Si f est deux fois dérivable, que représente le signe de f''''(x) ?', 3, 'unique', 0, 2, 'Dérivée seconde et convexité'),

-- Automates (QCM 3)
('Qu''est-ce qu''un automate fini déterministe (AFD) ?', 3, 'unique', 0, 3, 'Définition formelle d''un AFD'),
('Quelle est la propriété d''un langage reconnu par un automate fini ?', 3, 'multiple', 1, 3, 'Caractérisation des langages réguliers'),
('Quelle est la relation entre automates finis et expressions rationnelles ?', 4, 'unique', 0, 3, 'Théorème de Kleene'),
('Un automate fini non déterministe (AFN) peut-il être transformé en un AFD équivalent ?', 3, 'unique', 0, 3, 'Algorithme de déterminisation'),
('Comment reconnaît-on un langage régulier ?', 4, 'multiple', 1, 3, 'Plusieurs caractérisations équivalentes'),

-- Statistiques (QCM 4)
('Qu''est-ce que l''espérance mathématique d''une variable aléatoire X ?', 3, 'unique', 0, 4, 'Définition de l''espérance'),
('Quelle condition est nécessaire pour qu''une variable aléatoire ait une variance finie ?', 3, 'unique', 0, 4, 'Condition d''existence de la variance'),
('Quelle est la distribution limite du théorème central limite ?', 4, 'unique', 0, 4, 'Convergence vers la loi normale'),
('Quelle est la définition d''une estimation sans biais ?', 3, 'unique', 0, 4, 'Propriété d''un estimateur sans biais'),
('Si une variable suit une loi normale N(0,1), que vaut P(X > 0) ?', 4, 'unique', 0, 4, 'Symétrie de la loi normale'),

-- Nombres Complexes (QCM 5)
('Quelle est la définition de l''unité imaginaire i ?', 3, 'unique', 0, 5, 'Propriété fondamentale de i'),
('Quel est le module du nombre complexe z = 3 + 4i ?', 3, 'unique', 1, 5, 'Formule du module'),
('Quelle est l''écriture exponentielle du nombre complexe 1 + i ?', 4, 'unique', 0, 5, 'Forme exponentielle d''un complexe'),
('Quelle est la relation entre module et argument d''un nombre complexe z ?', 3, 'unique', 0, 5, 'Forme polaire'),
('Quel est l''ensemble des solutions de l''équation z² + 1 = 0 dans C ?', 3, 'unique', 0, 5, 'Racines de -1'),

-- Probabilités (QCM 6)
('Quelle est la définition d''une variable aléatoire discrète ?', 3, 'unique', 0, 6, 'Définition formelle'),
('La loi de probabilité d''une variable aléatoire discrète doit vérifier :', 3, 'multiple', 1, 6, 'Axiomes des probabilités'),
('Quelle est l''espérance mathématique de X si X suit une loi uniforme sur {1, 2, 3, 4} ?', 4, 'unique', 0, 6, 'Calcul de l''espérance'),
('Si X et Y sont deux variables indépendantes, alors :', 3, 'multiple', 1, 6, 'Propriétés de l''indépendance'),
('Quelle est la variance d''une loi de Bernoulli de paramètre p ?', 4, 'unique', 0, 6, 'Formule de la variance');


-- Insertion des réponses possibles
INSERT INTO Possible_answer(Proposition, Validity, ID_Question) VALUES
-- Algèbre Q1
('1 / det(A)', 1, 1),
('det(A)', 0, 1),
('-det(A)', 0, 1),
('0', 0, 1),

-- Algèbre Q2
('Le déterminant de la matrice est non nul', 1, 2),
('Le rang de la matrice est maximal', 1, 2),
('Toutes ses valeurs propres sont strictement positives', 0, 2),
('Ses colonnes sont toutes orthogonales', 0, 2),

-- Algèbre Q3
('λ₁ = 3, λ₂ = 3', 1, 3),
('λ₁ = 1, λ₂ = 3', 0, 3),
('λ₁ = 5, λ₂ = 2', 0, 3),
('λ₁ = 10, λ₂ = 5', 0, 3),

-- Algèbre Q4
('Elles sont réelles', 1, 4),
('Elles sont toutes strictement positives', 0, 4),
('Elles sont toutes distinctes', 0, 4),
('Elles sont imaginaires', 0, 4),

-- Analyse Q5
('2x + 3', 1, 5),
('x² + 3', 0, 5),
('2x - 3', 0, 5),
('x + 3', 0, 5),

-- Analyse Q6
('Toute valeur intermédiaire est atteinte par f', 1, 6),
('f est strictement monotone sur [a,b]', 0, 6),
('f admet un maximum sur [a,b]', 1, 6),
('f est dérivable sur [a,b]', 0, 6),

-- Analyse Q7
('Somme de (x^n)/n!', 1, 7),
('Somme de (x^n)/(n+1)!', 0, 7),
('Somme de ((x+2)^n)/n!', 0, 7),
('Somme de (x^2)/n!', 0, 7),

-- Analyse Q8
('Elle est bornée sur l''intervalle', 0, 8),
('Elle vérifie la condition de Cauchy', 1, 8),
('Elle est dérivable', 0, 8),
('Elle est convexe', 0, 8),

-- Analyse Q9
('f est strictement croissante', 1, 9),
('f est périodique', 0, 9),
('f est bornée', 0, 9),
('f est décroissante', 0, 9),

-- Analyse Q10
('Elle indique la convexité de f', 1, 10),
('Elle donne la croissance de f', 0, 10),
('Elle est toujours positive', 0, 10),
('Elle représente la tangente à f', 0, 10),

-- Automates Q11
('Un automate avec un seul état initial, un ensemble fini d''états et de transitions déterministes', 1, 11),
('Un automate qui peut avoir plusieurs transitions possibles pour un même symbole', 0, 11),
('Un automate avec des epsilon-transitions', 0, 11),
('Un automate qui ne reconnaît que les langages contextuels', 0, 11),

-- Automates Q12
('Un langage régulier', 1, 12),
('Un langage libre de contexte', 0, 12),
('Un langage récursivement énumérable', 0, 12),
('Un langage déterministe', 1, 12),

-- Automates Q13
('Tout langage reconnu par un automate fini peut être décrit par une expression rationnelle', 1, 13),
('Les expressions rationnelles définissent des langages non réguliers', 0, 13),
('Les automates finis peuvent reconnaître tous les langages', 0, 13),
('Les automates finis ne peuvent pas être représentés par des expressions rationnelles', 0, 13),

-- Automates Q14
('Oui, en utilisant l''algorithme de déterminisation', 1, 14),
('Non, un AFN et un AFD ne sont pas équivalents', 0, 14),
('Oui, mais uniquement si l''AFN est complet', 0, 14),
('Non, car un AFN utilise des epsilon-transitions', 0, 14),

-- Automates Q15
('Si un langage peut être reconnu par un automate fini, alors il est régulier', 1, 15),
('Un langage régulier peut être représenté par une grammaire hors-contexte', 0, 15),
('Les langages réguliers sont fermés par intersection, union et complémentaire', 1, 15),
('Un langage régulier doit avoir une infinité de mots', 0, 15),

-- Statistiques Q16
('La moyenne pondérée des valeurs prises par X', 1, 16),
('La valeur médiane de X', 0, 16),
('La fréquence la plus élevée de X', 0, 16),
('La somme des écarts à la moyenne', 0, 16),

-- Statistiques Q17
('E[X²] doit être fini', 1, 17),
('E[X] doit être nul', 0, 17),
('X doit être bornée', 0, 17),
('X doit être normale', 0, 17),

-- Statistiques Q18
('Une loi normale', 1, 18),
('Une loi de Poisson', 0, 18),
('Une loi exponentielle', 0, 18),
('Une loi uniforme', 0, 18),

-- Statistiques Q19
('Un estimateur dont l''espérance est égale à la vraie valeur du paramètre', 1, 19),
('Un estimateur qui minimise la variance', 0, 19),
('Un estimateur qui est toujours positif', 0, 19),
('Un estimateur qui maximise la vraisemblance', 0, 19),

-- Statistiques Q20
('0.5', 1, 20),
('1', 0, 20),
('0', 0, 20),
('0.75', 0, 20),

-- Nombres Complexes Q21
('i² = -1', 1, 21),
('i = √2', 0, 21),
('i est un nombre réel', 0, 21),
('i² = 1', 0, 21),

-- Nombres Complexes Q22
('5', 1, 22),
('7', 0, 22),
('√5', 0, 22),
('3', 0, 22),

-- Nombres Complexes Q23
('√2 e^(iπ/4)', 1, 23),
('e^(iπ/3)', 0, 23),
('e^(iπ/2)', 0, 23),
('e^(iπ/6)', 0, 23),

-- Nombres Complexes Q24
('|z| e^(i arg(z))', 1, 24),
('arg(z) = |z|', 0, 24),
('|z| = arg(z)', 0, 24),
('|z| = e^(i arg(z))', 0, 24),

-- Nombres Complexes Q25
('{i, -i}', 1, 25),
('{1, -1}', 0, 25),
('{0, i}', 0, 25),
('{0, -i}', 0, 25),

-- Probabilités Q26
('Une fonction qui associe à chaque issue un nombre réel', 1, 26),
('Une variable qui prend toutes les valeurs possibles dans ℝ', 0, 26),
('Une fonction constante', 0, 26),
('Une valeur fixe', 0, 26),

-- Probabilités Q27
('Les probabilités doivent être positives', 1, 27),
('La somme des probabilités doit être égale à 1', 1, 27),
('Chaque valeur possible a une probabilité non nulle', 0, 27),
('La somme des probabilités peut être supérieure à 1', 0, 27),

-- Probabilités Q28
('2.5', 1, 28),
('3', 0, 28),
('1.5', 0, 28),
('4', 0, 28),

-- Probabilités Q29
('E(XY) = E(X)E(Y)', 1, 29),
('P(X | Y) = P(X)', 1, 29),
('E(X + Y) = E(X) + E(Y)', 0, 29),
('X et Y ont la même variance', 0, 29),

-- Probabilités Q30
('p(1 - p)', 1, 30),
('p²', 0, 30),
('1 - p', 0, 30),
('1', 0, 30);

-- Insertion de quelques tentatives d'exemple
INSERT INTO Attempt(Date_attempt, Grade, ID_QCM, ID_user) VALUES
('2024-12-01', 18.5, 1, 5),
('2024-12-01', 12.0, 1, 6),
('2024-12-02', 16.0, 2, 5),
('2024-12-02', 14.5, 3, 7),
('2024-12-03', 19.0, 4, 8),
('2024-12-03', 11.5, 5, 9),
('2024-12-04', 17.0, 6, 10),
('2024-12-04', 15.5, 1, 7);

-- Insertion de réponses aux questions pour les tentatives
-- Tentative 1 (Étudiant 5, QCM 1)
INSERT INTO Answer_question(Points_earned, ID_Question, ID_Attempt) VALUES
(3, 1, 1),
(2, 2, 1),
(4, 3, 1),
(3, 4, 1);

-- Réponses sélectionnées pour la tentative 1
INSERT INTO Has_answered(ID_Proposition, ID_Answer) VALUES
(1, 1),  -- Q1: bonne réponse
(5, 2),  -- Q2: bonne réponse 1
(6, 2),  -- Q2: bonne réponse 2
(9, 3),  -- Q3: bonne réponse
(13, 4); -- Q4: bonne réponse

-- Tentative 2 (Étudiant 6, QCM 1)
INSERT INTO Answer_question(Points_earned, ID_Question, ID_Attempt) VALUES
(0, 1, 2),
(1, 2, 2),
(4, 3, 2),
(0, 4, 2);

-- Réponses sélectionnées pour la tentative 2
INSERT INTO Has_answered(ID_Proposition, ID_Answer) VALUES
(2, 5),  -- Q1: mauvaise réponse
(5, 6),  -- Q2: une bonne réponse seulement
(9, 7),  -- Q3: bonne réponse
(14, 8); -- Q4: mauvaise réponse

SELECT 'Jeu de données inséré avec succès!' AS Message;
SELECT CONCAT('Utilisateurs: ', COUNT(*), ' insérés') AS Info FROM users;
SELECT CONCAT('Matières: ', COUNT(*), ' insérées') AS Info FROM Subjectt;
SELECT CONCAT('Chapitres: ', COUNT(*), ' insérés') AS Info FROM Chapter;
SELECT CONCAT('QCM: ', COUNT(*), ' insérés') AS Info FROM QCM;
SELECT CONCAT('Questions: ', COUNT(*), ' insérées') AS Info FROM Question;
SELECT CONCAT('Réponses possibles: ', COUNT(*), ' insérées') AS Info FROM Possible_answer;
SELECT CONCAT('Tentatives: ', COUNT(*), ' insérées') AS Info FROM Attempt;
