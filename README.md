# App

GymPass style app

## Functional Requirements

- [] The user must be able to register an account.
- [] The user must be able to authenticate.
- [] It should be possible to obtain the profile from a logged-in user.
- [] It should be possible to obtain the amount of check-ins from a logged-in user.
- [] The user must be able to retrieve its check-in history.
- [] The user must be able to search for nearby gyms.
- [] The user must be able to search gyms by their names.
- [] The user must check in at a gym.
- [] It should be possible to validate a user's check-in.
- [] It should be possible to register a gym.

## Business Rules

- [] The user should not be able to register a duplicate email.
- [] The user should not be able to check in more than once a day.
- [] The user should not be able to check in if not within 100 meters of the gym.
- [] The check-in should be validated up to 20 minutes after it is created.
- [] The check-in should be validated by administrators.
- [] The gym should be registered by administrators.

## Non-Functional Requirements

- [] The user's password must be encrypted.
- [] The application data must be persisted in a PostgreSQL database.
- [] All data lists must be paginated with up to 20 items per page.
- [] The user must be identified by a Json Web Token (JWT).

# To start locally

1. Run "npm run dev" to start the local server
2. Run "docker compose up -d" to start Docker
3. Run "npx prisma migrate dev" to recreate the table in DEV ("npx prisma migrate deploy" for PROD)
4. Run "npx prisma studio" to start the UI
5. Check "docker ps" to show the active container's status, "docker ps -a" shows all the created containers

To shutdown the docker you can run "docker compose down", but this command drops the table, "docker compose stop" simply stops it, "docker compose start" starts it