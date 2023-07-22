import * as fs from 'fs'

export const fetchTwitchUser = async (loginName: string) => {
	try {
		const res = await fetch(`https://api.twitch.tv/helix/users?login=${loginName}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
				'Client-Id': `${process.env.TWITCH_CLIENT_ID}`,
			},
		})
		if (!res.ok) {
			throw new Error(`HTTP Error ${res.status}: fetching twitch user "${loginName}" was not successfull`)
		}
		return (await res.json()) as TwitchUsersDTO
	} catch (e) {
		console.log(`Couldn't fetchTwitchUsersBySchedule: ${e}`)
	}
}

export class TwitchUsersDTO {
	public data = [] as TwitchUserDTO[]
}

export class TwitchUserDTO {
	public id = ''
	public login = ''
	public login_name = ''
	public display_name = ''
	public type = ''
	public broadcaster_type = ''
	public description = ''

	public profile_image_url = ''
	public offline_image_url = ''
	public view_count = -1
}

export const downloadImage = async (imageUrl: string, outputPath: string = './downloaded-image.jpg'): Promise<void> => {
	try {
		const response = await fetch(imageUrl)

		if (!response.ok) {
			throw new Error('Failed to download image. Invalid response from server.')
		}

		const arrayBuffer = await response.arrayBuffer()
		fs.writeFileSync(outputPath, Buffer.from(arrayBuffer))
		console.log('Image downloaded successfully.')
	} catch (error) {
		console.error('Error occurred while downloading the image:', error)
	}
}
