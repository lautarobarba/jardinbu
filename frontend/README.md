# App para el Jardín Botánico De Ushuaia

## Tecnologías

**Proyecto ReactJS (typescript)**

### Librerias y otros

- MDBootstrap
- React-router-dom
- Redux

## Dependencias

- Docker (Apéndice)

## Configuración

```bash
$ cp .env.example .env
$ nano .env
```

## Iniciar

```bash
$ docker compose up -d prod/dev
```

_Quitando la opción *-d* se ven los logs del contenedor._

## Detener

```bash
$ # Si estan corriendo con logs visibles
$ #     detener con Ctr+C
$ docker compose down
```

## Debug

```bash
$ docker container exec -it prod/dev bash
```

## Instalar nuevas librerías

```bash
$ docker compose exec -it dev bash -c "npm install NPM_PACKAGE"
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
