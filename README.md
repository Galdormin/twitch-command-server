# Twitch Command Server

Simple Svelte + Pocketbase server forked from https://github.com/mpiorowski/svelte-auth

# How to run

1. Create .env file

```
cp .env.example .env
```

2. Run app

```
docker compose up --build
```

3. Setup PocketBase and Twitch OAuth2

> 1. Setup a superuser for PocketBase
>
>    In the Console of Docker use the URL to setup a SuperUser. 
>
>    ```
>    2026-01-08 17:32:26 (!) Launch the URL below in the browser if it hasn't been open already to create your first superuser account:
>    2026-01-08 17:32:26 http://0.0.0.0:8080/_/#/pbinstal/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Nzg5MTc0NiwiaWQiOiI0bmVzamJpcDV3eDBlanAiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.EnCEFFkgb36n15hn1tsqcxHzg33Gy8HhLkj8pFHW1zw
>    ```
>
>    2. Connect on PocketBase `http://localhost:8080/_`
>
>
>    3. Edit the `users` collection to add Twitch providers.
>
>    Edit Collection (gear) > Options > OAuth2 > Add Provider
>
>    4. Setup a superuser for the APP
>
>    Create a new entry in the `_superusers` collection and put the information on the .env of the database.