import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertTriangle, Scale, Users } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our mental health assessment platform.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          {/* Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing and using MindWell, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                MindWell provides mental health assessment tools and wellness resources. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Comprehensive mental health assessments</li>
                <li>Personalized reports and insights</li>
                <li>Relaxation activities and games</li>
                <li>Educational resources and recommendations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Important Medical Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                  Not a Substitute for Professional Care
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  MindWell is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the
                  advice of qualified health providers with any questions you may have regarding a medical condition.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Our assessments are for informational purposes only</li>
                <li>Results should not be used for self-diagnosis</li>
                <li>In case of emergency, contact local emergency services immediately</li>
                <li>Consult healthcare professionals for proper diagnosis and treatment</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">As a user of MindWell, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Provide accurate and truthful information</li>
                <li>Use the service for personal, non-commercial purposes only</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Not share your account with others</li>
                <li>Respect the intellectual property rights of MindWell</li>
                <li>Not attempt to reverse engineer or hack our systems</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and
                protect your information. By using our service, you consent to the collection and use of information in
                accordance with our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                MindWell and its affiliates shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our total liability to you for all damages shall not exceed the amount paid by you, if any, for
                accessing our service.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We may terminate or suspend your account and access to the service immediately, without prior notice,
                for any reason whatsoever, including without limitation if you breach the Terms. You may also terminate
                your account at any time by contacting us.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via
                email or through our platform. Your continued use of the service after such modifications constitutes
                acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p>Email: legal@mindwell.com</p>
                <p>Phone: +1 (234) 567-890</p>
                <p>Address: 123 Wellness Street, Mental Health City, MH 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
