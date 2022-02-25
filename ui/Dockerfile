# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:10

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./

# Installs all node packages
RUN npm install --no-optional --quiet --no-progress
RUN apt-get update
RUN apt-get install -y nginx

# Arguments
#ARG REACT_APP_CAMERA_IMAGE_REFRESH_INTERVAL

#ENV REACT_APP_CAMERA_IMAGE_REFRESH_INTERVAL $REACT_APP_CAMERA_IMAGE_REFRESH_INTERVAL
# Arguments
ARG REACT_APP_STACK_NAME
ARG REACT_APP_WEBRTC_URI
ARG REACT_APP_MAX_DETECTION_LOGS
ARG REACT_APP_NODE_TYPE

ENV REACT_APP_STACK_NAME $REACT_APP_STACK_NAME
ENV REACT_APP_WEBRTC_URI $REACT_APP_WEBRTC_URI
ENV REACT_APP_MAX_DETECTION_LOGS $REACT_APP_MAX_DETECTION_LOGS
ENV REACT_APP_NODE_TYPE $REACT_APP_NODE_TYPE

# Copies everything over to Docker environment
COPY . .

# Uses port which is used by the actual application
EXPOSE 80

RUN npm run build

RUN cp -rf  build/* /var/www/html/
RUN rm -rf build
RUN cp kb-eye-ui.sh /root/kb-eye-ui.sh
RUN cp nginx/default.conf /etc/nginx/sites-enabled/default
RUN rm -rf *

# Finally runs the application
#CMD [ "npm", "start" ]
