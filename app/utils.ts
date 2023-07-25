import { Canvas, createCanvas } from 'canvas'
import { logger } from './logger'
import { StatsRequestParams } from './server'
import { Response } from 'express'

export type Type = 'instagram' | 'twitter'
export const canvasSizeByType = (type: Type) => {
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

export const getCanvasContextByType = (type: Type) => {
	const { width, height } = canvasSizeByType(type)
	const canvas: Canvas = createCanvas(width, height)
	return canvas.getContext('2d')
}

export const currencyFormatter = Intl.NumberFormat('de-AT', {
	style: 'currency',
	currency: 'EUR',
})

export const formatCurrency = (money: string) => {
	return currencyFormatter.format(parseFloat(money))
}

export const validateRequestParams = (params: StatsRequestParams, res: Response) => {
	if (!params.streamer || params.streamer.length < 0 || (params.type !== 'instagram' && params.type !== 'twitter')) {
		logger.error(`Invalid params for request "${params}". Returning HTTP 400 response.`)
		return res.status(400).send({
			status: 400,
			result: `Validation failed for "${JSON.stringify(params)}"`,
		})
	}
}
