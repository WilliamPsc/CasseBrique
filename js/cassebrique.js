/**
 * @author Timothé LANNUZEL et William PENSEC
 * @version 1.3
 * @description Script servant à faire tourner le jeu du casse brique
 * 
** /

/* Récupération de la zone de travail */
var canvas = document.getElementById("myCanvas");
canvas.style.backgroundColor = "black"; // Fond en noir
var nbBriqueRestante = -1;
var ctx = canvas.getContext("2d");

var beg = false;

/* Création sprite audio */
var sonActif = false;
var musiqueFond = document.createElement("audio");
musiqueFond.src = "";


/* Initialisation position balle */
var diam = 20;
var posBalleX = canvas.width / 2;
var posBalleY = canvas.height / 2;
var moveX = 5;
var moveY = -5;

/* Initialisation position barre */
var longBarre = 200;
var hautBarre = 20;
var posBarreX = (canvas.width / 2) - (longBarre / 1.9);
var posBarreY = canvas.height - (hautBarre * 2);
var modeAutomatique = false;


/* Initialisation briques */
var nbLigne = 5;
var nbColonne = 10;
var espace_brique = 10;
var marge_gauche_brique = 7;
var marge_haut_brique = 25;
var largeur_brique = ((canvas.width) / (nbColonne)) - espace_brique;
var hauteur_brique = 40;
var tableauBrique = [];
for (var i = 0; i < nbColonne; i++) {
    tableauBrique[i] = [];
    for (var j = 0; j < nbLigne; j++) {
        tableauBrique[i][j] = 1;
    }
}

/* Variables chronometre */
var start = new Date();
var end = 0;
var diff = 0;

/* Vérification si on a gagné */
var score = 0;
var vie = -1;
nbBriqueRestante = nbColonne * nbLigne;

/* Mouvement Souris*/
document.addEventListener("mousemove", mouseMoveHandler, false);

/* Mouvement Tactil*/
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);

function setColonne() {
    localStorage.nbColonne = document.getElementById("nbColonne").value;
    nbColonne = Number(localStorage.getItem("nbColonne"));
    document.getElementById("labelSetColonne").innerHTML = "Valeur : " + nbColonne;

    largeur_brique = ((canvas.width) / (nbColonne)) - espace_brique;
    setLigne();
}

function setLigne() {
    localStorage.nbLigne = document.getElementById("nbLigne").value;
    nbLigne = Number(localStorage.getItem("nbLigne"));
    document.getElementById("labelSetLigne").innerHTML = "Valeur : " + nbLigne;

    for (var i = 0; i < nbColonne; i++) {
        tableauBrique[i] = [];
        for (var j = 0; j < nbLigne; j++) {
            tableauBrique[i][j] = 1;
        }
    }
    score = 0;
    nbBriqueRestante = nbColonne * nbLigne;
    drawBrique();
}

function setVies() {
    localStorage.vie = document.getElementById("nbVies").value;
    vie = Number(localStorage.getItem("vie"));
    document.getElementById("labelSetVies").innerHTML = "Valeur : " + vie;
}

function setAuto() {
    var valeur = "";
    modeAutomatique = !modeAutomatique;
    if (modeAutomatique == true) {
        valeur = "On";
        document.getElementById("Auto").value = true;
    }
    else {
        valeur = "Off";
        document.getElementById("Auto").value = false;
    }
    document.getElementById("labelModeAuto").innerHTML = valeur;
}

function setSon() {
    var valeur = "";
    sonActif = !sonActif;
    if (sonActif == true) {
        valeur = "On";
        document.getElementById("son").value = true;
    }
    else {
        valeur = "Off";
        document.getElementById("son").value = false;
    }
    document.getElementById("labelSon").innerHTML = valeur;
}

function son() {
    if (sonActif == true) {
        
    }
}

function pause() {
    alert("Pause");
}

