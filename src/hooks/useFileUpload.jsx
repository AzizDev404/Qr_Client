// hooks/useFileUpload.jsx
import { useState, useCallback } from 'react'
import { validateFileSize, validateFileType } from '../utils/validation'
import { formatFileSize } from '../utils/helpers'
import { useToast } from './useToast'

export const useFileUpload = (options = {}) => {
  const {
    maxSize = 100 * 1024 * 1024, // 100MB
    allowedTypes = [],
    multiple = false
  } = options

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState([])

  const { error: showError } = useToast()

  const validateFile = useCallback((file) => {
    const errors = []

    if (!validateFileSize(file, maxSize)) {
      errors.push(`Fayl hajmi ${formatFileSize(maxSize)} dan oshmasligi kerak`)
    }

    if (allowedTypes.length > 0 && !validateFileType(file, allowedTypes)) {
      errors.push('Fayl turi qo\'llab-quvvatlanmaydi')
    }

    return errors
  }, [maxSize, allowedTypes])

  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles)
    const validFiles = []
    const allErrors = []

    fileArray.forEach(file => {
      const fileErrors = validateFile(file)
      if (fileErrors.length === 0) {
        validFiles.push(file)
      } else {
        allErrors.push(...fileErrors)
      }
    })

    if (allErrors.length > 0) {
      setErrors(allErrors)
      allErrors.forEach(error => showError(error))
    }

    if (validFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles)
      setErrors([])
    }
  }, [validateFile, multiple, showError])

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
    setErrors([])
    setProgress(0)
  }, [])

  const uploadFiles = useCallback(async (uploadFunction) => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    try {
      const result = await uploadFunction(files, (progress) => {
        setProgress(progress)
      })
      
      clearFiles()
      return result
    } catch (error) {
      showError('Fayl yuklashda xatolik')
      throw error
    } finally {
      setUploading(false)
    }
  }, [files, clearFiles, showError])

  return {
    files,
    uploading,
    progress,
    errors,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles
  }
}