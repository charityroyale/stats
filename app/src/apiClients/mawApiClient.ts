import { MAKE_A_WISH_INFO_JSON, MAKE_A_WISH_STREAMER_API_URL } from '../config'

export const fetchMakeAWishData = async (streamerName: string) => {
	try {
		const res = await fetch(`${MAKE_A_WISH_STREAMER_API_URL}/${streamerName}`)
		return (await res.json()) as MakeAWishStreamerDataResponse
	} catch (e) {
		throw new Error(`Couldn't fetch MAW data: ${e}`)
	}
}

export async function fetchMakeAWishDataInfoJson() {
	try {
		const res = await fetch(MAKE_A_WISH_INFO_JSON)
		return (await res.json()) as MakeAWishInfoJsonDTO
	} catch (e) {
		console.log(`Couldn't fetchMakeAWishData: ${e}`)
		return null
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

export type StreamerType = 'main' | 'community'

/**
 * Clientside DTO
 * Latest changes and updates
 */
export class MakeAWishInfoJsonDTO {
	public id = '' // some MAW internal ID
	public total_donation_sum = '' // sum of donations
	public total_donation_sum_net = '' // sum of donations netto - without taxes - pure
	public total_donation_count = -1 // count of unqique donators
	public last_update = -1 // unix timestamp of latest update
	public streamers = {} as { [streamerSlug: string]: MakeAWishStreamerDTO }
	public wishes = {} as { [wishSlug: string]: MakeAWishRootLevelWishDTO }
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = [] // latest 10 donations made over all wishes
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = [] // top 10 donations made over all wishes
}

// Streamer DTOs
export class MakeAWishWishStreamerDTO {
	public id = -1 // some MAW internal ID
	public current_donation_sum = ''
	public slug = '' // identifier, streamchannel twitch in lower case
	public current_donation_count = -1
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
}

export class MakeAWishStreamerDTO {
	public id = -1 // some MAW internal ID
	public color = '' // some MAW internal color code
	public slug = '' // identifier, streamchannel twitch in lower case
	public name = '' // streamer name
	public type: StreamerType = 'main' // 'main' or 'community'
	public current_donation_sum = ''
	public current_donation_sum_net = '0'
	public current_donation_count = -1
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
	public wishes: [] | { [wishSlug: string]: MakeAWishStreamerWishDTO } = []
}

// Wish DTOs
export class MakeAWishRootLevelWishDTO {
	public id = -1 // some MAW internal ID
	public color = '' // some MAW internal color code
	public slug = '' // identifier
	public kid_name = ''
	public wish = '' // MAW internal title of wish
	public donation_goal = ''
	public country = '' // DE | AT
	public current_donation_sum = '0'
	public current_donation_sum_net = '0'
	public current_donation_count = -1
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
	public streamers: [] | { [streamerSlug: string]: MakeAWishWishStreamerDTO } = [] // streamers who are fullfilling this wish
}

export class MakeAWishStreamerWishDTO {
	public id = -1 // some MAW internal ID
	public slug = '' // identifier
	public current_donation_sum = '0'
	public current_donation_sum_net = '0'
	public current_donation_count = -1
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
}

// Donation DTOs
export class MakeWishInfoJsonRecentDonationDTO {
	public unix_timestamp = -1
	public username = ''
	public amount = ''
	public amount_net = ''
}

export class MakeAWishInfoJsonTopDonationDTO {
	public username = ''
	public amount_net = '' // netto - pure - without taxes --> ! will be renamed by MAW
}
