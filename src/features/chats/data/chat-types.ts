import chatData from './convo.json'

export type ChatUser = (typeof chatData.conversations)[number]
export type Convo = ChatUser['messages'][number]
