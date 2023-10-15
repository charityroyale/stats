import { loadImage } from 'canvas'
import { IMG_DOWNLOADS_PATH } from '../config'
import { MakeAWishStreamerDataResponse } from '../apiClients/mawApiClient'
import { formatCurrency, formatUserWithAmount, formatWishes } from '../utils'
import { HEADING, SUM_TITLE, TOP_DONORS_TITLE, WISHES_TITLE, drawBackground, drawStats } from './drawUtils'
import { WHITE, GOLD, IMAGE_PATH_CR_LOGO, IMAGE_PATH_MAW_LOGO, IMAGE_PATH_BG_TWITTER_PATTERN } from './theme'
import { CanvasRenderingContext2D } from 'canvas'
import { DrawData } from './draw'

const templateSlotsForSectionY: { [key: number]: number } = {
	0: 395,
	1: 545,
	2: 700,
}

const fontSizeStatsValues = 58
export const drawTwitter = async (ctx: CanvasRenderingContext2D, data: DrawData) => {
	const streamerName = data.streamerName.toLowerCase()
	const stats = data.stats

	drawBackground(ctx)
	await loadImage(`${IMAGE_PATH_BG_TWITTER_PATTERN}`).then((data) => {
		ctx.drawImage(data, 0, 0, ctx.canvas.width, ctx.canvas.height)
	})
	drawHeading(ctx)
	drawStreamerName(ctx, streamerName.toUpperCase())

	for (let i = 0; i < 3; i++) {
		drawStats(ctx, 100, templateSlotsForSectionY[i], stats[i].title, stats[i].value, 38, fontSizeStatsValues, 68, 400)
	}

	await loadImage(IMAGE_PATH_CR_LOGO).then((data) => {
		ctx.drawImage(data, 90, ctx.canvas.height - 190, data.width * 0.7, data.height * 0.7)
	})

	await loadImage(IMAGE_PATH_MAW_LOGO).then((data) => {
		ctx.drawImage(data, ctx.canvas.width - 400, ctx.canvas.height - 170, data.width * 0.2, data.height * 0.2)
	})

	await loadImage(`${IMG_DOWNLOADS_PATH}/${streamerName}.png`).then((data) => {
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
