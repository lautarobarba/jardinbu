# Jardín Botánico De Ushuaia

- Apps:

  - NextJS: frontend
  - NestJS: backend

- DBs:

  - PostgreSQL

- Reverse proxy:
  - Nginx

## Dependencias

- Desarrollo
  - Docker (instalación en Apéndice)
- Producción
  - PostgreSQL (instalación en Apéndice)
  - Node v18 (instalación en Apéndice)
  - NPM v9 (instalación en Apéndice)
  - Nginx (instalación en Apéndice)

## Configuración

```bash
$ # Se copian los ejemplos de config para cada módulo
$ cd backend/api && cp .env.example .env && cd ../.. && \
  cd frontend/app && cp .env.example .env && cd ../.. && \
  cp .env.example .env
$ nano backend/api/.env
$ nano frontend/app/.env
$ # Por último hay un archivo .env en la raiz del proyecto en el cual se configura el entorno
$ nano .env
```

## Iniciar compose para desarrollo

```bash
$ docker compose up -d
```

_Quitando la opción *-d* se ven los logs de los contenedores._

## Detener

```bash
$ # Si estan corriendo con logs visibles
$ #     detener con Ctr+C
$ docker compose down
```

## Iniciar node para producción

```bash
$ # Backend: Dejar una terminal corriendo con el servidor node
$ cd backend && \
   npm install && \
   npm run build && \
   npm run migration:run && \
   npm run start:prod
$ # Frontend: Dejar una terminal corriendo con el servidor node
$ cd frontend && \
   npm install && \
   npm build && \
   npm run start:prod
```

## Database - PostgreSQL (Docker)

Toda la base de datos queda guardada en **/database/database/data**

Para conectarse a una terminal del contenedor (sólo para debug).
Usar los datos configurados previamente en **database/.env**.

**DB_NAME**: está en el archivo _.env_

**DB_USER**: está en el archivo _.env_

**DB_PASSWORD**: está en el archivo _.env_

```bash
$ docker compose exec -it jbu_db bash
root@container:$ psql -U ${DB_USER} ${DB_NAME}
root@container:$ # DB_PASSWORD
```

### Backups

Se creó un volumen para guardar los _backups_ en **/database/backups**.

### Realizar backup

Para hacer el backup tenemos que entrar a una shell del contenedor y generar el archivo de backup en la carpeta donde esta montado el volumen.
Usar los datos configurados previamente en .env

**DB_USER**: está en el archivo _.env_

**DB_NAME**: está en el archivo _.env_

```bash
$ docker compose exec -it jbu_db bash
root@container:$ pg_dump -U ${DB_USER} ${DB_NAME} > backups/${DB_NAME}$(date "+%Y%m%d-%H_%M").sql
root@container:$ exit
```

### Restaurar backup

Para restaurar el backup tenemos que entrar a una shell del contenedor y restaurar el backup que se encuentra en el volumen montado.

1. Hay que asegurarse de tener el backup en la carpeta **/backups**.

**DB_USER**: está en el archivo _.env_

**DB_NAME**: está en el archivo _.env_

```bash
$ cd database/backups
$ sudo unzip NOMBRE_BACKUP.zip
$ cd ../..
$ docker compose exec -it jbu_db bash
root@container:$ psql -U ${DB_USER} -d ${DB_NAME} -f backups/NOMBRE_BACKUP.sql
root@container:$ exit
```

### Programar backups automáticos (CRON)

#### Prerrequisitos

En el servidor de destino tiene que estar configurado ssh para aceptar autenticación con Public Keys.

```bash
$ # En el servidor de destino
$ sudo nano /etc/ssh/sshd_config
$ # Descomentar la linea que tiene: PubkeyAuthentication yes
$ sudo systemctl restart sshd.service
$ #------------------------------------------------------------------------------
$ # En el servidor de origen del backup (USUARIO ROOT)
root$ # Generar las claves del usuario que va a ejecutar el script en este equipo
root$ ssh-keygen
root$ ssh-copy-id USUARIO@SERVIDOR_DESTINO
```

#### Programar tarea

```bash
$ # En el servidor de origen del backup
$ cp backup_cron.sh.example backup_cron.sh
$ # Configurar el destino. Editar la linea #DEST=usuaro@host:/path
$ nano backup_cron.sh
$ # Programar la tarea con cron (USUARIO ROOT)
root$ crontab -e
root$ # En cron:
			# Para probar un backup cada 5 minutos
			*/5 * * * * /ruta_al_script/backup_cron.sh

			# Para dejar el backup 1 vez por dia
			0 0 * * * /ruta_al_script/backup_cron.sh
```

## Backend (NestJS)

