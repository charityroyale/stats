# stats

A REST API to generate reports for Charity Royale streamers

# env variables

see [.env.example](.env.example)

# twitch application access token

```
curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials" \
  https://id.twitch.tv/oauth2/token
```

### avatar retrieval

https://dev.twitch.tv/docs/api/reference/#get-users
