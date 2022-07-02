import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLType } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import Spotify from '../api/services/spotify'

const api = new Spotify()

const paginationType = <T extends GraphQLType>(type: T) => ({
    href: { type: new GraphQLNonNull(GraphQLString) },
    items: {
        type: new GraphQLNonNull(new GraphQLList(type))
    },
    limit: { type: new GraphQLNonNull(GraphQLInt) },
    next: { type: GraphQLString },
    offset: { type: new GraphQLNonNull(GraphQLInt) },
    previous: { type: GraphQLString },
    total: { type: new GraphQLNonNull(GraphQLInt) }
})

const imageType = new GraphQLObjectType({
    name: 'Image',
    fields: {
        height: {type: new GraphQLNonNull(GraphQLInt)},
        width: {type: new GraphQLNonNull(GraphQLInt)},
        url: {type: new GraphQLNonNull(GraphQLString)}
    }
})

const externalUrlsType = new GraphQLObjectType({
    name: 'ExternalUrls',
    fields: {
        spotify: {type: new GraphQLNonNull(GraphQLString)}
    }
})

const artistSimplifiedType = new GraphQLObjectType({
    name: 'Artist',
    fields: {
        external_urls: { type: externalUrlsType },
        href: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const albumSimplifiedType = new GraphQLObjectType({
    name: 'Album',
    fields: {
        album_type: { type: new GraphQLNonNull(GraphQLString) },
        artists: { type: new GraphQLList(artistSimplifiedType) },
        available_markets: { type: new GraphQLList(GraphQLString) },
        external_urls: { type: externalUrlsType },
        href: {type: new GraphQLNonNull(GraphQLString)},
        id: {type: new GraphQLNonNull(GraphQLString)},
        images: {type: new GraphQLNonNull(new GraphQLList(imageType))},
        name: {type: new GraphQLNonNull(GraphQLString)},
        release_date: {type: new GraphQLNonNull(GraphQLString)},
        release_date_precision: {type: new GraphQLNonNull(GraphQLString)},
        total_tracks: {type: new GraphQLNonNull(GraphQLInt)},
        type: {type: new GraphQLNonNull(GraphQLString)},
    }
})

const trackSimplifiedType = new GraphQLObjectType({
    name: 'Track',
    fields: {
        album: {type: albumSimplifiedType},
        artists: {type: new GraphQLList(artistSimplifiedType)},
        available_markets: {type: new GraphQLList(GraphQLString)},
        disc_number: {type: GraphQLInt},
        duration_ms: {type: GraphQLInt},
        explicit: {type: GraphQLBoolean},
        external_urls: {type: externalUrlsType},
        href: {type: GraphQLString},
        id: {type: new GraphQLNonNull(GraphQLString)},
        is_local: {type: GraphQLBoolean},
        name: { type: new GraphQLNonNull(GraphQLString) },
        popularity: {type: GraphQLInt},
        preview_url: {type: GraphQLString},
        track_number: {type: GraphQLInt},
        type: {type: GraphQLString},
    }
})

const trackPaginationType = new GraphQLObjectType({
    name: 'TrackPagination',
    fields: {
        ...paginationType(trackSimplifiedType)
    }
})

const searchType = new GraphQLObjectType({
    name: 'Search',
    fields: {
        tracks: {
            type: trackPaginationType,
        }
    }
})

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        search: {
            type: searchType,
            args: {
                q: { type: new GraphQLNonNull(GraphQLString) },
                type: { type: new GraphQLNonNull(GraphQLString) },
                include_external: { type: GraphQLString },
                limit: { type: GraphQLInt },
                market: { type: GraphQLString },
                offset: { type:GraphQLInt }
            },
            resolve: async (_, args) => {
                try {
                    const resp = await api.search(args as any)
                    const data: SpotifyApi.SearchResponse = resp.data
                    return data
                } catch (e) {
                    throw new Error('Failed while getting the data')
                }
            }
        }
    }
})

export default () => new GraphQLSchema({
    query: queryType
})

// const trackSimpleType = new GraphQLObjectType({
//     name: 'Track',
    
// })