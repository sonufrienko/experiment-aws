FROM node:lts-alpine

# Set the work directory
RUN mkdir -p /var/www/app/current
WORKDIR /var/www/app/current

# Add our package.json and install *before* adding our application files
COPY package.json ./
RUN npm i --production

# Install pm2 *globally* so we can run our application
RUN npm i -g pm2

# Add application files
COPY . /var/www/app/current

EXPOSE 4000

CMD ["pm2", "start", "process.json", "--no-daemon"]