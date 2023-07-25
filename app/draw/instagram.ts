import { loadImage, CanvasRenderingContext2D } from 'canvas'
import { IMG_DOWNLOADS_PATH } from '../config'
import { MakeAWishStreamer } from '../mawApiClient'
import { formatCurrency, formatUserWithAmount } from '../utils'
import {
	HEADING,
	SUM_TITLE,
	TOP_DONORS_TITLE,
	WISHES_TITLE,
	drawAvatarBackground,
	drawBackground,
	drawStats,
} from './drawUtils'
import { WHITE, GOLD, IMAGE_PATH_MAW_LOGO, IMAGE_PATH_CR_LOGO } from './theme'

export const drawInstagram = async (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	const { slug } = streamer

	drawBackground(ctx)
	drawAvatarBackground(ctx, -150, 120, 300, 300)
	drawHeading(ctx)

	setOriginXToCenter(ctx)

	drawStreamerName(ctx, slug.toUpperCase())

	drawStats(ctx, 0, 695, SUM_TITLE, formatCurrency(streamer.current_donation_sum_net), 38, 68)
	drawStats(ctx, 0, 950, TOP_DONORS_TITLE, formatUserWithAmount(streamer), 38, 68)
	drawStats(ctx, 0, 1200, WISHES_TITLE, 'Max, Sissi, Flox, Adam, C.', 38, 68)

	await loadImage(IMAGE_PATH_CR_LOGO).then((data) => {
		ctx.drawImage(data, -400, ctx.canvas.height - 270, data.width * 0.9, data.height * 0.9)
	})

	await loadImage(IMAGE_PATH_MAW_LOGO).then((data) => {
		ctx.drawImage(data, 50, ctx.canvas.height - 240, data.width * 0.25, data.height * 0.25)
	})

	await loadImage(`${IMG_DOWNLOADS_PATH}/${streamer.slug}.png`).then((data) => {
		ctx.drawImage(data, -150, 120, 300, 300)
	})
}

const setOriginXToCenter = (ctx: CanvasRenderingContext2D) => {
	ctx.translate(ctx.canvas.width / 2, 0)
}

const drawStreamerName = (ctx: CanvasRenderingContext2D, text: string) => {
	ctx.fillStyle = GOLD
	ctx.font = '112px "Roboto"'
	ctx.textAlign = 'center'
	ctx.fillText(text, 0, 560)
}

const drawHeading = (ctx: CanvasRenderingContext2D, text = HEADING) => {
	ctx.fillStyle = WHITE
	ctx.font = '62px "Roboto"'
	ctx.save()
	ctx.translate(100, 400)
	ctx.rotate(-Math.PI / 2)
	ctx.textAlign = 'center'
	ctx.fillText(text, 0, 0)
	ctx.restore()
}
