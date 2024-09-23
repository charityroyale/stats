# stats

A REST API to generate reports for Charity Royale streamers

# api

## generate stats report

<code>GET</code> <code><b>/</b></code> <code>(generates charity royale report for streamer)</code>

##### Parameters

> | name     | type     | data type                | description                                                              |
> | -------- | -------- | ------------------------ | ------------------------------------------------------------------------ |
> | streamer | required | string                   | path, specifies which streamerdata should be used to generate the report |
> | type     | required | 'instagram' or 'twitter' | path, specifies in which format the report should be generated           |
> | wish     | optional | string                   | queryparam, specifies generation of a specific wish via wishSlug         |

##### Responses

> | http code | content-type | response |
> | --------- | ------------ | -------- |
> | `200`     | `image/png`  | `-`      |
> | `400`     | `text/html`  | `-`      |
> | `500`     | `text/html`  | `-`      |

## get active livestreams

<code>GET</code> <code><b>/</b></code> <code>(returns a dataset of active twitch streams)</code>

##### Parameters

> | name     | type     | data type | description                                                                                                                                                                                                  |
> | -------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
> | channels | required | string    | returns an array of livestreams that are currently streaming, format: https://dev.twitch.tv/docs/api/reference/#get-channel-information, if the livestream is not live it will not be in he response dataset |

##### Responses

> | http code | content-type       | response |
> | --------- | ------------------ | -------- |
> | `200`     | `application/json` | `-`      |
> | `500`     | `text/html`        | `-`      |

##### Example cURL

> ```javascript
>  curl -X GET http://localhost:6200/streams?channels=asdf1,asdf2,asdf3
> ```

# env variables

see [.env.example](.env.example)

# twitch application access token

> ```
> curl -X POST \
>  -H "Content-Type: application/x-www-form-urlencoded" \
>  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials" \
>  https://id.twitch.tv/oauth2/token
> ```

### avatar retrieval

https://dev.twitch.tv/docs/api/reference/#get-users

### docker

docker build -t stats .  
docker run -p 6200:6200 stats

docker-compose up --build  
docker-compose up -d -p 6200:6200
