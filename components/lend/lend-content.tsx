"use client"

import { useState } from "react"
import { LendInstructions } from "@/components/lend/lend-instructions"
import { LendForm } from "@/components/lend/lend-form"
import { LendSuccess } from "@/components/lend/lend-success"

export function LendContent() {
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleOpenForm = () => {
    setShowForm(true)
  }

  const handleFormSubmit = () => {
    setShowForm(false)
    setShowSuccess(true)
  }

  const handleBackToInstructions = () => {
    setShowSuccess(false)
    setShowForm(false)
  }

  if (showSuccess) {
    return <LendSuccess onBack={handleBackToInstructions} />
  }

  if (showForm) {
    return <LendForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
  }

  return <LendInstructions onOpenForm={handleOpenForm} />
}
