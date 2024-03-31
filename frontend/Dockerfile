FROM node:20.12.0-alpine
WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build
CMD npm run preview
