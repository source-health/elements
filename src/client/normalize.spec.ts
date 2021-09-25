import { normalize } from './normalize'

describe('normalize', () => {
  it('should normalize', () => {
    const [user1, user2, user3] = [
      {
        object: 'user',
        id: 'usr_19801',
        first_name: 'Colin',
        last_name: 'Morelli',
      },
      {
        object: 'user',
        id: 'usr_19802',
        first_name: 'Daniel',
        last_name: 'Schwartz',
      },
      {
        object: 'user',
        id: 'usr_19803',
        first_name: 'Zia',
        last_name: 'Rahaman',
      },
    ]

    const thread = {
      object: 'thread',
      id: 'thr_9102893',
      assignee: user1,
      participants: [user2, user3],
    }

    const result = normalize(thread)

    expect(result.result).toEqual('thr_9102893')
    expect(result.resources).toHaveProperty('user', {
      [user1.id]: user1,
      [user2.id]: user2,
      [user3.id]: user3,
    })
    expect(result.resources).toHaveProperty('thread', {
      [thread.id]: {
        object: 'thread',
        id: 'thr_9102893',
        assignee: user1.id,
        participants: [user2.id, user3.id],
      },
    })
  })
})
