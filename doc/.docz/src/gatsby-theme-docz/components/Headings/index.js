/** @jsx jsx */
import { jsx } from 'theme-ui'
import { FormattedMessage } from '../FormattedMessage';

const heading = Tag => {
  const Component = props => {
    console.log('props.id', props.id, props.children);
    return !!props.id ? (
      <Tag {...props}>
        <a
          href={`#${props.id}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            ':hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <FormattedMessage id={props.children} />
        </a>
      </Tag>
    ) : (
      <Tag {...props} />
    )
  }

  Component.displayName = Tag
  return Component
}

export const h2 = heading('h2')
export const h3 = heading('h3')
export const h4 = heading('h4')
export const h5 = heading('h5')
export const h6 = heading('h6')
