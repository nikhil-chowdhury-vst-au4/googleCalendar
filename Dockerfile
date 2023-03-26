ARG GCP_NODE_PATH
FROM $GCP_NODE_PATH as builder
ARG ENVIRONMENT=staging
ARG GITHUB_TOKEN


WORKDIR /app/server

ADD . /app/server
RUN npm install -g typescript
RUN npm install
RUN npm install git+https://$GITHUB_TOKEN:x-oauth-basic@github.com/XPrepOfficial/Base-Packages.git#addFilesInData --save
RUN npm run build
ARG ENVIRONMENT=staging


FROM node:14-alpine
ARG ENVIRONMENT=staging


WORKDIR /app/server

COPY --from=builder /app/server/package.json ./package.json
COPY --from=builder /app/server/node_modules node_modules
#COPY --from=builder /app/server/logs logs
COPY --from=builder /app/server/dist dist
COPY --from=builder /app/server/swagger.json ./swagger.json
COPY --from=builder /app/server/env.sh  /app/server/env_var.sh
COPY --from=builder /app/server/countryData.json  ./countryData.json
COPY --from=builder /app/server/locales  /app/server/locales

RUN chmod +x /app/server/env_var.sh


EXPOSE 8080
CMD [ "sh","-c",". ./env_var.sh && npm start" ]
