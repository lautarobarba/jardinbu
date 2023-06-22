#!/bin/bash
(nginx -g 'daemon off;' &) && touch /var/log/nginx/nginx.log && tail -f /var/log/nginx/nginx.log
