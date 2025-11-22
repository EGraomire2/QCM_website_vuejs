use sos_prepa_bdd;

INSERT INTO Accountt(ID_user, Administrator, Teacher, Nickname, Score_account) VALUES 
(1, True, True, "Etienne", 100),
(2, True, True, "Gabriel", 1),
(3, True, True, "Evan", 10),
(4, False, True, "Alexandre", 11),
(5, False, False, "Charlotte", 10),
(6, False, False, "Nassim", 7),
(7, False, False, "Billy", 12),
(8, False, False, "Andrew", 7),
(9, False, False, "Kevin", 3),
(10, False, False, "Juliette", 6);

INSERT INTO QCM(ID_QCM, Name_QCM, Subjects, Difficulty, ID_user) VALUES
(1, "QCM d'algèbre - Prépa", "Algèbre linéaire", 1, 1),
(2, "QCM d'Analyse - Prépa", "Analyse", 2, 1),
(3, "QCM Automates et Expressions Rationnelles - Prépa", "Automates Finis", 3, 3),
(4, "QCM Statistiques - Prépa", "Statistiques", 2, 1),
(5, "QCM Nombres Complexes - Prépa", "Nombres Complexes", 2, 1),
(6, "QCM Probabilités - Prépa", "Probabilités", 3, 1);

INSERT INTO Question(ID_Question, Question_heading, Number_of_points, Type_of_question, Negative_points, ID_QCM) VALUES
# Algèbre (QCM 1)

(1, "Soit A une matrice 3×3 inversible. Quelle est la valeur de det(A⁻¹) en fonction de det(A) ?", 3, "Choix simple", 0, 1),
(2, "Les colonnes d’une matrice carrée sont linéairement indépendantes si et seulement si…", 2, "Choix multiple", 1, 1),
(3, "Trouvez les valeurs propres de la matrice A = [[2, -1], [1, 4]].", 4, "Choix simple", 0, 1),
(4, "Si A est une matrice symétrique réelle, que peut-on dire de ses valeurs propres ?", 3, "Choix simple", 0, 2),

# Note totale maximal = 12

# Analyse (QCM 2)

(5, "Quelle est la dérivée de f(x) = x² + 3x - 5 ?", 2, "Choix simple", 0, 2),
(6, "Soit f une fonction continue sur [a,b]. Que dit le théorème des valeurs intermédiaires ?", 3, "Choix multiple", 1, 2),
(7, "Quelle est la série de Taylor de e^x centrée en 0 ?", 4, "Choix simple", 0, 2),
(8, "Quelle est la condition pour qu'une fonction soit uniformément continue sur un intervalle ?", 3, "Choix simple", 0, 2),
(9, "Soit f une fonction dérivable sur ℝ avec f'(x) > 0 sur ℝ. Que peut-on en conclure ?", 2, "Choix simple", 0, 2),
(10, "Si f est deux fois dérivable, que représente le signe de f''(x) ?", 3, "Choix simple", 0, 2),
(11, "Que vaut la limite de sin(x)/x quand x tend vers 0 ?", 3, "Choix simple", 0, 2),
(12, "Soit (u_n) une suite définie par u_(n+1) = sqrt(u_n). Si u_0 = 4, vers quoi converge-t-elle ?", 4, "Choix simple", 0, 2),
(13, "Si une fonction est intégrable sur [a,b], que peut-on dire de son intégrale ?", 3, "Choix multiple", 1, 2),
(14, "Que vaut l'intégrale de 1/(1+x²) sur ℝ ?", 4, "Choix simple", 0, 2),

# Note totale maximale = 31

# Automates finis et expressions rationnelles (QCM 3) 

