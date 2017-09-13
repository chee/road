require('dotenv').config()

with (process.env) {
console.log(`
server {
  default_type text/plain;
  listen 443 http2 ssl;
  listen [::]:443 http2 ssl;
  server_name ${HOST};
  ssl on;
  ssl_certificate ${CERT_PATH};
  ssl_certificate_key ${KEY_PATH};

  location / {
    proxy_pass http://localhost:${HTTP_PORT};
  }

  location /_api {
    proxy_pass http://localhost:${API_PORT};
  }

  location /_peer {
    proxy_pass http://localhost:${PEER_PORT};
  }
}


server {
  listen 80;
  listen [::]:80;
  server_name ${HOST};
  return 301 https://${HOST}$request_uri;
}
`)
}
