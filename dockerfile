FROM node:16.13.2

# RUN mkdir -p /app
# WORKDIR /app
# ADD . /app


# ENV HOST 0.0.0.0
EXPOSE 3001

CMD ["npm", "run", "start"]