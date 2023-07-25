import 'dotenv/config'
import express, { Request, Response } from 'express'
import { createCanvas, Canvas, registerFont } from 'canvas'
import { infojson } from './info'
import { Type, canvasSizeByType, getCanvasContextByType, validateRequestParams } from './utils'
import { draw } from './draw'
import { MakeAWishStreamer } from './mawApiClient'
import { downloadAndSaveImageFromUrl, fetchTwitchUser } from './twitch'
import { FONT_PATH } from './config'
import { logger } from './logger'

const app = express()
const port = 3000

app.listen(port, () => {
	logger.info(`Server started on port ${port}`)
	registerFont(`${FONT_PATH}/roboto-medium.ttf`, { family: 'Roboto' })
})

export type StatsRequestParams = { streamer: string; type: Type }
type StatsRequest = Request<StatsRequestParams>

app.get('/:streamer/:type', async (req: StatsRequest, res: Response) => {
	logger.info(`New "${req.method}" request from "${req.ip}" via url "${req.url}"`)

	try {
		const { params } = req
		validateRequestParams(params, res)

		const { streamer, type } = params
		// const streamers = (await fetchMakeAWishData()).streamers
		const mawStreamers = infojson.streamers as { [streamerSlug: string]: MakeAWishStreamer }

		const twitchUser = await fetchTwitchUser(streamer)
		await downloadAndSaveImageFromUrl(twitchUser?.data[0].profile_image_url ?? '', streamer)

		const canvas = await draw(type, mawStreamers[streamer])
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
