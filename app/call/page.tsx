'use client'
import React, { useState } from 'react'
import axios from 'axios'

const CallPage = () => {
  const [clientName, setClientName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const sendCall = async (e: any) => {
    e.preventDefault()
    setMessage('')
    if (!clientName || !phoneNumber) {
      setMessage('Please fill in both fields.')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        "https://api.bland.ai/v1/calls",
        {
          phone_number: phoneNumber,
          task: `
You are calling on behalf of Quote.ai to collect project details from ${clientName}. Speak in a friendly, natural, and professional tone. Ask each question step by step, confirm the customer's answer before moving on, and save their responses under the respective field names.

Say:
“Hi ${clientName}! This is an AI calling from Quote.ai. I just need a few quick details to create your project quote — this will only take a minute.”

Step 1 – Project Title:
Ask: “What would you like to call this project? For example, ‘Office Soundproofing’ or ‘Home Waterproofing.’”
Save the answer as project_title.

Step 2 – Project Type:
Ask: “What type of project is this? It can only be one of the following: Acoustic, Cladding, Soundproofing, Weathering or Waterproofing, or Fireproofing.”
If the customer gives something else, reply: “I’m sorry, we can only select from those five options. Which one fits best?”
Save the answer as project_type.

Step 3 – Estimated Area:
Ask: “What is the estimated area of the project in square feet?”
Save the answer as estimated_area.

Step 4 – Project Description:
Ask: “Is there anything else you’d like to add about the project? Any specific requirements, materials, or deadlines?”
Save the answer as project_description.

Then say:
“Thank you for sharing those details, ${clientName}! We’ll prepare your quote and get back to you shortly. Have a great day!”
          `
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BLAND_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      )

      console.log('Call initiated:', response.data)
      setMessage('✅ Call initiated successfully!')
    } catch (error) {
      console.error('Error initiating call:', error)
      setMessage('❌ Failed to initiate call. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Initiate Client Call</h1>
        <form onSubmit={sendCall} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-lg text-white font-semibold transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Calling...' : 'Start Call'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-gray-700 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  )


}

export default CallPage