function win() {
    score = -1;
    end = new Date();
    diff = end - start;
    diff = new Date(diff);
    var sec = diff.getSeconds();
    var min = diff.getMinutes();
    var heure = diff.getHours() - 1;

    if (sec < 10) {
        sec = "0" + sec;
    }
    if (min == 0) {
        min = "00";
    } else if (min < 10) {
        min = "0" + min;
    }
    if (heure == 0) {
        heure = "00";
    } else if (heure < 10) {
        heure = "0" + heure;
    }
    ctx.fillText(heure + " : " + min + " : " + sec, canvas.width - 100, 20);
    clearInterval(10); // Needed for Chrome to end game

    if (window.confirm("================ GAGNÉ ================ \n Temps mis : " + heure + " : " + min + " : " + sec + "\n\n Cliquez sur OK pour rejouer \n Cliquez sur Annuler pour revenir à l'accueil")) {
        document.location.reload();
    } else {
        document.location.href = "index.html";
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(posBalleX, posBalleY, diam, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function drawBarre() {
    ctx.beginPath();
    ctx.fillStyle = "#0000FF";
    ctx.strokeStyle = "#0000FF";
    ctx.fillRect(posBarreX, posBarreY, longBarre, hautBarre);
    ctx.stroke();
    ctx.fill();
}

function drawBrique(){
    for(var i = 0; i < nbColonne; i++){
        for (var j = 0; j < nbLigne; j++){
            if (tableauBrique[i][j] == 1) {
                var briqueX = (i * (largeur_brique + espace_brique)) + (marge_gauche_brique);
                var briqueY = (j * (hauteur_brique + espace_brique)) + (marge_haut_brique);
                ctx.beginPath();
                ctx.rect(briqueX, briqueY, largeur_brique, hauteur_brique);
                ctx.fillStyle = "#FF0000";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function moveBall() {
    posBalleX += moveX;
    posBalleY += moveY;

    if (modeAutomatique == true) {
        posBarreX = posBalleX - (longBarre / 2);
    }
   
    if (posBalleY + diam >= canvas.height) {
        if (vie != -1) {
            vie--;
            if (vie < 0) {
                console.log("YOU DIE");
                if (window.confirm("================ GAME OVER ================ \n Cliquez sur OK pour rejouer \n Cliquez sur Annuler pour revenir à l'accueil")) {
                    document.location.reload();
                    clearInterval(1); // Needed for Chrome to end game
                } else {
                    document.location.href = "index.html";
                }
            }
        }
        else {
            console.log("Mode infini");
        }
    }

    if (posBalleX + moveX > canvas.width - diam || posBalleX + moveX < 0 + diam) {
        console.log("Rebond Gauche ou Droit");
        moveX = -moveX;
    }

    if (posBalleY + moveY > canvas.height - diam || posBalleY + moveY < 0 + diam) {
        console.log("Rebond Bord haut");
        moveY = -moveY;
    }
    else if (posBalleY + moveY > canvas.height - diam) {
        if (posBalleX + diam > posBarreX && posBalleX + diam < posBarreX + longBarre) {
            console.log("Rebond Bord 2");
            moveY = -moveY;
        }
    }
    collisionBarre(); 
}

document.onkeydown = function (event) {
    switch (event.keyCode) {
        case 37: // Gauche
            if (posBarreX > 0) {
                if (modeAutomatique != true) {
                    posBarreX -= 60;
                }
            }
            break;
        case 39: // Droite
            if (posBarreX + longBarre < canvas.width) {
                if (modeAutomatique != true) {
                    posBarreX += 60;
                }
            }
            break;
        case 80: // Touche p
            beg = !beg;
            break;
    }
}

//Fonction controle souris
function mouseMoveHandler(e) {
    if (modeAutomatique != true) {
        var rect = canvas.getBoundingClientRect();
        var futurPosBarreX = (e.clientX - rect.left) * (canvas.width / rect.width) - (longBarre / 2)
        if (futurPosBarreX < 0) {
            posBarreX = 0;
        } else {
            if (futurPosBarreX > canvas.width - longBarre) {
                posBarreX = canvas.width - longBarre;
            } else {
                posBarreX = futurPosBarreX;
            }
        }
    }
}

//Fonction controle tactile
function touchHandler(e) {
    if (modeAutomatique != true) {
        var rect = canvas.getBoundingClientRect();
        if (e.touches) {
            var futurPosBarreX = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width) - (longBarre / 2)
            if (futurPosBarreX < 0) {
                posBarreX = 0;
            } else {
                if (futurPosBarreX > canvas.width - longBarre) {
                    posBarreX = canvas.width - longBarre;
                } else {
                    posBarreX = futurPosBarreX;
                }
            }
        }
    }
}

function collision() {
    for (var i = 0; i < nbColonne; i++) {
        for (var j = 0; j < nbLigne; j++) {
            var briqueX = (i * (largeur_brique + espace_brique)) + (marge_gauche_brique);
            var briqueY = (j * (hauteur_brique + espace_brique)) + (marge_haut_brique);
            if (posBalleY <= briqueY + hauteur_brique + marge_haut_brique && posBalleY >= briqueY) {
                if (posBalleX <= briqueX + largeur_brique + marge_gauche_brique && posBalleX >= briqueX) {
                    if (tableauBrique[i][j] == 1) {
                        posBalleY += moveY;
                        moveY = -moveY;
                        tableauBrique[i][j] = 0;
                        score++;   
                    }
                }
            }
        }
    }
}

function collisionBarre() {
    if ((posBalleX + moveX) > posBarreX && (posBalleX + moveX) < (posBarreX + longBarre)) {
        if ((posBalleY + moveY + diam) > posBarreY && (posBalleY + moveY + diam) < posBarreY + hautBarre) {
            console.log("Rebond Barre");
            //Bouger la balle selon la raquette
            if ((posBalleX + moveX) < (posBarreX + (longBarre / 5))) {
                console.log("Rebond Barre -3");
                if (moveX >= -10) {
                    moveX = moveX - 3;
                }
                moveY = -moveY;
            } else {
                if ((posBalleX + moveX) < (posBarreX + (longBarre / 5) + (longBarre / 5))) {
                    console.log("Rebond Barre -1");
                    if (moveX >= -10) {
                        moveX = moveX - 1;
                    }
                    moveY = -moveY;
                } else {
                    if ((posBalleX + moveX) < (posBarreX + (longBarre / 5) + (longBarre / 5) + (longBarre / 5))) {
                        console.log("Rebond Barre 0");
                        moveX = moveX;
                        moveY = -moveY;
                    } else {
                        if ((posBalleX + moveX) < (posBarreX + (longBarre / 5) + (longBarre / 5) + (longBarre / 5) + (longBarre / 5))) {
                            console.log("Rebond Barre +1");
                            if (moveX <= 10) {
                                moveX = moveX + 1;
                            }
                            moveX = moveX + 1;
                            moveY = -moveY;
                        } else {
                            console.log("Rebond Barre +3");
                            if (moveX <= 10) {
                                moveX = moveX + 3;
                            }
                            moveY = -moveY;
                        }
                    }
                }
            }
        }
    }
}

function chronometre() {
    end = new Date();
    diff = end - start;
    diff = new Date(diff);
    var sec = diff.getSeconds();
    var min = diff.getMinutes();
    var heure = diff.getHours() - 1;

    if (sec < 10) {
        sec = "0" + sec;
    }
    if (min == 0) {
        min = "00";
    }else if (min < 10) {
        min = "0" + min;
    }
    if (heure == 0) {
        heure = "00";
    } else if (heure < 10) {
        heure = "0" + heure;
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(heure + " : " + min + " : " + sec, canvas.width - 100, 20);
}

function drawText() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Brique restante : " + (nbBriqueRestante - score), 925, 20);
    ctx.fillText("x : " + posBalleX + " | y : " + posBalleY, canvas.width - 150, canvas.height - 10);
    ctx.fillText("Vitesse balle x : " + Math.abs(moveX), 10, canvas.height - 10);
    ctx.fillText("Vies restantes : " + vie, 925, canvas.height - 10);
}

function draw() {
    if (beg == true) {
        son();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBarre();
        drawBrique();
        if (score == nbBriqueRestante) {
            win();
        }
        moveBall();
        collision();

        drawText();
        chronometre();
    } else {
        ctx.font = "40px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("APPUYEZ SUR LA TOUCHE \"P\" POUR COMMENCER À JOUER !", canvas.width / 4 - 75, canvas.height / 2);
    }
}
setInterval(draw, 10);
requestAnimationFrame(draw);