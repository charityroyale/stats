import { Type, getCanvasContextByType } from '../utils'
import { MakeAWishStreamerDataResponse, MakeAWishStreamerWish } from '../apiClients/mawApiClient'
import { drawInstagram } from './instagram'
import { drawTwitter } from './twitter'

export const draw = async (type: Type, data: DrawData) => {
	const ctx = getCanvasContextByType(type)
	if (type === 'instagram') {
		await drawInstagram(ctx, data)
	} else {
		await drawTwitter(ctx, data)
	}
	return ctx.canvas
}

export interface DrawData {
	streamerName: string
	stats: { title: string; value: string | string[] }[]
}
