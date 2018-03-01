// @flow
import React, { PureComponent } from "react";
import { InputNumber } from "antd";
import isNaN from "lodash/isNaN";

// type
import type {NumberDefaultProps} from 'types/NumberDefaultProps';

type State = {
  value: string
};

type Props = NumberDefaultProps & {
  uiParams: {
    min: number,
    max: number,
    step: number,
    unit: string
  }
};

export default class Input extends PureComponent<Props, State> {
  onChange = (val: string) => {
    const value: number = isNaN(Number(val)) ? 0 : Number(val);
    this.props.onChange(this.props.id, "update", value);
  }

  render() {
    const { value, uiParams, disabled } = this.props;

    let formatter =
      uiParams && uiParams.unit ? val => `${val} ${uiParams.unit}` : val => val;
    return (
      <InputNumber
        disabled={disabled}
        min={uiParams && uiParams.min}
        max={uiParams && uiParams.max}
        step={uiParams && uiParams.step}
        formatter={formatter}
        value={value}
        onChange={this.onChange}
      />
    );
  }
}