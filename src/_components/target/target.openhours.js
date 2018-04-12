import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { View, Text } from 'react-native';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from 'react-native-table-component';

import { styles } from '../target';

export class TableOpenHours extends Component {

  empty(hours) {
    const { mon, tue, wed, thu, fri, sat, sun } = hours;
    return mon.start === "" && mon.end === "" && tue.start === "" && tue.end === "" && wed.start === "" && wed.end === "" && thu.start === "" && thu.end === "" && fri.start === "" && fri.end === "" && sat.start === "" && sat.end === "" && sun.start === "" && sun.end === "";
  }

  render() {
    const { target } = this.props.target;
    const { openingHours } = target;
    const { mon, tue, wed, thu, fri, sat, sun } = openingHours;

    const tableRows2 = [
      [this.context.t('mon'), mon.start, '-', mon.end, this.context.t('fri'), fri.start, '-', fri.end],
      [this.context.t('tue'), tue.start, '-', tue.end, this.context.t('sat'), sat.start, '-', sat.end],
      [this.context.t('wed'), wed.start, '-', wed.end, this.context.t('sun'), sun.start, '-', sun.end],
      [this.context.t('thu'), thu.start, '-', thu.end, '', '', '', '']
    ];

    return (
      <View>
        {this.empty(openingHours) ? (
          <Text style={styles.opening}>{this.context.t('clock-o')}</Text>
        ) : (
          <View>
            <Text style={styles.openingTitle}>{this.context.t('opening')}</Text>
            <Table style={styles.opening} borderStyle={{ borderWidth: 0 }}>
              <Rows
                flexArr={[1.5, 1.5, 0.5, 3, 1.5, 1.5, 0.5, 3]}
                heightArr={[22, 22, 22, 22]}
                data={tableRows2}
              />
            </Table>
          </View>
        )}
      </View>
    );
  }
}

TableOpenHours.contextTypes = {
  t: PropTypes.func.isRequired
};

TableOpenHours.propTypes = {
  target: PropTypes.object.isRequired
};
