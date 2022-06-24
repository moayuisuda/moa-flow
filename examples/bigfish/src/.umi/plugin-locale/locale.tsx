// @ts-nocheck
import React from 'react';
import EventEmitter from 'events';
import { ConfigProvider } from 'antd';

import { RawIntlProvider, getLocale, getDirection , setIntl, getIntl, localeInfo } from './localeExports';

import antd_es_locale_zh_CN from 'antd/es/locale/zh_CN';
import _alipay_tech_ui_es_locale_zh_CN from '@alipay/tech-ui/es/locale/zh-CN';

// @ts-ignore
export const event = new EventEmitter();
event.setMaxListeners(5);
export const LANG_CHANGE_EVENT = Symbol('LANG_CHANGE');

export function _onCreate() {
  const locale = getLocale();
  setIntl(locale);
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect

export const _LocaleContainer = (props:any) => {
  const [locale, setLocale] = React.useState(() => getLocale());
  const [intl, setContainerIntl] = React.useState(() => getIntl(locale, true));

  const handleLangChange = (locale:string) => {
    setLocale(locale);
    setContainerIntl(getIntl(locale));
  };

  useIsomorphicLayoutEffect(() => {
    event.on(LANG_CHANGE_EVENT, handleLangChange);
    return () => {
      event.off(LANG_CHANGE_EVENT, handleLangChange);
    };
  }, []);

  const defaultAntdLocale = {
    ...antd_es_locale_zh_CN,
    ..._alipay_tech_ui_es_locale_zh_CN,
  }
  const direction = getDirection();

  return (
    <ConfigProvider  direction={direction} locale={localeInfo[locale]?.antd || defaultAntdLocale}>
      <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>
    </ConfigProvider>
  )
};
