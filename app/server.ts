import 'dotenv/config'
import express, { Request, Response } from 'express'
import { registerFont } from 'canvas'
import { draw } from './src/draw/draw'
import { fetchMakeAWishData } from './src/apiClients/mawApiClient'
import { FONT_PATH } from './src/config'
import { logger } from './logger'
import { fetchTwitchUser, downloadAndSaveImageFromUrl, fetchLiveChannels } from './src/apiClients/twitchApiClient'
import { Type, hasValidRequestParams } from './src/utils'

const app = express()
const port = 6200

app.listen(port, () => {
	logger.info(`Server started on port ${port}`)
	registerFont(`${FONT_PATH}/roboto-medium.ttf`, { family: 'Roboto' })
})

export type StatsRequestParams = { streamer: string; type: Type }
type StatsRequest = Request<StatsRequestParams>

app.get('/streams', async (req: StatsRequest, res: Response) => {
	logger.info(`New "${req.method}" request from "${req.ip}" via url "${req.url}"`)

	try {
		if (!req.query.channels) {
			throw new Error('missing channels params or empty array or wrong data format')
		}
		const userLogins = (req.query.channels as string).split(',').join('&user_login=')
		const livestreams = await fetchLiveChannels(userLogins)
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
		const { params } = req
		if (!hasValidRequestParams(params)) {
			logger.error(`Invalid params for request "${JSON.stringify(params)}". Returning HTTP 400 response.`)
			return res.status(400).send({
				status: 400,
				result: `Validation failed for "${JSON.stringify(params)}"`,
			})
		}

		const { streamer, type } = params
		const mawStreamerData = await fetchMakeAWishData(streamer)

		const twitchUser = await fetchTwitchUser(streamer)
		await downloadAndSaveImageFromUrl(twitchUser?.data[0].profile_image_url ?? '', streamer)

		const canvas = await draw(type, mawStreamerData)
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
