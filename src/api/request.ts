import 'dotenv/config'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import type { AxiosInstance } from 'axios'
import axiosCacheAdapter from 'axios-cache-adapter'
import Authorization, { Session } from './authorization'

const { setupCache } = axiosCacheAdapter
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const tokenEndpoint = 'https://accounts.spotify.com/api/token'

export default class Request {
    static instance: Request;

    retryAfter?: number | null;

    #api: AxiosInstance;

    constructor() {
        const cache = setupCache({
            maxAge: 2 * 60 * 1000 // 2 minutes
        })

        this.#api = axios.create({
            adapter: cache.adapter,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })

        this.#api.interceptors.response.use((resp) => {
            this.retryAfter = null;
            return resp
        }, (err: AxiosError) => {
            const response = err.response
            if (response) {
                const retryAfter = response.headers['Retry-After']
                if (retryAfter) {
                    this.retryAfter = Date.now() + parseInt(retryAfter)
                } else this.retryAfter = null;
            }
            return err
        })
    }

    static run(config: AxiosRequestConfig) {
        if (!this.instance) this.instance = new Request
        return this.instance.makeRequest(config)
    }

    async #getAccessToken(): Promise<Session | undefined> {
        try {
            const { data } = await this.#api.post<Session>(tokenEndpoint, new URLSearchParams({
                grant_type: 'client_credentials'
            }), {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            return data
        } catch (e) {
            console.error((e as AxiosError).message)
        }
    }

    async makeRequest(config: AxiosRequestConfig) {
        if (this.retryAfter) {
            if (this.retryAfter > Date.now()) return {
                data: {
                    message: 'Server is busy'
                }
            }
        }

        // get authorization session
        const session = await Authorization.init().authorize(async () => {
            return await this.#getAccessToken()
        })

        if (!config.headers) config.headers = {}
        config.headers['Authorization'] = 'Bearer ' + session.access_token || ''

        return await this.#api.request(config)
    }
}

// Example of use

// Request.run({
//     url: 'https://api.spotify.com/v1/search',
//     params: {
//         type: 'album',
//         include_external: 'audio',
//         q: 'suste',
//         limit: 2
//     }
// }).then(resp => resp.data)
//     .then(data => console.log(data))