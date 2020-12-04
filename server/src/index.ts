import express, { Response, Request } from 'express'
import fetch from 'node-fetch'
import path from 'path'
import rateLimit from 'express-rate-limit'
// Start express server
const app = express()
const PORT = process.env.PORT || 4000
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
})

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Body-parser is built into express
app.set('trust proxy', 1) // trust first proxy
// Priority serve any static files.
app.use(express.static(path.join(__dirname, '../../client/build')))
app.use('/api/', apiLimiter)
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const userInput = req.query.userInput
    const afterId = req.query.afterId ? req.query.afterId : ''
    await fetch(
      `https://www.reddit.com/subreddits/search.json?q=${userInput}&limit=10&count=10&after=${afterId}`,
    )
      .then((res: any) => res.json())
      .then((json: any) => {
        return res
          .status(200)
          .send({ subreddits: json.data.children, afterId: json.data.after })
      })
  } catch (err) {
    return res.status(404).send({ error: 'Subreddit not found!' })
  }
})

app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../client', 'build/index.html'))
})
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../client', 'build/index.html'))
})

// Fixes the EADDRINUSE error when running tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}...`)
  })
}

export default app
