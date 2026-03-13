import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'
import { Server, Response } from 'miragejs'

export default function authFakeApi(server: Server, apiPrefix: string) {
  server.post(`${apiPrefix}/sign-in`, (schema, { requestBody }) => {
    const { email, password } = JSON.parse(requestBody)
    const user = schema.db.signInUserData.findBy({
      email,
      password,
    })
    console.log('Demo auth - user found:', user)
    if (user) {
      const { id, name, email, phone, authority, shopId, sellersShops, avatar } = user
      return {
        user: { 
          id, 
          name, 
          email, 
          phone, 
          authority, 
          shopId, 
          sellersShops 
        },
        token: 'demo-token-' + id,
        session: {
          access_token: 'demo-token-' + id,
          refresh_token: 'demo-refresh-' + id,
          expires_in: 3600,
          token_type: 'bearer',
        }
      }
    }
    return new Response(
      401,
      { some: 'header' },
      { message: 'Invalid email or password!' }
    )
  })

  server.post(`${apiPrefix}/sign-out`, () => {
    return true
  })

  server.post(`${apiPrefix}/sign-up`, (schema, { requestBody }) => {
    const { userName, password, email } = JSON.parse(requestBody)
    const userExist = schema.db.signInUserData.findBy({
      accountUserName: userName,
    })
    const emailUsed = schema.db.signInUserData.findBy({ email })
    const newUser = {
      avatar: '/img/avatars/thumb-1.jpg',
      userName,
      email,
      authority: ['admin', 'user'],
    }
    if (!isEmpty(userExist)) {
      const errors = [{ message: '', domain: 'global', reason: 'invalid' }]
      return new Response(
        400,
        { some: 'header' },
        { errors, message: 'User already exist!' }
      )
    }

    if (!isEmpty(emailUsed)) {
      const errors = [{ message: '', domain: 'global', reason: 'invalid' }]
      return new Response(
        400,
        { some: 'header' },
        { errors, message: 'Email already used' }
      )
    }

    schema.db.signInUserData.insert({
      ...newUser,
      ...{ id: uniqueId('user_'), password, accountUserName: userName },
    })
    return {
      user: newUser,
      token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
    }
  })

  server.post(`${apiPrefix}/forgot-password`, () => {
    return true
  })

  server.post(`${apiPrefix}/reset-password`, () => {
    return true
  })
}
