import React from "react";
import PropTypes from "prop-types";
import immutable from "immutable";
import { Modal } from "antd";

import ChangeMethodComponent from "./changeMethodComponent";
import { FormattedMessage } from "react-intl";
import defaultMessage from "../locales";

export default class EditModal extends ChangeMethodComponent {
  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.onChange = super.onChange.bind(this);
    this.onChangeMulti = super.onChangeMulti.bind(this);
    this.onChangeApi = super.onChangeApi.bind(this);
    this.state = {
      visible: false,
      record: immutable.fromJS({}),
      idPath: "",
      errors: []
    };
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeMulti: PropTypes.func.isRequired,
    renderChildren: PropTypes.func.isRequired,
    updateAction: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  showModal(record, i) {
    this.setState({
      visible: true,
      record: immutable.fromJS(record),
      idPath: [this.props.id, i].join("/")
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
      record: immutable.fromJS({}),
      idPath: null,
      errors: []
    });
  }

  handleOk() {
    const { onChange } = this.props;
    const { idPath } = this.state;
    const that = this;
    onChange(idPath, "update", that.state.record);
    that.handleCancel();
  }

  render() {
    const { visible, record, idPath } = this.state;
    const { updateAction, renderChildren } = this.props;
    return (
      <Modal
        width="80%"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={
          <FormattedMessage
            id="array.popup.modal.okText"
            defaultMessage={defaultMessage.en["array.popup.modal.okText"]}
          />
        }
        cancelText={
          <FormattedMessage
            id="array.popup.modal.cancelText"
            defaultMessage={defaultMessage.en["array.popup.modal.cancelText"]}
          />
        }
      >
        {visible
          ? renderChildren(child => ({
              value: record,
              id: idPath,
              onChange: this.onChange,
              // not work now, need to resolve it
              readOnly: updateAction.indexOf(child.title) !== -1
            }))
          : null}
      </Modal>
    );
  }
}