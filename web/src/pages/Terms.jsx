export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service for FoodLog</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: March 2, 2026</p>
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-700">By downloading, installing, or using FoodLog ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Description of Service</h2>
          <p className="text-gray-700 mb-2">FoodLog is a nutrition tracking application that allows users to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Log food entries with nutritional information</li>
            <li>Use AI-powered photo analysis to estimate calories and macronutrients</li>
            <li>Scan barcodes to retrieve product nutritional data</li>
            <li>Track daily calorie and macro goals</li>
            <li>View historical nutrition data and statistics</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. User Accounts</h2>
          <p className="text-gray-700">FoodLog can be used without creating an account. All data is stored locally on your device. If you choose to create an account for cloud sync features, you are responsible for maintaining the confidentiality of your account credentials.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. User Content and Conduct</h2>
          <p className="text-gray-700 mb-2">You are responsible for the content you input into the App. You agree not to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Upload malicious or harmful content</li>
            <li>Attempt to interfere with or disrupt the App's functionality</li>
            <li>Reverse engineer or attempt to extract source code from the App</li>
            <li>Use the App for any unlawful purpose</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. AI-Generated Estimates</h2>
          <p className="text-gray-700">The App provides AI-generated estimates of nutritional content based on food photos. These estimates are for informational purposes only and may not be accurate. You should not rely solely on these estimates for medical or dietary decisions. Always consult with a qualified healthcare professional for nutritional guidance.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Third-Party Services</h2>
          <p className="text-gray-700 mb-2">The App integrates with third-party services:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>OpenAI Vision API:</strong> For food photo analysis</li>
            <li><strong>Open Food Facts:</strong> For barcode nutritional data lookups</li>
          </ul>
          <p className="text-gray-700 mt-2">These services are provided by third parties under their own terms and privacy policies. We are not responsible for their practices.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Data and Privacy</h2>
          <p className="text-gray-700">Your use of the App is also governed by our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Intellectual Property</h2>
          <p className="text-gray-700">The App, including its original content, features, and functionality, is owned by FoodLog and is protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the App.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Disclaimer of Warranties</h2>
          <p className="text-gray-700">THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Limitation of Liability</h2>
          <p className="text-gray-700">TO THE MAXIMUM EXTENT PERMITTED BY LAW, FOODLOG SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, PROFITS, OR USE, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APP.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Changes to Terms</h2>
          <p className="text-gray-700">We reserve the right to modify these Terms at any time. We will notify you of any changes by updating the "Last Updated" date and displaying a notice within the App. Continued use of the App after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">12. Termination</h2>
          <p className="text-gray-700">We may terminate or suspend your access to the App at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">13. Contact Information</h2>
          <p className="text-gray-700">For questions about these Terms, please contact us at:</p>
          <ul className="text-gray-700 mt-2">
            <li>Email: <a href="mailto:legal@foodlog.app" className="text-blue-600 hover:underline">legal@foodlog.app</a></li>
            <li>GitHub: <a href="https://github.com/twilson63/food-log" className="text-blue-600 hover:underline">github.com/twilson63/food-log</a></li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">14. Governing Law</h2>
          <p className="text-gray-700">These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
        </section>
      </div>
    </div>
  );
}