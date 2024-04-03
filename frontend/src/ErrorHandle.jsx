import { useEffect } from "react"

export default function ErrorHandle() {

  useEffect(() => window.location.assign('/'),[])
  return (
    <div>Redirecting...</div>
  )
}
