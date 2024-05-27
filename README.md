# Bubble Pop Game

## Contexto
El videojuego desarrollado es un juego de tipo casual donde el jugador interactúa con burbujas que se mueven en la pantalla. El entorno está ambientado con gráficos y sonidos que buscan crear una experiencia divertida y relajante. La jugabilidad se centra en hacer clic en burbujas que se mueven hacia la parte superior de la pantalla para ganar puntos. El juego tiene una mecánica de niveles donde la dificultad aumenta progresivamente.

## Objetivo
El objetivo principal del videojuego es alcanzar la mayor puntuación posible haciendo clic en las burbujas que aparecen en la pantalla antes de que desaparezcan. A medida que el jugador avanza, los niveles incrementan la velocidad de las burbujas, lo que aumenta la dificultad del juego. Además, hay diferentes tipos de burbujas que afectan la puntuación del jugador de manera distinta.

## Justificación
La creación de este videojuego está justificada por varios motivos:
1. **Entretenimiento**: Proporcionar una actividad lúdica y relajante para los usuarios que buscan un juego sencillo pero adictivo.
2. **Desarrollo de habilidades**: Mejorar la coordinación mano-ojo y los reflejos del jugador al requerir clics precisos y rápidos.
3. **Educativo**: Introducir conceptos básicos de programación gráfica y animación en canvas para estudiantes y desarrolladores principiantes.
4. **Accesibilidad**: Crear un juego que sea fácil de entender y jugar para personas de todas las edades.
5. **Portabilidad**: Al estar desarrollado en JavaScript y HTML5 Canvas, el juego puede ejecutarse en cualquier navegador moderno, sin necesidad de instalaciones adicionales.

## Operación

### Configuración Inicial
- **HTML**: Se define un lienzo (canvas) donde se dibujan las burbujas, y se incluye un elemento de audio para la música de fondo.
- **JavaScript**: Se configura el contexto de renderizado del lienzo y se cargan las imágenes y los sonidos necesarios.

### Jugabilidad

1. **Inicio del Juego**:
   - El jugador abre la página y el juego comienza automáticamente después de que todas las imágenes y sonidos se han cargado.
   - La música de fondo comienza a reproducirse de manera continua.
2. **Interacción del Jugador**:
   - El jugador utiliza el cursor para hacer clic en las burbujas que se mueven hacia arriba.
   - Cada burbuja clickeada desaparece y afecta la puntuación del jugador según su tipo.
     - Burbuja pequeña: Aumenta la puntuación.
     - Burbuja grande: Disminuye la puntuación.
3. **Niveles y Dificultad**:
   - El juego incrementa el nivel cada 15 segundos.
   - Con cada nuevo nivel, la velocidad de las burbujas aumenta, haciendo el juego más desafiante.
4. **Fin del Juego**:
   - No hay un estado explícito de "fin del juego". El juego puede continuar indefinidamente mientras el jugador siga clickeando burbujas.
   - La puntuación más alta se guarda en localStorage y se muestra al jugador.

### Actualización y Renderizado
- **Función `updateCircles`**: Es la función principal que se llama repetidamente para actualizar la posición de las burbujas y redibujar el lienzo. Utiliza `requestAnimationFrame` para mantener una animación fluida.
- **Interacciones del Usuario**: El evento de clic en el lienzo se utiliza para detectar y manejar clics en las burbujas, actualizar la puntuación y reproducir el sonido de clic.

### Funciones y Clases Principales
- **Clase `Circle`**: Define las propiedades y comportamientos de cada burbuja, incluyendo su movimiento, detección de colisiones y dibujo en el lienzo.
- **Funciones de Utilidad**:
  - `createCircles(image)`: Genera un conjunto de burbujas con una imagen específica.
  - `getDistance(x1, x2, y1, y2)`: Calcula la distancia entre dos puntos, útil para la detección de colisiones.

### Audio y Gráficos
- **Música de Fondo**: Se reproduce en bucle y se controla para asegurar que siga sonando incluso si la página se recarga.
- **Sonidos de Interacción**: Se reproducen cuando el jugador hace clic en una burbuja.
- **Gráficos**: Utiliza imágenes para las burbujas y el fondo, proporcionando una experiencia visual atractiva.

---

¡Disfruta jugando y mejorando tus habilidades con Bubble Pop Game!
