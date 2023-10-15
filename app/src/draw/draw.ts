import { Type, getCanvasContextByType } from '../utils'
import { MakeAWishStreamer, MakeAWishStreamerDataResponse, MakeAWishStreamerWish } from '../apiClients/mawApiClient'
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
	wishes: MakeAWishStreamerDataResponse['wishes']
	stats: DrawSectionType[]
	statsData: MakeAWishStreamerWish | MakeAWishStreamer
}

type DrawSectionType = 'DONATION_SUM' | 'TOP_DONATOR' | 'WISH_KID_NAME'
