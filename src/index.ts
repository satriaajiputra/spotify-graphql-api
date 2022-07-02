import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import Spotify from './api/services/spotify'
import cors from 'cors'
import { AlbumObjectFull, formatAlbum, formatPaging } from './formatters/spotify-formatter'
import type { AxiosError } from 'axios'
import baseUrl, { port } from './utils/base-url'
import schema from './schema'

const api = new Spotify()
const app: Application = express()
app.disable('x-powered-by')
app.use(cors())

app.get('/', (req, res) => res.json({
    message: 'Welcome to Miurev!'
}))

app.get('/search', async (req: Request, res: Response) => {
    res.set('Cache-control', 'max-age=' + 60 * 5)
    try {
        if (req.query.type != 'album') throw new Error('Currently supported types is album')

        const { data: result } = await api.search({
            q: req.query.q,
            type: req.query.type,
            limit: req.query.limit,
            offset: req.query.offset
        } as SpotifyApi.SearchForItemParameterObject)

        const data = result[req.query.type + 's'] as SpotifyApi.PagingObject<AlbumObjectFull>
        const results = formatPaging(data, '/search?' + new URLSearchParams({
            q: req.query.q as string,
            type: req.query.type
        }))

        results.items = data.items.map(item => {
            switch (req.query.type) {
                case 'album':
                    return (formatAlbum(item) as unknown) as AlbumObjectFull
                default:
                    return item
            }
        })

        return res.json(results)
    } catch (e: any) {
        const err: AxiosError = e
        console.error(err.message)
        if (err.response) {
            if (err.response.status === 429) {
                res.json({
                    message: 'Server is busy. Please wait for several minutes'
                }).status(409)
            }
        } else {
            return res.json({
                message: err.message || 'There is something problem with Our system.'
            }).status(500)
        }
    }
})

app.get('/album/:albumId', async (req: Request, res: Response) => {
    res.set('Cache-control', 'max-age=' + 60 * 5);
    try {
        const { data } = await api.album(req.params.albumId)
        res.json(formatAlbum(data))
    } catch (e) {
        res.send({
            message: (e as AxiosError).message
        })
    }
});

app.get('/album/:albumId/tracks', async (req: Request, res: Response) => {

})

app.use('/graphql', schema)

app.listen(port, () => console.log('Server running'));