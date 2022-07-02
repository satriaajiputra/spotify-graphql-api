import { readFileSync, writeFileSync, } from 'fs'

export interface Session {
    access_token: string | null,
    expires_in: number | null,
    token_type: string,
    expires_at: number | null
}

export interface RequestTokenCallback {
    (): Promise<Session | undefined>
}

export default class Authorization {
    static instance: Authorization;

    static init() {
        if (!this.instance) this.instance = new Authorization;
        return this.instance
    }

    async authorize(requestTokenCallback: RequestTokenCallback) {
        let session = this.#getSession()

        if ((!session.access_token || !session.expires_at) || session.expires_at <= Date.now()) {
            const newSession = await requestTokenCallback()

            if (!newSession) throw new Error('Authorization cannot receive new access token')

            session = {
                access_token: newSession.access_token,
                expires_in: newSession.expires_in,
                token_type: newSession.token_type,
                expires_at: Date.now() + (parseInt((newSession.expires_in as unknown) as string) - (60 * 1)) * 1000 // 50 minutes
            }
            this.#writeSession(session)
        }

        return session;
    }

    #getSession(): Session {
        let session;

        try {
            session = JSON.parse(
                (readFileSync(__dirname + '/session.json') as unknown) as string
            )
        } catch (e) {
            // file is not exists
        } finally {
            if (!session) {
                this.#writeSession({
                    access_token: null,
                    expires_in: null,
                    token_type: 'bearer',
                    expires_at: null
                })
                session = this.#getSession()
            }
        }

        return session
    }

    #writeSession(session: Session) {
        writeFileSync(__dirname + '/session.json', JSON.stringify(session))
    }
}