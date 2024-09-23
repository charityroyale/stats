# define nodejs baseimage
FROM node:20.17.0
# expose ports
EXPOSE 6200

# set target image directory
WORKDIR /opt/stats

# add all files to image directory
ADD . /opt/stats

# install dependencies
RUN npm install

# set target image directory
WORKDIR /opt/stats

# start
ENTRYPOINT npm run start