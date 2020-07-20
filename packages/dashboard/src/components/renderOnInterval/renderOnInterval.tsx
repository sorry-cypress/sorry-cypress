
import React from 'react'

class renderOnInterval extends React.PureComponent {
  tick = () => {

    const { live, refreshIntervalInSeconds } = this.props

    if (live) {
      clearTimeout(this.timeoutId);
      const timeoutId = setTimeout(this.tick, 1000 * refreshIntervalInSeconds)
      this.timeoutId = timeoutId
    }

    this.forceUpdate();
  }

  componentDidMount () {
    this.tick();
  }

  componentWillUnmount () {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }
  render () {
    return this.props.renderChild();
  }
}

renderOnInterval.defaultProps = {
  live: true,
  refreshIntervalInSeconds: 60
}

export default renderOnInterval