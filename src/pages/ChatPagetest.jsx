import { useEffect, useRef } from 'react';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

export default function ChatPage() {
  const tawkMessengerRef = useRef();

  // Replace with your actual tawk.to keys
  const tawkPropertyId = 'YOUR_PROPERTY_ID'; // From tawk.to dashboard
  const tawkWidgetId = 'YOUR_WIDGET_ID';     // From tawk.to dashboard

  // Optional: Programmatically open chat
  const handleOpenChat = () => {
    tawkMessengerRef.current?.maximize();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Support</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">How can we help you?</h2>
          <p className="text-gray-600 mb-6">
            Our team is ready to assist you with any questions.
          </p>
          
          <button 
            onClick={handleOpenChat}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Open Live Chat
          </button>
        </div>

        {/* FAQ Section (Optional) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          {/* Add your FAQ content here */}
        </div>
      </div>

      {/* Tawk.to Widget - Fixed position */}
      <div className="fixed bottom-6 right-6 z-50">
        <TawkMessengerReact
          propertyId={tawkPropertyId}
          widgetId={tawkWidgetId}
          ref={tawkMessengerRef}
          onLoad={() => console.log('Chat widget loaded')}
        />
      </div>
    </div>
  );
}