(15, "Qu'est-ce qu'un automate fini déterministe (AFD) ?", 3, "Choix simple", 0, 3),
(16, "Quelle est la propriété d'un langage reconnu par un automate fini ?", 3, "Choix multiple", 1, 3),
(17, "Quelle est la relation entre automates finis et expressions rationnelles ?", 4, "Choix simple", 0, 3),
(18, "Un automate fini non déterministe (AFN) peut-il être transformé en un AFD équivalent ?", 3, "Choix simple", 0, 3),
(19, "Quelle est la complexité de l'algorithme de déterminisation d'un AFN ?", 3, "Choix simple", 0, 3),
(20, "Quel est le nombre minimal d'états d'un automate reconnaissant le langage (a|b)* ?", 3, "Choix simple", 0, 3),
(21, "Comment reconnaît-on un langage régulier ?", 4, "Choix multiple", 1, 3),
(22, "Que vaut l'expression rationnelle correspondant au langage constitué de tous les mots sur {a, b} finissant par 'ab' ?", 4, "Choix simple", 0, 3),
(23, "Un langage est dit régulier si et seulement si…", 3, "Choix multiple", 1, 3),
(24, "Quel théorème établit l'équivalence entre langages rationnels et automates finis ?", 4, "Choix simple", 0, 3),

# Note totale maximale = 34

# Statistiques (QCM 4)

(25, "Qu'est-ce que l'espérance mathématique d'une variable aléatoire X ?", 3, "Choix simple", 0, 4),
(26, "Quelle condition est nécessaire pour qu'une variable aléatoire ait une variance finie ?", 3, "Choix simple", 0, 4),
(27, "Quelle est la distribution limite du théorème central limite ?", 4, "Choix simple", 0, 4),
(28, "Quelle est la définition d'une estimation sans biais ?", 3, "Choix simple", 0, 4),
(29, "Quelle est la probabilité d'événement A sachant B si A et B sont indépendants ?", 2, "Choix simple", 0, 4),
(30, "Quelle est la propriété principale d'un estimateur de maximum de vraisemblance ?", 3, "Choix simple", 0, 4),
(31, "Quel test statistique permet de comparer les moyennes de deux échantillons indépendants ?", 4, "Choix simple", 0, 4),
(32, "Quelle est la définition d'un intervalle de confiance ?", 3, "Choix simple", 0, 4),
(33, "Quelle loi de probabilité modélise le nombre de succès dans une série de n expériences de Bernoulli ?", 3, "Choix simple", 0, 4),
(34, "Si une variable suit une loi normale N(0,1), que vaut P(X > 0) ?", 4, "Choix simple", 0, 4),

# Note totale maximale = 32

# Nombres complexes (QCM 5)

(35, "Quelle est la définition de l'unité imaginaire i ?", 3, "Choix simple", 0, 5),
(36, "Quel est le module du nombre complexe z = 3 + 4i ?", 3, "Choix simple", 1, 5),
(37, "Quelle est l'écriture exponentielle du nombre complexe 1 + i ?", 4, "Choix simple", 0, 5),
(38, "Quelle est la relation entre module et argument d'un nombre complexe z ?", 3, "Choix simple", 0, 5),
(39, "Quel est l'ensemble des solutions de l'équation z² + 1 = 0 dans C ?", 3, "Choix simple", 0, 5),
(40, "Si z = e^(iπ/3), quelle est sa forme trigonométrique ?", 3, "Choix simple", 1, 5),
(41, "Quelle est la forme exponentielle d'un nombre complexe ?", 4, "Choix simple", 0, 5),
(42, "Quel est le conjugué du nombre complexe z = 5 - 2i ?", 3, "Choix simple", 0, 5),
(43, "Quelle est la forme trigonométrique de i ?", 3, "Choix simple", 0, 5),
(44, "Quel est le produit des racines n-ièmes de l’unité ?", 4, "Choix simple", 0, 5),

# Note totale maximale = 33

# Probabilités (QCM 6)

