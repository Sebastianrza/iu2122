# iu2122

Servidor y código de plantilla para una interfaz de gestión de valoraciones de películas, a usar para las prácticas de la asignatura *Interfaces de Usuario* de los grados de Informática de la Universidad Complutense, en su edición 2021-22.

## Componentes Grupo 1

- Ana Martínez Sabiote 
- Eladia Gómez Morales 
- Ignacio Urretavizcaya Tato 
- Javier Rodríguez-Avello Tapias 
- Sebastián Rafael Zambrano Azuaje 


## Cambios realizados

### Funcionalidades incluidas

Acciones sobre películas:
- Añadir película
- Editar película
- Eliminar película
- Buscar película por título.

Acciones sobre usuarios:
- Añadir usuario
- Editar usuario
- Eliminar usuario

Acciones sobre grupos:
- Añadir grupo
- Editar grupo
- Eliminar grupo

Acciones sobre ratings:
- Añadir valoración 
- Editar valoración

Acciones sobre requests:
- Hacer request de un usuario a un grupo.

Login:
- Iniciar sesión e identificar si se trata de un usuario o un administrador.
- Ocultar funcionalidades que no están disponibles para usuarios.

### Funcionalidades que faltan/por terminar

En el apartado de las peticiones queda pendiente ajustar la funcionalidad de crear una nueva solicitud, ya que en el estado actual se permite a un usuario solicitar unirse a un grupo en el que ya está presente. Por otro lado, también es necesario implementar la posibilidad de manejar las solicitudes, tanto para aceptar como para rechazar.


### Cambios con respecto a la practica 5 (prototipo)

En el prototipo solo había dos pestañas entre las que interactuar, siendo estas las de películas y grupos, mientras que en esta práctica hemos añadido una tercera que hace referencia a los usuarios dados de alta en el sistema.

En el apartado de películas, primeramente a la hora de buscar una película solo se busca a través del título, cuando en el prototipo se hacía con bastantes filtros que no se van a implementar en esta versión. Por otra parte, en el prototipo las películas aparecían en una lista con múltiples filas y columnas, mientras que en la implementación se trata de tan solo una columna. Además, en la práctica 5 no estaba la posibilidad desde la lista de películas de modificar, valorar o eliminar película, cosa que sí aparece en esta prácrica.

Por último, en la pestaña de grupos, se han unificado las posibilidades que ofrecíamos en el prototipo en la pantalla principal de grupos(solicitar) y gestionar grupos (modificar y eliminar) en una lista donde aparecen los tres botones desde el principio. Las solicitudes pendientes únicamente eran accesibles pulsando el botón de solicitudes en la pestaña de gestionar grupos mientras que ahora aparecen de diferente color según su estado en la lista principal de grupos.

## Práctica

Implementa la interfaz que propusiste en tu Práctica 5 (Diseño de una GUI) usando Boostrap 5, *sin* JQuery. Tendrás que usar
- HTML
- JavaScript
- CSS

Para ello, haz un "fork" de este proyecto, y toca únicamente los siguientes ficheros y directorios (todos ellos bajo [main/src/main/resources/static](https://github.com/manuel-freire/iu2122/blob/main/src/main/resources/static/)):
- [index.html](https://github.com/manuel-freire/iu2122/blob/main/src/main/resources/static/index.html), donde escribirás todo el HTML estático (es decir, el que existe al cargar la página, en lugar de generarse dinámicamente vía `pmgr.js`)
- [js/pmgr.js](https://github.com/manuel-freire/iu2122/blob/main/src/main/resources/static/js/pmgr.js), donde escribirás todo el JS que genera HTML y realiza peticiones a la [API](https://github.com/manuel-freire/iu2122/blob/main/src/main/resources/static/js/pmgrapi.js) para interactuar con el servidor. *Por favor, no modifiques la API en sí*.
- [css/custom.css](https://github.com/manuel-freire/iu2122/blob/main/src/main/resources/static/css/custom.js), donde escribirás reglas CSS para estilar tu página tal y como quieres, modificando los estilos por defecto de Bootstrap 5.
- Puedes incorporar css/scripts/imágenes en sus respectivas carpetas (`css`, `js`, `img`). **Evita** introducir dependencias a código externo, entendido como código que cargas de fuera de tu aplicación. Sí puedes (si su licencia lo permite) introducir dependencias copiándolas a las respectivas carpetas, previa consulta al profesor.

### Entorno de desarrollo

Necesitarás un servidor local para lanzar tu página. Hay muchos disponibles:
- si tienes PHP instalado, puedes, desde la carpeta `static`, lanzar `php -S localhost:8000` (y luego abres un navegador apuntando a localhost:8000`)
- si tienes Python3 instalado, puedes usar, desde la carpeta `static`, `python -m http.server 8000` (y luego abres un navegador apuntando a localhost:8000`)
- (recomendado) si usas VS Code, puedes instalar la extensión "Live Server", y lanzar el servidor vía click derecho desde `index.html` + `Open with Live Server`.

## Resto del código

La aplicación de servidor funciona con Spring Boot, y puedes lanzarla en local y/o jugar con ella libremente. Para lanzarla, necesitarás tener `maven` y una JDK >= 8.0 instaladas. Basta con ejecutar `mvn spring-boot:run` para lanzar todo en local. Archivos importantes:
- Configuración de la aplicación: [application.properties](https://github.com/manuel-freire/iu2122/blob/main/src/main/resources/application.properties)
- Contraseñas y contenido inicial de la BD: [import.sql](https://github.com/manuel-freire/iu2122/blob/main/src/main/resources/import.sql)

*El profesor proporcionará un servidor (con configuración cambiada con respecto a la anterior) que permanecerá encendido hasta el fin de las prácticas de la asignatura. Lanzar o no otro servidor en local, o jugar con el codigo, es completamente opcional. Ver [licencia](https://github.com/manuel-freire/iu2122/blob/main/LICENSE)*



