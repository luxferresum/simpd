import KoaRouter from 'koa-router'

export function mpdService(mpd) {
	const router = new KoaRouter()

	router.get('/status', async function(ctx, next) {
		ctx.body = await mpd.status()
	})

	router.get('/lsinfo', async function(ctx, next) {
		console.log(ctx.request.query.uri)
		ctx.body = await mpd.lsinfo(ctx.request.query.uri)
	})

	router.post('/update', async function(ctx, next) {
		ctx.body = await mpd.update(ctx.request.body.fields.uri)
	})

	router.patch('/volume', async function(ctx, next) {
		await mpd.setvol(ctx.request.body.fields.volume)
		ctx.status = 204;// no content
	})

	return router.routes()
}

export default mpdService