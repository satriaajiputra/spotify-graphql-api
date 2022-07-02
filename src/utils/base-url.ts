export const url = new URL(process.env.APP_URL || 'http://localhost:3000')
export const port = url.port || process.env.PORT || 3000
export default (path: string, params?: any) => {
    let searchParams = new URLSearchParams(params).toString()
    searchParams = searchParams.length > 0 ? '?' + searchParams : searchParams

    const trailingPath = (path.substring(0, 1) == '/' ? '' : '/');

    return url.origin + trailingPath + path + searchParams
}