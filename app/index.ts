import express, { Request, Response } from 'express'
import { createCanvas } from 'canvas'

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
		const streamers = (await fetchMakeAWishData()).streamers
		const potentialStreamer = streamers[req.query.streamername?.toString().toLowerCase() ?? '']

		const width = 400
		const height = 200

		const streamerName = req.query.streamername?.toString() ?? 'YourLovelyNameHere'

		const canvas = createCanvas(width, height)
		const ctx = canvas.getContext('2d')

		ctx.fillStyle = 'blue'
		ctx.fillRect(0, 0, width, height)
		ctx.fillStyle = 'white'
		ctx.font = '48px serif'
		ctx.fillText(streamerName, 10, 100)

		const buffer = canvas.toBuffer('image/png')
		res.set('Content-Type', 'image/png')
		res.send(buffer)
	} catch (err) {
		console.error(err)
		res.status(500).send('An error occurred')
	}
})

/***************************
 * Make-A-Wish Austria API *
 ***************************/
const MAKE_A_WISH_BASE_URL = 'https://streamer.make-a-wish.at'
const INFO_JSON_PATH = 'charityroyale2022/info.json'

export const fetchMakeAWishData = async () => {
	try {
		const res = await fetch(`${MAKE_A_WISH_BASE_URL}/${INFO_JSON_PATH}`, {})
		return (await res.json()) as MakeAWishInfoJson
	} catch (e) {
		throw new Error(`Couldn't fetchMakeAWishData: ${e}`)
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
