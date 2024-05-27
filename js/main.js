const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_height = 500; // Altura del lienzo
const window_width = 700; // Anchura del lienzo

canvas.height = window_height;
canvas.width = window_width;

// Imagen de fondo
const backgroundImage = new Image();
backgroundImage.src = 'FondoBob.jpeg';

// Imagen de la burbuja
const bubbleImage = new Image();
bubbleImage.src = 'BurbujaS.png';

// Imagen de la burbuja para los nuevos círculos
const newBubbleImage = new Image();
newBubbleImage.src = 'BurbujaL.png';

// Sonido cuando se hace clic en un círculo
const clickSound = new Audio('BurbujaExplota.wav');

// Esperar a que la página y todos sus recursos estén completamente cargados antes de ejecutar el script
window.onload = function() {
    const backgroundAudio = document.getElementById("backgroundAudio");
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");

    playButton.addEventListener("click", function() {
        backgroundAudio.currentTime = 0; // Reiniciar la reproducción desde el principio
        backgroundAudio.play().catch(error => {
            console.error("Error al reproducir el audio:", error);
        });
    });

    pauseButton.addEventListener("click", function() {
        backgroundAudio.pause();
    });

    // Reproducir el audio principal al cargar la página
    backgroundAudio.currentTime = 0; // Reiniciar la reproducción desde el principio
    backgroundAudio.play().catch(error => {
        console.error("Error al reproducir el audio:", error);
    });
};


// Cambiar el cursor cuando el ratón entra en el lienzo
canvas.addEventListener("mouseenter", () => {
    canvas.style.cursor = "url('Lapiz.png') 16 16, auto"; // Especifica las coordenadas del hotspot del cursor
});

// Restaurar el cursor cuando el ratón sale del lienzo
canvas.addEventListener("mouseleave", () => {
    canvas.style.cursor = "auto";
});

// Puntuación y nivel
let score = 0;
let level = 1;
let timeToNextLevel = 15000; // 15 segundos
let lastTime = Date.now();
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const levelElement = document.getElementById("level");

// Recuperar la puntuación más alta de localStorage
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerText = `Puntuación más alta: ${highScore}`;

class Circle {
    constructor(x, y, radius, text, image) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.text = text;
        this.speed = 1; // Velocidad inicial fija a 1
        this.dx = (Math.random() - 0.5) * 2 * this.speed; // Dirección horizontal aleatoria (-1 o 1) multiplicada por la velocidad
        this.dy = -Math.random() * this.speed; // Dirección vertical hacia arriba con velocidad aleatoria
        this.visible = true;
        this.image = image; // Asignar la imagen específica para este círculo
    }

    draw() {
        if (!this.visible) return;

        // Dibujar la imagen del círculo
        ctx.drawImage(this.image, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);

        // Dibujar el número en el centro del círculo
        ctx.fillStyle = "#fff"; // Color blanco para el número
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px Arial";
        ctx.fillText(this.text, this.posX, this.posY);
    }

    update(circles) {
        if (!this.visible) return;

        this.draw();

        this.posX += this.dx; // Mover en el eje X
        this.posY += this.dy; // Mover en el eje Y

        // Rebotar en los bordes laterales
        if (this.posX + this.radius >= window_width || this.posX - this.radius <= 0) {
            this.dx = -this.dx; // Invertir la dirección horizontal al chocar con los bordes laterales
        }

        // Rebotar con otros círculos y ajustar posición para evitar solapamiento
        for (let otherCircle of circles) {
            if (this !== otherCircle && otherCircle.visible) {
                let distance = getDistance(this.posX, otherCircle.posX, this.posY, otherCircle.posY);
                if (distance < this.radius + otherCircle.radius) {
                    let angle = Math.atan2(otherCircle.posY - this.posY, otherCircle.posX - this.posX);
                    let overlap = this.radius + otherCircle.radius - distance + 1;

                    // Calcular nuevos componentes de velocidad después del choque
                    let u1 = this.dx;
                    let v1 = this.dy;
                    let u2 = otherCircle.dx;
                    let v2 = otherCircle.dy;

                    // Intercambiar velocidades después del choque (rebote elástico)
                    this.dx = u2;
                    this.dy = v2;
                    otherCircle.dx = u1;
                    otherCircle.dy = v1;

                    // Mover los círculos para evitar solapamiento
                    this.posX -= overlap * Math.cos(angle);
                    this.posY -= overlap * Math.sin(angle);
                    otherCircle.posX += overlap * Math.cos(angle);
                    otherCircle.posY += overlap * Math.sin(angle);
                }
            }
        }

        // Desaparecer al llegar al borde superior
        if (this.posY - this.radius <= 0) {
            this.visible = false;
        }
    }

    containsPoint(x, y) {
        // Utilizar la fórmula del teorema de Pitágoras (distancia al cuadrado) para determinar si el punto (x, y) está dentro del círculo
        let dx = x - this.posX;
        let dy = y - this.posY;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }

    increaseSpeed(level) {
        this.dx *= (level + 1); // Incrementar la velocidad horizontal según el nivel
        this.dy *= (level + 1); // Incrementar la velocidad vertical según el nivel
    }
}

