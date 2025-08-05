// hooks/useContactForm.ts

import { useState } from 'react'

export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

export const useContactForm = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Fake API delay
      await new Promise(res => setTimeout(res, 1500))

      console.log('Submitted data:', form)
      setSuccess(true)

      // reset form
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('Submission error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    handleChange,
    handleSubmit,
    isLoading,
    success,
  }
}
