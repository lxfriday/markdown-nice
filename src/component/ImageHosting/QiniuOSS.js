import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Form, Input, Select } from "antd";
import { QINIUOSS_IMAGE_HOSTING } from "../../utils/constant";

const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 16 }
  }
};

@inject("imageHosting")
@observer
class QiniuOSS extends Component {
  constructor(props) {
    super(props);
    // 从localstorage里面读取
    const imageHosting = JSON.parse(
      localStorage.getItem(QINIUOSS_IMAGE_HOSTING)
    );
    this.state = {
      imageHosting
    };
  }

  regionChange = value => {
    const { imageHosting } = this.state;
    imageHosting.region = value;
    this.setState({ imageHosting });
    localStorage.setItem(QINIUOSS_IMAGE_HOSTING, JSON.stringify(imageHosting));
  };

  accessKeyChange = e => {
    const { imageHosting } = this.state;
    imageHosting.accessKey = e.target.value;
    this.setState({ imageHosting });
    localStorage.setItem(QINIUOSS_IMAGE_HOSTING, JSON.stringify(imageHosting));
  };

  secretKeyChange = e => {
    const { imageHosting } = this.state;
    imageHosting.secretKey = e.target.value;
    this.setState({ imageHosting });
    localStorage.setItem(QINIUOSS_IMAGE_HOSTING, JSON.stringify(imageHosting));
  };

  bucketChange = e => {
    const { imageHosting } = this.state;
    imageHosting.bucket = e.target.value;
    this.setState({ imageHosting });
    localStorage.setItem(QINIUOSS_IMAGE_HOSTING, JSON.stringify(imageHosting));
  };

  handleImgDomainChange  = ({ target: { value } }) => {
    const { imageHosting } = this.state;
    imageHosting.domain = value;
    this.setState({ imageHosting });
    localStorage.setItem(QINIUOSS_IMAGE_HOSTING, JSON.stringify(imageHosting));
  };

  handleImgNamespaceChange  = ({ target: { value } }) => {
    const { imageHosting } = this.state;
    imageHosting.namespace = value;
    this.setState({ imageHosting });
    localStorage.setItem(QINIUOSS_IMAGE_HOSTING, JSON.stringify(imageHosting));
  };

  render() {
    const { region, accessKey, secretKey, bucket, domain, namespace } = this.state.imageHosting;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="Bucket" style={style.formItem}>
          <Input
            value={bucket}
            onChange={this.bucketChange}
            placeholder="例如：my-wechat"
          />
        </Form.Item>
        <Form.Item label="Region" style={style.formItem}>
          <Select
            value={region}
            onChange={this.regionChange}
            placeholder="例如：qiniu.region.z2"
          >
            <Option value="z0">华东</Option>
            <Option value="z1">华北</Option>
            <Option value="z2">华南</Option>
            <Option value="na0">北美</Option>
            <Option value="as0">东南亚</Option>
          </Select>
        </Form.Item>
        <Form.Item label="AccessKey" style={style.formItem}>
          <Input
            value={accessKey}
            onChange={this.accessKeyChange}
            placeholder="例如：qweASDF1234zxcvb"
          />
        </Form.Item>
        <Form.Item label="SecretKey" style={style.formItem}>
          <Input
            value={secretKey}
            onChange={this.secretKeyChange}
            placeholder="例如：qweASDF1234zxcvbqweASD"
          />
        </Form.Item>
        <Form.Item label="自定义域名" style={style.formItem}>
          <Input
            placeholder="http://qiniu.mdnice.com/"
            onChange={this.handleImgDomainChange}
            value={domain}
          />
        </Form.Item>
        <Form.Item label="自定义命名空间" style={style.formItem}>
          <Input
            placeholder="mdnice/"
            onChange={this.handleImgNamespaceChange}
            value={namespace}
          />
        </Form.Item>
        <Form.Item label="提示" style={style.formItem}>
          <span>配置好图床信息后请在右上角进行切换</span>
          <br />
          {/* <a rel="noopener noreferrer" target="_blank" href="https://mp.weixin.qq.com/s/QPsOUkLCsvhqSicTOGaHJg">七牛云图床配置文档</a> */}
        </Form.Item>
      </Form>
    );
  }
}

const style = {
  formItem: {
    marginBottom: "10px"
  }
};

export default QiniuOSS;
