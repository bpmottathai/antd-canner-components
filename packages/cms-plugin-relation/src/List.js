// @flow
import React, { PureComponent } from "react";
import { Tag, Tooltip, Icon } from "antd";
import type { Map, List } from 'immutable';
import template from 'lodash/template';
import difference from "lodash/difference";
import defaultMessage from "@canner/cms-locales";
import { FormattedMessage } from "react-intl";
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

  handleOk = (queue: List<any>, originData: any) => {
    let {onChange, id, value} = this.props;
    value = value && value.toJS ? value.toJS() : [];
    queue = queue.toJS();
    const currentIds = value.map(v => v._id);
    const idsShouldCreate = difference(queue, currentIds);
    const idsShouldRemove = difference(currentIds, queue);
    const createActions = idsShouldCreate.map(_id => ({id, type: "create", value: originData.find(data => data.get('_id') === _id)}));
    const delActions = idsShouldRemove.map(_id => ({id: `${id}/${currentIds.findIndex(v => v === _id)}`, type: "delete"}));
    onChange([...createActions, ...delActions]);
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
    let { readOnly, value, uiParams, renderChildren, id, relation } = this.props;
    value = value && value.toJS ? value.toJS() : [];
    return (
      <div>
        {value.map((v, index) => {
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
          <Icon type="plus" />
          <FormattedMessage 
            id="relation.list.newTags"
            tagName="span"
            defaultMessage={defaultMessage.en["relation.list.newTags"]}
          />
        </Tag>
        {
          !readOnly && <Picker
            title={
              <FormattedMessage 
                id="relation.list.choose"
                tagName="span"
                defaultMessage={defaultMessage.en["relation.list.choose"]}
              />
            }
            visible={modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            renderChildren={renderChildren}
            pickedIds={value.map(v => v._id)}
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