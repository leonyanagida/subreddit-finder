import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
// My Components
import Footer from './components/Footer'
import Item from './components/Item'
import Spacer from './components/Spacer'

interface ISubredditItem {
  data: {
    public_description?: string
    display_name?: string
    icon_img?: string
    title?: string
    url?: string
  }
}

function App(): JSX.Element {
  const [afterId, setAfterId] = useState<string | null>() // Used to keep track of pagination: Reddit API
  const [subreddits, setSubreddits] = useState<ISubredditItem[]>([])
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
  const [isFetchedDataEmpty, setIsFetchedDataEmpty] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [isFetchingError, setIsFetchingError] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>('')
  const [storeUserInput, setStoreUserInput] = useState<string>('')

  useEffect(() => {
    setIsPageLoading(true)
    setIsPageLoading(false)
  }, [])

  const handleFormControlChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserInput(event.target.value)
  }

  const handleLoadMoreBtn = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    try {
      setIsFetchingData(true)
      await axios
        .get('/api/search', {
          params: { userInput: storeUserInput, afterId: afterId },
        })
        .then((api) => {
          // Keep concatenating new api data
          setSubreddits(subreddits.concat(api.data.subreddits))
          // Set the afterId to keep track of the current page
          setAfterId(api.data.afterId)
          setIsFetchingData(false)
        })
    } catch (err) {
      setIsFetchingData(false)
      setIsFetchingError(true)
    }
  }

  const fetchData = async () => {
    try {
      await axios
        .get('/api/search', {
          params: {
            userInput: userInput.trim(),
            afterId: '', // Send an empty afterId for new searches
          },
        })
        .then((api) => {
          if (api.data.subreddits.length > 0) {
            // Set the new data to the subreddits array
            setSubreddits(api.data.subreddits)
            setStoreUserInput(userInput.trim())
            // The afterId keeps track of the current page (Reddit API)
            setAfterId(api.data.afterId)
          } else {
            // If the api returns an empty array, set the subreddits array to []
            setIsFetchedDataEmpty(true)
            setSubreddits([])
          }
          setIsFetchingData(false)
        })
    } catch (error) {
      setIsFetchingData(false)
      setIsFetchingError(true)
    }
  }

  const handleSearch = async (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault()
    // ===== Reset any errors back to default values ==== //
    if (isFetchingError) setIsFetchingError(false)
    if (isFetchedDataEmpty) setIsFetchedDataEmpty(false)
    // ===== Reset any errors back to default values ==== //
    if (!userInput.trim()) return
    // Don't allow users to spam the find button for the same subreddits
    if (userInput.trim() === storeUserInput) return
    // When the user searches for different subreddits,
    // clear the previous state
    if (userInput.trim() !== storeUserInput) {
      setStoreUserInput(userInput.trim())
      setAfterId(null)
      setSubreddits([])
    }
    // Set the fetching to true to display the loading content
    setIsFetchingData(true)
    // Fetch subreddits
    await fetchData()
  }

  return (
    <>
      <Container fluid="sm" style={{ height: '100%', minHeight: '100%' }}>
        {isPageLoading ? (
          <>
            <Spacer space={'3em'} />
            <Row>
              <Col sm={3}></Col>
              <Col sm={6}>
                <SkeletonTheme color="#c7c7c7" highlightColor="#cfcfcf">
                  <Skeleton height={20} />
                  <Skeleton height={30} />
                  <Skeleton height={30} />
                  <Spacer space={'1em'} />
                  <Skeleton height={50} />
                </SkeletonTheme>
              </Col>
              <Col sm={3}></Col>
            </Row>
          </>
        ) : (
          <>
            <Spacer space={'3em'} />
            <Form onSubmit={handleSearch}>
              <Row>
                <Col sm={3}></Col>
                <Col sm={6}>
                  <label style={{ fontSize: '2em' }} htmlFor="user-input">
                    Subreddit Finder
                  </label>
                  <InputGroup className="mb-3">
                    <FormControl
                      autoFocus
                      id="user-input"
                      onChange={handleFormControlChange}
                      placeholder={isPageLoading ? '' : 'Search...'}
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      disabled={isPageLoading}
                    />
                    <InputGroup.Append>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isFetchingData}
                      >
                        Find
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
                <Col sm={3}></Col>
              </Row>
            </Form>
            <hr />
            {(isFetchingError || isFetchedDataEmpty) && !isFetchingData && (
              <>
                <Spacer space={'2em'} />
                <h5 style={{ textAlign: 'center' }} id="no-results">
                  No results found!
                </h5>
              </>
            )}
            {subreddits.length === 0 && !isFetchingData && (
              <p style={{ textAlign: 'center' }}>
                Get started by searching for subreddits. For example: aww
              </p>
            )}
            <Spacer space={'3em'} />
            <ul style={{ paddingLeft: 0 }}>
              {subreddits.length > 0 &&
                subreddits.map((item: ISubredditItem) => {
                  return (
                    <Item
                      key={item.data.url}
                      public_description={item.data.public_description}
                      display_name={item.data.display_name}
                      icon_img={item.data.icon_img}
                      title={item.data.title}
                      url={item.data.url}
                    />
                  )
                })}
            </ul>
            <Spacer space={'1.5em'} />
            {isFetchingData && (
              <>
                <Row>
                  <Col sm={3}></Col>
                  <Col sm={6}>
                    <p
                      style={{
                        textAlign: 'center',
                        paddingBottom: 0,
                        marginBottom: 0,
                      }}
                    >
                      Loading...
                    </p>
                    <SkeletonTheme color="#c7c7c7" highlightColor="#cfcfcf">
                      <Skeleton height={10} />
                    </SkeletonTheme>
                  </Col>
                  <Col sm={3}></Col>
                </Row>
                <br />
              </>
            )}
            {subreddits.length > 0 && afterId && (
              <Button
                variant="primary"
                onClick={handleLoadMoreBtn}
                disabled={isPageLoading || isFetchingData}
              >
                Load More
              </Button>
            )}
            <Spacer space={'2em'} />
          </>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default App
