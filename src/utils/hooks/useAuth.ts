import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import appConfig from '@/configs/app.config'
import { OWNER, SELLER_FIXED } from '@/constants/roles.constant'
import {
  apiSignIn,
  apiSignUp,
  apiSignUpSeller,
  signUpWithInvitation,
  apiSignOut,
  isAuthenticated,
  getCurrentUser,
} from '@/services/AuthService'
import supabase from '@/services/Supabase/BaseClient'
import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import { initialState } from '@/store/slices/auth/userSlice'

import useQuery from './useQuery'

type Status = 'success' | 'failed'

function useAuth() {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const location = useLocation()
  const isForSellers = location.pathname.includes('/s/')
  const query = useQuery()

  const { token, signedIn } = useAppSelector(state => state.auth.session)

  // Initialize demo auth state on mount
  React.useEffect(() => {
    if (appConfig.enableMock) {
      const demoUser = getCurrentUser()
      const demoToken = localStorage.getItem('demo-auth-token')
      
      if (demoUser && demoToken) {
        dispatch(setUser(demoUser))
        dispatch(signInSuccess(demoToken))
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiSignIn(email, password)

      if (data) {
        const { user, session, token } = data

        // Handle both demo and Supabase auth responses
        const authToken = session?.access_token || token
        if (authToken) {
          dispatch(signInSuccess(authToken))
        }

        console.log('USER', user)
        if (user) {
          dispatch(setUser(user))
          navigate(
            isForSellers
              ? appConfig.authenticatedEntryPathForSellers
              : appConfig.authenticatedEntryPath
          ) // Redirige a la ruta autenticada
        }

        return {
          status: 'success',
          message: '',
        }
      }
    } catch (error) {
      return {
        status: 'failed',
        message: error.message || 'Failed to sign in.',
      }
    }
  }

  const signUp = async (id = '', values: SignUpCredential) => {
    try {
      // Cual va a ser la diferencia entre los que venden de forma fija y lo
      // que los venden de forma no fija
      const data = isForSellers // Analiza si es para vendedores o dueños
        ? await signUpWithInvitation(id, values, SELLER_FIXED)
        : await signUpWithInvitation(id, values, OWNER)

      if (data) {
        const { user, session } = data

        if (session?.access_token) {
          dispatch(signInSuccess(session.access_token))
        }
        if (user) {
          dispatch(setUser(user))

          navigate(
            isForSellers
              ? appConfig.authenticatedEntryPathForSellers
              : appConfig.authenticatedEntryPath
          )
        }

        return {
          status: 'success',
          message: '',
        }
      } else {
        return data
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const handleSignOut = () => {
    dispatch(signOutSuccess())
    dispatch(setUser(initialState))
    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signOut = async () => {
    try {
      await apiSignOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      handleSignOut()
    }
  }

  const createInvitation = async (shopId: number, inviterId: string) => {
    try {
      console.log(shopId, inviterId)
      // 1. Verificar si ya existe una invitación con el mismo shop_id y inviter_id
      const { data: existingInvitation, error: findError } = await supabase
        .from('invitations')
        .select('*')
        .eq('shop_id', shopId)
        .eq('inviter_id', inviterId)

      if (existingInvitation[0]?.id) {
        return {
          status: 'success',
          message: 'Invitación creada con éxito.',
          invitationId: existingInvitation[0],
        }
      } else {
        console.log(existingInvitation)

        // 2. Crear una nueva invitación si no existe
        const { data: newInvitation, error } = await supabase
          .from('invitations')
          .insert({
            shop_id: shopId,
            inviter_id: inviterId,
          })
          .select('id')
          .single()

        if (error) {
          throw new Error(`Error al crear la invitación: ${error.message}`)
        }
        //const invitationId = newInvitation.id;
        return {
          status: 'success',
          message: 'Invitación creada con éxito.',
          invitationId: newInvitation,
        }
      }
    } catch (error) {
      return {
        status: 'failed',
        message: error.message || 'Failed to create invitation.',
      }
    }
  }

  return {
    authenticated: appConfig.enableMock ? isAuthenticated() : (token && signedIn),
    signIn,
    signUp,
    signOut,
    createInvitation,
  }
}

export default useAuth
