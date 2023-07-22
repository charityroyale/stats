import { loadImage, CanvasRenderingContext2D } from 'canvas'
import { PURPLE, WHITE, DARKGRAY, GOLD } from './theme'
import { Type, formatCurrency } from './utils'
import { MakeAWishStreamer } from './mawApiClient'

export const draw = async (type: Type, ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	if (type === 'instagram') {
		await drawInstagram(ctx, streamer)
	} else {
		await drawTwitter(ctx, streamer)
	}
}

const drawInstagram = async (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	const { slug } = streamer

	// Background
	ctx.fillStyle = PURPLE
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	// Headline
	ctx.fillStyle = WHITE
	ctx.font = '62px "Roboto"'
	ctx.save()
	ctx.translate(100, 400)
	ctx.rotate(-Math.PI / 2)
	ctx.textAlign = 'center'
	ctx.fillText('Charity Royale STATS', 0, 0)
	ctx.restore()

	ctx.translate(ctx.canvas.width / 2, 0)

	// Avatar
	ctx.fillStyle = DARKGRAY
	ctx.fillRect(-150, 120, 300, 300)

	// Headline Streamername
	ctx.fillStyle = GOLD
	ctx.font = '112px "Roboto"'
	ctx.textAlign = 'center'
	ctx.fillText(slug.toUpperCase(), 0, 560)

	// Spendensumme
	drawStats(ctx, 0, 695, 'Spendensumme', formatCurrency(streamer.current_donation_sum_net), 38, 68)

	// Top Spender:in
	const valueText = streamer.top_donors[0].username + ' ' + formatCurrency(streamer.top_donors[0].amount_net)
	drawStats(ctx, 0, 950, 'Top Spender:in', valueText, 38, 68)

	// Gesammelt für
	drawStats(ctx, 0, 1200, 'Gesammelt für', 'Max, Sissi, Flox, Adam, C.', 38, 68)

	await loadImage(__dirname + '/img/cr_logo.png').then((data) => {
		ctx.drawImage(data, -400, ctx.canvas.height - 270, data.width * 0.9, data.height * 0.9)
	})

	await loadImage(__dirname + '/img/maw_logo.png').then((data) => {
		ctx.drawImage(data, 50, ctx.canvas.height - 240, data.width * 0.25, data.height * 0.25)
	})

	await loadImage(__dirname + '/img/' + `${streamer.slug}.png`).then((data) => {
		ctx.drawImage(data, -150, 120, 300, 300)
	})
}

const drawTwitter = async (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	const { slug } = streamer
	// Background
	ctx.fillStyle = PURPLE
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	// Avatar
	ctx.fillStyle = DARKGRAY
	ctx.fillRect(100, 70, 220, 220)

	// Headline
	ctx.fillStyle = WHITE
	ctx.font = '62px "Roboto"'
	ctx.fillText('Charity Royale STATS', 370, 145)

	// Headline Streamername
	ctx.fillStyle = GOLD
	ctx.font = '112px "Roboto"'
	ctx.fillText(slug.toUpperCase(), 370, 260)

	// Spendensumme
	drawStats(ctx, 100, 395, 'Spendensumme', formatCurrency(streamer.current_donation_sum_net), 38, 68)

	// Top Spender:in
	const valueText = streamer.top_donors[0].username + ' ' + formatCurrency(streamer.top_donors[0].amount_net)
	drawStats(ctx, 100, 545, 'Top Spender:in', valueText, 38, 68)

	// Gesammelt für
	drawStats(ctx, 100, 700, 'Gesammelt für', 'Max, Sissi, Flox, Adam, C.', 38, 68)

	await loadImage(__dirname + '/img/cr_logo.png').then((data) => {
		ctx.drawImage(data, 90, ctx.canvas.height - 190, data.width * 0.7, data.height * 0.7)
	})

	await loadImage(__dirname + '/img/maw_logo.png').then((data) => {
		ctx.drawImage(data, ctx.canvas.width - 400, ctx.canvas.height - 170, data.width * 0.2, data.height * 0.2)
	})

	await loadImage(__dirname + '/img/' + `${streamer.slug}.png`).then((data) => {
		ctx.drawImage(data, 100, 70, 220, 220)
	})
}

const drawStats = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	title: string,
	value: string,
	titleFontSize: number,
	valueFontSize: number
) => {
	ctx.fillStyle = WHITE
	ctx.font = `${titleFontSize}px Roboto` //  38px
	ctx.fillText(title, x, y)

	ctx.fillStyle = GOLD
	ctx.font = `${valueFontSize}px Roboto` //  68px
	ctx.fillText(value, x, y + 90)
}
