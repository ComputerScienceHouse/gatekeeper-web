import React from "react";
import Duallist from "react-duallist";
import isFunction from "lodash/isFunction";

interface TagRealmSelectProps {
  onSelect?: (selected: string[]) => void;
  available: Array<{
    label: string;
    value: string;
  }>
}

interface TagRealmSelectState {
  selected: string[];
}

export default class TagRealmSelect extends React.Component<TagRealmSelectProps, TagRealmSelectState> {
  public state = {
    selected: []
  };

  public render() {
    return (
      <Duallist
        available={this.props.available}
        selected={this.state.selected}
        sortable={false}
        onMove={this.handleMove}
      />
    );
  }

  private handleMove = (selected: string[]) => {
    this.setState({ selected });

    if (isFunction(this.props.onSelect)) {
      this.props.onSelect(selected);
    }
  };
}

