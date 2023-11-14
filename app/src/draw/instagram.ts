import { loadImage, CanvasRenderingContext2D } from 'canvas'
import { IMG_DOWNLOADS_PATH } from '../config'
import { HEADING, drawBackground, drawStats } from './drawUtils'
import { WHITE, GOLD, IMAGE_PATH_MAW_LOGO, IMAGE_PATH_CR_LOGO, IMAGE_PATH_BG_INSTA_PATTERN } from './theme'
import { DrawData } from './draw'

const fontSizeStatsTitleValues = 52
const fontSizeStatsTextValues = 72

const statsGap = 95

const templateSpaceY = 235
const templateYStart = 740
const templateSlotsForSectionY: { [key: number]: number } = {
	0: templateYStart,
	1: templateYStart + 1 * templateSpaceY,
	2: templateYStart + 2 * templateSpaceY,
}

export const drawInstagram = async (ctx: CanvasRenderingContext2D, data: DrawData) => {
	const streamerName = data.streamerName.toLowerCase()
	const stats = data.stats

	drawBackground(ctx)
	await loadImage(`${IMAGE_PATH_BG_INSTA_PATTERN}`).then((data) => {
		ctx.drawImage(data, 0, 0, ctx.canvas.width, ctx.canvas.height)
	})

	setOriginXToCenter(ctx)

	drawStreamerName(ctx, streamerName.toUpperCase())
	for (let i = 0; i < 3; i++) {
		if (streamerName.toUpperCase() === 'PAPAPLATTE' && i === 2) {
			drawStats(
				ctx,
				0,
				templateSlotsForSectionY[i],
				stats[i].title,
				stats[i].value,
				fontSizeStatsTitleValues,
				48,
				64,
				200
			)
			break
		}

		drawStats(
			ctx,
			0,
			templateSlotsForSectionY[i],
			stats[i].title,
			stats[i].value,
			fontSizeStatsTitleValues,
			fontSizeStatsTextValues,
			statsGap,
			200
		)
	}

	await loadImage(IMAGE_PATH_CR_LOGO).then((data) => {
		ctx.drawImage(data, -470, ctx.canvas.height - 300, data.width * 1.13, data.height * 1.13)
	})

	await loadImage(IMAGE_PATH_MAW_LOGO).then((data) => {
		ctx.drawImage(data, -90, ctx.canvas.height - 270, data.width * 0.33, data.height * 0.33)
	})

	await loadImage(`${IMG_DOWNLOADS_PATH}/${streamerName}.png`).then((data) => {
		ctx.shadowColor = 'rgba(0,0,0,0.8)'
		ctx.shadowBlur = 45
		ctx.drawImage(data, -150, 120, 300, 300)
		resetShadows(ctx)
	})
}

const setOriginXToCenter = (ctx: CanvasRenderingContext2D) => {
	ctx.translate(ctx.canvas.width / 2, 0)
}

const drawStreamerName = (ctx: CanvasRenderingContext2D, text: string) => {
	ctx.fillStyle = GOLD
	ctx.font = '112px "Roboto"'

	ctx.textAlign = 'center'
	setShadows(ctx, 10, 10, 'rgba(0,0,0,0.3)')
	ctx.fillText(text, 0, 580)
	resetShadows(ctx)
}

export const setShadows = (
	ctx: CanvasRenderingContext2D,
	offsetX: number,
	offsetY: number,
	shadowColor: string = 'rgba(0,0,0,0.5)'
) => {
	ctx.shadowOffsetX = offsetX
	ctx.shadowOffsetY = offsetY
	ctx.shadowColor = shadowColor
}

export const resetShadows = (ctx: CanvasRenderingContext2D) => {
	ctx.shadowOffsetX = 0
	ctx.shadowOffsetY = 0
	ctx.shadowColor = ''
	ctx.shadowBlur = 0
}
