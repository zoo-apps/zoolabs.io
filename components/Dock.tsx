import { useRouter } from 'next/router'
import { XStack } from '@hanzo/ui'
import { BRAND, Label } from './kit'
import ZooLogo from './ZooLogo'

/**
 * The mark, bottom right, where a chat launcher lives. It does the one thing
 * this site has to offer: put you in front of Blue with the cursor in the box.
 * From anywhere else it navigates there first.
 */
export default function Dock() {
  const router = useRouter()

  const ask = () => {
    const field = document.getElementById('question')
    if (field) {
      field.scrollIntoView({ behavior: 'smooth', block: 'center' })
      field.focus({ preventScroll: true })
      return
    }
    router.push('/')
  }

  return (
    <XStack
      position="fixed"
      b={20}
      r={20}
      z={40}
      items="center"
      gap="$2"
      tabIndex={0}
      role="button"
      aria-label="Ask Blue"
      onPress={ask}
      cursor="pointer"
      borderWidth={2}
      borderColor={BRAND.ink}
      bg="white"
      boxShadow={`6px 6px 0 0 ${BRAND.ink}`}
      pl="$2"
      pr="$3"
      py="$2"
      hoverStyle={{ x: 2, y: 2, boxShadow: `4px 4px 0 0 ${BRAND.ink}` }}
      pressStyle={{ x: 4, y: 4, boxShadow: `2px 2px 0 0 ${BRAND.ink}` }}
    >
      <ZooLogo size={34} />
      <Label display="none" $sm={{ display: 'flex' }}>
        Ask Blue
      </Label>
    </XStack>
  )
}
