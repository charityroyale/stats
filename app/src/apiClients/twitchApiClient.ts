import * as fs from 'fs'
import { logger } from '../../logger'
import { IMG_DOWNLOADS_PATH } from '../config'

export const fetchTwitchUser = async (loginName: string) => {
	const res = await fetch(`https://api.twitch.tv/helix/users?login=${loginName}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
			'Client-Id': `${process.env.TWITCH_CLIENT_ID}`,
		},
	})
	if (!res.ok) {
		throw new Error(`HTTP Error ${res.status}: returned bad http status code for user "${loginName}".`)
	}
	return (await res.json()) as TwitchUsersData
}

export const downloadAndSaveImageFromUrl = async (
	downloadUrl: string,
	outputFileName: string,
	outputPath: string = IMG_DOWNLOADS_PATH
): Promise<void> => {
	if (downloadUrl.length < 0) {
		logger.info(`DownloadUrl for "${outputFileName}" is empty string.`)
		return
	}

	const destination = `${outputPath}/${outputFileName}.png`
	if (fs.existsSync(destination)) {
		logger.info(`Canceling image download. The following file already exists: "${destination}"`)
		return
	}

	try {
		const response = await fetch(downloadUrl)
		const arrayBuffer = await response.arrayBuffer()
		fs.writeFileSync(destination, Buffer.from(arrayBuffer))
		logger.info(`Successfully downloaded and saved file "${outputFileName}" to "${destination}"`)
	} catch (error) {
		logger.error(
			`Couldn't download from url "${downloadUrl}" and save file "${outputFileName}" to "${destination}". ${error}`
		)
	}
}

export interface TwitchUsersData {
	data: TwitchUser[]
}

export interface TwitchUser {
	id: string
	login: string
	login_name: string
	display_name: string
	type: string
	broadcaster_type: string
	description: string
	profile_image_url: string
	offline_image_url: string
	view_count: number
}
