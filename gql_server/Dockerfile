# Stage 1: Build the React app

FROM node:18-alpine

LABEL version="1.0"
LABEL description="server GraphQL API"
LABEL maintainer = ["d.n.davtyan@gmail.com"]

WORKDIR /app

COPY package*.json ./
RUN npm install --production
RUN npm ci --omit=dev

# ARG REACT_APP_HOST_IP_ADDRESS
# ENV REACT_APP_HOST_IP_ADDRESS $REACT_APP_HOST_IP_ADDRESS

COPY . .

EXPOSE 4000
CMD ["node", "index.js"]



# Stage 2: Serve the React app with Nginx
#FROM nginx:1.23.3-alpine

#COPY --from=node /app/build /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
