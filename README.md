#  Source Elements

:bangbang: | This SDK is still in beta, and may change significantly before its public release.
:---: | :---

This project contains Source Elements, our React based member facing SDK. This SDK makes it easy for you to build member side experiences and uses an underlying `@source-health/client` that you provide to it to make calls using your API keys to the Source Health API. 

## Installation

### First, install `@source-health/elements-react`.

Install with `yarn`:

```
yarn add @source-health/elements-react
```

OR with `npm`:

```
npm install --save @source-health/elements-react
```

##  Getting Started

### Generating a Member JWT
In order to use Source Elements you must generate a member JWT on your backend that gets passed to your application. This member JWT is generated on your backend using your private API keys and is what lets our API know you've authenticated your member and that we can trust requests coming directly from your frontend on behalf of a given member. If your backend is javascript based you can use our `@source-health/client` to easily generate a JWT like so:

```typescript
// backend.ts
import { Source, ApiKey } from '@source-health/client'

const source = new Source(new ApiKey('SOURCE_KEY_ID', 'SOURCE_KEY_SECRET'))

const jwt = await source.tokens.generate({
  member: 'member_id',
  expiration: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
})
```

If your backend isn't writtern in javascript or you simply would like generate the JWT yourself you can do easily. Here is an abridged version of how our `@source-health/client` does it internally:

```typescript
import { SignJWT } from 'jose/jwt/sign'

export interface TokenOptions {
  /**
   * Member for which this token should be generated
   */
  member: string

  /**
   * Expiration time for the token. Must be no more than 24 hours from now.
   */
  expiration: Date

  /**
   * Scopes to apply to the token which may limit its access
   */
  scopes?: string[]
}

export default class TokenGenerator {
  private readonly encoder = new TextEncoder()

  public async generate(options: TokenOptions): Promise<string> {
    const signJWT = new SignJWT({
      sub: options.member, // The source members id
      iat: Math.floor(Date.now() / 1_000), // The Issued At time
      exp: Math.floor(options.expiration.getTime() / 1_000), // The Expiration Time
      scopes: options.scopes ?? [], // The scopes to give this JWT
    })

    return await signJWT
      .setProtectedHeader({ alg: 'HS256', kid: 'SOURCE_KEY_ID' })
      .sign(this.encoder.encode('SOURCE_KEY_SECRET'))
  }
}
```

### The Elements context (`SourceProvider`)
In order for your application to have access to the SourceElements context you must add a `SourceProvider` to your React app.

```tsx
// App.tsx
import React, { useMemo } from 'react'
import { Source, Token } from '@source-health/client'
import { SourceElements } from '@source-health/elements-react'

function App() {
  const source = useMemo(() => new Source(new Token('MEMBER_JWT_FROM_BACKEND')), [])

  return (
    <SourceElements client={source}>
      <MyMemberPortal />
    </SourceElements>
  )
}

export default App
```

### Using individual SourceElements components
Now that you've setup your provider you can use individual components, such as `ThreadList`, to build your Member experience (in this example, communications).

```tsx
import React, { FC } from 'react'
import { ThreadList } from '@source-health/elements-react'

export const MemberChat: FC = () => {
  return <ThreadList />
}
```

### Styling SourceElements components
We provide an out of the box styled experience by allowing you to import our SourceElements css file directly.
```tsx
import '@source-health/elements-react/dist/elements-react.css'
```

We also provide stable class names that won't change from version to version, such as `source-comms__thread-list-container`, so you can override our styles to match your brand. Simply include our imported CSS file before your custom CSS and override the styles in your custom CSS. You are also able to completely forgo importing our styles if you'd like to style everything yourself. It's completely up to you and how much or how little you'd like to own.

### Overriding SourceElements components with custom-built components
We provide the ability for you to override most of our components by providing your own custom-built components. This is useful if you'd like to completely modify the underlying JSX/TSX or add in new custom functionality. Components that support child component overrides will make it available in their props and your custom component must match the props the overriden component expects to receive.

```tsx
import React, { FC } from 'react'
import { ThreadList } from '@source-health/elements-react'

import { MyCustomThreadListItem } from '../CustomComponents'

export const MemberChat: FC = () => {
  return <ThreadList ItemComponent={MyCustomThreadListItem} />
}
```

## Component Reference
This section is coming soon. For now please refer to the source files in this repo to understand component structure/heirarchy and what props they each expect to receive.