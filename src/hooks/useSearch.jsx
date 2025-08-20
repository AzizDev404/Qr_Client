// hooks/useSearch.jsx
import { useState, useMemo } from 'react'
import { useDebounce } from './useDebounce'

export const useSearch = (data, searchFields = [], delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, delay)

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data

    return data.filter(item => {
      return searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item)
        return value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      })
    })
  }, [data, debouncedSearchTerm, searchFields])

  const clearSearch = () => setSearchTerm('')

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    isSearching: searchTerm !== debouncedSearchTerm
  }
}