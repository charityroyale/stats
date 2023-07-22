import 'dotenv/config'
import express, { Request, Response } from 'express'
import { createCanvas, Canvas, registerFont } from 'canvas'
import { infojson } from './info'
import { Type, canvasSizeByType } from './utils'
import { draw } from './draw'
import { MakeAWishStreamer } from './mawApiClient'
import { fetchTwitchUser } from './twitch'

const app = express()
const port = 3000

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

app.get('/', async (req: Request, res: Response) => {
	try {
		if (typeof req.query.streamername !== 'string' || typeof req.query.type !== 'string') {
			throw Error('"streamername" or "type" param invalid')
		}

		// const streamers = (await fetchMakeAWishData()).streamers
		const streamers = infojson.streamers as { [streamerSlug: string]: MakeAWishStreamer }

		// process maw data by request param
		const potentialStreamer = streamers[req.query.streamername?.toString().toLowerCase() ?? '']
		const twitchUser = await fetchTwitchUser(req.query.streamername?.toString().toLowerCase() ?? '')

		console.log(twitchUser)
		const type = req.query.type as Type

		const streamerName = req.query.streamername?.toString()

		// prepare canvas
		const { width, height } = canvasSizeByType(type)
		const canvas: Canvas = createCanvas(width, height)
		const ctx = canvas.getContext('2d')
		registerFont(__dirname + '/font/Roboto-Medium.ttf', { family: 'Roboto' })

		// draw canvas
		await draw(type, ctx, potentialStreamer)

		// package canvas
		const buffer = canvas.toBuffer('image/png')
		res.set('Content-Type', 'image/png')
		res.send(buffer)
	} catch (err) {
		console.error(err)
		res.status(500).send('An error occurred')
	}
})
