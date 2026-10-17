import { useEffect } from 'react'

export default function ChatbotEmbed() {
  useEffect(() => {
    let isMounted = true

    // Dynamically import external script with @vite-ignore to prevent build-time bundling issues
    import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@denserai/embed-chat@1/dist/web.min.js')
      .then((module) => {
        if (!isMounted) return
        const Chatbot = module.default || module
        if (Chatbot && typeof Chatbot.init === 'function') {
          Chatbot.init({
            chatbotId: 'chatbot_kalab4vtotlqccgyogb2p'
          })
        }
      })
      .catch((err) => {
        console.warn('DenserAI Chatbot script load warning:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return null
}
