import React, {PropTypes} from 'react'
import Markdown from 'react-remarkable'
import './markdown.css'

const MarkdownText = ({source}) => (
  <span className="markdown-body">
    <Markdown source={source} />
  </span>
)

MarkdownText.propTypes = {
  source : PropTypes.string.isRequired
}

export default MarkdownText
