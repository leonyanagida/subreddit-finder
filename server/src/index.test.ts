import request from 'supertest'
import app from './index'

describe('Index', () => {
  let req: any
  beforeAll(async () => {
    req = await request(app)
  })

  it('Can fetch subreddit data', async () => {
    const params = {
      userInput: 'javascript',
      afterId: '',
    }
    const data = await req.get(`/api/search`).set(params)
    expect(data.status).toBe(200)
  })
})
