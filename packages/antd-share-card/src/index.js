// @flow
import React, { Component } from "react";
import Label from "./label";
import CSSModules from "react-css-modules";
import styles from "./style/Card.scss";

type Props = {
  checked: boolean,
  value: string | boolean,
  onChange: (value: string | boolean) => void,
  text: string,
  disabled: boolean
};

@CSSModules(styles)
export default class Card extends Component<Props> {
  onChange = (value: string | boolean) => {
    this.props.onChange(value);
  };

  render() {
    const {
      value,
      checked,
      text,
      disabled
    } = this.props;
    let displayText = text || value;
    if (typeof value === "boolean") {
      displayText = text || (value ? "YES" : "NO");
    }

    return (
      <label styleName="label">
        <Label
          checked={checked}
          disabled={disabled}
          onClick={() => this.onChange(value)}
        >
          {displayText}
        </Label>
      </label>
    );
  }
}
