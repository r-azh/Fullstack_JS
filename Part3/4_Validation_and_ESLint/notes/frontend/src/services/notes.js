import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  // this could be ommited if we wanted to return the whole response object
  //We no longer return the promise returned by axios directly. Instead,
  // we assign the promise to the request variable and call its then method
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  // this could be ommited if we wanted to return the whole response object
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  // this could be ommited if we wanted to return the whole response object
  return request.then(response => response.data)
}

export default { getAll, create, update }
