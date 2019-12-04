/**
 * @author Timothé LANNUZEL et William PENSEC
 * @version 1.7
 * @description Script servant à faire tourner le jeu du casse brique
 * 
** /

/* Récupération de la zone de travail */
var canvas = document.getElementById("myCanvas");
canvas.style.backgroundColor = "black"; // Fond en noir
var nbBriqueRestante = -1;
var ctx = canvas.getContext("2d");

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

/* Initialisation briques */
var nbLigne = 10;
var nbColonne = 30;
var espace_brique = 10;
var marge_gauche_brique = 7;
var marge_haut_brique = 25;
console.log(canvas.width);
var largeur_brique = ((canvas.width) / (nbColonne)) - espace_brique;
var hauteur_brique = 40;
var tableauBrique = [];
for (var i = 0; i < nbColonne; i++) {
    tableauBrique[i] = [];
    for (var j = 0; j < nbLigne; j++) {
        tableauBrique[i][j] = Math.floor(Math.random() * 6 + 1);
    }
}

/* Initialisation bonus */
var longBonus = largeur_brique / 1.5;
var hautBonus = hauteur_brique / 1.5;
var posBonusX = -500;
var posBonusY = -500;
var nbBonus = 0;
var typeBonus = 0;
var bonusTime = false;
var startBonus = new Date();
var endBonus = 0;
var diffBonus = 0;

/* Variables chronometre */
var start = new Date();
var end = 0;
var diff = 0;

/* Variable timer bonus */
var startBonus = new Date();
var endBonus = 0;
var diffBonus = 0;

/* Vérification si on a gagné */
var score = 0;
nbBriqueRestante = nbColonne * nbLigne;

/* Mouvement Souris*/
document.addEventListener("mousemove", mouseMoveHandler, false);

/* Mouvement Tactil*/
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);

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
        document.location.href = "/cassebrique/index.html";
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

