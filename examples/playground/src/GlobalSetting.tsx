import React, { useEffect, useState } from "react";
import { Drawer, Form } from "antd";
import { ProForm, ProFormSelect } from "@alipay/tech-ui";
import { getServicesList } from "@alipay/connect-util";

type IProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit: (values: IForm) => void;
};

type IOption = {
  value: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  tagList?: any[];
};

type IForm = {
  appId: string;
  tagName: string;
};

const GlobalSettingDrawer = ({ visible, setVisible, onSubmit }: IProps) => {
  const [form] = Form.useForm();
  const [appOptions, setAppOptions] = useState<IOption[]>([]);
  const [tagOptions, setTagOptions] = useState<IOption[]>([]);
  const searchAppByKeyWord = (keyword: string) => {
    getServicesList(keyword).then((list) => {
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
    // 初始化时，获取基础信息，如果有值，触发onSubmit()
  }, []);

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
      </ProForm>
    </Drawer>
  );
};

export default GlobalSettingDrawer;
