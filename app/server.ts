import 'dotenv/config'
import express, { Request, Response } from 'express'
import { registerFont } from 'canvas'
import { draw } from './src/draw/draw'
import { MakeAWishStreamer, fetchMakeAWishData } from './src/apiClients/mawApiClient'
import { FONT_PATH } from './src/config'
import { logger } from './logger'
import { fetchTwitchUser, downloadAndSaveImageFromUrl } from './src/apiClients/twitchApiClient'
import { infojson } from './src/info'
import { Type, validateRequestParams } from './src/utils'

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
		const mawStreamers = (await fetchMakeAWishData()).streamers

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
