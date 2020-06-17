import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { HFlow, Paper, TextField } from 'bold-ui';
import { BranchesField } from '../branches/branchesField';
class Filter extends React.Component {
  constructor(props) {
    super(props);
    const searchParams = new URLSearchParams(props?.location?.search);
    this.state = { branch: searchParams.get('branch') || '' };
  }

  render() {
    return (
      <Paper
        style={{
          marginBottom: '2rem',
          padding: '1rem',
        }}
      >
        <HFlow alignItems="center" hSpacing={1} justifyContent="flex-start">
          <BranchesField
            label="Branch"
            value={this.state.branch}
            onChange={(branch) => this.setState({ branch })}
          />
          <Link
            to={{ pathname: '/', search: `branch=${this.state.branch}` }}
            style={{ marginTop: '1rem' }}
          >
            Go
          </Link>
        </HFlow>
      </Paper>
    );
  }
}

export default withRouter(Filter);
