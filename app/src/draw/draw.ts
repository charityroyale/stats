import { Type, getCanvasContextByType } from '../utils'
import { MakeAWishStreamer } from '../apiClients/mawApiClient'
import { drawInstagram } from './instagram'
import { drawTwitter } from './twitter'

export const draw = async (type: Type, streamer: MakeAWishStreamer) => {
	const ctx = getCanvasContextByType(type)
	if (type === 'instagram') {
		await drawInstagram(ctx, streamer)
	} else {
		await drawTwitter(ctx, streamer)
	}
	return ctx.canvas
}
