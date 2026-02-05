# Pokémon Application 

Aplicación web completa para gestionar Pokémon, entrenadoras, equipos y encuentros. Construida con Spring Boot en el backend y HTML5/CSS3/JavaScript en el frontend.

# Descripción

Esta es una aplicación full-stack que permite:
- Gestionar Pokémon (crear, leer, actualizar, eliminar)
- Administrar entrenadoras y sus datos
- Crear y organizar equipos de Pokémon
- Registrar encuentros entre entrenadoras
- Interfaz web intuitiva y responsive

## Tecnologías Utilizadas

# Backend
- **Java** - Lenguaje de programación principal
- **Spring Boot** - Framework para aplicaciones Java
- **Spring Data JPA** - Acceso a datos
- **Maven** - Gestor de dependencias

# Frontend
- **HTML5** - Estructura de la aplicación
- **CSS3** - Estilos y responsive design
- **JavaScript** - Lógica interactiva del cliente
- **Fetch API** - Comunicación con el backend

##  Estructura del Proyecto

```
├── Backend/
│   └── pokemon-backend/          # Aplicación Spring Boot
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/api/
│       │   │   │   ├── controller/       # Controladores REST
│       │   │   │   ├── model/            # Modelos de datos
│       │   │   │   ├── repository/       # Acceso a datos
│       │   │   │   └── service/          # Lógica de negocio
│       │   │   └── resources/            # Configuración
│       │   └── test/                     # Pruebas unitarias
│       ├── pom.xml                       # Configuración de Maven
│       └── mvnw                          # Maven Wrapper
│
├── Frontend/                     # Aplicación web
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── Fuentes/                 # Archivos de fuentes
│   └── Imagenes/                # Recursos de imágenes
│
└── README.md                     # Este archivo
```

## Entidades Principales

# Pokemon
- ID
- Nombre
- Tipo
- Nivel
- Vida (HP)
- Ataque
- Defensa

# Entrenador
- ID
- Nombre
- Edad
- Nivel de experiencia
- Insignias

# Equipo
- ID
- Nombre
- Entrenadora asociada
- Lista de Pokémon (máximo 6)

# Encuentro
- ID
- Entrenadoras participantes
- Equipos enfrentados
- Resultado
- Fecha

# Requisitos Previos

- **Java 11+** o superior
- **Maven 3.6+**
- Un navegador web moderno (Chrome, Firefox, Edge, Safari)
- **Base de datos** (configurar según application.properties)

# Instalación

### 1. Clonar o descargar el repositorio

```bash
cd Backend/pokemon-backend
```

# 2. Compilar el Backend

```bash
# Con Maven Wrapper en Windows
mvnw.cmd clean install

# Con Maven Wrapper en Linux/Mac
./mvnw clean install
```

# 3. Configurar la Base de Datos

Editar el archivo `Backend/pokemon-backend/src/main/resources/application.properties` con los datos de conexión de tu base de datos:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pokemon_db
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

# 4. Ejecutar el Servidor Backend

```bash
mvnw.cmd spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`

# Ejecutar el Frontend

1. Navegar a la carpeta `Frontend/`
2. Abrir `index.html` en un navegador web
3. O servir con un servidor local (recomendado para desarrollo):

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npm install -g http-server)
http-server
```

Acceder a `http://localhost:8000`

## Endpoints de la API

# Pokémon
- `GET /api/pokemon` - Obtener todos los Pokémon
- `GET /api/pokemon/{id}` - Obtener Pokémon por ID
- `POST /api/pokemon` - Crear nuevo Pokémon
- `PUT /api/pokemon/{id}` - Actualizar Pokémon
- `DELETE /api/pokemon/{id}` - Eliminar Pokémon

# Entrenadoras
- `GET /api/entrenador` - Obtener todas las entrenadoras
- `GET /api/entrenador/{id}` - Obtener entrenadoras por ID
- `POST /api/entrenador` - Crear nueva entrenadoras
- `PUT /api/entrenador/{id}` - Actualizar entrenadoras
- `DELETE /api/entrenador/{id}` - Eliminar entrenadoras

# Equipos
- `GET /api/equipo` - Obtener todos los equipos
- `GET /api/equipo/{id}` - Obtener equipo por ID
- `POST /api/equipo` - Crear nuevo equipo
- `PUT /api/equipo/{id}` - Actualizar equipo
- `DELETE /api/equipo/{id}` - Eliminar equipo

# Encuentros
- `GET /api/encuentro` - Obtener todos los encuentros
- `GET /api/encuentro/{id}` - Obtener encuentro por ID
- `POST /api/encuentro` - Crear nuevo encuentro
- `PUT /api/encuentro/{id}` - Actualizar encuentro
- `DELETE /api/encuentro/{id}` - Eliminar encuentro

# Pruebas

Ejecutar las pruebas unitarias:

```bash
mvnw.cmd test
```

# Solución de Problemas

## El puerto 8080 ya está en uso
Cambiar el puerto en `application.properties`:
```properties
server.port=8081
```

## Errores de conexión a la base de datos
- Verificar que el servicio de base de datos está ejecutándose
- Validar credenciales en `application.properties`
- Confirmar que la base de datos existe

## CORS errors en el frontend
Asegurar que el backend tiene CORS habilitado para acepta peticiones desde la URL del frontend

## Notas de Desarrollo

- El backend utiliza arquitectura MVC con capas de Controller, Service y Repository
- El frontend se comunica con el backend mediante peticiones HTTP (Fetch API)
- Las transacciones se manejan a través de las anotaciones de Spring

**Última actualización:** Febrero 2026

¿Preguntas? ¡Abre un issue en el repositorio!
