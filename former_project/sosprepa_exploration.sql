use sos_prepa_bdd;

/* Requête permettant de voir le statut d'un Compte */
Select administrator from accountt
where accountt.ID_user = 1;

SELECT Teacher FROM accountt
where accountt.ID_user = 1;

-- Affiche les tentatives dont la note est supérieure à 15/20 de l'utilisateur d'ID 1
Select DISTINCT ID_Attempt, Date_attempt, Grade from attempt
JOIN accountt ON accountt.ID_user = attempt.ID_user
WHERE accountt.ID_user = 1 and Grade > 0.75;

-- Affiche les qcm dont la moyenne général dont la note minimale est supérieur à 10/20
SELECT min(grade) as Minimum, avg(grade) as Average, qcm.ID_QCM from attempt
JOIN qcm on qcm.ID_QCM = attempt.ID_QCM
group by qcm.ID_QCM
having Minimum > 0.5
ORDER BY Average;

-- Selectionner uniquements les réponses valides d'un QCM
Select Proposition from possible_answer
join Question on Question.ID_Question = Possible_answer.ID_Question
join QCM on QCM.ID_qcm = Question.ID_qcm
where possible_answer.validity = True;

-- requête classant les utilisateurs en fonction de leur moyenne
Select avg(grade) AS Average, Nickname from accountt
join attempt ON accountt.ID_user = attempt.ID_user
group by accountt.ID_user
ORDER BY Average DESC;

-- requête classant les utilisateurs en fonction du nombre de QCM auquels ils ont répondu
Select count(*) as Nb_answers, Nickname from accountt
join attempt ON accountt.ID_user = attempt.ID_user
group by accountt.ID_user
ORDER BY Nb_answers DESC;

/* Requête pour récupérer la liste des QCM auquel l'utilisateur d'itentifiant 1 à répondu*/
Select QCM.ID_qcm, Name_QCM, grade from QCM 
join attempt ON QCM.ID_QCM = attempt.ID_QCM
join accountt ON accountt.ID_user = attempt.ID_user
where accountt.ID_user = 1;

/* Requête complémentaire de la précédente */
Select QCM.ID_qcm, name_qcm from QCM
where QCM.ID_QCM NOT IN
	(Select QCM.ID_qcm from QCM 
	join attempt ON QCM.ID_QCM = attempt.ID_QCM
	join accountt ON accountt.ID_user = attempt.ID_user
	where accountt.ID_user = 1);
    
/* Requête permettant d'afficher le nombre de personnes ayant répondu au QCM d'ID 4 */
Select count(*) AS Number_of_response from QCM
join attempt ON QCM.ID_QCM = attempt.ID_QCM
where QCM.ID_QCM = 4;

/* Requêtes permettant de récupérer les informations essentiels afin d'afficher la correction de la question 1 */
-- Réponse de l'utilisateur dont l'ID est 1
Select ID_proposition, Proposition, Validity from Answer_Question 
join Question ON Question.ID_Question = Answer_Question.ID_Question
join Possible_Answer ON Possible_Answer.ID_Question = Question.ID_Question
where Question.ID_question = 1 and ID_proposition = 1; 

-- Selectionner toutes les informations et propositions relatives à la question d'ID 1
Select * from possible_answer
JOIN Question ON Question.ID_Question = possible_answer.ID_Question
where Question.ID_question = 1;
