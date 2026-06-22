FROM nginx:stable-alpine3.23-perl

COPY ./src/ /usr/share/nginx/html

EXPOSE 80