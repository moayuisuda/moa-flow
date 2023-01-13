/** @jsx jsx */
/* eslint react/jsx-key: 0 */
import Highlight, { defaultProps } from 'prism-react-renderer'
import { jsx, Styled } from 'theme-ui'
import { useIntl } from "gatsby-plugin-intl";
import { usePrismTheme } from '~utils/theme'

export const Code = ({ children, className: outerClassName }) => {
  const [language] = outerClassName
    ? outerClassName.replace(/language-/, '').split(' ')
    : ['text']
  const theme = usePrismTheme()
  const intl = useIntl();
  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Styled.pre
          className={`${outerClassName || ''} ${className}`}
          style={{ ...style, overflowX: 'auto' }}
          data-testid="code"
        >
          {tokens.map((line, i) => {
            return (
              <div {...getLineProps({ line, key: i })} style={{ fontSize: '16px' }}>
                {line.map((token, key) => {
                  if (typeof token.content === 'string' && token.content?.startsWith('//')) {
                    token = {
                      ...token,
                      content: intl.formatMessage({ id: token.content })
                    }
                  }
                  return (
                    <span
                      {...getTokenProps({ token, key })}
                      sx={{ display: 'inline-block' }} />
                  )
                })}
              </div>
            )
          })}
        </Styled.pre>
      )
      }
    </Highlight >
  )
}
