export type Route = '/' | '/quickreview'

export interface APIParams {
	eventName: string
	route: Route
	data: any
	requestTime: number
}