(45, "Quelle est la définition d'une variable aléatoire discrète ?", 3, "Choix simple", 0, 6),
(46, "La loi de probabilité d'une variable aléatoire discrète doit vérifier :", 3, "Choix multiple", 1, 6),
(47, "Quelle est l'espérance mathématique de X si X suit une loi uniforme sur {1, 2, 3, 4} ?", 4, "Choix simple", 0, 6),
(48, "Si X et Y sont deux variables indépendantes, alors :", 3, "Choix multiple", 1, 6),
(49, "Quelle est la variance d’une loi de Bernoulli de paramètre p ?", 4, "Choix simple", 0, 6),
(50, "Si X suit une loi normale N(0,1), alors P(-1 ≤ X ≤ 1) est environ :", 3, "Choix simple", 0, 6),
(51, "Quelle est la somme des probabilités des issues d’un espace probabilisé ?", 3, "Choix simple", 0, 6),
(52, "Si une variable aléatoire suit une loi exponentielle de paramètre λ, son espérance vaut :", 4, "Choix simple", 0, 6),
(53, "Quelle est la définition de l’indépendance entre deux événements A et B ?", 3, "Choix simple", 0, 6),
(54, "Quelle est la probabilité que deux dés lancés donnent un total de 7 ?", 3, "Choix simple", 0, 6);

# Note totale maximale = 33

INSERT INTO Possible_answer(ID_Proposition, Proposition, Validity, ID_Question) VALUES
# Algèbre (QCM 1)

(1, "1 / det(A)", 1, 1),
(2, "det(A)", 0, 1),
(3, "-det(A)", 0, 1),
(4, "0", 0, 1),

(5, "Le déterminant de la matrice est non nul", 1, 2),
(6, "Le rang de la matrice est maximal", 1, 2),
(7, "Toutes ses valeurs propres sont strictement positives", 0, 2),
(8, "Ses colonnes sont toutes orthogonales", 0, 2),

(9, "λ₁ = 3, λ₂ = 3", 1, 3),
(10, "λ₁ = 1, λ₂ = 3", 0, 3),
(11, "λ₁ = 5, λ₂ = 2", 0, 3),
(12, "λ₁ = 10, λ₂ = 5", 0, 3),

(13, "Elles sont réelles", 1, 4),
(14, "Elles sont toutes strictement positives", 0, 4),
(15, "Elles sont toutes distinctes", 0, 4),
(16, "Elles sont imaginaires", 0, 4),

# Analyse (QCM 2)

(17, "2x + 3", 1, 5),
(18, "x² + 3", 0, 5),
(19, "2x - 3", 0, 5),
(20, "x + 3", 0, 5),

(21, "Toute valeur intermédiaire est atteinte par f", 1, 6),
(22, "f est strictement monotone sur [a,b]", 0, 6),
(23, "f admet un maximum sur [a,b]", 1, 6),
(24, "f est dérivable sur [a,b]", 0, 6),

(25, "Somme de (x^n)/n!", 1, 7),
(214, "Somme de (x^n)/(n+1)!", 0, 7),
(215, "Somme de ((x+2)^n)/n!", 0, 7),
(216, "Somme de (x^2)/n!", 0, 7),

(26, "Elle est bornée sur l'intervalle", 0, 8),
(27, "Elle vérifie la condition de Cauchy", 1, 8),
(28, "Elle est dérivable", 0, 8),
(29, "Elle est convexe", 0, 8),

(30, "f est strictement croissante", 1, 9),
(31, "f est périodique", 0, 9),
(32, "f est bornée", 0, 9),
(33, "f est décroissante", 0, 9),

(34, "Elle indique la convexité de f", 1, 10),
(35, "Elle donne la croissance de f", 0, 10),
(36, "Elle est toujours positive", 0, 10),
(37, "Elle représente la tangente à f", 0, 10),

(38, "1", 1, 11),
(39, "0", 0, 11),
(40, "∞", 0, 11),
(41, "-1", 0, 11),

(42, "2", 1, 12),
(43, "4", 0, 12),
(44, "1", 0, 12),
(45, "∞", 0, 12),

