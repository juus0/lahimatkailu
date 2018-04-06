import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SearchPage, filter } from '../listpage';

class ListPageContainer extends Component {
  render() {
    return <SearchPage {...this.props} />;
  }
}

const mapStateToProps = state => ({
  data: filter(state.data.data, state.filter.filterText),
  dimensions: state.dimensions,
  region: state.region,
  userlocation: state.userlocation
});

export default connect(mapStateToProps)(ListPageContainer);