export const initHotKeys = (model) => {
    const { hotKey } = model

    window.addEventListener('keydown', e => {
        switch (e.code) {
            case 'MetaLeft':
                e.preventDefault()
                hotKey.MetaLeft = true
                break
            case 'AltLeft':
                e.preventDefault()
                hotKey.AltLeft = true
                break
            case 'Space':
                // e.preventDefault()
                hotKey.Space = true
                break
            case 'ControlLeft':
                hotKey.ControlLeft = true
                break
        }
    })
    window.addEventListener('keyup', e => {
        switch (e.code) {
            case 'MetaLeft':
                e.preventDefault()
                hotKey.MetaLeft = false
                break
            case 'AltLeft':
                e.preventDefault()
                hotKey.AltLeft = false
                break
            case 'Space':
                hotKey.Space = false
                break
            case 'ControlLeft':
                hotKey.ControlLeft = false
                break
        }
    })
}