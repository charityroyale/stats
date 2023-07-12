import express, { Request, Response } from 'express'
import { createCanvas, CanvasRenderingContext2D } from 'canvas'

const app = express()
const port = 3000
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

/************
 * CORE API *
 ************/
app.get('/', async (req: Request, res: Response) => {
	try {
		// validate request data
		if (typeof req.query.streamername !== 'string' || typeof req.query.type !== 'string') {
			throw Error('"streamername" or "type" param invalid')
		}

		// fetch maw data
		const streamers = (await fetchMakeAWishData()).streamers

		// process maw data by request param
		const potentialStreamer = streamers[req.query.streamername?.toString().toLowerCase() ?? '']
		const type = req.query.type as Type // "instagram" | "twitter"
		const streamerName = req.query.streamername?.toString()

		// prepare canvas
		const { width, height } = canvasSizeByType(type)
		const canvas = createCanvas(width, height)
		const ctx = canvas.getContext('2d')

		// draw canvas
		draw(type, ctx, potentialStreamer)

		// package canvas
		const buffer = canvas.toBuffer('image/png')
		res.set('Content-Type', 'image/png')
		res.send(buffer)
	} catch (err) {
		console.error(err)
		res.status(500).send('An error occurred')
	}
})

type Type = 'instagram' | 'twitter'
const canvasSizeByType = (type: Type) => {
	if (type === 'instagram') {
		return {
			height: 1920,
			width: 1080,
		}
	} else {
		return {
			height: 1080,
			width: 1080,
		}
	}
}

const draw = (type: Type, ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	if (type === 'instagram') {
		drawInstagram(ctx, streamer)
	} else {
		drawTwitter(ctx, streamer)
	}
}

const drawInstagram = (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	throw new Error('drawInstagram not implemented')
}

const drawTwitter = (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	const { slug } = streamer
	ctx.fillStyle = '#231565'
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.fillStyle = 'white'
	ctx.font = '48px serif'
	ctx.fillText(slug, 10, 100)
}

/***************************
 * Make-A-Wish Austria API *
 ***************************/
const MAKE_A_WISH_BASE_URL = 'https://streamer.make-a-wish.at'
const INFO_JSON_PATH = 'charityroyale2022/info.json'

export const fetchMakeAWishData = async () => {
	try {
		const res = await fetch(`${MAKE_A_WISH_BASE_URL}/${INFO_JSON_PATH}`)
		return (await res.json()) as MakeAWishInfoJson
	} catch (e) {
		throw new Error(`Couldn't fetch MAW data: ${e}`)
	}
}

interface MakeAWishInfoJson {
	streamers: { [streamerSlug: string]: MakeAWishStreamer }
}

interface MakeAWishStreamer {
	id: number
	color: string
	slug: string
	type: 'main' | 'community'
	current_donation_sum: string
	current_donation_sum_net: string
	current_donation_count: number
	top_donors: MakeAWishInfoJsonTopDonation[]
}

interface MakeAWishInfoJsonTopDonation {
	username: string
	amount_net: string
}
