FROM debian
RUN mkdir adapteur
ADD modbus-adapter adapteur
RUN apt-get update 
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN apt-get install -y gnupg
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs 
RUN cd adapteur && npm install && ./node_modules/.bin/tsc 
CMD cd adapteur && npm run start:service debug
 
