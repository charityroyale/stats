import { WHITE, GOLD, PURPLE } from './theme'
import { CanvasRenderingContext2D } from 'canvas'

export const HEADING = 'Charity Royale STATS'

export const SUM_TITLE = 'Spendensumme'
export const TOP_DONORS_TITLE = 'Top Spender:in'
export const WISHES_TITLE = 'Gesammelt für'

export const drawStats = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	title: string,
	value: string,
	titleFontSize: number,
	valueFontSize: number
) => {
	ctx.fillStyle = WHITE
	ctx.font = `${titleFontSize}px Roboto`
	ctx.fillText(title, x, y)

	ctx.fillStyle = GOLD
	ctx.font = `${valueFontSize}px Roboto`
	ctx.fillText(value, x, y + 90)
}

export const drawBackground = (ctx: CanvasRenderingContext2D) => {
	ctx.fillStyle = PURPLE
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
