export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy for SnapCal</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: March 2, 2026</p>
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Introduction</h2>
          <p className="text-gray-700">SnapCal ("we," "our," or "the App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h2>
          <h3 className="font-medium text-gray-800 mt-4 mb-1">Data You Provide</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Food Entries:</strong> Descriptions of food items, calorie and macronutrient information, and optional photos</li>
            <li><strong>User Preferences:</strong> Daily calorie and macro goals you set</li>
            <li><strong>Account Information:</strong> If you create an account, we collect your email address</li>
          </ul>
          
          <h3 className="font-medium text-gray-800 mt-4 mb-1">Automatically Collected Data</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Usage Data:</strong> How you interact with the App (e.g., features used, session duration)</li>
            <li><strong>Device Information:</strong> Device type, operating system version, app version</li>
            <li><strong>Photos:</strong> Only when you grant camera/photo library permissions to capture food images</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Track Nutrition:</strong> Store and display your food entries and nutritional data</li>
            <li><strong>AI Analysis:</strong> Process food photos through OpenAI Vision API to estimate calories and macronutrients</li>
            <li><strong>Improve the App:</strong> Analyze usage patterns to enhance features and user experience</li>
            <li><strong>Provide Support:</strong> Respond to your inquiries and provide customer service</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Storage and Security</h2>
          <h3 className="font-medium text-gray-800 mt-4 mb-1">Local Storage</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Your food entries are stored locally on your device using secure storage methods</li>
            <li>You control your data and can delete it at any time through the App's settings</li>
          </ul>
          
          <h3 className="font-medium text-gray-800 mt-4 mb-1">Cloud Storage</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>If you enable cloud sync, your data is encrypted and stored securely</li>
            <li>We use industry-standard encryption (TLS 1.3) for data transmission</li>
          </ul>
          
          <h3 className="font-medium text-gray-800 mt-4 mb-1">Photo Processing</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Food photos are sent to OpenAI's API for analysis</li>
            <li>OpenAI processes photos in accordance with their privacy policy</li>
            <li>Photos are not permanently stored on our servers</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Services</h2>
          <h3 className="font-medium text-gray-800 mt-4 mb-1">OpenAI Vision API</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>We use OpenAI's Vision API to analyze food photos</li>
            <li>Photos are processed to estimate nutritional content</li>
            <li><a href="https://openai.com/privacy" className="text-blue-600 hover:underline">OpenAI's privacy policy</a></li>
          </ul>
          
          <h3 className="font-medium text-gray-800 mt-4 mb-1">Open Food Facts</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>We query product information from the Open Food Facts database</li>
            <li>Barcode scans retrieve nutritional data from their public database</li>
            <li><a href="https://world.openfoodfacts.org/privacy" className="text-blue-600 hover:underline">Open Food Facts privacy policy</a></li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Rights</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Access:</strong> View all data stored in the App</li>
            <li><strong>Export:</strong> Download your data in JSON or CSV format</li>
            <li><strong>Delete:</strong> Remove your data at any time through App settings</li>
            <li><strong>Opt-Out:</strong> Disable AI photo analysis and use manual entry only</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="text-gray-700 mt-2">
            <li>Email: <a href="mailto:privacy@snapcal.app" className="text-blue-600 hover:underline">privacy@snapcal.app</a></li>
            <li>GitHub Issues: <a href="https://github.com/twilson63/food-log/issues" className="text-blue-600 hover:underline">github.com/twilson63/food-log/issues</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}