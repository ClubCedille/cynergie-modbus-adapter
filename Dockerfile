FROM node:9.7.0-slim

ADD modbus-adapter /home
WORKDIR home
RUN npm install && npm run build
CMD npm run start


