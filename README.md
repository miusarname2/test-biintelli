
# VIAJE POR COLOMBIA API REST

# Ejecución de VIAJE POR COLOMBIA API REST:

Como se mencionó previamente, la empresa VIAJE POR COLOMBIA busca una solución que permita conectar viajes en todo el mundo. Este proyecto debe recibir como entrada el origen y el destino del viaje del usuario. Luego, el sistema debe consultar todos las rutas asociados disponibles y determinar si es posible trazar una ruta de viaje. En caso afirmativo, se debe proporcionar al usuario la ruta calculada; de lo contrario, se emitirá un mensaje indicando que la ruta no puede ser calculada, pero puedes empezar a usarlo ya mismo, en `test-biintelli.onrender.com` esta ya corriendo el servidor desplegado, puedes ir a `test-biintelli.onrender.com/api-docs` a probarlo ya mismo, pero deberas esperar a que inicie, normalmente dura entre 5 y 60 segundo.

## Tabla de Contenidos:

* [Estructura del Proyecto](#1.Estructura-del-Proyecto)
* [Requisitos](#requisitos)
* [Instalación](#instalaci%C3%B3n)
* [Uso](#uso)
* [Contribuir](#contribuir)
* [Licencia](#licencia)

## 1. Uso rapido...

Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación y al Swagger UI visitando la ruta `/api-docs`. Aquí encontrarás la documentación detallada de las rutas disponibles junto con ejemplos de uso.

## 2.Estructura del Proyecto:

La estructura del proyecto sigue una organización basada en la arquitectura hexagonal o arquitectura Onion. A continuación, se muestra la estructura de carpetas del proyecto:

```
|-- app/
|   |-- Journey/
|   |   |-- aplication/
|   |   |   |-- journey.controller.ts
|   |   |   |-- journey.routes.ts
|   |   |-- domain/
|   |   |   |-- dto/
|   |   |   |   |-- journey.model.ts
|   |   |   |-- storage/
|   |   |   |   |-- journey.ts
|   |   |-- infrastructure/
|   |   |   |-- config/
|   |   |   |   |-- RateLimit.ts
|   |   |   |-- database/
|   |   |   |   |-- connection.ts
|   |   |   |-- repository/
|   |   |   |   |-- journey.ts
|   |   |   |   |-- data.ts
|-- auth/
|   |-- JWT.js
|-- prisma/
|   |-- migrations/
|   |   |-- schemas.mongodb
|   |-- schema.prisma
|-- readme.md
|-- LICENSE
|-- package.json
|-- .gitignore
|-- index.ts
|-- .env.exmple
|-- tsconfig.json
```

## Modelo Base de Datos

A continuación se presenta el modelo base de datos utilizado en el proyecto:

```prisma

model Journey_Flight {
  id       Int      @id @default(autoincrement())
  journey  Journey  @relation(fields: [journeyId], references: [id])
  flight   Flight   @relation(fields: [flightId], references: [id])
  journeyId Int
  flightId Int
}

model Journey {
  id Int @id @default(autoincrement())
  Origin String
  Destination String
  price Decimal
  flights Journey_Flight[]
}

model Transport{
  id Int @id @default(autoincrement())
  FlightCarrier String
  FlightNumber String
  Flights Flight[]
}

model Flight{
  id Int @id @default(autoincrement())
  Origin String
  Destination String
  price Decimal
  transportId Int
  journeys Journey_Flight[]
  transport Transport @relation(fields: [transportId], references: [id])
}
```


## 3.Requisitos:

Los requisitos para la ejecución de VIAJE POR COLOMBIA API REST son los siguientes:

* Node.js bajo la versión (v18.16.1), esta la puedes instalar desde ([https://nodejs.org/en/download](https://nodejs.org/en/download)).
 Además, para la base de datos, puedes optar por MySQL si prefieres una base de datos local. La conexión a nuestra base de datos personal ya está configurada en las variables de entorno, pero hemos dejado un archivo de ejemplo `.env.example` para referencia."

## 4.Instalación:

* Clonamos el repositorio en la carpeta que se desee, para hacerlo mas sencillo puedes entrar a la carpeta donde quieras alojar el proyecto y ahí abres la terminal directamente y ejecutas el siguiente comando:

  ```
  git clone https://github.com/miusarname2/test-biintelli
  ```
* Si quieres hacerlo aún mas sencillo puedes utilizar la extensión "Git Graph" y directamente clonas el repositorio después que tengas las credenciales sincronizadas con tu Github, clicando en el apartado clonar repositorio y pegas lo siguiente `https://github.com/miusarname2/test-biintelli` y procedes a ubicar el repositorio donde mas desees.
* Luego de esto abriremos la terminal clicando en la parte superior del Visual Studio Code en el apartado "Terminal" y luego "New Terminal", ahí ejecutaremos el comando `npm update` o `npm install`descargar todas las dependencias previamente establecidas en el archivo "package.json".

  **NOTA MUY IMPORTANTE: **Recuerda que el archivo de ejemplo ".env.example" deberás renombrarlo borrando el ".example" y quedará ".env" para que la dependencia "dotenv" pueda acceder a las variables de entorno, recomendamos realizar todas estas pruebas conectadas a nuestro servidor de MySQL para evitar conflictos y si deseas cambiar el puerto,solo debes ir al archivo .env y cambiar la variable de entorno `PORT` o a las variables de entorno de tu sistema y cambiar la variable de entorno `PORT`  recuerda que en la consola obtendrás la nueva ruta para que procedas a copiarla e ingresarla en el "Thunder Client" o  "Postman",si deseas utilizar alguno de estos, pero recuerda que swagger esta en `http://localhost:<tu_puerto>/api-docs/`.

  Si no cambias el nombre del archivo `.env.example` a `.env`, te mostara algo como esto:

    ```bash
  [1]
  [1] PrismaClientInitializationError: error: Environment variable not found: DATABASE_URL.
  [1]   -->  schema.prisma:13
  [1]    |
  [1] 12 |   provider = "mysql"
  [1] 13 |   url      = env("DATABASE_URL")
  [1]    |
  [1]
  [1] Validation Error Count: 1
  [1]     at r (C:\Users\Oscar Alvarez\Desktop\Rima-Backend-Public-\node_modules\@prisma\client\runtime\library.js:113:2493) {
  [1]   clientVersion: '5.10.2',
  [1]   errorCode: 'P1012'
  [1] }
  [1]
  [1] Node.js v21.6.1
  ``` 

asi que recomentamos hacerlo,para que funcione satisfactoriamente

**Nota Importante** :Si deseas cambiar la configuración y usar una base de datos local o una base de datos MySQL diferente a la que te envié, lo que debes hacer es reemplazar la variable de entorno `DATABASE_URL` y ponerle como valor el string de conexión para la base de datos. Luego de eso, ejecuta las migraciones con `npx prisma migrate reset` para que se hagan las migraciones a la base de datos.

* Por ultimo iniciaremos el servidor con el comando en terminal `npm run dev`, esto inicializará nuestro servidor y podremos visualizar en que ruta y puerto esta el servidor de node en la consola para al hacer uso de ellas en las consultas debes ir a swagger que esta en `http://localhost:<tu_puerto>/api-docs/` . Un ejemplo de lo que deberiamos ver en consola es lo siguiente:


  ```bash
  10:16:50 - Starting compilation in watch mode...
  [0]
  [0]
  [0] 10:17:06 - Found 0 errors. Watching for file changes.
  [1] ilugrflawgvfcisadifasgdiyfg
  [1] ⚡️[server]: Server is running at http://localhost:3000
  ```


## 5.Uso:

A continuación observaremos cuales son todas la consultas disponibles en esta API:


#### 5.1 Consultar "tk":

* **Endpoint** : `/tk`
* **Método HTTP** : POST
* **Descripción** : Generador de token y login de la base de la API.
* **Ejecución:** Para su ejecución debemos ingresar el rol por el "Body", entonces iremos a nuestra extensión "Thunder Client", clicaremos en "New Request" y procedemos a ingresar la siguiente data donde dice `https://www.thunderclient.com/welcome` borraremos esa dirección y agregaremos la siguiente dirección y cambias el predeterminado "GET" por "POST", luego de eso deberás agregar en los "Headers" en el apartado vacío "header".
* Ejemplo del contenido correspondiente en la ruta:

```bash
http://localhost:3000/tk
```

* Ejemplo del contenido correspondiente en body:

```json
{
  "role":"admin"
}
```

* Clicaremos en Send y obtendremos una respuesta similar a esta, ejemplo de respuesta del servidor:

```json
{
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDk5OTk4MzksImV4cCI6MTcxMDAwMzQzOX0.h0GVX5_KA1wwM-a5NZzYCUROGKlNX6z73jVOCasWKxg"
}
```

* Ahora debemos en el apartado "Headers" de nuevo y añadir un "header" llamado "Authorization" y en "value" todo el contenido del "token", sólo el texto, sin las comillas, de tal modo que quede algo asi `Bearer <token>`

A partir de ahora podemos empezar con las consultas.


#### 5.2 Consultar "journey":

* **Endpoint** : `/journey`
* **Método HTTP** : POST
* **Descripción** : Obtiene y consulta los vuelos o las rutas para hacer un viaje, tiene un limite de 50000 consultas/hora.
* **Ejecución:** Para su ejecución debemos ingresar `"Origin", "Destination"` por el "Body", entonces iremos a nuestra extensión "Thunder Client", clicaremos en "New Request" y procedemos a ingresar la siguiente data donde dice `https://www.thunderclient.com/welcome` borraremos esa dirección y agregaremos la siguiente dirección y cambias el predeterminado "GET" por "POST", luego de eso deberás agregar en los "Headers" en el apartado vacío "header" la frase "Authorization" y poner en value el token que te dio `/tk`, es decir esto `Bearer <token>`

* Ejemplo del contenido correspondiente en la ruta:

```bash
http://localhost:3000/journey
```

* Ejemplo del contenido correspondiente en body:

```json
{
  "Origin": "BGA",
  "Destination": "BTA"
}
```

* Clicaremos en Send y obtendremos una respuesta similar a esta, ejemplo de respuesta del servidor:

```json
[
  {
    "id": 2,
    "Origin": "BGA",
    "Destination": "BTA",
    "price": "1000"
  },
  {
    "id": 3,
    "Origin": "BTA",
    "Destination": "BGA",
    "price": "1200"
  }
]
```

Listo, ahora obtenido una ruta,simpre que existan viajes directo de ida y de regreso,siempre te dara solo los viajes directos, continuemos con la guía.

