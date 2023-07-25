import { loadImage } from 'canvas'
import { IMG_DOWNLOADS_PATH } from '../config'
import { MakeAWishStreamer } from '../apiClients/mawApiClient'
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
import { WHITE, GOLD, IMAGE_PATH_CR_LOGO, IMAGE_PATH_MAW_LOGO } from './theme'
import { CanvasRenderingContext2D } from 'canvas'

export const drawTwitter = async (ctx: CanvasRenderingContext2D, streamer: MakeAWishStreamer) => {
	const { slug } = streamer

	drawBackground(ctx)
	drawAvatarBackground(ctx, 100, 70, 220, 220)

	drawHeading(ctx)
	drawStreamerName(ctx, slug.toUpperCase())

	drawStats(ctx, 100, 395, SUM_TITLE, formatCurrency(streamer.current_donation_sum_net), 38, 68)
	drawStats(ctx, 100, 545, TOP_DONORS_TITLE, formatUserWithAmount(streamer), 38, 68)
	drawStats(ctx, 100, 700, WISHES_TITLE, 'Max, Sissi, Flox, Adam, C.', 38, 68)

	await loadImage(IMAGE_PATH_CR_LOGO).then((data) => {
		ctx.drawImage(data, 90, ctx.canvas.height - 190, data.width * 0.7, data.height * 0.7)
	})

	await loadImage(IMAGE_PATH_MAW_LOGO).then((data) => {
		ctx.drawImage(data, ctx.canvas.width - 400, ctx.canvas.height - 170, data.width * 0.2, data.height * 0.2)
	})

	await loadImage(`${IMG_DOWNLOADS_PATH}/${streamer.slug}.png`).then((data) => {
		ctx.drawImage(data, 100, 70, 220, 220)
	})
}

const drawHeading = (ctx: CanvasRenderingContext2D, text = HEADING) => {
	ctx.fillStyle = WHITE
	ctx.font = '62px "Roboto"'
	ctx.fillText(text, 370, 145)
}

const drawStreamerName = (ctx: CanvasRenderingContext2D, text: string) => {
	ctx.fillStyle = GOLD
	ctx.font = '112px "Roboto"'
	ctx.fillText(text, 370, 260)
}
