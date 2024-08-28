# NodeJS Version 16
FROM node:20-buster-slim
RUN apt-get update -y && apt-get install -y openssl
# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN npm install --legacy-peer-deps

# Set Env
ENV NODE_ENV development

# Cmd script
CMD ["npm", "run", "start"]
