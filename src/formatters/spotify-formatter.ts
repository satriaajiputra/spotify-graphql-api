/// <reference types="spotify-api" />

import baseUrl from "../utils/base-url"

export interface Image {
    url: string,
    height: string,
    width: string
}

export interface Artist {
    external_urls: string,
    genres: string[],
    id: string,
    name: string,
    type: string,
    uri: string,
    images: SpotifyApi.ImageObject[]
}

export interface Album {
    id: string,
    name: string,
    release_date: string,
    release_date_precission: string,
    images: SpotifyApi.ImageObject[],
    external_urls: string,
    artists: Artist[],
    album_type: string,
    total_tracks: number,
    type: string,
    uri: string,
    tracks?: SpotifyApi.PagingObject<Pick<
        SpotifyApi.TrackObjectSimplified, "disc_number" | "duration_ms" | "explicit" | "external_urls" | "id" | "is_playable" | "track_number" | "name" | "preview_url"
    >>
}

export interface AlbumObjectFull extends SpotifyApi.AlbumObjectFull {
    artists: SpotifyApi.ArtistObjectFull[]
}

/**
 * 
 * @param path next or prev path
 */
export const formatPaging = <T>(paging: SpotifyApi.PagingObject<T>, path: string) => {
    if (paging.next) {
        const next = new URL(paging.next)
        paging.next = baseUrl(path, {
            limit: next.searchParams.get('limit') || 0,
            offset: next.searchParams.get('offset') || 0,
        })
    }

    if (paging.previous) {
        const previous = new URL(paging.previous)
        paging.previous = baseUrl(path, {
            limit: previous.searchParams.get('limit') || 0,
            offset: previous.searchParams.get('offset') || 0,
        })
    }

    return paging
}

export const formatAlbum = (album: AlbumObjectFull): Album => ({
    id: album.id,
    name: album.name,
    release_date: album.release_date,
    release_date_precission: album.release_date_precision,
    images: album.images,
    total_tracks: album.total_tracks,
    external_urls: album.external_urls.spotify,
    artists: album.artists.map((artist: SpotifyApi.ArtistObjectFull): Artist => ({
        external_urls: artist.external_urls.spotify,
        genres: artist.genres,
        images: artist.images,
        id: artist.id,
        name: artist.name,
        type: artist.type,
        uri: artist.uri
    })),
    album_type: album.album_type as string,
    type: album.type,
    uri: album.uri,
    tracks: !album.tracks ? undefined : {
        ...album.tracks,
        items: album.tracks.items.map(item => ({
            disc_number: item.disc_number,
            duration_ms: item.duration_ms,
            explicit: item.explicit,
            external_urls: item.external_urls,
            id: item.id,
            name: item.name,
            preview_url: item.preview_url,
            track_number: item.track_number,
            is_playable: item.is_playable
        }))
    }
})

// export const formatTrack = (track) => ({
//     id: album.id,
//     name: album.name,
//     release_date: album.release_date,
//     release_date_precission: album.release_date_precission,
//     images: album.images,
//     external_urls: album.external_urls,
//     artists: album.artists.map(artist => ({
//         external_urls: artist.external_urls,
//         id: artist.id,
//         name: artist.name,
//         type: artist.type,
//         uri: artist.uri
//     })),
//     album_type: album.album_type,
//     type: album.type,
//     uri: album.uri,
// })