// hooks/useAsync.jsx
import { useState, useEffect, useCallback } from 'react'

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  // The execute function wraps asyncFunction and handles setting state for pending, value, and error
  const execute = useCallback((...args) => {
    setStatus('pending')
    setData(null)
    setError(null)

    return asyncFunction(...args)
      .then((response) => {
        setData(response)
        setStatus('success')
        return response
      })
      .catch((error) => {
        setError(error)
        setStatus('error')
        throw error
      })
  }, [asyncFunction])

  // Call execute if we want to fire it right away
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { 
    execute, 
    status, 
    data, 
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error'
  }
}