import { ProForm, ProFormSelect, ProFormText } from "@alipay/tech-ui";
import { Drawer, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { getServicesList, IService } from "@alipay/connect-util";

type IProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit: (values: IForm) => void;
  defaultData: IForm;
};

type IOption = {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
  tagList?: any[];
};

type IForm = {
  appId?: string;
  tagName?: string;
  domain?: string;
};

const GlobalSettingDrawer = ({ visible, setVisible, onSubmit, defaultData }: IProps) => {
  const [form] = Form.useForm();
  const [appOptions, setAppOptions] = useState<IOption[]>([]);
  const [tagOptions, setTagOptions] = useState<IOption[]>([]);
  const searchAppByKeyWord = (keyword: string) => {
    getServicesList(keyword).then((list: IService[]) => {
      setAppOptions(
        list?.map((item) => ({
          label: item.appName || "",
          value: item.id,
          tagList: item.tagList,
        }))
      );
    });
  };

  const onSelectApp = (value: string | number) => {
    setTagOptions(
      appOptions
        .find((item) => item.value === value)
        ?.tagList?.map((tag) => ({
          label: tag.tag,
          value: tag.tag,
        })) || []
    );
  };

  useEffect(() => {
    if (visible && defaultData) {
      form.setFieldsValue(defaultData);
    }
    // 初始化时，获取基础信息，如果有值，触发onSubmit()
  }, [visible]);

  return (
    <Drawer
      visible={visible}
      destroyOnClose
      width={800}
      onClose={() => setVisible(false)}
    >
      <ProForm<IForm>
        form={form}
        layout="vertical"
        onFinish={async (values: IForm) => {
          onSubmit?.(values);
          setVisible(false);
        }}
      >
        <ProFormSelect
          name="appId"
          label="后端应用"
          rules={[{ required: true, message: "请选择后端应用" }]}
          fieldProps={{
            options: appOptions,
            onSearch: searchAppByKeyWord,
            showSearch: true,
            onChange: onSelectApp,
          }}
        />
        <ProFormSelect
          name="tagName"
          label="分支"
          rules={[{ required: true, message: "请选择分支" }]}
          fieldProps={{
            options: tagOptions,
            showSearch: true,
            disabled: !form.getFieldValue("appId"),
          }}
        />
        <ProFormText
          name="domain"
          label="服务器域名"
          rules={[{ required: true, message: "请填写域名" }]}
          fieldProps={{
            placeholder: "http://xxx.alipay.net",
          }}
        />
      </ProForm>
    </Drawer>
  );
};

export default GlobalSettingDrawer;
