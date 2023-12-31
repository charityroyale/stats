import winston, { format, Logger } from 'winston'

const createLogger = (label: string): Logger =>
	winston.createLogger({
		format: format.combine(
			format.timestamp(),
			format.label({ label }),
			format.printf((info) => `${info.timestamp} - [${info.level}] - ${info.message}`)
		),
		level: 'info',
		transports: new winston.transports.Console(),
	})

export const logger = createLogger('Web')
