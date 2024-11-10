import { loadImage } from 'canvas'
import { IMG_DOWNLOADS_PATH } from '../config'
import { HEADING, drawBackground, drawStats } from './drawUtils'
import { WHITE, GOLD, IMAGE_PATH_CR_LOGO, IMAGE_PATH_MAW_LOGO, IMAGE_PATH_BG_TWITTER_PATTERN } from './theme'
import { CanvasRenderingContext2D } from 'canvas'
import { DrawData } from './draw'
import { resetShadows, setShadows } from './instagram'

const templateSpaceY = 150
const templateYStart = 375
const templateSlotsForSectionY: { [key: number]: number } = {
	0: templateYStart,
	1: templateYStart + 1 * templateSpaceY,
	2: templateYStart + 2 * templateSpaceY,
}

const leftPadding = 70
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

	if (data.multiStreamers) {
		drawMultiStreamers(ctx, `mit ${data.multiStreamers?.join(',')}`)
	}

	for (let i = 0; i < 3; i++) {
		if (streamerName.toUpperCase() === 'PAPAPLATTE' && i === 2) {
			drawStats(ctx, leftPadding, templateSlotsForSectionY[i], stats[i].title, stats[i].value, 38, 32, 48, 200)
			break
		}
		drawStats(
			ctx,
			leftPadding,
			templateSlotsForSectionY[i],
			stats[i].title,
			stats[i].value,
			38,
			fontSizeStatsValues,
			68,
			200
		)
	}

	await loadImage(IMAGE_PATH_CR_LOGO).then((data) => {
		ctx.drawImage(data, ctx.canvas.width - 350, ctx.canvas.height - 235, data.width * 0.95, data.height * 0.95)
	})

	await loadImage(IMAGE_PATH_MAW_LOGO).then((data) => {
		ctx.drawImage(data, leftPadding, ctx.canvas.height - 190, data.width * 0.28, data.height * 0.28)
	})

	await loadImage(`${IMG_DOWNLOADS_PATH}/${streamerName}.png`).then((data) => {
		ctx.shadowColor = 'rgba(0,0,0,0.8)'
		ctx.shadowBlur = 45
		ctx.drawImage(data, leftPadding, 70, 220, 220)
		resetShadows(ctx)
	})
}

const headingLeftPadding = 340
const drawHeading = (ctx: CanvasRenderingContext2D, text = HEADING) => {
	ctx.fillStyle = WHITE
	ctx.font = '62px "Roboto"'
	ctx.fillText(text, headingLeftPadding, 155)
}

const drawStreamerName = (ctx: CanvasRenderingContext2D, text: string) => {
	ctx.fillStyle = GOLD
	ctx.font = '78px "Roboto"'
	setShadows(ctx, 8, 8, 'rgba(0,0,0,0.3)')
	ctx.fillText(text, headingLeftPadding, 255)
	resetShadows(ctx)
}

const drawMultiStreamers = (ctx: CanvasRenderingContext2D, text: string) => {
	ctx.fillStyle = GOLD
	ctx.font = '32px "Roboto"'
	setShadows(ctx, 8, 8, 'rgba(0,0,0,0.3)')
	ctx.fillText(text, headingLeftPadding, 305)
	resetShadows(ctx)
}
