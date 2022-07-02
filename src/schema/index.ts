import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import schema from "./schema";
import Spotify, { CategoryParams } from '../api/services/spotify'

const api = new Spotify()

const rootValue = {
    search: async (args: SpotifyApi.SearchForItemParameterObject) => {
        try {
            const resp = await api.search(args as any)
            const data: SpotifyApi.SearchResponse = resp.data
            return data
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    album: async ({ id, market }: { id: String, market?: String }) => {
        try {
            const resp = await api.album(id, market)
            const data: SpotifyApi.AlbumObjectFull = resp.data
            return data
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    albums: async ({ ids, market }: { ids: String, market?: String }) => {
        try {
            const resp = await api.albums(ids, market)
            return {
                items: resp.data.albums
            }
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    albumTracks: async ({ id, limit, offset, market }: {
        id: String,
        limit?: number,
        offset?: number,
        market?: String
    }) => {
        try {
            const resp = await api.albumTracks(id, {
                limit, market, offset
            })
            const data: SpotifyApi.AlbumTracksResponse = resp.data
            return data
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    artist: async ({ id }: { id: String }) => {
        try {
            const resp = await api.artist(id)
            const data: SpotifyApi.ArtistObjectFull = resp.data
            return data
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    artists: async ({ ids }: { ids: String }) => {
        try {
            const resp = await api.artists(ids)
            return {
                items: resp.data.artists
            }
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    artistAlbums: async ({ id, include_groups, limit, market, offset }: {
        id: String,
        include_groups?: any,
        limit?: number,
        market?: String,
        offset?: number
    }) => {
        try {
            const resp = await api.artistAlbums(id, {
                include_groups, limit, market, offset
            })
            return resp.data
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    track: async ({ id, market }: { id: String, market?: String }) => {
        try {
            const resp = await api.track(id, market)
            const data: SpotifyApi.TrackObjectFull = resp.data
            return data
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    tracks: async ({ ids, market }: { ids: String, market?: String }) => {
        try {
            const resp = await api.tracks(ids, market)
            return {
                items: resp.data.tracks
            }
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    category: async ({ id, locale, country }: { id: String, locale?: String, country?: String }) => {
        try {
            const resp = await api.category(id, country, locale)
            return resp.data
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
    categories: async (params: unknown) => {
        try {
            const resp = await api.categories(params as CategoryParams)
            return resp.data.categories
        } catch (e) {
            throw new Error('Failed while getting the data')
        }
    },
}

export default graphqlHTTP({
    schema: buildSchema(schema),
    rootValue,
    graphiql: true
})