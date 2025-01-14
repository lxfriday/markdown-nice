/**
 * 图片上传
 */
/* eslint-disable */
import * as qiniu from "qiniu-js";
import QiniuOSS from "../component/ImageHosting/QiniuOSS";
import {
  SM_MS_PROXY,
  ALIOSS_IMAGE_HOSTING,
  QINIUOSS_IMAGE_HOSTING,
  IMAGE_HOSTING_TYPE,
  IMAGE_HOSTING_TYPE_OPTIONS,
} from "./constant";
import {toBlob, getOSSName, axiosMdnice} from "./helper";

function writeToEditor({content, image}) {
  let text = `\n![${image.filename}](${image.url})\n`;
  const {markdownEditor} = content;
  const cursor = markdownEditor.getCursor();
  console.log("cursor", cursor);

  markdownEditor.replaceSelection(text, cursor);
  content.setContent(markdownEditor.getValue());
}

// 七牛云对象存储上传
export const qiniuOSSUpload = async ({
  file = {},
  onSuccess = () => {},
  onError = () => {},
  onProgress = () => {},
  images = [],
  content = null, // 编辑器示例，粘贴的时候会用到
}) => {
  const config = JSON.parse(window.localStorage.getItem(QINIUOSS_IMAGE_HOSTING));
  try {
    let {domain} = config;
    const {namespace} = config;
    // domain可能配置时末尾没有加‘/’
    if (domain[domain.length - 1] !== "/") {
      domain += "/";
    }
    const result = await axiosMdnice.get(`/qiniu/${config.bucket}/${config.accessKey}/${config.secretKey}`);
    const token = result.data;

    const base64Reader = new FileReader();

    base64Reader.readAsDataURL(file);

    base64Reader.onload = (e) => {
      const urlData = e.target.result;
      const base64 = urlData.split(",").pop();
      const fileType = urlData
        .split(";")
        .shift()
        .split(":")
        .pop();

      // base64转blob
      const blob = toBlob(base64, fileType);

      const conf = {
        useCdnDomain: true,
        region: qiniu.region[config.region], // 区域
      };

      const putExtra = {
        fname: "",
        params: {},
        mimeType: [] || null,
      };

      const OSSName = getOSSName(file.name, namespace);

      // 这里第一个参数的形式是blob
      const imageObservable = qiniu.upload(blob, OSSName, token, putExtra, conf);

      // 上传成功后回调
      const complete = (response) => {
        // console.log(response);
        const names = file.name.split(".");
        names.pop();
        const filename = names.join(".");
        const image = {
          filename, // 名字不变并且去掉后缀
          url: `${domain}${response.key}`,
        };
        images.push(image);

        if (content) {
          writeToEditor({content, image});
        }
        onSuccess(response);
      };

      // 上传过程回调
      const next = (response) => {
        // console.log(response);
        const percent = parseInt(Math.round(response.total.percent.toFixed(2)), 10);
        onProgress(
          {
            percent,
          },
          file,
        );
      };

      // 上传错误回调
      const error = (err) => {
        onError(err, err.toString());
      };

      const imageObserver = {
        next,
        error,
        complete,
      };
      // 注册 imageObserver 对象
      imageObservable.subscribe(imageObserver);
    };
  } catch (err) {
    onError(err, err.toString());
  }
};

export default {
  qiniuOSSUpload,
};
