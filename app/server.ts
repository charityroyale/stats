import 'dotenv/config'
import * as fs from 'fs'
import express, { NextFunction, Request, Response } from 'express'
import { registerFont } from 'canvas'
import { draw } from './src/draw/draw'
import { fetchMakeAWishData, fetchMakeAWishDataInfoJson } from './src/apiClients/mawApiClient'
import { FONT_PATH, IMG_DOWNLOADS_PATH } from './src/config'
import { logger } from './logger'
import { fetchTwitchUser, downloadAndSaveImageFromUrl, fetchLiveChannels } from './src/apiClients/twitchApiClient'
import { Type, hasValidRequestParams, isMultiStream } from './src/utils'
import cors from 'cors'
import { prepareDrawData } from './src/draw/drawUtils'
import NodeCache from 'node-cache'

const app = express()
const port = 6200
const cache = new NodeCache({ stdTTL: 300 })

app.listen(port, () => {
	logger.info(`Server started on port ${port}`)
	registerFont(`${FONT_PATH}/roboto-medium.ttf`, { family: 'Roboto' })
	registerFont(`${FONT_PATH}/roboto-regular.ttf`, { family: 'Roboto-Regular' })
})

app.use(cors())

export type StatsRequestParams = { streamer: string; type: Type }
type StatsRequest = Request<StatsRequestParams>

const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const key = req.originalUrl

	const cachedData = cache.get(key)
	if (cachedData) {
		logger.info(`Returning data cache for key ${req.originalUrl}`)
		return res.json(cachedData)
	}

	next()
}

app.get('/streams', cacheMiddleware, async (req: StatsRequest, res: Response) => {
	logger.info(`New "${req.method}" request from "${req.ip}" via url "${req.url}"`)

	try {
		if (!req.query.channels) {
			// throw new Error('missing channels params or empty array or wrong data format')
			return res.status(400).send('Silence is key.')
		}
		const userLogins = (req.query.channels as string).split(',').join('&user_login=')
		const livestreams = await fetchLiveChannels(userLogins)
		cache.set(req.originalUrl, livestreams)
		res.status(200).json(livestreams)
		logger.info(`Returning live streams for charity royale "${req.url}"!`)
	} catch (error) {
		console.log(error)
		logger.error(`Couldn't process request "${req.url}" successfully because "${error}".`)
		res.status(500).send('The request caused an internal server error.')
	}
})

app.get('/:streamer/:type', async (req: StatsRequest, res: Response) => {
	logger.info(`New "${req.method}" request from "${req.ip}" via url "${req.url}"`)

	try {
		const { params, query } = req
		if (!hasValidRequestParams(params)) {
			logger.error(`Invalid params for request "${JSON.stringify(params)}". Returning HTTP 400 response.`)
			return res.status(400).send({
				status: 400,
				result: `Validation failed for "${JSON.stringify(params)}"`,
			})
		}

		const { streamer, type } = params
		const mawStreamerData = await fetchMakeAWishData(streamer)

		let mawInfoJson = null
		if (isMultiStream(streamer)) {
			mawInfoJson = await fetchMakeAWishDataInfoJson()
		}

		const destination = `${IMG_DOWNLOADS_PATH}/${streamer}.png`
		if (!fs.existsSync(destination)) {
			const twitchUser = await fetchTwitchUser(streamer)
			await downloadAndSaveImageFromUrl(twitchUser?.data[0].profile_image_url ?? '', streamer)
		}
		// TODO: change to DrawData interface
		const drawData = prepareDrawData(mawStreamerData, query.wish as string, mawInfoJson)
		const canvas = await draw(type, drawData)
		const buffer = canvas.toBuffer('image/png')

		res.set('Content-Type', 'image/png')
		res.send(buffer)

		logger.info(`Created stats for "${req.url}"! Yey!`)
	} catch (error) {
		console.log(error)
		logger.error(`Couldn't process request "${req.url}" successfully because "${error}".`)
		res.status(500).send('The request caused an internal server error.')
	}
})
