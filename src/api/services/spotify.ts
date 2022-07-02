import { AxiosRequestConfig } from 'axios'
import Request from '../request'

export enum IncludeGroups {
    album = 'album',
    single = 'single',
    appears_on = 'appears_on',
    compilation = 'compilation'
}

interface AlbumTrackParams {
    limit?: number
    offset?: number
    market?: String
}

interface ArtistAlbumParams {
    include_groups?: IncludeGroups
    limit?: number
    market?: String
    offset?: number
}

export interface CategoryParams {
    country?: String
    limit?: number
    locale?: String
    offset?: number
}

export default class Spotify {
    search(query: SpotifyApi.SearchForItemParameterObject) {
        return Request.run({
            url: 'https://api.spotify.com/v1/search',
            params: {
                q: query.q,
                type: query.type,
                limit: query.limit || 20,
                offset: query.offset || 0
            }
        })
    }

    album(albumId: String, market?: String) {
        const requestConfig: AxiosRequestConfig = {
            url: 'https://api.spotify.com/v1/albums/' + albumId,
        };

        if (market) requestConfig['params'] = {
            market
        }

        return Request.run(requestConfig)
    }

    albums(albumIds: String, market?: String) {
        const params: any = {
            ids: albumIds
        }

        if (market) params['market'] = market

        const requestConfig: AxiosRequestConfig = {
            url: 'https://api.spotify.com/v1/albums',
            params
        };

        return Request.run(requestConfig)
    }

    albumTracks(albumId: String, params: AlbumTrackParams) {
        const requestConfig: AxiosRequestConfig = {
            url: 'https://api.spotify.com/v1/albums/' + albumId + '/tracks',
            params
        };

        return Request.run(requestConfig)
    }

    artist(artistId: String) {
        return Request.run({
            url: 'https://api.spotify.com/v1/artists/' + artistId
        })
    }

    artists(artistIds: String) {
        return Request.run({
            url: 'https://api.spotify.com/v1/artists',
            params: {
                ids: artistIds
            }
        })
    }

    artistAlbums(artistId: String, params: ArtistAlbumParams) {
        return Request.run({
            url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
            params
        })
    }

    track(trackId: String, market?: String) {
        const requestConfig: AxiosRequestConfig = {
            url: 'https://api.spotify.com/v1/tracks/' + trackId,
        };

        if (market) requestConfig['params'] = {
            market
        }

        return Request.run(requestConfig)
    }

    tracks(trackIds: String, market?: String) {
        const params: any = {
            ids: trackIds
        }

        if (market) params['market'] = market

        const requestConfig: AxiosRequestConfig = {
            url: 'https://api.spotify.com/v1/tracks',
            params
        };

        return Request.run(requestConfig)
    }

    categories(params: CategoryParams) {
        return Request.run({
            url: 'https://api.spotify.com/v1/browse/categories',
            params
        })
    }

    category(categoryId: String, country?: String, locale?: String) {
        return Request.run({
            url: 'https://api.spotify.com/v1/browse/categories/' + categoryId,
            params: {
                country, locale
            }
        })
    }
}