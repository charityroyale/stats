import { WHITE, GOLD, PURPLE } from './theme'
import { CanvasRenderingContext2D } from 'canvas'

export const HEADING = 'Charity Royale STATS'

export const SUM_TITLE = 'Spendensumme'
export const TOP_DONORS_TITLE = 'Top Spender:in'
export const WISHES_TITLE = 'Gesammelt für'

const defaultGap = 68
export const drawStats = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	title: string,
	text: string,
	titleFontSize: number,
	valueFontSize: number,
	gap: number = defaultGap,
	threshold: number = 200
) => {
	ctx.fillStyle = WHITE
	ctx.font = `${titleFontSize}px Roboto`
	ctx.fillText(title, x, y)

	ctx.fillStyle = GOLD
	ctx.font = `${valueFontSize}px Roboto`

	// Draw multiple lines of text content that contains ", "
	// and is exceeding max width threshold
	if (ctx.measureText(text).width > ctx.canvas.width - threshold && text.includes(', ')) {
		const lineTexts = text.split(', ')

		let textBlockRows = []
		let textToDraw = ''

		for (let i = 0; i < lineTexts.length; i++) {
			if (ctx.measureText(textToDraw).width >= ctx.canvas.width - threshold) {
				textBlockRows.push(textToDraw)
				textToDraw = ''
			}
			textToDraw += lineTexts[i] + ', '
		}
		textBlockRows.push(textToDraw.slice(0, textToDraw.lastIndexOf(', ')))

		for (let j = 0; j < textBlockRows.length; j++) {
			ctx.fillText(textBlockRows[j], x, y + gap * (j + 1))
		}
	} else {
		ctx.fillText(text, x, y + gap)
	}
}

export const drawBackground = (ctx: CanvasRenderingContext2D) => {
	ctx.fillStyle = PURPLE
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
