/**
 * @author Timothé LANNUZEL et William PENSEC
 * @version 1.0
 * @date 27/11/2019
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
var nbColomne = 10;
var espace_brique = 6;
var marge_gauche_brique = 15;
var marge_haut_brique = 10;
var largeur_brique = (canvas.width) / (nbColomne + (espace_brique * nbColomne)/150);
var hauteur_brique = (canvas.height) / (nbLigne * 4);
var tableauBrique = [];
for (var i = 0; i < nbColomne; i++) {
    tableauBrique[i] = [];
    for (var j = 0; j < nbLigne; j++) {
        tableauBrique[i][j] = 1;
    }
}

/* Vérification si on a gagné */
var score = 0;
nbBriqueRestante = nbColomne * nbLigne;

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
    if (window.confirm("================ GAGNÉ ================ \n Cliquez sur OK pour rejouer \n Cliquez sur Annuler pour revenir à l'accueil")) {
        document.location.reload();
        clearInterval(10); // Needed for Chrome to end game
    } else {
        document.location.href = "/index.html";
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
    for(var i = 0; i < nbColomne; i++){
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

    if (posBalleY + diam >= canvas.height) {
        console.log("YOU DIE");
        /*if (window.confirm("================ GAME OVER ================ \n Cliquez sur OK pour rejouer \n Cliquez sur Annuler pour revenir à l'accueil")) {
            document.location.reload();
            clearInterval(1); // Needed for Chrome to end game
        } else {
            document.location.href = "/index.html";
        }*/
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
        case 37: //Gauche
            if (posBarreX > 0) {
                posBarreX -= 40;
            }
            break;
        case 39: //Droite
            if (posBarreX + longBarre < canvas.width) {
                posBarreX += 40;
            }
            break;
        case 80: //Touche p
            pause();
            break;
    }
}

//Fonction controle souris
function mouseMoveHandler(e) {
    var positionSourisX = e.clientX - canvas.offsetLeft;
    if (positionSourisX > 0 && positionSourisX < canvas.width) {
        posBarreX = positionSourisX - longBarre / 2;
    }
}

//Fonction controle tactile
function touchHandler(e) {
    if (e.touches) {
        if (e.touches[0].clientX > 0 && e.touches[0].clientX < canvas.width) {
            posBarreX = e.touches[0].clientX - longBarre / 2;
        }
    }
}

function collision() {
    for (var i = 0; i < nbColomne; i++) {
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

function drawText() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("x :" + posBalleX + " | y : " + posBalleY, canvas.width - 150, canvas.height - 10);
    ctx.fillText("Vitesse balle x :" + moveX + " | Vitesse balle y : " + moveY, 10, canvas.height - 10);
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
}
setInterval(draw, 10);
requestAnimationFrame(draw);