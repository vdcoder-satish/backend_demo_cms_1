# use aws lamda base image for node js
From public.ecr.aws/lambda/nodejs20
# copy app files
COPY package*.json ./
RUN npm install
COPY . .
RUN ["app.handler"]