function getDistance(x1, x2, y1, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

let circles = [];

// Función para crear círculos
function createCircles(image) {
    let newCircles = [];
    for (let i = 0; i < 20; i++) {
        let radius = Math.random() * 50 + 20; // Radio entre 20 y 70
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = window_height + radius + i * 50; // Posición debajo de la pantalla, incrementando el espacio vertical
        let text = (i + 1).toString(); // Números del 1 al 20

        let circle = new Circle(x, y, radius, "", image);
        newCircles.push(circle);
    }
    return newCircles;
}

// Crear círculos con la primera imagen
circles = circles.concat(createCircles(bubbleImage));

// Crear círculos con la segunda imagen
circles = circles.concat(createCircles(newBubbleImage));

canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    // Verificar si el clic está dentro de algún círculo visible
    for (let circle of circles) {
        if (circle.visible && circle.containsPoint(mouseX, mouseY)) {
            circle.visible = false; // Hacer que el círculo sea invisible al hacer clic sobre él
            clickSound.play(); // Reproducir el sonido de clic
            if (circle.image === bubbleImage) {
                score += 1; // Puntos positivos
            } else if (circle.image === newBubbleImage) {
                score -= 1; // Puntos negativos
                scoreElement.style.color = "red"; // Cambiar color de la puntuación a rojo
            }
            scoreElement.innerText = `Puntuación: ${score}`;
            console.log(`Clicked Circle ${circle.text} at (${circle.posX.toFixed(1)}, ${circle.posY.toFixed(1)})`);
            break; // Salir del bucle una vez que se ha encontrado el círculo clickeado
        }
    }

    // Restablecer el color de la puntuación si es positivo
    if (score >= 0) {
        scoreElement.style.color = "black";
    }

    // Actualizar la puntuación más alta si es necesario
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreElement.innerText = `Puntuación más alta: ${highScore}`;
    }
});

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, window_width, window_height);
}

function updateCircles() {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);

    drawBackground(); // Dibujar el fondo antes de los círculos

    // Actualizar y dibujar los círculos
    for (let circle of circles) {
        circle.update(circles);
    }

    // Incrementar el nivel cada 15 segundos
    let currentTime = Date.now();
    if (currentTime - lastTime > timeToNextLevel) {
        level++;
        lastTime = currentTime;
        timeToNextLevel = 15000; // Reiniciar el tiempo para el siguiente nivel
        levelElement.innerText = `Nivel: ${level}`;
        alert(`Nivel ${level}`); // Mostrar una alerta indicando el nuevo nivel

        // Crear de nuevo los círculos para el siguiente nivel
        circles = createCircles(bubbleImage).concat(createCircles(newBubbleImage));

        for (let circle of circles) {
            circle.increaseSpeed(level);
        }
    }
}

// Esperar a que las imágenes se carguen antes de iniciar la animación
backgroundImage.onload = function() {
    updateCircles();
};

bubbleImage.onload = function() {
    updateCircles();
};

newBubbleImage.onload = function() {
    updateCircles();
};

// Verificar si las imágenes ya están cargadas (por si se cargan instantáneamente)
if (backgroundImage.complete && bubbleImage.complete && newBubbleImage.complete) {
    updateCircles();
}

document.addEventListener("DOMContentLoaded", function() {
    const backgroundAudio = document.getElementById("backgroundAudio");
    backgroundAudio.play();
});

document.addEventListener("DOMContentLoaded", function() {
    const backgroundAudio = document.getElementById("backgroundAudio");
    const toggleAudioButton = document.getElementById("toggleAudioButton");

    toggleAudioButton.addEventListener("click", function() {
        // Si el audio está pausado, iniciar la reproducción
        if (backgroundAudio.paused) {
            backgroundAudio.play().catch(error => {
                console.error("Error al reproducir el audio:", error);
            });
            toggleAudioButton.textContent = "Pausar"; // Cambiar el texto del botón a "Pausar"
        } else { // Si el audio está reproduciéndose, pausarlo
            backgroundAudio.pause();
            toggleAudioButton.textContent = "Reproducir"; // Cambiar el texto del botón a "Reproducir"
        }
    });
});
