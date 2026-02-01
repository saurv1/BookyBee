import React, { useState, useEffect } from 'react'

const ProviderDashboard = () => {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setUserName(user.firstName)
    }
  }, [])

  return (
    <div className="pt-25 px-10">
      <div className="mb-4">
        <h1 className="text-2xl text-gray-600">Welcome, <span className="font-bold text-[#FFB800]">{userName}</span></h1>
      </div>
      <h2 className="text-3xl font-bold text-[#1e293b]">provider dashboard</h2>
    </div>
  )
}

export default ProviderDashboard
