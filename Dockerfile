FROM mcr.microsoft.com/playwright:v1.42.1-jammy

RUN command mkdir /app
WORKDIR /app
COPY . /app/

RUN npm install --force
RUN npx playwright install