### Instalar nuevas librerías

```bash
$ docker compose exec -it backend bash -c "npm install NPM_PACKAGE"
```

### Recursos NestJS

```bash
$ # Para crear un nuevo recurso usamos el generador de NestJs
$ # RESOURCE_NAME puede ser el nombre de una entidad(tabla) en singular
$ docker compose exec -it backend bash -c "nest g resource modules/RESOURCE_NAME --no-spec"
$ # El contenedor va a generar los archivos con el owner ROOT.
$ # Cambiamos el owner para que nos deje editar
$ sudo chown -R ${USER}:${USER} backend/backend/src/modules
```

### Migraciones TypeORM

```bash
$ # Ver migraciones aplicadas:
$ docker compose exec -it jbu_back bash -c "npm run migration:show"
$ # Generar migración
$ docker compose exec -it jbu_back bash -c "npm run migration:generate --name=nombreMigracion"
$ # Aplicar migraciones
$ docker compose exec -it jbu_back bash -c "npm run migration:run"
```

### Crear administrador

```bash
$ docker compose exec -it dev bash -c "npm run create-admin"
$ # Esto creara un nuevo administador con las credenciales
$ #   email: admin@admin.com
$ #   contraseña: admin
```

### Test endpoints

Para testear los endpoints se puede usar _Postman_ o dirigirse a la ruta **/api/docs** para testear con _Swagger_.

## Frontend (NextJS)

### Instalar nuevas librerías

```bash
$ docker compose exec -it frontend bash -c "npm install NPM_PACKAGE"
```

## Reverse proxy

### Configuración

Los puertos 80 y 443 deben estar libres.

Definir las redirecciones en el archivo nginx.conf utilizando la siguiente plantilla.

Nota: _host.docker.internal_ es un alias al host que está corriendo el contenedor del reverse proxy.

```
upstream sitio_ejemplo_uno {
    server host.docker.internal:8000;
}
upstream sitio_ejemplo_dos {
    server 192.168.150.50:8000;
}

# ENTRANDO POR IP
server {
    listen 80 default_server;
    root /var/www/html;
    index index.html;
    client_max_body_size 500M;
    error_log /var/log/nginx/service-error.log debug;
    server_name _;
    location / {
	include proxy_params;

	# Direccion de proxy
        proxy_pass http://sitio_ejemplo_uno;
        proxy_ssl_server_name on;
    }
}

# ENTRANDO CON UN DOMINIO
server {
    listen 80;
    root /var/www/html;
    index index.html;
    error_log /var/log/nginx/service-error.log debug;
    server_name nombre_dominio_filtrado;

    # Direccion de proxy
    location / {
	include proxy_params;
        proxy_pass http://sitio_ejemplo_dos;
        proxy_ssl_server_name on;
    }
}
```

### Instalar certificados SSL

```bash
$ docker compose exec -it jbu_rproxy bash
$ certbot --nginx
```

# Apéndice

## Instalación de docker en ubuntu 18.04/20.04/22.04

Fuente: [Instalación docker ubuntu](https://docs.docker.com/engine/install/ubuntu).

```bash
$ sudo apt-get update
$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

$  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## Instalación de PostgreSQL en ubuntu 18.04/20.04/22.04

```bash
$ sudo apt install curl gpg gnupg2 software-properties-common apt-transport-https lsb-release ca-certificates
$ curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
$ echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
$ sudo apt update
$ sudo apt install postgresql-13 postgresql-client-13
$ sudo passwd postgres # Para cambiar la contraseña del usuario postgres
$ su postgres
postgres$ psql # Abrir cliente por linea de comandos
postgres (psql)$ # Cambiar la contraseña del usuario dentro del motor
postgres (psql)$ ALTER USER postgres WITH PASSWORD 'jbu_db';
postgres (psql)$ # Crear la base de datos para la aplicación
postgres (psql)$ CREATE DATABASE jbu_db;
postgres (psql)$ # Salir
postgres (psql)$ \q
postgres$ exit
$ sudo systemctl status postgresql.service
```

## Instalación de Redis en ubuntu 18.04/20.04/22.04

```bash
$ sudo apt install lsb-release curl gpg
$ curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
$ echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
$ sudo apt-get update
$ sudo apt-get install redis
$ sudo systemctl status redis-server.service
```

## Instalación de NodeV18 en ubuntu 18.04/20.04/22.04

```bash
$ cd /tmp
$ curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt update
$ sudo apt install nodejs
$ node -v
$ npm -v
```

## Instalación de Nginx + Certbot en ubuntu 18.04/20.04/22.04

```bash
$ sudo apt install nginx
```
