// @ts-nocheck
import React, { useState, useEffect } from "react";
import { ApplyPluginsType, useModel , useIntl, traverseModifyRoutes, useAccess } from "umi";
import { plugin } from "../core/umiExports";
import LayoutComponent from './layout/layout/index.tsx';

export default props => {
  const [runtimeConfig, setRuntimeConfig] = useState(null);

  const initialInfo = (useModel && useModel("@@initialState")) || {
    initialState: undefined,
    loading: false,
    setInitialState: null
  }; // plugin-initial-state 未开启

  const access = useAccess?.();

  useEffect(() => {
    const useRuntimeConfig =
      plugin.applyPlugins({
        key: "layout",
        type: ApplyPluginsType.modify,
        initialValue: {
          ...initialInfo,
          traverseModifyRoutes: (menuData) => {return traverseModifyRoutes?.(menuData, access);},
        },
      }) || {};
    if (useRuntimeConfig instanceof Promise) {
      useRuntimeConfig.then((config) => {
        setRuntimeConfig(config);
      });
      return;
    }
    setRuntimeConfig(useRuntimeConfig);
  }, [initialInfo?.initialState, access]);

  const userConfig = {
    ...{'name':'Bigfish','theme':'PRO','locale':false,'showBreadcrumb':true,'logo':'https://gw-office.alipayobjects.com/basement_prod/c83c53ab-515e-43e2-85d0-4d0da16f11ef.svg'},
    ...runtimeConfig || {}
  };

  const { formatMessage } = useIntl();

  if(!runtimeConfig){
    return null
  }

  return React.createElement(LayoutComponent, {
    userConfig,
    formatMessage,
    ...props
  });
};