(46, "Elle est bien définie et finie", 1, 13),
(47, "Elle est nécessairement positive", 0, 13),
(48, "Elle est nécessairement croissante", 0, 13),
(49, "Son intégrale dépend du signe de f", 1, 13),

(50, "π", 1, 14),
(51, "1", 0, 14),
(52, "2π", 0, 14),
(53, "0", 0, 14),

# Automates finis et expressiosn rationnelles (QCM 3)

(54, "Un automate avec un seul état initial, un ensemble fini d'états et de transitions déterministes", 1, 15),
(55, "Un automate qui peut avoir plusieurs transitions possibles pour un même symbole", 0, 15),
(56, "Un automate avec des epsilon-transitions", 0, 15),
(57, "Un automate qui ne reconnaît que les langages contextuels", 0, 15),

(58, "Un langage régulier", 1, 16),
(59, "Un langage libre de contexte", 0, 16),
(60, "Un langage récursivement énumérable", 0, 16),
(61, "Un langage déterministe", 1, 16),

(62, "Tout langage reconnu par un automate fini peut être décrit par une expression rationnelle", 1, 17),
(63, "Les expressions rationnelles définissent des langages non réguliers", 0, 17),
(64, "Les automates finis peuvent reconnaître tous les langages", 0, 17),
(65, "Les automates finis ne peuvent pas être représentés par des expressions rationnelles", 0, 17),

(66, "Oui, en utilisant l'algorithme de déterminisation", 1, 18),
(67, "Non, un AFN et un AFD ne sont pas équivalents", 0, 18),
(68, "Oui, mais uniquement si l'AFN est complet", 0, 18),
(69, "Non, car un AFN utilise des epsilon-transitions", 0, 18),

(70, "Exponentielle dans le pire cas", 1, 19),
(71, "Linéaire", 0, 19),
(72, "Quadratique", 0, 19),
(73, "Constante", 0, 19),

(74, "1", 0, 20),
(75, "2", 1, 20),
(76, "3", 0, 20),
(77, "4", 0, 20),

(78, "Si un langage peut être reconnu par un automate fini, alors il est régulier", 1, 21),
(79, "Un langage régulier peut être représenté par une grammaire hors-contexte", 0, 21),
(80, "Les langages réguliers sont fermés par intersection, union et complémentaire", 1, 21),
(81, "Un langage régulier doit avoir une infinité de mots", 0, 21),

(82, "(a|b)*ab", 1, 22),
(83, "(a|b)ab*", 0, 22),
(84, "(a|b)*ba", 0, 22),
(85, "ab(a|b)*", 0, 22),

(86, "S'il peut être reconnu par un automate fini", 1, 23),
(87, "S'il est engendré par une grammaire hors contexte", 0, 23),
(88, "S'il est défini par une expression rationnelle", 1, 23),
(89, "S'il est décidable", 0, 23),

(90, "Le théorème de Kleene", 1, 24),
(91, "Le théorème de Myhill-Nerode", 0, 24),
(92, "Le théorème de Chomsky", 0, 24),
(93, "Le théorème de Pumping Lemma", 0, 24),

# Statistiques (QCM 4)

(94, "La moyenne pondérée des valeurs prises par X", 1, 25),
(95, "La valeur médiane de X", 0, 25),
(96, "La fréquence la plus élevée de X", 0, 25),
(97, "La somme des écarts à la moyenne", 0, 25),

(98, "E[X²] doit être fini", 1, 26),
(99, "E[X] doit être nul", 0, 26),
(100, "X doit être bornée", 0, 26),
(101, "X doit être normale", 0, 26),

(102, "Une loi normale", 1, 27),
(103, "Une loi de Poisson", 0, 27),
(104, "Une loi exponentielle", 0, 27),
(105, "Une loi uniforme", 0, 27),

