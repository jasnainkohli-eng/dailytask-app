import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTasks(userId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchTasks(today)
  }, [userId, today])

  const fetchTasks = async (date) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setTasks(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (content) => {
    try {
      setError(null)
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: userId,
            content,
            date: today,
            completed: false,
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError
      setTasks([...tasks, data])
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      console.error('Error adding task:', err)
      return { data: null, error: err }
    }
  }

  const updateTask = async (id, updates) => {
    try {
      setError(null)
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      setTasks(tasks.map((task) => (task.id === id ? data : task)))
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      console.error('Error updating task:', err)
      return { data: null, error: err }
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id)
    return updateTask(id, { completed: !task.completed })
  }

  const deleteTask = async (id) => {
    try {
      setError(null)
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      setTasks(tasks.filter((task) => task.id !== id))
      return { error: null }
    } catch (err) {
      setError(err.message)
      console.error('Error deleting task:', err)
      return { error: err }
    }
  }

  const fetchTasksByDate = async (date) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      return { data: data || [], error: null }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tasks by date:', err)
      return { data: [], error: err }
    } finally {
      setLoading(false)
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    fetchTasksByDate,
  }
}

