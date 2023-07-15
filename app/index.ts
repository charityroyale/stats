import express, { Request, Response } from 'express'
import { createCanvas, Canvas, CanvasRenderingContext2D, registerFont, loadImage } from 'canvas'
import { infojson } from './info'

const app = express()
const port = 3000
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

const path = __dirname

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
		// const streamers = (await fetchMakeAWishData()).streamers
		const streamers = infojson.streamers as { [streamerSlug: string]: MakeAWishStreamer }

		// process maw data by request param
		const potentialStreamer = streamers[req.query.streamername?.toString().toLowerCase() ?? '']
		const type = req.query.type as Type // "instagram" | "twitter"

		const streamerName = req.query.streamername?.toString()

		// prepare canvas
		const { width, height } = canvasSizeByType(type)
		const canvas: Canvas = createCanvas(width, height)
		const ctx = canvas.getContext('2d')
		registerFont(path + '/font/Roboto-Medium.ttf', { family: 'Roboto' })

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

/********
 * DRAW *
 ********/
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

const draw = async (type: Type, ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	if (type === 'instagram') {
		await drawInstagram(ctx, streamer)
	} else {
		await drawTwitter(ctx, streamer)
	}
}

const drawInstagram = async (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	const { slug } = streamer

	// Background
	ctx.fillStyle = '#231565'
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	// Headline
	ctx.fillStyle = 'white'
	ctx.font = '62px "Roboto"'
	ctx.save()
	ctx.translate(100, 400)
	ctx.rotate(-Math.PI / 2)
	ctx.textAlign = 'center'
	ctx.fillText('Charity Royale STATS', 0, 0)
	ctx.restore()

	ctx.translate(ctx.canvas.width / 2, 0)

	// Avatar
	ctx.fillStyle = '#333'
	ctx.fillRect(-150, 120, 300, 300)

	// Headline Streamername
	ctx.fillStyle = '#FFC439'
	ctx.font = '112px "Roboto"'
	ctx.textAlign = 'center'
	ctx.fillText(slug.toUpperCase(), 0, 560)

	// Spendensumme
	drawStatsTitle(ctx, 0, 695, 'Spendensumme')
	drawStatsValue(ctx, 0, 785, formatCurrency(streamer.current_donation_sum_net))

	// Top Spender:in
	drawStatsTitle(ctx, 0, 950, 'Top Spender:in')
	drawStatsValue(
		ctx,
		0,
		1030,
		streamer.top_donors[0].username + ' ' + formatCurrency(streamer.top_donors[0].amount_net)
	)

	// Gesammelt für
	drawStatsTitle(ctx, 0, 1200, 'Gesammelt für')
	// TODO: add real values
	drawStatsValue(ctx, 0, 1280, 'Max, Sissi, Flox, Adam, C.')

	await loadImage(path + '/img/cr_logo.png').then((data) => {
		ctx.drawImage(data, -400, ctx.canvas.height - 270, data.width * 0.9, data.height * 0.9)
	})

	await loadImage(path + '/img/maw_logo.png').then((data) => {
		ctx.drawImage(data, 50, ctx.canvas.height - 240, data.width * 0.25, data.height * 0.25)
	})
}

const drawTwitter = async (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	const { slug } = streamer
	// Background
	ctx.fillStyle = '#231565'
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	// Avatar
	ctx.fillStyle = '#333'
	ctx.fillRect(100, 70, 220, 220)

	// Headline
	ctx.fillStyle = 'white'
	ctx.font = '62px "Roboto"'
	ctx.fillText('Charity Royale STATS', 370, 145)

	// Headline Streamername
	ctx.fillStyle = '#FFC439'
	ctx.font = '112px "Roboto"'
	ctx.fillText(slug.toUpperCase(), 370, 260)

	// Spendensumme
	drawStatsTitle(ctx, 100, 395, 'Spendensumme')
	drawStatsValue(ctx, 120, 465, formatCurrency(streamer.current_donation_sum_net))

	// Top Spender:in
	drawStatsTitle(ctx, 100, 545, 'Top Spender:in')
	drawStatsValue(
		ctx,
		120,
		620,
		streamer.top_donors[0].username + ' ' + formatCurrency(streamer.top_donors[0].amount_net)
	)

	// Gesammelt für
	drawStatsTitle(ctx, 100, 700, 'Gesammelt für')
	// TODO: add real values
	drawStatsValue(ctx, 120, 790, 'Max, Sissi, Flox, Adam, C.')

	await loadImage(path + '/img/cr_logo.png').then((data) => {
		ctx.drawImage(data, 90, ctx.canvas.height - 190, data.width * 0.7, data.height * 0.7)
	})

	await loadImage(path + '/img/maw_logo.png').then((data) => {
		ctx.drawImage(data, ctx.canvas.width - 400, ctx.canvas.height - 170, data.width * 0.2, data.height * 0.2)
	})
}

const drawStatsTitle = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
	ctx.fillStyle = 'white'
	ctx.font = '38px Roboto'
	ctx.fillText(text, x, y)
}

const drawStatsValue = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
	ctx.fillStyle = '#FFC439'
	ctx.font = '68px Roboto'
	ctx.fillText(text, x, y)
}

const currencyFormatter = Intl.NumberFormat('de-AT', {
	style: 'currency',
	currency: 'EUR',
})
const formatCurrency = (money: string) => {
	return currencyFormatter.format(parseFloat(money))
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
