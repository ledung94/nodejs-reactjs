export const LOCAL_STORAGE_TOKEN_NAME = 'token'

export const apiUrl = process.env.NODE_ENV !== 'product'
                    ? 'http://localhost:5000/api'
                    : ''