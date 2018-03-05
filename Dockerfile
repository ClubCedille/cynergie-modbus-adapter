FROM node:9.7.0-slim

RUN mkdir adapteur
ADD modbus-adapter adapteur
RUN cd adapteur && npm install && npm run build
CMD cd adapteur && npm run start


