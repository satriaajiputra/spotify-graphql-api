import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { port } from './utils/base-url'
import schema from './schema'

const app: Application = express()
app.disable('x-powered-by')
app.use(cors())

app.get('/', (_req: Request, res: Response) => res.json({
    message: 'Welcome to Spotify GraphQL API!'
}))

app.use('/graphql', schema)

app.listen(port, () => console.log('Server running'));