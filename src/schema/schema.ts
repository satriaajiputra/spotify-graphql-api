const schema = `#graphql
enum IncludeExternal {
    audio
}

enum AlbumType {
    album
    single
    compilation
}

enum ReleaseDatePrecision {
    year
    month
    day
}

enum RestrictionReason {
    market
    product
    explicit
}

type ExternalUrls {
    spotify: String!
}

type ExternalIds {
    isrc: String
    ean: String
    upc: String
}

type Image {
    width: Int!
    height: Int!
    url: String!
}

type Followers {
    href: String
    total: Int!
}

type Owner {
    display_name: String!
    external_urls: ExternalUrls
    href: String
    id: ID!
    type: String!
    uri: String
}

type TracksMeta {
    href: String
    total: Int!
}

type Restrictions {
    reason: RestrictionReason
}

type Copyright {
    text: String
    type: String
}

type SimplifiedArtist {
    external_urls: ExternalUrls
    href: String
    id: ID!
    name: String!
    type: String!
    uri: String
    followers: Followers
    genres: [String!]
    popularity: Int
    images: [Image!]
}

type SimplifiedAlbum {
    album_type: AlbumType!
    artists: [SimplifiedArtist!]
    available_markets: [String!]
    external_urls: ExternalUrls,
    href: String
    id: ID!
    images: [Image!]
    name: String!
    release_date: String
    release_date_precision: ReleaseDatePrecision
    total_tracks: Int!
    type: String!
    uri: String
}

type SimplifiedTrack {
    album: SimplifiedAlbum
    artists: [SimplifiedArtist!]
    available_markets: [String!]
    disc_number: Int
    duration_ms: Int!
    explicit: Boolean!
    external_ids: ExternalIds
    external_urls: ExternalUrls
    href: String
    id: ID!
    is_local: Boolean!
    name: String!
    popularity: Int
    preview_url: String
    track_number: Int
    type: String!
    uri: String
}

type SimplifiedPlaylist {
    collaborative: Boolean!
    description: String
    external_urls: ExternalUrls
    href: String
    id: ID!
    images: [Image!]
    name: String!
    owner: Owner!
    primary_color: String
    public: Boolean
    snapshot_id: String
    tracks: TracksMeta
    type: String!
    uri: String
}

type Category {
    href: String!
    icons: [Image!]!
    id: ID!
    name: String!
}

type PaginationTrack {
    href: String!
    items: [SimplifiedTrack!]
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
}

type PaginationAlbum {
    href: String!
    items: [SimplifiedAlbum!]
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
}

type PaginationArtist {
    href: String!
    items: [SimplifiedArtist!]
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
}

type PaginationPlaylist {
    href: String!
    items: [SimplifiedPlaylist!]
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
}

type Album {
    album_group: String
    album_type: AlbumType!
    total_tracks: Int!
    available_markets: [String!]
    external_urls: ExternalUrls,
    href: String
    id: ID!
    images: [Image!]
    name: String!
    release_date: String
    release_date_precision: ReleaseDatePrecision
    restrictions: Restrictions
    type: String!
    uri: String
    artists: [SimplifiedArtist!]
    tracks: PaginationTrack
    copyrights: [Copyright!]
}

type Albums {
    items: [Album!]
}

type Artists {
    items: [SimplifiedArtist!]
}

type Tracks {
    items: [SimplifiedTrack!]
}

type PaginationCategories {
    href: String!
    items: [Category!]
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
}

type PaginationArtistAlbums {
    href: String!
    items: [Album!]
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
}

type Search {
    tracks: PaginationTrack
    albums: PaginationAlbum
    artists: PaginationArtist
    playlists: PaginationPlaylist
}

type Query {
    search(
        # Search query
        q: String!
        """
        Type of search
        Allowed values: "album", "artist", "playlist", "track", "show", "episode".
        For multiple types use comma separator. Example: album,track.
        Notes: for episodes and show still in construction
        """
        type: String!
        """
        An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) or the string 'from_token'.
        If a country code is specified, only artists, albums, and tracks with content that is playable in that market is returned.
        """
        market: String
         """
        The maximum number of results to return.
        Default: '20'. Minimum: '1'. Maximum: '50'.
         """
        limit: Int
        """
        The index of the first result to return.
        Default: '0' (first result). Maximum offset (including limit): '2,000'.
        Use with limit to get the next page of search results.
        """
        offset: Int
        """
        Possible values: 'audio'.
        If 'include_external=audio' is specified, the response will include any relevant audio content that is hosted externally.
        By default external content is filtered out from responses.
        """
        include_external: IncludeExternal
    ): Search

    """
    Get album by id
    """
    album(id: ID! market: String): Album

    """
    **Get several albums**

    Example ids = 382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc
    Maximal 20 ids
    """
    albums(ids: String! market: String): Albums

    """
    Get album tracks
    """
    albumTracks(id: ID! limit: Int offset: Int market: String): PaginationTrack

    artist(id: ID!): SimplifiedArtist

    """
    **Get several artists**

    Example ids = 382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc
    Maximal 50 ids
    """
    artists(ids: String!): Artists

    artistAlbums(id: ID! include_groups: String limit: Int offset: Int market: String offset: Int): PaginationArtistAlbums
    
    track(id: ID! market: String): SimplifiedTrack

    tracks(ids: String! market: String): Tracks

    categories(country: String limit: Int  locale: String offset: Int): PaginationCategories

    category(id: ID! country: String locale: String): Category
}
`

export default schema