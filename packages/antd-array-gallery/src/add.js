// @flow
import React, { Component } from "react";
import { Icon } from "antd";
import CSSModules from "react-css-modules";
import styles from "./style/add.scss";

type Props = {
  onClick: () => void;
}

@CSSModules(styles)
export default class Add extends Component<Props> {

  render() {
    return (
      <div style={{padding: '5px'}}>
        <div styleName="add-container" onClick={this.props.onClick}>
          <Icon type="plus-circle" style={{fontSize: 60}}/>
        </div>
      </div>
    );
  }
}