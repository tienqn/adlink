FROM composer:2.3  as composer

WORKDIR /usr/src/app
COPY composer.json composer.json
COPY artisan artisan
COPY bootstrap bootstrap
COPY app app
COPY database database
COPY config config
COPY routes routes
COPY tests tests
RUN composer install --ignore-platform-reqs --no-progress
RUN composer dump-autoload --classmap-authoritative

FROM php:8.2-fpm-alpine

WORKDIR /usr/src/app

RUN apk add --virtual build-dependencies build-base openssl-dev autoconf libbson
RUN pecl install mongodb && docker-php-ext-enable mongodb 
RUN apk add nginx supervisor --no-cache
RUN apk del build-dependencies build-base openssl-dev autoconf && rm -rf /var/cache/apk/*

COPY . .
RUN mv deployment/config/nginx.conf /etc/nginx/nginx.conf &&\
    mv deployment/config/supervisord.conf /etc/supervisord.conf &&\
    rm -rf /usr/local/etc/php-fpm.d/ &&\
    mv deployment/config/php-fpm.d/ /usr/local/etc/php-fpm.d/

COPY --from=composer /usr/src/app/vendor /usr/src/app/vendor

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]