function drawBrique() {
    for (var i = 0; i < nbColonne; i++) {
        for (var j = 0; j < nbLigne; j++) {
            if (tableauBrique[i][j] >= 1) {
                var briqueX = (i * (largeur_brique + espace_brique)) + (marge_gauche_brique);
                var briqueY = (j * (hauteur_brique + espace_brique)) + (marge_haut_brique);
                ctx.beginPath();
                ctx.rect(briqueX, briqueY, largeur_brique, hauteur_brique);
                if (tableauBrique[i][j] == 1) {
                    ctx.fillStyle = "#FF0000";
                } else {
                    ctx.fillStyle = "#FFFF00";
                }

                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function moveBall() {
    posBalleX += moveX;
    posBalleY += moveY;
    /*
    if (posBalleY + diam >= canvas.height) {
        console.log("YOU DIE");
        if (window.confirm("================ GAME OVER ================ \n Cliquez sur OK pour rejouer \n Cliquez sur Annuler pour revenir à l'accueil")) {
            document.location.reload();
            clearInterval(1); // Needed for Chrome to end game
        } else {
            document.location.href = "/index.html";
        }
    }*/

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
        case 37: //Gauche
            if (posBarreX > 0) {
                posBarreX -= 60;
            }
            break;
        case 39: //Droite
            if (posBarreX + longBarre < canvas.width) {
                posBarreX += 60;
            }
            break;
        case 80: //Touche p
            pause();
            break;
    }
}

//Fonction controle souris
function mouseMoveHandler(e) {
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

//Fonction controle tactile
function touchHandler(e) {
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

function collision() {
    for (var i = 0; i < nbColonne; i++) {
        for (var j = 0; j < nbLigne; j++) {
            var briqueX = (i * (largeur_brique + espace_brique)) + (marge_gauche_brique);
            var briqueY = (j * (hauteur_brique + espace_brique)) + (marge_haut_brique);
            var changerDirection = false;
            var changerDirectionY = false;
            if ((((posBalleY >= briqueY) && (posBalleY <= (briqueY + hauteur_brique)))
                || (((posBalleY + (diam / 2)) >= briqueY) && ((posBalleY + (diam / 2)) <= (briqueY + hauteur_brique)))
                || (((posBalleY - (diam / 2)) >= briqueY) && ((posBalleY - (diam / 2)) <= (briqueY + hauteur_brique))))
                && ((((posBalleX + (diam / 2)) >= briqueX) && (posBalleX + (diam / 2)) <= briqueX + largeur_brique)
                    || (((posBalleX + (diam / 2)) >= briqueX) && (posBalleX - (diam / 2)) <= (briqueX + largeur_brique)))) {
                if ((((posBalleX >= briqueX) && (posBalleX <= (briqueX + largeur_brique)))
                    || (((posBalleX + (diam / 2)) >= briqueX) && ((posBalleX + (diam / 2)) <= (briqueX + largeur_brique)))
                    || (((posBalleX - (diam / 2)) >= briqueX) && ((posBalleX - (diam / 2)) <= (briqueX + largeur_brique))))
                    && (((posBalleY + (diam / 2)) == briqueY) || ((posBalleY - (diam / 2)) == (briqueY + hauteur_brique)))) {
                    changerDirectionY = true;
                    changerDirection = true;
                } else {
                    changerDirectionY = false;
                    changerDirection = true;
                }
            }
            if (changerDirection == true) {
                if (tableauBrique[i][j] >= 1) {
                    if (changerDirectionY == true) {
                        posBalleY += moveY;
                        moveY = -moveY;
                    } else {
                        posBalleX += moveX;
                        moveX = -moveX;
                    }
                    if (tableauBrique[i][j] == 1) {
                        typeBonus = Math.floor(Math.random() * 3 + 1)
                        posBonusX = briqueX + largeur_brique / 4;
                        posBonusY = briqueY + hauteur_brique / 2;
                        nbBonus = nbBonus + 1;
                        drawBonus();
                    }
                    tableauBrique[i][j] = 0;
                    score++;
                    changerDirection = false;
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

function collisionBonus() {
    if (posBonusX >= posBarreX && posBonusX <= (posBarreX + longBarre) || (posBonusX + longBonus) >= posBarreX && (posBonusX + longBonus) <= (posBarreX + longBarre)) {
        if (posBonusY + hautBonus > posBarreY && posBonusY < posBarreY + hautBarre) {
            effacerBonus();
            bonus();
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
    } else if (min < 10) {
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
    ctx.fillText("x :" + posBalleX + " | y : " + posBalleY, canvas.width - 150, canvas.height - 10);
    ctx.fillText("Vitesse balle x :" + moveX + " | Vitesse balle y : " + moveY, 10, canvas.height - 10);
}

function drawBonus() {
    ctx.beginPath();
    switch (typeBonus) {
        case 1:
            ctx.fillStyle = "#00FFFF";
            ctx.strokeStyle = "#00FFFF";
            break;
        case 2:
            ctx.fillStyle = "#FF00FF";
            ctx.strokeStyle = "#FF00FF";
            break;
        case 3:
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
            break
        default:
            ctx.fillStyle = "#F0FFFF";
            ctx.strokeStyle = "#F0FFFF";
    }

    ctx.fillRect(posBonusX, posBonusY, longBonus, hautBonus);
    posBonusY = posBonusY + 4;
    ctx.stroke();
    ctx.fill();
    collisionBonus();
    if (posBonusY >= canvas.height) {
        effacerBonus();
    }
}

function effacerBonus() {
    posBonusX = -500;
    posBonusY = -500;
    nbBonus = nbBonus - 1;
}

function bonus() {
    if (bonusTime) {
        endBonus = new Date();
        diffBonus = endBonus - startBonus;
        diffBonus = new Date(diffBonus);
        var sec = diffBonus.getSeconds();

    } else {
        startBonus = new Date();
        endBonus = 0;
        diffBonus = 0;

    }

    switch (typeBonus) {
        case 1: //Balle Plus grande
            malus = Math.floor(Math.random() * 2);
            if (malus == 1) {
                diam = diam / 1.5;
            } else {
                diam = diam * 1.5;
            }
            break;
        case 2: //Paddle plus grand
            malus = Math.floor(Math.random() * 2)
            if (malus == 1) {
                longBarre = longBarre / 1.5;
            } else {
                longBarre = longBarre * 1.5;
            }
            break;
        case 3: //Nouvelle balle
            if (bonusTime == false) {
                bonusTime = true;
            }
            if (sec > 5) {
                bonusTime = false;
            }
            break
        default:

    }
}


function draw() {
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

    if (nbBonus >= 1) {
        drawBonus();
    }

    chronometre();
    if (bonusTime) {
        bonus();
    }
}
setInterval(draw, 10);
requestAnimationFrame(draw);