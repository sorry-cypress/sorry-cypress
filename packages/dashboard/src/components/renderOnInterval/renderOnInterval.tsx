import React from 'react';

interface RenderOnIntervalProps {
  live?: boolean;
  refreshIntervalInSeconds: number;
  renderChild: () => React.ReactNode;
}

class RenderOnInterval extends React.PureComponent<
  React.PropsWithChildren<RenderOnIntervalProps>
> {
  private timeoutId: NodeJS.Timeout | undefined = undefined;
  static defaultProps = {
    live: true,
    refreshIntervalInSeconds: 60,
  };
  tick = () => {
    const { live, refreshIntervalInSeconds } = this.props;

    if (live) {
      this.timeoutId && clearTimeout(this.timeoutId);
      const timeoutId = setTimeout(this.tick, 1000 * refreshIntervalInSeconds);
      this.timeoutId = timeoutId;
    }

    this.forceUpdate();
  };

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
  render() {
    return this.props.renderChild();
  }
}

export default RenderOnInterval;
