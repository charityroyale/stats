import { MAKE_A_WISH_STREAMER_API_URL } from '../config'

export const fetchMakeAWishData = async (streamerName: string) => {
	try {
		const res = await fetch(`${MAKE_A_WISH_STREAMER_API_URL}/${streamerName}`)
		return (await res.json()) as MakeAWishStreamerDataResponse
	} catch (e) {
		throw new Error(`Couldn't fetch MAW data: ${e}`)
	}
}

export interface MakeAWishStreamerDataResponse {
	streamer: MakeAWishStreamer
	wishes: { [wishSlug: string]: MakeAWishStreamerWish }
}

export interface MakeAWishStreamerWish {
	id: number // some MAW internal ID
	color: string // some MAW internal color code
	slug: string // identifier
	kid_name: string | null
	wish: string // MAW internal title of wish
	donation_goal: string
	country: string // DE | AT
	current_donation_sum: string
	current_donation_sum_net: string
	current_donation_count: number
	recent_donations: MakeWishInfoJsonRecentDonation[]
	top_donors: MakeAWishTopDonator[]
}

export interface MakeAWishTopDonator {
	username: string
	amount_net: string
}

export interface MakeWishInfoJsonRecentDonation {
	unix_timestamp: number
	username: string
	amount: string
	amount_net: string
}

export interface MakeAWishStreamer {
	id: number
	name: string
	slug: string
	type: 'main' | 'community'
	color: string
	current_donation_sum: string
	current_donation_sum_net: string
	current_donation_count: number
	top_donors: MakeAWishInfoJsonTopDonation[]
}

export interface MakeAWishInfoJsonTopDonation {
	username: string
	amount_net: string
}