(106, "Un estimateur dont l'espérance est égale à la vraie valeur du paramètre", 1, 28),
(107, "Un estimateur qui minimise la variance", 0, 28),
(108, "Un estimateur qui est toujours positif", 0, 28),
(109, "Un estimateur qui maximise la vraisemblance", 0, 28),

(110, "P(A|B) = P(A)", 1, 29),
(111, "P(A|B) = P(A) * P(B)", 0, 29),
(112, "P(A|B) = P(B|A)", 0, 29),
(113, "P(A|B) = 1", 0, 29),

(114, "Il maximise la vraisemblance des observations", 1, 30),
(115, "Il minimise l’erreur quadratique moyenne", 0, 30),
(116, "Il est toujours asymptotiquement normal", 0, 30),
(117, "Il est toujours sans biais", 0, 30),

(118, "Le test de Student (t-test)", 1, 31),
(119, "Le test du Khi-deux", 0, 31),
(120, "Le test de Kolmogorov-Smirnov", 0, 31),
(121, "Le test de Fisher", 0, 31),

(122, "Un intervalle contenant une estimation du paramètre avec une certaine probabilité", 1, 32),
(123, "Un intervalle qui contient toujours la moyenne de l’échantillon", 0, 32),
(124, "Un intervalle qui contient tous les échantillons possibles", 0, 32),
(125, "Un intervalle de valeurs de X", 0, 32),

(126, "Une loi binomiale", 1, 33),
(127, "Une loi exponentielle", 0, 33),
(128, "Une loi normale", 0, 33),
(129, "Une loi de Poisson", 0, 33),

(130, "0.5", 1, 34),
(131, "1", 0, 34),
(132, "0", 0, 34),
(133, "0.75", 0, 34),

# Nombres complexes (QCM 5)
(134, "i² = -1", 1, 35),
(135, "i = √2", 0, 35),
(136, "i est un nombre réel", 0, 35),
(137, "i² = 1", 0, 35),

(138, "5", 1, 36),
(139, "7", 0, 36),
(140, "√5", 0, 36),
(141, "3", 0, 36),

(142, "√2 e^(iπ/4)", 1, 37),
(143, "e^(iπ/3)", 0, 37),
(144, "e^(iπ/2)", 0, 37),
(145, "e^(iπ/6)", 0, 37),

(146, "|z| e^(i arg(z))", 1, 38),
(147, "arg(z) = |z|", 0, 38),
(148, "|z| = arg(z)", 0, 38),
(149, "|z| = e^(i arg(z))", 0, 38),

(150, "{i, -i}", 1, 39),
(151, "{1, -1}", 0, 39),
(152, "{0, i}", 0, 39),
(153, "{0, -i}", 0, 39),

(154, "cos(π/3) + i sin(π/3)", 1, 40),
(155, "cos(π/2) + i sin(π/2)", 0, 40),
(156, "cos(π/4) + i sin(π/4)", 0, 40),
(157, "cos(π/6) + i sin(π/6)", 0, 40),

(158, "re^(iθ)", 1, 41),
(159, "a + bi", 0, 41),
(160, "|z|e^(-iθ)", 0, 41),
(161, "z = x + iy", 0, 41),

(162, "5 + 2i", 1, 42),
(163, "-5 - 2i", 0, 42),
(164, "-5 + 2i", 0, 42),
(165, "5 - 2i", 0, 42),

(166, "cos(π/2) + i sin(π/2)", 1, 43),
(167, "cos(π) + i sin(π)", 0, 43),
(168, "cos(π/4) + i sin(π/4)", 0, 43),
(169, "cos(π/6) + i sin(π/6)", 0, 43),

(170, "1", 1, 44),
(171, "n", 0, 44),
(172, "e^(iπ)", 0, 44),
(173, "-1", 0, 44),

# Probabilités (QCM 6)

