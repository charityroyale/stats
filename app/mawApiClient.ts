/***************************
 * Make-A-Wish Austria API *
 ***************************/
const MAKE_A_WISH_BASE_URL = 'https://streamer.make-a-wish.at'
const INFO_JSON_PATH = 'charityroyale2022/info.json'

export const fetchMakeAWishData = async () => {
	try {
		const res = await fetch(`${MAKE_A_WISH_BASE_URL}/${INFO_JSON_PATH}`)
		return (await res.json()) as MakeAWishInfoJson
	} catch (e) {
		throw new Error(`Couldn't fetch MAW data: ${e}`)
	}
}

export interface MakeAWishInfoJson {
	streamers: { [streamerSlug: string]: MakeAWishStreamer }
}

export interface MakeAWishStreamer {
	id: number
	color: string
	slug: string
	type: 'main' | 'community'
	current_donation_sum: string
	current_donation_sum_net: string
	current_donation_count: number
	top_donors: MakeAWishInfoJsonTopDonation[]
}

export interface MakeAWishInfoJsonTopDonation {
	username: string
	amount_net: string
}
