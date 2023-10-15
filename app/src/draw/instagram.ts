import { loadImage, CanvasRenderingContext2D } from 'canvas'
import { IMG_DOWNLOADS_PATH } from '../config'
import { HEADING, drawBackground, drawStats } from './drawUtils'
import { WHITE, GOLD, IMAGE_PATH_MAW_LOGO, IMAGE_PATH_CR_LOGO, IMAGE_PATH_BG_INSTA_PATTERN } from './theme'
import { DrawData } from './draw'

const fontSizeStatsTitleValues = 52
const fontSizeStatsTextValues = 72

const statsGap = 84

const templateSlotsForSectionY: { [key: number]: number } = {
	0: 695,
	1: 950,
	2: 1200,
}

export const drawInstagram = async (ctx: CanvasRenderingContext2D, data: DrawData) => {
	const streamerName = data.streamerName.toLowerCase()
	const stats = data.stats

	drawBackground(ctx)
	await loadImage(`${IMAGE_PATH_BG_INSTA_PATTERN}`).then((data) => {
		ctx.drawImage(data, 0, 0, ctx.canvas.width, ctx.canvas.height)
	})
	drawHeading(ctx)

	setOriginXToCenter(ctx)

	drawStreamerName(ctx, streamerName.toUpperCase())
	for (let i = 0; i < 3; i++) {
		drawStats(
			ctx,
			0,
			templateSlotsForSectionY[i],
			stats[i].title,
			stats[i].value,
			fontSizeStatsTitleValues,
			fontSizeStatsTextValues,
			statsGap
		)
	}

	await loadImage(IMAGE_PATH_MAW_LOGO).then((data) => {
		ctx.drawImage(data, 50, ctx.canvas.height - 240, data.width * 0.25, data.height * 0.25)
	})

	await loadImage(IMAGE_PATH_CR_LOGO).then((data) => {
		ctx.drawImage(data, -400, ctx.canvas.height - 270, data.width * 0.9, data.height * 0.9)
	})

	await loadImage(IMAGE_PATH_MAW_LOGO).then((data) => {
		ctx.drawImage(data, 50, ctx.canvas.height - 240, data.width * 0.25, data.height * 0.25)
	})

	await loadImage(`${IMG_DOWNLOADS_PATH}/${streamerName}.png`).then((data) => {
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
