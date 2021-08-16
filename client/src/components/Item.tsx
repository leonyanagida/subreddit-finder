import React from 'react'
import Media from 'react-bootstrap/Media'

const trimText = (text: string) => {
  if (text.length > 50) {
    return text.slice(0, 100).concat('...')
  } else {
    return text
  }
}

interface IItem {
  public_description?: string
  display_name?: string
  icon_img?: string
  title?: string
  url?: string
}

export default function Item({
  public_description,
  display_name,
  icon_img,
  title,
  url,
}: IItem): JSX.Element {
  return (
    <Media style={{ marginBottom: '1em' }}>
      <a
        href={`https://reddit.com${url}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        {icon_img ? (
          <img
            src={icon_img}
            width={64}
            height={64}
            className="mr-3"
            alt="subreddit"
          />
        ) : (
          <img
            src="http://via.placeholder.com/100x100"
            width={64}
            height={64}
            className="mr-3"
            alt="subreddit"
          />
        )}
      </a>
      <Media.Body>
        <h5>
          {display_name} -{' '}
          <small>
            <a
              href={`https://reddit.com${url}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {url}
            </a>
          </small>
        </h5>
        <p>{public_description ? trimText(public_description) : url}</p>
      </Media.Body>
    </Media>
  )
}