(174, "Une fonction qui associe à chaque issue un nombre réel", 1, 45),
(175, "Une variable qui prend toutes les valeurs possibles dans ℝ", 0, 45),
(176, "Une fonction constante", 0, 45),
(177, "Une valeur fixe", 0, 45),

(178, "Les probabilités doivent être positives", 1, 46),
(179, "La somme des probabilités doit être égale à 1", 1, 46),
(180, "Chaque valeur possible a une probabilité non nulle", 0, 46),
(181, "La somme des probabilités peut être supérieure à 1", 0, 46),

(182, "2.5", 1, 47),
(183, "3", 0, 47),
(184, "1.5", 0, 47),
(185, "4", 0, 47),

(186, "E(XY) = E(X)E(Y)", 1, 48),
(187, "P(X | Y) = P(X)", 1, 48),
(188, "E(X + Y) = E(X) + E(Y)", 0, 48),
(189, "X et Y ont la même variance", 0, 48),

(190, "p(1 - p)", 1, 49),
(191, "p²", 0, 49),
(192, "1 - p", 0, 49),
(193, "1", 0, 49),

(194, "68%", 1, 50),
(195, "50%", 0, 50),
(196, "95%", 0, 50),
(197, "99%", 0, 50),

(198, "1", 1, 51),
(199, "0", 0, 51),
(200, "Dépend des événements", 0, 51),
(201, "Infini", 0, 51),

(202, "1/λ", 1, 52),
(203, "λ", 0, 52),
(204, "2λ", 0, 52),
(205, "λ²", 0, 52),

(206, "P(A ∩ B) = P(A)P(B)", 1, 53),
(207, "P(A | B) = P(A)", 0, 53),
(208, "A et B sont mutuellement exclusifs", 0, 53),
(209, "A et B ont la même probabilité", 0, 53),

(210, "1/6", 1, 54),
(211, "1/12", 0, 54),
(212, "1/36", 0, 54),
(213, "1/2", 0, 54);


INSERT INTO Attempt(ID_Attempt, Date_attempt, Grade, ID_QCM, ID_user) VALUES
(1, "2025-03-10", 12/12, 1, 1),
(2, "2025-03-10", 7/12, 1, 1),
(3, "2025-03-10", 31/31, 2, 1),
(4, "2025-03-11", 17/31, 2, 2),
(5, "2025-03-11", 34/34, 3, 2),
(6, "2025-03-11", 30/34, 3, 3),
(7, "2025-03-11", 32/32, 4, 3),
(8, "2025-03-11", 32/32, 4, 4),
(9, "2025-03-12", 33/33, 5, 4),
(10, "2025-03-12", 0/33, 5, 5),
(11, "2025-03-12", 33/33, 6, 5),
(12, "2025-03-12", 17/33, 6, 6),
(13, "2025-03-13", 6/12, 1, 6),
(14, "2025-03-13", 1/31, 2, 7),
(15, "2025-03-13", 7/12, 1, 7),
(16, "2025-03-13", 17/33, 5, 8),
(17, "2025-03-14", 9/32, 4, 8),
(18, "2025-03-14", 29/33, 6, 9),
(19, "2025-03-14", 8/12, 1, 9),
(20, "2025-03-14", 8/12, 1, 10);


INSERT INTO Answer_question(ID_Answer, Points_earned, ID_Question, ID_Attempt) VALUES
(1 , 3, 1, 1),
(2, 1, 2, 1),
(3, 1, 2, 1),
(4, 4, 3, 1),
(5, 3, 4, 1),
(6, 0, 1, 2),
(7, 0, 2, 2),
(8, 0, 2, 2),
(9, 4, 3, 2),
(10, 3, 4, 2);

INSERT INTO Has_answered(ID_Proposition, ID_Answer) VALUES
(1, 1),
(5, 2),
(6, 3),
(9, 4),
(13, 5),
(2, 6),
(7, 7),
(8, 8),
(9, 9),
(13, 10);




#SELECT * FROM Accountt ORDER BY ID_user ASC;