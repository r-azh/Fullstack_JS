import { useState, useEffect } from 'react'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(baseUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch resources')
        }
        const data = await response.json()
        setResources(data)
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }

    fetchResources()
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
      })

      if (!response.ok) {
        throw new Error('Failed to create resource')
      }

      const newResource = await response.json()
      setResources(resources.concat(newResource))
      return newResource
    } catch (error) {
      console.error('Error creating resource:', error)
      throw error
    }
  }

  const service = {
    create
  }

  return [resources, service]
}

export default useResource
