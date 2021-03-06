import React, { useState, createContext, useEffect } from 'react'
import useSound from 'use-sound';
import boop1 from '../assets/boop1.wav'


const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false
  })
  const [deleteSound] =  useSound(boop1, { volume: 0.3 });

  useEffect(() => {
    fetchFeedback()
  },[])

  // Fetch feedback data
  const fetchFeedback = async () => {
    const resp = await fetch('/feedback?_sort=id&_order=desc')
    const data = await resp.json()

    setFeedback(data)
    setIsLoading(false)
  }

  // Add new feedback
  const addFeedback = async (newFeedback) => {
    const resp = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    })

    const data = await resp.json()

    setFeedback([data, ...feedback])
  }

  // Delete feedback
  const deleteFeedback = async (id) => {
    await fetch(`/feedback/${id}`, {
      method: 'DELETE'
    })

    deleteSound(feedback)
    setFeedback(feedback.filter((item) => item.id !== id))
  }

  // Update feedback item
  const updateFeedback = async (id, updItem) => {
    const resp = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem)
    })
    const data = await resp.json()

    setFeedback(feedback.map((item) => 
    item.id === id ? {...item, ...data} : item))
  }

  // Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true
    })
  }

  return (
    <FeedbackContext.Provider value={{
      feedback,
      feedbackEdit,
      isLoading,
      deleteFeedback,
      addFeedback,
      editFeedback,
      updateFeedback,
    }}>
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext