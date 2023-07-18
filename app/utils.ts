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

export const currencyFormatter = Intl.NumberFormat('de-AT', {
	style: 'currency',
	currency: 'EUR',
})

export const formatCurrency = (money: string) => {
	return currencyFormatter.format(parseFloat(money))
}
