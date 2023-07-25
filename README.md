# stats

A REST API to generate reports for Charity Royale streamers

# api

## generate stats report

<code>GET</code> <code><b>/</b></code> <code>(generates charity royale report for streamer)</code>

##### Parameters

> | name     | type     | data type                | description                                                        |
> | -------- | -------- | ------------------------ | ------------------------------------------------------------------ |
> | streamer | required | string                   | specifies which streamerdata should be used to generate the report |
> | type     | required | 'instagram' or 'twitter' | specifies in which format the report should be generated           |

##### Responses

> | http code | content-type | response |
> | --------- | ------------ | -------- |
> | `200`     | `image/png`  | `-`      |
> | `400`     | `text/html`  | `-`      |
> | `500`     | `text/html`  | `-`      |

##### Example cURL

> ```javascript
>  curl -X GET http://localhost:3000/veni/twitter
> ```

# env variables

see [.env.example](.env.example)

# twitch application access token

> ```
> curl -X POST \
>  -H "Content-Type: application/x-www-form-urlencoded" \
>  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRETgrant_type=client_credentials" \
>  https://id.twitch.tv/oauth2/token
> ```

### avatar retrieval

https://dev.twitch.tv/docs/api/reference/#get-users
