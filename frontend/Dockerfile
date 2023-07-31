#Desarrollo
FROM node:16 AS development

WORKDIR /app

RUN apt update -y && apt upgrade -y

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Produccion
FROM development AS production

ARG NODE_ENV=build
ENV NODE_ENV=${NODE_ENV}

RUN apt update -y && apt upgrade -y
RUN apt install nginx software-properties-common -y
