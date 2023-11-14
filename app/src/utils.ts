import { Canvas, createCanvas } from 'canvas'
import { Response } from 'express'
import { logger } from '../logger'
import { StatsRequestParams } from '../server'
import { MakeAWishStreamer, MakeAWishStreamerWish } from './apiClients/mawApiClient'

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

export const formatUserWithAmount = (data: MakeAWishStreamerWish | MakeAWishStreamer) => {
	if (!data.top_donors || data.top_donors.length < 0) {
		logger.info(`Streamer with slug "${data.slug}" does not have any donors in list "top_donors".`)
		return '-'
	}

	const topDonor = data.top_donors[0]?.username ?? '-'
	return topDonor.toLowerCase() === 'papaplatte'
		? data.top_donors[1]?.username ?? '-'
		: data.top_donors[0]?.username ?? '-'
}

export const hasValidRequestParams = (params: StatsRequestParams) => {
	return !params.streamer || params.streamer.length < 0 || !(params.type !== 'instagram' && params.type !== 'twitter')
}

export const formatWish = (wish: MakeAWishStreamerWish) => {
	return [`${wish.wish}`, `${wish.kid_name ?? wish.slug}`]
}

export const formatWishes = (wishes: { [wishSlug: string]: MakeAWishStreamerWish }) => {
	if (Object.keys(wishes).length < 1) {
		return '-'
	}

	const wishKeys = Object.keys(wishes)
	if (wishKeys.length === 1) {
		return wishes[wishKeys[0]].kid_name ?? wishes[wishKeys[0]].wish ?? wishes[wishKeys[0]].slug
	}

	const kidNames = wishKeys.map((key) => wishes[key].kid_name ?? wishes[key].slug).join(', ')

	return kidNames
}
