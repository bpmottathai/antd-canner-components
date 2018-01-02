// @flow
import React, { PureComponent } from "react";
import { Tag, Tooltip, Icon } from "antd";
import type { Map, List } from 'immutable';
import template from 'lodash/template';
import Picker from './Picker';

type State = {
  modalVisible: boolean
};

type Props = defaultProps & {
  value: Array<Map<string, any>>,
  uiParams: {
    textCol: string,
    subtextCol: string,
    renderText?: string
  }
};

export default class RelationIdList extends PureComponent<Props, State> {
  isOnComposition: boolean;
  constructor(props: Props) {
    super(props);
    this.isOnComposition = false;
    this.state = {
      modalVisible: false
    };
  }

  static defaultProps = {
    uiParams: {}
  }

  showModal = () => {
    this.setState({
      modalVisible: true
    });
  }

  handleOk = (queue: List<any>) => {
    const {onChange, id} = this.props;
    onChange(id, 'update', queue);
    this.handleCancel();
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  }

  handleClose = (index:  number) => {
    const {onChange, id} = this.props;
    onChange(`${id}/${index}`, 'delete');
  }

  render() {
    const { modalVisible } = this.state;
    const { readOnly, value, uiParams, renderChildren, id, relation } = this.props;
    return (
      <div>
        {value.toJS().map((v, index) => {
          const tag = getTag(v, uiParams);
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={v._id} closable={true} afterClose={() => this.handleClose(index)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={v._id}>{tagElem}</Tooltip> : tagElem;
        })}
        <Tag
          onClick={this.showModal}
          style={{ background: '#fff', borderStyle: 'dashed' }}
        >
          <Icon type="plus" /> New Tag
        </Tag>
        {
          !readOnly && <Picker
            title="選擇你要的物件"
            visible={modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            renderChildren={renderChildren}
            pickedIds={value.map(v => v.get('_id'))}
            columns={uiParams.columns}
            id={id}
            relation={relation}
          />
        }
      </div>
    );
  }
}

function getTag(v: {[string]: any}, uiParams: {
  textCol: string,
  subtextCol: string,
  renderText?: string  
}): string {
  // use value and uiParams to generateTagName
  const {textCol, subtextCol, renderText} = uiParams;
  let tag = '';
  
  if (renderText) {
    // if there is renderText, textCol and subtextCol will be ignored;
    const compiler = template(renderText);
    try {
      tag = compiler(v);
    } catch (e) {
      throw e;
    }
  } else {
    const text = v[textCol];
    const subtext = v[subtextCol];
    tag = text + (subtext ? `(${subtext})` : '');
  }

  return tag;
}
