FROM yobasystems/alpine-nodejs:latest
RUN mkdir adapteur
ADD modbus-adapter adapteur
RUN cd adapteur && npm install && npm run build
CMD cd adapteur && npm run start

 
